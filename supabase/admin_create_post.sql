-- ================================================================
-- 博客「写文章」管理员码校验 + 入库
-- 在 Supabase Dashboard → SQL Editor 中执行
--
-- wp_posts 实际只有 4 列（从 MySQL 导入的精简表）：
--   id (bigint, 无自增序列) / post_date (text) / post_content (text) / post_title (text)
-- 所以插入时显式给 id = max(id)+1，post_date 用与历史数据一致的文本格式。
-- ================================================================

-- pgcrypto 提供 crypt() / gen_salt()（装在 extensions schema）
create extension if not exists pgcrypto with schema extensions;

-- 0. 给 wp_posts 增加 is_markdown 标记列：
--    新文章以 markdown 存储并渲染，历史文章仍按 HTML 渲染
alter table wp_posts add column if not exists is_markdown boolean not null default false;

-- 1. 存放管理员码的单行表（只存 bcrypt 哈希，不存明文）
create table if not exists app_secrets (
  id              int primary key,
  admin_code_hash text not null,
  constraint app_secrets_single_row check (id = 1)
);

-- 2. 设置管理员码（占位符；真实码请单独执行下面的 update 语句，勿写进仓库）
insert into app_secrets (id, admin_code_hash)
values (1, extensions.crypt('CHANGE_ME_ADMIN_CODE', extensions.gen_salt('bf')))
on conflict (id) do update
set admin_code_hash = excluded.admin_code_hash;

-- 3. RLS：匿名/登录用户读不到该表
alter table app_secrets enable row level security;
revoke all on app_secrets from public, anon, authenticated;

-- 4. 校验码并写入文章（SECURITY DEFINER）
create or replace function admin_create_post(
  p_title   text,
  p_content text,
  p_code    text
) returns bigint
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_id   bigint;
begin
  -- 校验管理员码
  select admin_code_hash into v_hash from app_secrets where id = 1;
  if v_hash is null or v_hash <> extensions.crypt(p_code, v_hash) then
    raise exception 'INVALID_CODE' using errcode = '28000';
  end if;

  -- 内容非空校验
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_content), '') = '' then
    raise exception 'EMPTY_CONTENT';
  end if;

  -- 入库：id 无自增序列，手动 max(id)+1；post_date 与历史数据同格式
  -- 新文章以 markdown 存储，is_markdown 标记为 true
  insert into wp_posts (id, post_date, post_content, post_title, is_markdown)
  values (
    coalesce((select max(id) from wp_posts), 0) + 1,
    to_char(now(), 'DD/MM/YYYY HH24:MI:SS'),
    p_content,
    p_title,
    true
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- 5. 只允许通过函数调用，不允许直接读写表
revoke all on function admin_create_post(text, text, text) from public;
grant execute on function admin_create_post(text, text, text) to anon, authenticated;

-- ================================================================
-- 设置真实管理员码（替换成你自己的码，执行一次）：
-- update app_secrets
-- set admin_code_hash = extensions.crypt('你的管理员码', extensions.gen_salt('bf'))
-- where id = 1;
-- ================================================================
