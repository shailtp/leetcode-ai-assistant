function getLeetCodeProblemLink() {
    return window.location.href;
}

function injectButtons() {
    const actionBar = document.querySelector('.action__38Sb');
    if (actionBar) {
        const fullCodeButton = document.createElement('button');
        fullCodeButton.innerText = 'Autofill Full Code';
        fullCodeButton.className = 'autofill-button';
        fullCodeButton.onclick = () => autofill('full');

        const pseudoCodeButton = document.createElement('button');
        pseudoCodeButton.innerText = 'Autofill Pseudocode';
        pseudoCodeButton.className = 'autofill-button';
        pseudoCodeButton.onclick = () => autofill('pseudo');

        actionBar.appendChild(fullCodeButton);
        actionBar.appendChild(pseudoCodeButton);
    }
}

function autofill(type) {
    const problemLink = getLeetCodeProblemLink();
    const problemDescription = document.querySelector('.content__u3I1.question-content__JfgR') ? 
        document.querySelector('.content__u3I1.question-content__JfgR').innerText : '';

    chrome.runtime.sendMessage({ 
        prompt: `${problemLink}\n\n${problemDescription}`, 
        type 
    }, (response) => {
        if (response && response.generatedText) {
            const editor = document.querySelector('.monaco-editor');
            if (editor) {
                const model = editor.querySelector('.view-lines');
                if (model) {
                    // This is a simplified way to insert text. For more precise control,
                    // you might need to use LeetCode's internal editor API if available.
                    const lines = response.generatedText.split('\n');
                    const formattedText = type === 'pseudo' ? 
                        lines.map(line => `// ${line}`).join('\n') :
                        response.generatedText;
                    
                    // Try to use the clipboard API to paste the text
                    navigator.clipboard.writeText(formattedText).then(() => {
                        // Simulate Ctrl+A and Ctrl+V
                        model.focus();
                        document.execCommand('selectAll');
                        document.execCommand('paste');
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            }
        }
    });
}

// Run when the page loads
injectButtons();

// Watch for navigation changes (LeetCode uses client-side routing)
let lastUrl = location.href; 
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        injectButtons();
    }
}).observe(document, {subtree: true, childList: true});