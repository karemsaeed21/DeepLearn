// import React, { useState } from 'react';
// import { Send } from 'lucide-react';

// interface ChatInputProps {
//   onSendMessage: (message: string) => void;
//   isLoading: boolean;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputValue.trim() && !isLoading) {
//       onSendMessage(inputValue);
//       setInputValue('');
//     }
//   };

//   return (
//     <form 
//       onSubmit={handleSubmit}
//       className="flex items-center gap-3"
//     >
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Type your message..."
//         disabled={isLoading}
//         className="flex-1 py-3 px-4 bg-gray-50 rounded-xl border border-transparent
//                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
//                  focus:bg-white transition-all duration-300 disabled:opacity-75"
//         aria-label="Type your message"
//       />
//       <button
//         type="submit"
//         disabled={!inputValue.trim() || isLoading}
//         className={`p-3 rounded-xl transition-all duration-300 focus:outline-none
//           ${inputValue.trim() && !isLoading
//             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
//             : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
//         `}
//         aria-label="Send message"
//       >
//         <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
//       </button>
//     </form>
//   );
// };

// export default ChatInput
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-3"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 h-12 px-5 rounded-full chat-input
                 text-gray-700 placeholder:text-gray-400
                 transition-all duration-300 disabled:opacity-75"
        aria-label="Type your message"
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
        className={`h-12 w-12 rounded-full flex items-center justify-center
          transition-all duration-300 disabled:opacity-50
          ${inputValue.trim() && !isLoading
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
        `}
        aria-label="Send message"
      >
        <Send size={20} className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>
    </form>
  );
};

export default ChatInput;