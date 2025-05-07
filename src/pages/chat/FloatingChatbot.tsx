import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader'; // Make sure these components exist
import ChatMessage from './ChatMessage'; // Make sure these components exist
import ChatInput from './ChatInput';   // Make sure these components exist



interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen &&
          chatWindowRef.current &&
          !chatWindowRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('#chat-toggle-btn')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hi there! 👋 Im your AI assistant. How can I help you today?',
        timestamp: new Date()
      }]);
    }
  };
  

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat history cleared. What would you like to discuss?',
      timestamp: new Date()
    }]);
  };

  const sendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: inputText,
      timestamp: new Date()
    };

    const currentMessagesForApi = [...messages, userMessage]
      .filter(msg => msg.content && msg.content.trim() !== '');

    if (currentMessagesForApi.length === 0) {
      console.warn("No valid messages with content to send to the API. Aborting.");
      return;
    }

    setMessages(prevMessages => [...prevMessages, userMessage, { 
      role: 'assistant', 
      content: '', 
      timestamp: new Date() 
    }]);
    
    setLoading(true);
    let accumulatedAssistantContent = '';

    const API_KEY = "AIzaSyDP5-ltToP59wrwEXQzX7UWfebYhSL_ZpU";

    try {
      const payloadForApi = {
        contents: currentMessagesForApi.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${API_KEY}&alt=sse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadForApi),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        let errorJson: any = {};
        try { errorJson = JSON.parse(errorBody); } catch (e) { console.warn("Could not parse error response as JSON:", errorBody); }
        throw new Error(`API request failed with status ${res.status}: ${errorJson.error?.message || res.statusText || 'Unknown API error'}`);
      }

      if (!res.body) throw new Error('Response body is null');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalFinishReason = '' as string;

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
              const candidate = json.candidates?.[0];
              const textChunk = candidate?.content?.parts?.[0]?.text;

              if (textChunk) {
                accumulatedAssistantContent += textChunk;
                setMessages(current => {
                  const updated = [...current];
                  if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: accumulatedAssistantContent,
                      timestamp: new Date()
                    };
                  }
                  return updated;
                });
              }

              if (candidate?.finishReason) {
                finalFinishReason = candidate.finishReason;
                if (candidate.finishReason !== "STOP" && candidate.finishReason !== "UNSPECIFIED") {
                  let reasonMessage = `\n[Response ended. Reason: ${candidate.finishReason}]`;
                  if (candidate.finishReason === "MAX_TOKENS") {
                    reasonMessage = "\n[Response reached maximum length]";
                  } else if (candidate.finishReason === "SAFETY") {
                    reasonMessage = "\n[Content blocked by safety filters]";
                  }
                  accumulatedAssistantContent += reasonMessage;
                  setMessages(current => {
                    const updated = [...current];
                    if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                      updated[updated.length - 1].content = accumulatedAssistantContent;
                    }
                    return updated;
                  });
                }
              }
            } catch (e) {
              console.error('Error parsing JSON line from stream:', line, e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error in sendMessage:', err);
      setMessages(current => {
        const updatedMessages = [...current];
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'assistant') {
          updatedMessages[updatedMessages.length - 1] = {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${err.message || 'Please try again later.'}`,
            timestamp: new Date()
          };
          return updatedMessages;
        } else {
          return [...current, { 
            role: 'assistant', 
            content: `Error: ${err.message || 'Connection issue.'}`, 
            timestamp: new Date() 
          }];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="chat-toggle-btn"
        onClick={handleToggleChat}
        className={`fixed bottom-24 right-7 z-50 w-16 h-16
                   bg-gradient-to-br from-indigo-600 to-violet-600
                   text-white rounded-2xl flex items-center justify-center
                   shadow-lg hover:shadow-xl transition-all duration-500
                   group hover:scale-105
                   `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle
          size={26}
          className={`transition-transform duration-500 ${isOpen ? 'rotate-90 scale-90' : 'group-hover:rotate-12'}`}
        />
      </button>

      <div
        ref={chatWindowRef}
        // Apply a class for easier styling if needed, e.g., 'chat-window-container'
        className={`fixed z-40 chat-window rounded-3xl transition-all duration-500
                   w-[380px] sm:w-[440px] max-w-[calc(100vw-3rem)] bg-white border border-gray-200 shadow-2xl
                   ${isOpen
                     ? 'opacity-100 bottom-48 right-8 translate-y-0 scale-100' // Adjusted bottom positioning
                     : 'opacity-0 bottom-40 right-6 translate-y-4 scale-95 pointer-events-none'}`} // Adjusted bottom
      >
        <div className="flex flex-col h-[600px] max-h-[calc(100vh-10rem)]"> {/* Adjusted max-h */}
          <div className="p-6 border-b border-gray-200"> {/* Added border for header separation */}
            <ChatHeader
              onClose={() => setIsOpen(false)}
              onClearChat={clearChat}
              messageCount={messages.length}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-50"> {/* Light bg for chat area */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
                <div className="p-6 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100">
                  <MessageCircle size={40} className="text-indigo-600" />
                </div>
                <p className="text-center max-w-[240px]">
                  Start a conversation with your AI assistant
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isLatest={i === messages.length - 1 && loading && msg.role === 'assistant'}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-gray-200 bg-white"> {/* Ensure input area has solid bg */}
            <ChatInput onSendMessage={sendMessage} isLoading={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingChatbot;