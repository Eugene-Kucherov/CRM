import { useState, useEffect } from "react";
import { IMessage } from "../../types";
import { IUserDetails } from "../../types";
import "./dialogWindow.scss";
import { useTypedSelector } from "../../store";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface DialogWindowProps {
  selectedUser: IUserDetails;
  onClose: () => void;
  selectedDialogueId: string | null;
}

const DialogWindow = ({
  selectedUser,
  onClose,
  selectedDialogueId,
}: DialogWindowProps) => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const socket = useTypedSelector((state) => state.socket.socket);

  const userId = JSON.parse(localStorage.getItem("userId")!);
  const messageData = {
    sender: userId,
    recipient: selectedUser._id,
    content: messageContent,
  };

  useEffect(() => {
    if (socket) {
      const handleMessages = (receivedMessages: Array<IMessage>) => {
        setMessages(receivedMessages);
      };

      const handleNewMessage = (newMessage: IMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("getMessages", {
          dialogueId: selectedDialogueId,
          userId,
        });
      };

      const handleDeletedMessage = (deletedMessageId: string | null) => {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === deletedMessageId
              ? { ...message, is_deleted: true }
              : message
          )
        );
        socket.emit("getMessages", {
          dialogueId: selectedDialogueId,
          userId,
        });
      };

      socket.emit("getMessages", {
        dialogueId: selectedDialogueId,
        userId,
      });

      socket.on("messages", handleMessages);
      socket.on("message", handleNewMessage);
      socket.on("messageDeleted", handleDeletedMessage);

      return () => {
        socket.off("messages", handleMessages);
        socket.off("message", handleNewMessage);
        socket.off("messageDeleted", handleDeletedMessage);
      };
    }
  }, [socket, selectedUser._id, userId]);

  const handleSendMessage = () => {
    if (socket) {
      setTimeout(() => {
        socket.emit("sendMessage", messageData);
      }, 100);
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

  const formatMessageTime = (timestamp: Date) => {
    const messageDate = new Date(timestamp);

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
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
                <span className="message-text">{message.content}</span>
                <span className="message-time">
                  {formatMessageTime(message.created_at)}
                </span>
                {message.sender === userId && (
                  <div className="message-status">
                    {message.is_read ? (
                      <DoneAllIcon fontSize="small" />
                    ) : (
                      <DoneIcon fontSize="small" />
                    )}
                  </div>
                )}
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
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default DialogWindow;
