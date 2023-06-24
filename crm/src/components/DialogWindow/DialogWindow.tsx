import { useState, useEffect } from "react";
import { IMessage } from "../../types";
import { IUserDetails } from "../../types";
import useFetch from "../../hooks/useFetch";

interface DialogWindowProps {
  selectedUser: IUserDetails;
  onClose: () => void;
}

const DialogWindow = ({ selectedUser, onClose }: DialogWindowProps) => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const messageData = {
    sender: userId,
    recipient: selectedUser._id,
    content: messageContent,
  };
  const sendMessage = useFetch("post", "/messages", messageData);
  const getMessages = useFetch(
    "get",
    `/messages/${userId}/${selectedUser._id}`
  );

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages();
      if (messages) {
        setMessages(messages);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    await sendMessage();
    setMessageContent("");
    const messages = await getMessages();
    if (messages) {
      setMessages(messages);
    }
  };

  return (
    <div className="dialog-window">
      <div className="header">
        <button onClick={onClose}>Close</button>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default DialogWindow;
