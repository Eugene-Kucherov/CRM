import "./messagesPage.scss";
import { useState, useEffect } from "react";
import { IDialogue, IUserDetails } from "../../types";
import DialogWindow from "../../components/DialogWindow/DialogWindow";
import useFetch from "../../hooks/useFetch";
import { Avatar } from "@mui/material";
import { useTypedSelector } from "../../store";

const MessagesPage = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<Array<IDialogue>>([]);
  const [selectedUser, setSelectedUser] = useState<IUserDetails | null>(null);
  const [dialogues, setDialogues] = useState<Array<IDialogue>>([]);
  const [globalResults, setGlobalResults] = useState<Array<IUserDetails>>([]);
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | null>(
    null
  );

  const socket = useTypedSelector((state) => state.socket.socket);

  const userId = JSON.parse(localStorage.getItem("userId")!);
  const globalSearch = useFetch("get", `/users?name=${searchName}`);

  useEffect(() => {
    if (socket) {
      socket.emit("getDialogues", userId);
      socket.on("dialogues", (receivedDialogues: Array<IDialogue>) => {
        setDialogues(receivedDialogues);
        receivedDialogues.forEach((dialogue) => {
          socket.emit("joinRoom", dialogue._id);
        });
      });
    }
  }, [socket, userId, dialogues]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName) {
        handleGlobalSearch();
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName]);

  const handleSearch = () => {
    const filteredDialogues = dialogues.filter((dialogue) => {
      const dialoguePartner = getDialoguePartner(dialogue);
      return (
        dialoguePartner.username
          .toLowerCase()
          .includes(searchName.toLowerCase()) ||
        dialogue.lastMessage.content
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    });

    setSearchResults(filteredDialogues);
  };

  const handleGlobalSearch = async () => {
    const users = await globalSearch();
    if (users) setGlobalResults(users);
  };

  const handleUserClick = (user: IUserDetails, dialogueId?: string) => {
    setSelectedUser(user);
    if (dialogueId) setSelectedDialogueId(dialogueId);
  };

  const getDialoguePartner = (dialogue: IDialogue) => {
    return dialogue.dialoguePartners.filter(
      (dialoguePartner) => dialoguePartner.user._id !== userId
    )[0];
  };

  const formatMessageTime = (timestamp: Date) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    ) {
      return `${formattedHours}:${formattedMinutes}`;
    } else {
      return `${messageDate.toLocaleDateString()}`;
    }
  };

  return (
    <section className="messages-page">
      <div className="dialogues">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <div>
          {(searchName ? searchResults : dialogues).map((dialogue) => (
            <div
              className={`dialogue ${
                selectedUser &&
                getDialoguePartner(dialogue).user._id === selectedUser._id
                  ? "active"
                  : ""
              }`}
              key={dialogue._id}
              onClick={() =>
                handleUserClick(getDialoguePartner(dialogue).user, dialogue._id)
              }
            >
              <div className="dialogue-photo">
                {getDialoguePartner(dialogue).photo ? (
                  <img src={getDialoguePartner(dialogue).photo} alt="" />
                ) : (
                  <Avatar alt="" className="avatar" />
                )}
              </div>
              <div className="dialogue-content">
                <div className="dialogue-content-head">
                  <span className="dialogue-content-head__name">
                    {getDialoguePartner(dialogue).username}
                  </span>
                  <span className="dialogue-content-head__time">
                    {formatMessageTime(dialogue.lastMessage.created_at)}
                  </span>
                </div>
                <div className="dialogue-content-body">
                  <span
                    className={`dialogue-content-body__last-message ${
                      dialogue.lastMessage.recipient._id === userId &&
                      !dialogue.lastMessage.is_read
                        ? "bold"
                        : ""
                    }`}
                  >
                    {dialogue.lastMessage.content}
                  </span>
                  {dialogue.lastMessage.recipient._id === userId &&
                    dialogue.unreadNumber > 0 && (
                      <div className="dialogue-content-body__unread-number">
                        {dialogue.unreadNumber}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {globalResults.map((user) => (
            <div key={user.email} onClick={() => handleUserClick(user)}>
              {user.name}
            </div>
          ))}
        </div>
      </div>
      {selectedUser && (
        <DialogWindow
          selectedUser={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setSelectedDialogueId(null);
          }}
          selectedDialogueId={selectedDialogueId}
        />
      )}
    </section>
  );
};

export default MessagesPage;
