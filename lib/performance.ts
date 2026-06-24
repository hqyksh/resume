/**
 * 性能监控工具 / Performance Monitoring Utilities
 * 
 * 用于监控和调试内存使用情况
 * For monitoring and debugging memory usage
 */

export interface MemoryInfo {
  usedJSHeapSize: string;
  totalJSHeapSize: string;
  jsHeapSizeLimit: string;
  timestamp: string;
}

/**
 * 记录当前内存使用情况
 * Log current memory usage
 */
export function logMemoryUsage(label?: string): MemoryInfo | null {
  if (typeof window === 'undefined') return null;
  
  const performance = window.performance as any;
  if (!performance?.memory) {
    console.warn('Memory API not available. Use Chrome with --enable-precise-memory-info flag.');
    return null;
  }

  const memory = performance.memory;
  const info: MemoryInfo = {
    usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
    timestamp: new Date().toISOString(),
  };

  console.log(`[Memory ${label || 'Usage'}]`, info);
  return info;
}

/**
 * 监控组件的内存使用（在 useEffect 中使用）
 * Monitor component memory usage (use in useEffect)
 * 
 * @example
 * useEffect(() => {
 *   const cleanup = monitorComponentMemory('HomePage');
 *   return cleanup;
 * }, []);
 */
export function monitorComponentMemory(componentName: string) {
  logMemoryUsage(`${componentName} Mount`);
  
  return () => {
    logMemoryUsage(`${componentName} Unmount`);
  };
}

/**
 * 创建内存使用追踪器
 * Create memory usage tracker
 * 
 * @example
 * const tracker = createMemoryTracker();
 * tracker.start('HomePage');
 * // ... do something
 * tracker.end('HomePage');
 * tracker.report();
 */
export function createMemoryTracker() {
  const records: Array<{ label: string; memory: MemoryInfo | null; type: 'start' | 'end' }> = [];

  return {
    start(label: string) {
      const memory = logMemoryUsage(`START: ${label}`);
      records.push({ label, memory, type: 'start' });
    },
    
    end(label: string) {
      const memory = logMemoryUsage(`END: ${label}`);
      records.push({ label, memory, type: 'end' });
    },
    
    report() {
      console.table(records);
      return records;
    },
    
    clear() {
      records.length = 0;
    }
  };
}

/**
 * 检测内存泄漏（比较前后内存差异）
 * Detect memory leaks (compare memory before/after)
 * 
 * @example
 * const detector = createLeakDetector();
 * detector.snapshot('before navigation');
 * // ... navigate pages
 * detector.snapshot('after navigation');
 * detector.analyze();
 */
export function createLeakDetector() {
  const snapshots: Array<{ label: string; memory: MemoryInfo | null }> = [];

  return {
    snapshot(label: string) {
      const memory = logMemoryUsage(label);
      snapshots.push({ label, memory });
    },
    
    analyze() {
      if (snapshots.length < 2) {
        console.warn('Need at least 2 snapshots to analyze');
        return null;
      }

      console.log('=== Memory Leak Analysis ===');
      for (let i = 1; i < snapshots.length; i++) {
        const prev = snapshots[i - 1];
        const curr = snapshots[i];
        
        if (prev.memory && curr.memory) {
          const prevMB = parseFloat(prev.memory.usedJSHeapSize);
          const currMB = parseFloat(curr.memory.usedJSHeapSize);
          const diff = currMB - prevMB;
          
          console.log(`${prev.label} -> ${curr.label}: ${diff > 0 ? '+' : ''}${diff.toFixed(2)} MB`);
        }
      }
      
      return snapshots;
    },
    
    clear() {
      snapshots.length = 0;
    }
  };
}
