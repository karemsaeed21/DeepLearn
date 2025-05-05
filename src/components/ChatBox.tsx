import { useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    console.log("Button clicked");
    setError(null);

    const content = newMessage.trim();
    if (!content) {
      console.log("Empty message, abort");
      return;
    }

    setLoading(true);
    try {
      console.log("POST /chat with:", content);
      const response = await axios.post("http://localhost:8000/chat", {
        user_id: userId,
        messages: [{ role: "user", content }],
      });
      console.log("Response:", response.data);

      setMessages((prev) => [
        ...prev,
        { role: "user", content },
        { role: "assistant", content: response.data.content },
      ]);
      setNewMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log("Key press:", e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded self-${
              msg.role === "user" ? "end bg-blue-100" : "start bg-gray-200"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-2 text-red-600 bg-red-100 border-t">
          Error: {error}
        </div>
      )}

      <div className="flex items-center space-x-2 p-4 border-t">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded resize-none h-20"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
