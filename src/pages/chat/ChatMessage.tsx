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
import React from 'react';
import { Bot, User } from 'lucide-react';

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
          {message.content || (
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