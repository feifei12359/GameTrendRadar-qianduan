// 手动执行React应用
console.log('=== main.js loaded ===');

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== DOMContentLoaded in main.js ===');

  // 检查React应用是否已经加载
  console.log('Checking for React app variables...');
  console.log('Qf:', typeof Qf);
  console.log('S:', typeof S);
  console.log('td:', typeof td);

  // 尝试直接执行React渲染代码
  try {
    const root = document.getElementById('root');
    if (root) {
      console.log('Rendering React app...');
      // 直接使用与原始代码相同的渲染方式
      Qf.createRoot(root).render(S.jsx(td, {}));
      console.log('React app rendered successfully!');

      // 更新调试信息
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = 'React应用渲染成功！';
      }
    } else {
      console.error('Root element not found');
    }
  } catch (error) {
    console.error('Error rendering React app:', error);

    // 更新调试信息
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = 'React应用渲染失败: ' + error.message;
    }
  }
});
