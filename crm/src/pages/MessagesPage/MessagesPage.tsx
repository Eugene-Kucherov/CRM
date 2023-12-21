import "./messagesPage.scss";
import { useState, useEffect } from "react";
import { IDialogue, IUserDetails } from "../../types";
import DialogWindow from "../../components/DialogWindow/DialogWindow";
import useFetch from "../../hooks/useFetch";
import { Avatar } from "@mui/material";
import { useTypedSelector } from "../../store";

const MessagesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("dialogues");
  const [selectedUser, setSelectedUser] = useState<IUserDetails | null>(null);
  const [dialogues, setDialogues] = useState<Array<IDialogue>>([]);
  const [userResults, setUserResults] = useState<Array<IUserDetails>>([]);
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | null>(
    null
  );

  const socket = useTypedSelector((state) => state.socket.socket);

  const userId = JSON.parse(localStorage.getItem("userId")!);
  const globalSearch = useFetch("get", `/users?name=${searchText}`);

  useEffect(() => {
    if (socket && !searchText) {
      socket.emit("getDialogues", userId);
      socket.on("dialogues", (receivedDialogues: Array<IDialogue>) => {
        setDialogues(receivedDialogues);
      });
    }
  }, [socket, userId, dialogues, searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText && searchMode === "dialogues") {
        handleDialogueSearch();
      } else if (searchText && searchMode === "users") {
        handleUserSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, searchMode, dialogues]);

  const handleSearchModeToggle = () => {
    setSearchMode((prevMode) =>
      prevMode === "dialogues" ? "users" : "dialogues"
    );
  };

  const handleDialogueSearch = () => {
    if (socket) {
      socket.emit("searchDialogues", { userId, searchText });
      socket.on("matchingDialogues", (matchingDialogues: Array<IDialogue>) => {
        setDialogues(matchingDialogues);
      });
    }
  };

  const handleUserSearch = async () => {
    const users = await globalSearch();
    if (users) setUserResults(users);
  };

  const handleUserClick = (user: IUserDetails, dialogueId?: string) => {
    if (socket && user && !dialogueId) {
      socket.emit("createDialogue", {
        senderId: userId,
        recipientId: user._id,
      });
      socket.on("dialogueCreated", (dialogue) => {
        setSelectedDialogueId(dialogue._id);
        setSelectedUser(user);
      });
    }

    if (dialogueId) {
      setSelectedUser(user);
      setSelectedDialogueId(dialogueId);
    }
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
        <div className="dialogues__search">
          <input
            className="dialogues__search-input"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
          />
          <button
            className="dialogues__search-switcher"
            onClick={handleSearchModeToggle}
          >
            {searchMode === "dialogues" ? "Dialogues" : "Users"}
          </button>
        </div>
        <div>
          {searchMode === "dialogues" &&
            dialogues.map(
              (dialogue) =>
                (dialogue.lastMessage ||
                  (!dialogue.lastMessage && dialogue.creator === userId)) && (
                  <div
                    className={`dialogue ${
                      selectedUser &&
                      getDialoguePartner(dialogue).user._id === selectedUser._id
                        ? "active"
                        : ""
                    }`}
                    key={dialogue._id}
                    onClick={() =>
                      handleUserClick(
                        getDialoguePartner(dialogue).user,
                        dialogue._id
                      )
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
                        {dialogue.lastMessage && (
                          <span className="dialogue-content-head__time">
                            {formatMessageTime(dialogue.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      {dialogue.lastMessage && (
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
                      )}
                    </div>
                  </div>
                )
            )}
        </div>
        <div>
          {searchMode === "users" &&
            userResults.map((user) => (
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
