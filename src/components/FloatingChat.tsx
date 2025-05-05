import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

export default function FloatingChat({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-white border shadow-xl rounded-xl w-96 h-[450px] overflow-hidden">
          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-semibold">Ask the Tutor</span>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">×</button>
          </div>
          <div className="h-full overflow-y-auto">
            <ChatBox userId={userId} />
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
