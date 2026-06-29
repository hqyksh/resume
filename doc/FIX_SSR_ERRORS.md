# 修复 SSR 错误 - requestAnimationFrame

## 问题

在访问 `/education` 页面时出现错误：

```
ReferenceError: requestAnimationFrame is not defined
```

## 原因

`SchoolImage` 组件虽然标记了 `"use client"`，但在组件的顶层（函数体内，但在 JSX 返回之前）直接调用了浏览器 API：

```typescript
// ❌ 错误：在组件顶层调用浏览器 API
export const SchoolImage = () => {
    const DURATION = 5800;
    let last = performance.now();  // 服务器端不可用
    
    function tick() {
        requestAnimationFrame(tick);  // 服务器端不可用
    }
    tick();  // 立即执行
    
    return <div>...</div>;
}
```

### 为什么会在服务器端执行？

即使组件标记了 `"use client"`，Next.js 仍然会在服务器端进行初始渲染（SSR）：

1. **首次请求** → 服务器渲染 HTML
2. **发送到浏览器** → 浏览器接收 HTML
3. **Hydration** → React 在客户端接管

在第 1 步，服务器会执行组件代码，但浏览器 API（如 `requestAnimationFrame`、`performance`、`window`、`document`）不存在。

## 解决方案

将浏览器 API 调用移到 `useEffect` 中，因为 `useEffect` 只在客户端执行：

```typescript
// ✅ 正确：在 useEffect 中调用浏览器 API
export const SchoolImage = () => {
    const [num, setNum] = useState(0);

    useEffect(() => {
        // 这里的代码只在客户端执行
        const DURATION = 5800;
        let last = performance.now();
        let animationFrameId: number;

        function tick() {
            const now = performance.now();
            const elapsed = now - last;
            const steps = Math.floor(elapsed / DURATION);
            
            if (steps > 0) {
                setNum((prevNum) => (prevNum >= 2 ? 0 : prevNum + 1));
                last = now;
            }
            
            animationFrameId = requestAnimationFrame(tick);
        }
        
        animationFrameId = requestAnimationFrame(tick);

        // 清理函数：组件卸载时取消动画
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []); // 空依赖数组：只在组件挂载时执行一次

    return <div>...</div>;
};
```

## 其他改进

### 1. 使用 Next.js Image 组件

```typescript
// ❌ 之前：使用原生 img 标签
<img src={src} alt="school view" />

// ✅ 现在：使用 Next.js Image 组件
<Image 
    src={src} 
    alt="school view"
    width={800}
    height={500}
    priority={i === 0}  // 第一张图片优先加载
/>
```

**优势**:
- 自动优化图片（WebP/AVIF）
- 懒加载（除了 priority 的图片）
- 防止布局偏移
- 更好的性能

### 2. 使用函数式更新

```typescript
// ❌ 之前：直接使用 num
setNum(num >= 2 ? 0 : num + 1);

// ✅ 现在：使用函数式更新
setNum((prevNum) => (prevNum >= 2 ? 0 : prevNum + 1));
```

**优势**:
- 避免闭包陷阱
- 确保使用最新的状态值
- 更可靠的状态更新

### 3. 添加清理函数

```typescript
useEffect(() => {
    const animationFrameId = requestAnimationFrame(tick);
    
    // 清理函数
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}, []);
```

**优势**:
- 防止内存泄漏
- 组件卸载时停止动画
- 避免在已卸载的组件上更新状态

### 4. 改进过渡效果

```css
/* 之前 */
transition-opacity duration-300

/* 现在 */
transition-opacity duration-1000
```

更长的过渡时间使图片切换更平滑。

## 常见的 SSR 错误

### 1. 使用 window 对象

```typescript
// ❌ 错误
const width = window.innerWidth;

// ✅ 正确
const [width, setWidth] = useState(0);

useEffect(() => {
    setWidth(window.innerWidth);
}, []);
```

### 2. 使用 document 对象

```typescript
// ❌ 错误
const element = document.getElementById('root');

// ✅ 正确
useEffect(() => {
    const element = document.getElementById('root');
}, []);
```

### 3. 使用 localStorage

```typescript
// ❌ 错误
const data = localStorage.getItem('key');

// ✅ 正确
const [data, setData] = useState(null);

useEffect(() => {
    const stored = localStorage.getItem('key');
    setData(stored);
}, []);
```

### 4. 使用第三方库（如 jQuery）

```typescript
// ❌ 错误
import $ from 'jquery';
$('#element').hide();

// ✅ 正确
useEffect(() => {
    import('jquery').then(($) => {
        $('#element').hide();
    });
}, []);
```

## 检测 SSR 错误的方法

### 1. 检查是否在浏览器环境

```typescript
if (typeof window !== 'undefined') {
    // 浏览器环境
    const width = window.innerWidth;
}
```

### 2. 使用动态导入

```typescript
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
    () => import('./ClientOnlyComponent'),
    { ssr: false }  // 禁用 SSR
);
```

### 3. 使用 useEffect

```typescript
useEffect(() => {
    // 这里的代码只在客户端执行
}, []);
```

## 最佳实践

### 1. 客户端组件的标记

```typescript
// 在文件顶部明确标记
"use client";

import React from 'react';
```

### 2. 分离服务器和客户端逻辑

```
components/
  ├── ServerComponent.tsx    # 服务器组件
  └── ClientComponent.tsx    # 客户端组件（"use client"）
```

### 3. 使用 TypeScript 类型保护

```typescript
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

if (isBrowser()) {
    // 安全使用浏览器 API
}
```

### 4. 服务器端回退

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
    setMounted(true);
}, []);

if (!mounted) {
    // 服务器端渲染的占位符
    return <div>Loading...</div>;
}

// 客户端渲染的内容
return <div>{/* 使用浏览器 API */}</div>;
```

## 验证修复

### 1. 开发环境测试

```bash
npm run dev
# 访问 http://localhost:3000/education
```

### 2. 生产构建测试

```bash
npm run build
npm run start
# 访问 http://localhost:3000/education
```

### 3. 检查控制台

- ✅ 没有 SSR 错误
- ✅ 图片正常切换
- ✅ 动画流畅

## 总结

**问题**: 在组件顶层调用浏览器 API 导致 SSR 错误

**解决**: 将浏览器 API 调用移到 `useEffect` 中

**关键点**:
1. ✅ `useEffect` 只在客户端执行
2. ✅ 添加清理函数防止内存泄漏
3. ✅ 使用函数式状态更新
4. ✅ 使用 Next.js Image 组件优化图片

---

修复时间: 2026年3月1日
错误类型: SSR - requestAnimationFrame is not defined
解决方案: 将浏览器 API 移到 useEffect 中
