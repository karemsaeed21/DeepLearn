// import React, { useState, useRef, useEffect } from 'react';
// import { MessageCircle } from 'lucide-react';
// import ChatHeader from './ChatHeader';
// import ChatMessage from './ChatMessage';
// import ChatInput from './ChatInput';

// interface Message {
//   role: string;
//   content: string;
//   timestamp?: Date;
// }

// const FloatingChatbot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const chatWindowRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (isOpen && 
//           chatWindowRef.current && 
//           !chatWindowRef.current.contains(event.target as Node) &&
//           !(event.target as Element).closest('#chat-toggle-btn')) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleToggleChat = () => {
//     setIsOpen(prev => !prev);
//     if (!isOpen && messages.length === 0) {
//       setMessages([{
//         role: 'assistant',
//         content: 'Hi there! 👋 How can I assist you today?',
//         timestamp: new Date()
//       }]);
//     }
//   };

//   const clearChat = () => {
//     setMessages([{
//       role: 'assistant',
//       content: 'Chat history cleared. How can I help you?',
//       timestamp: new Date()
//     }]);
//   };

//   const sendMessage = async (inputText: string) => {
//     if (!inputText.trim()) return;
    
//     const userMessage = { 
//       role: 'user', 
//       content: inputText,
//       timestamp: new Date()
//     };
    
//     const newMessages = [...messages, userMessage];
//     setMessages([...newMessages, { role: 'assistant', content: '' }]);
//     setLoading(true);

//     try {
//       const res = await fetch('http://localhost:11434/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           model: 'gemma3:4b',
//           messages: newMessages.map(({ role, content }) => ({ role, content })),
//         }),
//       });

//       if (!res.body) throw new Error('Response body is null');

//       const reader = res.body.getReader();
//       let buffer = '';
//       let assistantContent = '';

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         buffer += new TextDecoder().decode(value);

//         let lines = buffer.split('\n');
//         buffer = lines.pop() || '';

//         for (const line of lines) {
//           if (!line.trim()) continue;
//           try {
//             const json = JSON.parse(line);
//             if (json.message?.content) {
//               assistantContent += json.message.content;
//               setMessages(current => {
//                 const updated = [...current];
//                 updated[updated.length - 1] = { 
//                   role: 'assistant', 
//                   content: assistantContent,
//                   timestamp: new Date()
//                 };
//                 return updated;
//               });
//             }
//           } catch (e) {
//             console.error('Error parsing JSON:', e);
//           }
//         }
//       }
//     } catch (err) {
//       setMessages(current => [
//         ...current.slice(0, -1),
//         { 
//           role: 'assistant', 
//           content: 'I apologize, but I seem to be having trouble connecting. Please try again in a moment.',
//           timestamp: new Date()
//         }
//       ]);
//     }
    
//     setLoading(false);
//   };

//   return (
//     <>
//       <button
//         id="chat-toggle-btn"
//         onClick={handleToggleChat}
//         className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 
//                  text-white rounded-full w-14 h-14 flex items-center justify-center
//                  shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300
//                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         aria-label={isOpen ? "Close chat" : "Open chat"}
//       >
//         <MessageCircle 
//           size={24} 
//           className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'animate-pulse'}`} 
//         />
//       </button>

//       <div 
//         ref={chatWindowRef}
//         className={`fixed z-40 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out
//                    w-[380px] sm:w-[420px] max-w-full bg-white border border-gray-100
//                    backdrop-blur-sm bg-white/95
//                    ${isOpen 
//                      ? 'opacity-100 bottom-24 right-6 translate-y-0 scale-100' 
//                      : 'opacity-0 bottom-16 right-6 translate-y-4 scale-95 pointer-events-none'}`}
//       >
//         <div className="flex flex-col h-[32rem] max-h-[85vh]">
//           <div className="px-6 py-4 bg-gradient-to-b from-white to-transparent">
//             <ChatHeader 
//               onClose={() => setIsOpen(false)} 
//               onClearChat={clearChat}
//               messageCount={messages.length}
//             />
//           </div>
          
//           <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-indigo-50/20 to-purple-50/20">
//             {messages.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
//                 <MessageCircle size={48} className="text-indigo-200" />
//                 <p className="text-center text-sm">
//                   Start a conversation with our AI assistant
//                 </p>
//               </div>
//             ) : (
//               messages.map((msg, i) => (
//                 <ChatMessage 
//                   key={i} 
//                   message={msg} 
//                   isLatest={i === messages.length - 1 && loading && msg.role === 'assistant'}
//                 />
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>
          
//           <div className="px-6 py-4 bg-white border-t border-gray-100">
//             <ChatInput onSendMessage={sendMessage} isLoading={loading} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FloatingChatbot;
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  role: string;
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
      role: 'user', 
      content: inputText,
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3:4b',
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.body) throw new Error('Response body is null');

      const reader = res.body.getReader();
      let buffer = '';
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);

        let lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              assistantContent += json.message.content;
              setMessages(current => {
                const updated = [...current];
                updated[updated.length - 1] = { 
                  role: 'assistant', 
                  content: assistantContent,
                  timestamp: new Date()
                };
                return updated;
              });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (err) {
      setMessages(current => [
        ...current.slice(0, -1),
        { 
          role: 'assistant', 
          content: 'I apologize, but I seem to be having trouble connecting. Please try again in a moment.',
          timestamp: new Date()
        }
      ]);
    }
    
    setLoading(false);
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
                  //  ${!isOpen && !messages.length ? 'animate-float' : ''}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle 
          size={26} 
          className={`transition-transform duration-500 ${isOpen ? 'rotate-90 scale-90' : 'group-hover:rotate-12'}`} 
        />
      </button>

      <div 
        ref={chatWindowRef}
        className={`fixed z-40 chat-window rounded-3xl transition-all duration-500
                   w-[380px] sm:w-[440px] max-w-[calc(100vw-3rem)]
                   ${isOpen 
                     ? 'opacity-100 bottom-48 right-8 translate-y-0 scale-100' 
                     : 'opacity-0 bottom-20 right-6 translate-y-4 scale-95 pointer-events-none'}`}
      >
        <div className="flex flex-col h-[600px] max-h-[80vh]">
          <div className="p-6">
            <ChatHeader 
              onClose={() => setIsOpen(false)} 
              onClearChat={clearChat}
              messageCount={messages.length}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100">
                  <MessageCircle size={40} className="text-indigo-600" />
                </div>
                <p className="text-center text-gray-500 max-w-[240px]">
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
          
          <div className="p-6 border-t border-gray-100">
            <ChatInput onSendMessage={sendMessage} isLoading={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingChatbot;