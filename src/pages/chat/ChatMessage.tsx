// import React from 'react';
// import { Bot, User } from 'lucide-react';

// interface ChatMessageProps {
//   message: {
//     role: string;
//     content: string;
//     timestamp?: Date;
//   };
//   isLatest: boolean;
// }

// const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
//   const isUser = message.role === 'user';
//   const timestamp = message.timestamp || new Date();
//   const formattedTime = timestamp.toLocaleTimeString([], { 
//     hour: '2-digit', 
//     minute: '2-digit'
//   });
  
//   return (
//     <div 
//       className={`group flex w-full items-end ${isUser ? 'justify-end' : 'justify-start'}`}
//     >
//       {!isUser && (
//         <div className="flex-shrink-0 mr-3">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-2">
//             <Bot size={18} className="text-white" />
//           </div>
//         </div>
//       )}
      
//       <div 
//         className={`max-w-[85%] ${isLatest ? 'animate-slideIn' : ''}`}
//       >
//         <div 
//           className={`px-4 py-3 rounded-2xl shadow-sm
//             ${isUser 
//               ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
//               : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
//             }
//           `}
//         >
//           {message.content || (
//             isLatest && (
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                 <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                 <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//               </div>
//             )
//           )}
//         </div>
        
//         <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//           {formattedTime}
//         </div>
//       </div>
      
//       {isUser && (
//         <div className="flex-shrink-0 ml-3">
//           <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-2">
//             <User size={18} className="text-gray-700" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatMessage
import React, { useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-funky.css';
// import 'prismjs/themes/prism-funky.css';


// Import necessary language supports
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    timestamp?: Date;
  };
  isLatest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp || new Date();
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  const CodeBlock = ({ language, code }: { language: string; code: string }) => {
    useEffect(() => {
      Prism.highlightAll();
    }, [code]);

    return (
      <div className="my-2 rounded-lg overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-1">
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {language}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Copy
          </button>
        </div>
        <pre className="!m-0 !rounded-none">
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    );
  };

  const renderText = (text: string) => {
  const processedText = text
    // Handle code blocks
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Handle bold+italic (***text***)
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Handle bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle italic (*text*)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle bullet points (* item)
    .replace(/^\*\s(.*$)/gm, '<li>$1</li>')
    // Handle line breaks (but preserve list formatting)
    .replace(/\n/g, (_match, offset, string) => {
      // Only convert to <br> if not part of a list
      return offset > 0 && string[offset-1] !== '>' ? '<br/>' : '\n';
    });

  // Wrap list items in <ul> if we found any
  const hasListItems = processedText.includes('<li>');
  const finalText = hasListItems 
    ? processedText.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
    : processedText;

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: finalText }}
    />
  );
};

  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderText(content.substring(lastIndex, match.index)));
      }

      const language = match[1] || 'text';
      const code = match[2];
      parts.push(
        <CodeBlock key={`code-${lastIndex}`} language={language} code={code} />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(renderText(content.substring(lastIndex)));
    }

    return parts.length ? parts : renderText(content);
  };

  return (
    <div 
      className={`group flex w-full items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-md">
            <Bot size={20} className="text-indigo-600" />
          </div>
        </div>
      )}
      
      <div 
        className={`max-w-[80%] ${isLatest ? 'animate-slideUp' : ''}`}
      >
        <div 
          className={`px-5 py-3 message-bubble shadow-sm
            ${isUser 
              ? 'user-message text-white rounded-[24px] rounded-br-lg' 
              : 'bot-message text-gray-700 rounded-[24px] rounded-bl-lg'
            }
          `}
        >
          {message.content ? (
            <div className="whitespace-pre-wrap">
              {renderMessageContent(message.content)}
            </div>
          ) : (
            isLatest && (
              <div className="flex items-end space-x-1 h-6">
                <div className="typing-dot w-2 h-2 rounded-full bg-current opacity-60"></div>
                <div className="typing-dot w-2 h-2 rounded-full bg-current opacity-75"></div>
                <div className="typing-dot w-2 h-2 rounded-full bg-current"></div>
              </div>
            )
          )}
        </div>
        
        <div className="text-xs text-gray-400 mt-1.5 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {formattedTime}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md">
            <User size={20} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;