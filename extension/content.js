document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.includes('leetcode.com/problems/')) {
      // Create autofill buttons
      const fullCodeButton = document.createElement('button');
      fullCodeButton.innerText = 'Autofill Full Code';
      fullCodeButton.onclick = () => autofill('full');
  
      const pseudoCodeButton = document.createElement('button');
      pseudoCodeButton.innerText = 'Autofill PseudoCode';
      pseudoCodeButton.onclick = () => autofill('pseudo');
  
      // Add buttons to the page
      const container = document.querySelector('.question-content__JfgR');
      if (container) {
        container.appendChild(fullCodeButton);
        container.appendChild(pseudoCodeButton);
      }
    }
  });
  
  function autofill(type) {
    const problemDescription = document.querySelector('.description__24sA') ? document.querySelector('.description__24sA').innerText : '';
  
    chrome.runtime.sendMessage({ prompt: problemDescription, type }, (response) => {
      const codeArea = document.querySelector('.CodeMirror');
      if (codeArea && response && response.generatedText) {
        const editor = codeArea.CodeMirror;
        editor.setValue(response.generatedText);
      }
    });
  }
  