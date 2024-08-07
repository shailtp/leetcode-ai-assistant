let GROQ_API_KEY = '';

// This function will be called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // In development, you would manually set this value from your .env file
  GROQ_API_KEY = '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';
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { prompt, type } = request;
  
  fetch('https://api.groq.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      prompt: `Generate ${type === 'full' ? 'full code' : 'pseudocode'} for this problem: ${prompt}`,
      max_tokens: 150
    })
  })
  .then(response => response.json())
  .then(data => sendResponse({ generatedText: data.choices[0].text }))
  .catch(error => console.error('Error:', error));

  return true; // Keep the message channel open for async response
});