// 直接测试React应用
console.log('=== react-test.js loaded ===');

// 检查React应用的变量是否可用
console.log('Qf:', typeof Qf);
console.log('S:', typeof S);
console.log('td:', typeof td);

// 尝试直接执行React应用的渲染代码
if (typeof Qf !== 'undefined' && typeof S !== 'undefined' && typeof td !== 'undefined') {
  console.log('React and ReactDOM available');
  try {
    const root = document.getElementById('root');
    if (root) {
      console.log('Rendering React app...');
      Qf.createRoot(root).render(S.jsx(td, {}));
      console.log('React app rendered successfully!');
    } else {
      console.error('Root element not found');
    }
  } catch (e) {
    console.error('Error rendering React app:', e);
  }
} else {
  console.error('React or ReactDOM not available');
}
