// import React from 'react';
// import { X, Trash2, Bot } from 'lucide-react';

// interface ChatHeaderProps {
//   onClose: () => void;
//   onClearChat: () => void;
//   messageCount: number;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onClearChat, messageCount }) => {
//   return (
//     <div className="flex items-center justify-between pb-4">
//       <div className="flex items-center space-x-3">
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-2.5">
//           <Bot size={20} />
//         </div>
//         <div>
//           <h3 className="font-semibold text-gray-900">AI Assistant</h3>
//           <p className="text-xs text-gray-500">
//             {messageCount > 0 ? `${messageCount} messages in conversation` : 'Ready to help'}
//           </p>
//         </div>
//       </div>
      
//       <div className="flex items-center space-x-1">
//         {messageCount > 0 && (
//           <button 
//             onClick={onClearChat}
//             className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 
//                      transition-all duration-300"
//             aria-label="Clear chat history"
//             title="Clear conversation"
//           >
//             <Trash2 size={18} />
//           </button>
//         )}
        
//         <button 
//           onClick={onClose}
//           className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100
//                    transition-all duration-300"
//           aria-label="Close chat window"
//         >
//           <X size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader
import React from 'react';
import { X, Trash2, Bot } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onClearChat: () => void;
  messageCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onClearChat, messageCount }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
          <Bot size={22} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Assistant
          </h3>
          <p className="text-sm text-gray-500">
            {messageCount > 0 ? `${messageCount} messages` : 'Ready to help'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <button 
            onClick={onClearChat}
            className="h-10 w-10 flex items-center justify-center text-gray-400
                     hover:text-red-500 rounded-xl hover:bg-red-50 
                     transition-all duration-300"
            aria-label="Clear chat history"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        )}
        
        <button 
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center text-gray-400
                   hover:text-gray-600 rounded-xl hover:bg-gray-100
                   transition-all duration-300"
          aria-label="Close chat window"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;