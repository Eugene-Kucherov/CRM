import { useState, useEffect } from "react";
import { IMessage } from "../../types";
import { IUserDetails } from "../../types";
import "./dialogWindow.scss";
import { Socket, io } from "socket.io-client";

interface DialogWindowProps {
  selectedUser: IUserDetails;
  onClose: () => void;
}

const DialogWindow = ({ selectedUser, onClose }: DialogWindowProps) => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  const userId = JSON.parse(localStorage.getItem("userId")!);
  const messageData = {
    sender: userId,
    recipient: selectedUser._id,
    content: messageContent,
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("getMessages", {
        senderId: userId,
        recipientId: selectedUser._id,
      });

      socket.on("messages", (receivedMessages: Array<IMessage>) => {
        setMessages(receivedMessages);
      });

      socket.on("message", (newMessage: IMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("messageDeleted", (deletedMessageId: string | null) => {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === deletedMessageId
              ? { ...message, is_deleted: true }
              : message
          )
        );
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (socket) {
      socket.emit("sendMessage", messageData);
    }
    setMessageContent("");
  };

  const handleDeleteMessage = () => {
    if (socket) {
      socket.emit("deleteMessage", selectedMessageId);
    }
  };

  const handleMessageContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    messageId: string
  ) => {
    event.preventDefault();
    setSelectedMessageId(messageId);
  };

  return (
    <div className="dialog-window">
      <div className="header">
        <button onClick={onClose}>Close</button>
      </div>
      <div className="messages">
        {messages
          .filter((message) => !message.is_deleted)
          .map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === userId ? "sender" : ""}`}
              onContextMenu={(event) =>
                handleMessageContextMenu(event, message.id)
              }
            >
              <div
                className={`message-content ${
                  message.sender === userId ? "sender" : ""
                }`}
              >
                {message.content}
              </div>
              {selectedMessageId === message.id && (
                <button onClick={() => handleDeleteMessage()}>Delete</button>
              )}
            </div>
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
