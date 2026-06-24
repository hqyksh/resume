import { MeiliSearch } from 'meilisearch';
import { createBrowserClient } from "@supabase/ssr";
import 'dotenv/config';

console.log('DEBUG env:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  meiliHost: process.env.MEILISEARCH_HOST,
  meiliKey: process.env.MEILISEARCH_API_KEY,
  cwd: process.cwd()  // 查看当前工作目录
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const meiliHost   = process.env.MEILISEARCH_HOST;
const meiliKey    = process.env.MEILISEARCH_API_KEY;

if (!supabaseUrl || !supabaseKey || !meiliHost || !meiliKey) {
  console.error('缺少必要的环境变量，请检查 .env 文件');
  process.exit(1);
}

const supabase = createBrowserClient(supabaseUrl, supabaseKey);

const meili = new MeiliSearch({
  host: meiliHost,
  apiKey: meiliKey,
});

async function syncArticles() {
  const { data, error } = await supabase
    .from('wp_posts')
    .select('id, post_title, post_content')

  if (error) {
    console.error('Supabase 查询失败:', error);
    return;
  }

  const index = meili.index('articles');
  await index.addDocuments(data);

  console.log(`已同步 ${data.length} 篇文章`);
}

syncArticles();