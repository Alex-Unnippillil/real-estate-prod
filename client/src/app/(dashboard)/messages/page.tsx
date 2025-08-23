"use client";
import { useGetAuthUserQuery, useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } from "@/state/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MessagesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const userId = authUser?.cognitoInfo.userId;
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { data: conversations } = useGetConversationsQuery(userId!, {
    skip: !userId,
    pollingInterval: 5000,
  });
  const { data: messages } = useGetMessagesQuery(
    { userId: userId!, otherUserId: activeConversation! },
    { skip: !activeConversation || !userId, pollingInterval: 5000 }
  );
  const [newMessage, setNewMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();

  const handleSend = async () => {
    if (!activeConversation || !newMessage.trim()) return;
    await sendMessage({ senderId: userId!, receiverId: activeConversation, content: newMessage });
    setNewMessage("");
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r p-4 space-y-2">
        {conversations?.map((c) => (
          <div
            key={c.userId}
            onClick={() => setActiveConversation(c.userId)}
            className={`p-2 rounded cursor-pointer flex justify-between ${
              activeConversation === c.userId ? "bg-primary-200" : "hover:bg-primary-200"
            }`}
          >
            <span>{c.userId}</span>
            {c.unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-2">
                {c.unreadCount}
              </span>
            )}
          </div>
        ))}
      </aside>
      <section className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages?.map((m) => (
            <div
              key={m.id}
              className={`p-2 rounded max-w-xs ${
                m.senderId === userId ? "bg-blue-200 ml-auto" : "bg-gray-200"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>
        {activeConversation && (
          <div className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;
