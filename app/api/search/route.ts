import { NextRequest, NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

// 允许的索引白名单，防止用户枚举任意索引
const ALLOWED_INDEXES = ['articles'];

function getMeiliClient() {
  return new MeiliSearch({
    host: process.env.MEILISEARCH_HOST!,
    apiKey: process.env.MEILISEARCH_API_KEY!,
    timeout: 5000,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get('q') ?? '').slice(0, 200); // 限制查询长度
  const index = searchParams.get('index') ?? 'articles';

  // 白名单校验，拒绝未知索引
  if (!ALLOWED_INDEXES.includes(index)) {
    return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
  }

  // 分页参数边界校验
  const offset = Math.max(0, Math.min(Number(searchParams.get('offset') ?? 0), 10000));
  const limit  = Math.max(1, Math.min(Number(searchParams.get('limit')  ?? 10), 50));
  const cropLength = Math.max(10, Math.min(Number(searchParams.get('cropLength') ?? 100), 500));

  // 高亮/裁剪字段白名单过滤（只允许字母数字下划线）
  const fieldPattern = /^[a-zA-Z0-9_]+$/;
  const rawHighlight = searchParams.get('attributesToHighlight');
  const rawCrop = searchParams.get('attributesToCrop');
  const attributesToHighlight = rawHighlight
    ? rawHighlight.split(',').filter(f => fieldPattern.test(f.trim()))
    : ['*']; // 默认高亮所有字段
  const attributesToCrop = rawCrop
    ? rawCrop.split(',').filter(f => fieldPattern.test(f.trim()))
    : [];

  // 高亮标签只允许安全的 HTML 标签
  const highlightPreTag  = '<mark>';
  const highlightPostTag = '</mark>';

  try {
    const result = await getMeiliClient()
      .index(index)
      .search(q, {
        offset,
        limit,
        attributesToHighlight,
        attributesToCrop,
        cropLength,
        highlightPreTag,
        highlightPostTag,
      });
    return NextResponse.json(result);
  } catch (error) {
    console.error('MeiliSearch error:', error);
    return NextResponse.json({ error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}