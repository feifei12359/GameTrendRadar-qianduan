// 修复React应用的渲染问题
console.log('=== fix-react.js loaded ===');

// 等待React应用的JavaScript文件加载完成
setTimeout(() => {
  console.log('Checking for React app variables...');
  
  // 检查Qf、S和td变量是否可用
  if (typeof Qf !== 'undefined' && typeof S !== 'undefined' && typeof td !== 'undefined') {
    console.log('React app variables available');
    
    // 尝试渲染React应用
    try {
      const root = document.getElementById('root');
      if (root) {
        console.log('Rendering React app...');
        Qf.createRoot(root).render(S.jsx(td, {}));
        console.log('React app rendered successfully!');
        
        // 更新调试信息
        const statusElement = document.getElementById('status');
        if (statusElement) {
          statusElement.textContent = 'React应用渲染成功！';
        }
      } else {
        console.error('Root element not found');
        
        // 更新调试信息
        const statusElement = document.getElementById('status');
        if (statusElement) {
          statusElement.textContent = 'Root元素未找到';
        }
      }
    } catch (e) {
      console.error('Error rendering React app:', e);
      
      // 更新调试信息
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = 'React测试失败: ' + e.message;
      }
    }
  } else {
    console.error('React app variables not available');
    
    // 更新调试信息
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = 'React或ReactDOM不可用';
    }
  }
}, 1000);
