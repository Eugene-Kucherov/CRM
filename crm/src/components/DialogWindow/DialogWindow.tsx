import { useState, useEffect, useRef } from "react";
import { IMessage } from "../../types";
import { IUserDetails } from "../../types";
import "./dialogWindow.scss";
import { useTypedSelector } from "../../store";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const socket = useTypedSelector((state) => state.socket.socket);

  const userId = JSON.parse(localStorage.getItem("userId")!);
  const messageData = {
    sender: userId,
    recipient: selectedUser._id,
    content: messageContent,
  };

  const handleClickOutsideContextMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInsideContextMenu = target.closest(".context-menu");

    if (!isInsideContextMenu) {
      setIsContextMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isContextMenuOpen) {
      document.addEventListener("click", handleClickOutsideContextMenu);
    } else {
      document.removeEventListener("click", handleClickOutsideContextMenu);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideContextMenu);
    };
  }, [isContextMenuOpen]);

  useEffect(() => {
    if (socket) {
      const handleMessages = (receivedMessages: Array<IMessage>) => {
        setMessages(receivedMessages);
      };

      socket.emit("getMessages", {
        dialogueId: selectedDialogueId,
        userId,
      });

      socket.on("messages", handleMessages);

      return () => {
        socket.off("messages", handleMessages);
      };
    }
  }, [socket, selectedUser._id, userId, selectedDialogueId, messages]);

  const handleSendMessage = () => {
    if (socket) {
      setTimeout(() => {
        socket.emit("sendMessage", messageData);
      }, 100);
    }
    setMessageContent("");
  };

  const handleEditMode = (content: string) => {
    setIsEditMode(true);
    setMessageContent(content);
    setIsContextMenuOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleUpdateMessage = () => {
    if (socket) {
      socket.emit("updateMessage", {
        messageId: selectedMessageId,
        updatedContent: messageContent,
      });
    }
    setIsEditMode(false);
    setMessageContent("");
  };

  const handleDeleteMessage = () => {
    if (socket) {
      socket.emit("deleteMessage", selectedMessageId);
    }
    setIsContextMenuOpen(false);
  };

  const handleMessageContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    messageId: string
  ) => {
    event.preventDefault();
    setSelectedMessageId(messageId);
    setIsContextMenuOpen(true);
  };

  const formatMessageTime = (createdAt: Date, updatedAt: Date | null) => {
    const messageDate = new Date(createdAt);

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return updatedAt
      ? `edited ${formattedHours}:${formattedMinutes}`
      : `${formattedHours}:${formattedMinutes}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      isEditMode ? handleUpdateMessage() : handleSendMessage();
    }
  };

  return (
    <div className="dialog-window">
      <div className="header">
        <button className="dialogue-close" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="messages">
        {messages
          .filter((message) => !message.is_deleted)
          .map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === userId ? "sender" : ""}`}
            >
              <div
                className={`message-content ${
                  message.sender === userId ? "sender" : ""
                }`}
                onContextMenu={(event) =>
                  handleMessageContextMenu(event, message.id)
                }
              >
                <span className="message-text">{message.content}</span>
                <span className="message-time">
                  {formatMessageTime(message.created_at, message.updated_at)}
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
                {isContextMenuOpen &&
                  selectedMessageId === message.id &&
                  message.sender === userId && (
                    <div className="context-menu">
                      <button
                        className="context-menu__action"
                        onClick={() => handleEditMode(message.content)}
                      >
                        <EditIcon fontSize="small" /> Edit
                      </button>
                      <button
                        className="context-menu__action"
                        onClick={() => handleDeleteMessage()}
                      >
                        <DeleteIcon fontSize="small" /> Delete
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
      </div>
      <div className="message-input">
        <input
          ref={inputRef}
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={isEditMode ? handleUpdateMessage : handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default DialogWindow;
