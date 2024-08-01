require('dotenv').config();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { prompt, type } = request;

  fetch('https://api.groq.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
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
