# 性能优化总结 / Performance Optimization Summary

## 问题描述 / Problem Description

Node.js 进程启动时内存占用很少，但页面跳转后内存直接飙升到 700-800MB+。

Node.js process starts with low memory usage, but jumps to 700-800MB+ after page navigation.

---

## 已修复的问题 / Fixed Issues

### 1. ⚠️ CRITICAL: Pin.tsx - setTimeout 内存泄漏
**位置**: `components/animation/Pin.tsx`

**问题**: useEffect 中的 setTimeout 没有清理函数，每次组件挂载都会创建新的定时器但不清理旧的。

**修复**:
```typescript
// 修复前
useEffect(() => {
  setTimeout(() => { ... }, 800);
  setTimeout(() => { ... }, 2000);
}, [])

// 修复后
useEffect(() => {
  const timer1 = setTimeout(() => { ... }, 800);
  const timer2 = setTimeout(() => { ... }, 2000);
  
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, [])
```

**影响**: 每次页面导航都会泄漏定时器，累积导致内存增长。

---

### 2. HackerBtn.tsx - 防止并发动画
**位置**: `components/animation/HackerBtn.tsx`

**问题**: 快速多次触发 onMouseEnter 会创建多个并发的 scramble 动画，每个都有自己的 Promise 链和 setTimeout。

**修复**:
```typescript
const [isScrambling, setIsScrambling] = useState(false);

const scramble = async (input: string) => {
  if (isScrambling) return; // 防止并发
  setIsScrambling(true);
  // ... animation logic
  setIsScrambling(false);
};
```

**影响**: 减少不必要的异步操作和状态更新。

---

### 3. 图片优化 - 懒加载和质量压缩
**位置**: `components/hello/index.tsx`

**问题**: 首页同时加载 5 张大图（4张项目图 + 1张背景图），没有懒加载或质量优化。

**修复**:
```typescript
// 项目图片
<Image
  src="/project/1.jpg"
  loading="lazy"
  quality={75}
  // ...
/>

// 背景图
<Image
  src={imgs[num]}
  loading="lazy"
  quality={60}
  // ...
/>
```

**影响**: 
- 懒加载延迟非关键图片的加载
- 质量压缩减少图片体积（75% 和 60%）
- 减少初始内存占用

---

### 4. useEffect 依赖优化
**位置**: `app/[lang]/blog/client-search.tsx`

**问题**: useEffect 缺少 exhaustive-deps 注释，可能导致不必要的重新渲染。

**修复**:
```typescript
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentPage]);
```

---

## 潜在问题和建议 / Potential Issues & Recommendations

### 1. TypeAnimation 无限循环
**位置**: `components/hello/index.tsx`

**问题**: TypeAnimation 设置了 `repeat={Infinity}`，会持续运行动画。

**建议**:
```typescript
// 考虑限制重复次数
<TypeAnimation
  repeat={3} // 而不是 Infinity
  // ...
/>

// 或在组件卸载时停止
useEffect(() => {
  return () => {
    // cleanup if needed
  };
}, []);
```

---

### 2. Framer Motion 动画累积
**位置**: 多个组件使用 `framer-motion`

**建议**:
- 使用 `React.memo()` 包装不需要频繁更新的动画组件
- 考虑使用 `AnimatePresence` 的 `mode="wait"` 避免动画重叠
- 限制同时运行的动画数量

---

### 3. 图片资源优化
**当前状态**:
- public/project/ 文件夹包含多个大图
- 最大图片: ptzs (1).png (253KB), ptzs (3).png (162KB)

**建议**:
1. 转换 PNG 到 WebP/AVIF 格式（减少 30-50% 体积）
2. 使用 Next.js Image Optimization
3. 考虑使用 CDN

```bash
# 使用 sharp 转换图片
npm install sharp
# 然后批量转换 PNG -> WebP
```

---

### 4. 添加性能监控
**建议添加**:

```typescript
// lib/performance.ts
export function logMemoryUsage() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const memory = (performance as any).memory;
    if (memory) {
      console.log({
        usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      });
    }
  }
}

// 在页面组件中使用
useEffect(() => {
  logMemoryUsage();
}, []);
```

---

### 5. React.memo 优化重渲染
**建议**:

```typescript
// components/animation/Pin.tsx
export const PinContainer = React.memo(({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  // ... component logic
});

// components/animation/HackerBtn.tsx
const HackerBtn = React.memo(({ label }: { label: string }) => {
  // ... component logic
});

export default HackerBtn;
```

---

## 测试建议 / Testing Recommendations

### 1. 内存测试
```bash
# 启动开发服务器
npm run dev

# 在 Chrome DevTools 中:
# 1. 打开 Performance Monitor (Ctrl+Shift+P -> Show Performance Monitor)
# 2. 观察 JS heap size
# 3. 导航多个页面
# 4. 检查内存是否持续增长
```

### 2. 生产构建测试
```bash
npm run build
npm start

# 生产模式下内存使用应该更低
```

### 3. Lighthouse 性能测试
```bash
# Chrome DevTools -> Lighthouse
# 运行性能审计
# 关注:
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Total Blocking Time (TBT)
# - Cumulative Layout Shift (CLS)
```

---

## 预期效果 / Expected Results

修复后预期内存使用:
- 初始加载: 50-100MB
- 页面导航后: 150-250MB
- 多次导航后: 应该稳定，不持续增长

如果内存仍然持续增长，需要:
1. 使用 Chrome DevTools Memory Profiler 查找具体泄漏点
2. 检查第三方库（framer-motion, react-type-animation）的已知问题
3. 考虑升级或替换有问题的依赖

---

## 下一步 / Next Steps

1. ✅ 修复 setTimeout 清理（已完成）
2. ✅ 添加图片懒加载和质量优化（已完成）
3. ✅ 防止 HackerBtn 并发动画（已完成）
4. ⏳ 测试修复后的内存使用
5. ⏳ 如需要，实施额外优化（React.memo, 图片格式转换等）
6. ⏳ 添加性能监控代码

---

## 相关文件 / Related Files

- `components/animation/Pin.tsx` - 修复 setTimeout 泄漏
- `components/animation/HackerBtn.tsx` - 防止并发动画
- `components/hello/index.tsx` - 图片懒加载优化
- `app/[lang]/blog/client-search.tsx` - useEffect 优化
- `components/animation/FramerWrapper.tsx` - 可考虑添加 React.memo

---

## 参考资源 / References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [React useEffect Cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
