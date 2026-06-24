# 性能监控使用指南 / Performance Monitoring Guide

## 概述 / Overview

已创建性能监控工具 `lib/performance.ts`，可用于调试内存使用和检测内存泄漏。

Performance monitoring utilities have been created in `lib/performance.ts` for debugging memory usage and detecting leaks.

---

## 使用方法 / Usage

### 1. 基础内存日志 / Basic Memory Logging

在任何组件中记录当前内存使用：

```typescript
import { logMemoryUsage } from '@/lib/performance';

export default function MyPage() {
  useEffect(() => {
    logMemoryUsage('MyPage loaded');
  }, []);
  
  return <div>...</div>;
}
```

输出示例：
```
[Memory MyPage loaded] {
  usedJSHeapSize: "156.23 MB",
  totalJSHeapSize: "180.50 MB",
  jsHeapSizeLimit: "2048.00 MB",
  timestamp: "2026-03-06T10:30:45.123Z"
}
```

---

### 2. 组件生命周期监控 / Component Lifecycle Monitoring

自动记录组件挂载和卸载时的内存：

```typescript
import { monitorComponentMemory } from '@/lib/performance';

export default function MyPage() {
  useEffect(() => {
    const cleanup = monitorComponentMemory('MyPage');
    return cleanup;
  }, []);
  
  return <div>...</div>;
}
```

输出：
```
[Memory MyPage Mount] { usedJSHeapSize: "150.00 MB", ... }
// 当组件卸载时
[Memory MyPage Unmount] { usedJSHeapSize: "155.00 MB", ... }
```

---

### 3. 内存追踪器 / Memory Tracker

追踪特定操作的内存变化：

```typescript
import { createMemoryTracker } from '@/lib/performance';

export default function MyPage() {
  const handleHeavyOperation = () => {
    const tracker = createMemoryTracker();
    
    tracker.start('Heavy Operation');
    
    // 执行耗内存的操作
    // ... heavy operation
    
    tracker.end('Heavy Operation');
    tracker.report(); // 显示表格
  };
  
  return <button onClick={handleHeavyOperation}>Run</button>;
}
```

---

### 4. 内存泄漏检测器 / Memory Leak Detector

比较页面导航前后的内存差异：

```typescript
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createLeakDetector } from '@/lib/performance';

// 在 layout.tsx 中使用
export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const detector = createLeakDetector();
      
      detector.snapshot(`Page: ${pathname}`);
      
      return () => {
        detector.snapshot(`Leaving: ${pathname}`);
        detector.analyze();
      };
    }
  }, [pathname]);
  
  return <html>{children}</html>;
}
```

输出示例：
```
=== Memory Leak Analysis ===
Page: /en -> Leaving: /en: +5.23 MB
Leaving: /en -> Page: /zh: +12.45 MB
Page: /zh -> Leaving: /zh: +8.67 MB
```

---

## 实际应用示例 / Practical Examples

### 示例 1: 监控首页内存使用

```typescript
// app/[lang]/page.tsx
'use client';
import { useEffect } from 'react';
import { monitorComponentMemory } from '@/lib/performance';
import Hello from '@/components/hello';

export default function HomePage({ dict }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return monitorComponentMemory('HomePage');
    }
  }, []);
  
  return <Hello dict={dict} />;
}
```

---

### 示例 2: 监控博客搜索性能

```typescript
// app/[lang]/blog/client-search.tsx
import { createMemoryTracker } from '@/lib/performance';

export const ClientSearch = ({ lang, dict }) => {
  const tracker = createMemoryTracker();
  
  async function handleSearch(page: number) {
    tracker.start('Search Operation');
    setLoading(true);
    
    // ... search logic
    
    setLoading(false);
    tracker.end('Search Operation');
    
    if (process.env.NODE_ENV === 'development') {
      tracker.report();
    }
  }
  
  // ...
};
```

---

### 示例 3: 全局内存监控（推荐）

在根 layout 中添加全局监控：

```typescript
// app/[lang]/layout.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logMemoryUsage } from '@/lib/performance';

export default function RootLayout({ children, params }) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 每次路由变化时记录内存
      logMemoryUsage(`Route: ${pathname}`);
      
      // 每 10 秒记录一次内存（可选）
      const interval = setInterval(() => {
        logMemoryUsage('Periodic Check');
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [pathname]);
  
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## Chrome DevTools 配置 / Chrome DevTools Setup

### 启用精确内存信息

Chrome 需要特殊标志才能提供精确的内存信息：

```bash
# Windows
chrome.exe --enable-precise-memory-info

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-precise-memory-info

# Linux
google-chrome --enable-precise-memory-info
```

### 使用 Performance Monitor

1. 打开 Chrome DevTools (F12)
2. 按 `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)
3. 输入 "Show Performance Monitor"
4. 观察 "JS heap size" 指标

### 使用 Memory Profiler

1. Chrome DevTools -> Memory 标签
2. 选择 "Heap snapshot"
3. 点击 "Take snapshot"
4. 导航页面后再次拍摄快照
5. 比较两个快照找出内存增长

---

## 测试流程 / Testing Workflow

### 1. 基础测试

```bash
# 启动开发服务器
npm run dev

# 打开浏览器并启用内存监控
# 访问 http://localhost:3000
# 打开 Console 查看内存日志
```

### 2. 压力测试

```typescript
// 创建测试脚本
const testMemoryLeak = async () => {
  const detector = createLeakDetector();
  
  for (let i = 0; i < 10; i++) {
    detector.snapshot(`Iteration ${i}`);
    
    // 模拟页面导航
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 触发一些操作
    // ...
  }
  
  detector.analyze();
};
```

### 3. 生产环境测试

```bash
# 构建生产版本
npm run build
npm start

# 生产模式下内存使用应该更低
# 监控工具只在开发模式下运行
```

---

## 预期结果 / Expected Results

### 正常内存使用模式

```
[Memory Route: /en] { usedJSHeapSize: "80.00 MB", ... }
[Memory Route: /zh] { usedJSHeapSize: "95.00 MB", ... }
[Memory Route: /en/blog] { usedJSHeapSize: "110.00 MB", ... }
[Memory Route: /en] { usedJSHeapSize: "100.00 MB", ... }  // 应该下降或稳定
```

### 内存泄漏模式（需要修复）

```
[Memory Route: /en] { usedJSHeapSize: "80.00 MB", ... }
[Memory Route: /zh] { usedJSHeapSize: "150.00 MB", ... }  // +70MB
[Memory Route: /en/blog] { usedJSHeapSize: "230.00 MB", ... }  // +80MB
[Memory Route: /en] { usedJSHeapSize: "320.00 MB", ... }  // +90MB 持续增长！
```

---

## 故障排除 / Troubleshooting

### 问题: "Memory API not available"

**解决方案**: 使用 `--enable-precise-memory-info` 标志启动 Chrome

### 问题: 内存持续增长

**检查清单**:
1. ✅ 所有 setTimeout/setInterval 都有清理函数
2. ✅ 所有 event listeners 都在 useEffect cleanup 中移除
3. ✅ 大图片使用懒加载
4. ✅ 无限动画有限制或清理机制
5. ✅ 第三方库版本是最新的

### 问题: 内存在特定页面增长

**调试步骤**:
1. 使用 `monitorComponentMemory` 监控该页面
2. 检查该页面的所有 useEffect
3. 使用 Chrome Memory Profiler 拍摄快照
4. 查找 "Detached DOM nodes" 和 "Event listeners"

---

## 相关文件 / Related Files

- `lib/performance.ts` - 性能监控工具
- `doc/PERFORMANCE_OPTIMIZATION.md` - 性能优化总结
- `components/animation/Pin.tsx` - 已修复的内存泄漏示例

---

## 参考资源 / References

- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)
- [React useEffect Cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [JavaScript Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
