// interface AIResponse {
//   content: string;
//   error?: string;
// }

export const formatAIResponse = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '');
};

export const callGeminiAPI = async (
  promptText: string,
  GEMINI_API_KEY: string,
  onContent: (content: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GOOGLE_AI_API_KEY_HERE") {
    onError("Error: API Key not configured. Please set your Google AI API Key.");
    onComplete();
    return;
  }
  
  if (!promptText.trim()) {
    onError("Error: Input text is empty.");
    onComplete();
    return;
  }

  let accumulatedContent = '';
  
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {},
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: { message: "Unknown error with non-JSON response" } }));
      console.error('Gemini API Error:', errorBody);
      throw new Error(`API request failed (${res.status}) - ${errorBody.error?.message || res.statusText}`);
    }

    if (!res.body) throw new Error('Response body is null');
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      let eolIndex;
      
      while ((eolIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.substring(0, eolIndex).trim();
        buffer = buffer.substring(eolIndex + 1);
        
        if (line.startsWith('data: ')) {
          const jsonString = line.substring('data: '.length);
          if (!jsonString.trim() || jsonString.trim() === '[DONE]') continue;
          
          try {
            const json = JSON.parse(jsonString);
            const textChunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (textChunk) {
              accumulatedContent += textChunk;
              onContent(formatAIResponse(textChunk));
            }
            
            if (json.error) {
              console.error("Error in stream from API:", json.error);
              accumulatedContent += `\n[API Stream Error: ${json.error.message || 'Unknown error in stream'}]`;
              onContent(`\n[API Stream Error: ${json.error.message || 'Unknown error in stream'}]`);
            }
          } catch (e) {
            console.warn('Error parsing JSON line from stream:', jsonString, e);
          }
        }
      }
    }
  } catch (err: any) {
    console.error('Error calling Gemini API:', err);
    onError(`Error: ${err.message || 'Failed to connect or process request.'}`);
  } finally {
    onComplete();
  }
};

export const generateAIPrompt = (
  type: 'summary' | 'paraphrase' | 'explanation',
  text: string,
  instruction?: string
) => {
  const basePrompts = {
    summary: `Summarize the following text in a concise paragraph. Only return the summary.\n\nText:\n${text}`,
    paraphrase: `Paraphrase the following text. Rephrase it in your own words while maintaining the original meaning. Only return the paraphrased text.\n\nOriginal Text:\n${text}`,
    explanation: `Explain the following text in a clear and detailed way. Break down complex concepts if necessary. Provide examples if it helps clarify the meaning. Keep the tone informative and easy to understand.\n\nText to Explain:\n${text}`
  };

  if (instruction) {
    return {
      summary: `Summarize the following text. Instruction: "${instruction}". Only return the refined summary.\n\nText:\n${text}`,
      paraphrase: `Paraphrase the following text. Instruction: "${instruction}". Only return the refined paraphrased text.\n\nOriginal Text:\n${text}`,
      explanation: `Explain the following text. Instruction: "${instruction}". Provide a clear and detailed explanation.\n\nText to Explain:\n${text}`
    }[type];
  }

  return basePrompts[type];
};