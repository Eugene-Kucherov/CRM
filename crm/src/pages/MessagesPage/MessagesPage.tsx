import "./messagesPage.scss";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { IDialog, IUserDetails } from "../../types";
import DialogWindow from "../../components/DialogWindow/DialogWindow";
import { io } from "socket.io-client";

const MessagesPage = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<Array<IUserDetails>>([]);
  const [selectedUser, setSelectedUser] = useState<IUserDetails | null>(null);
  const [dialogs, setDialogs] = useState<Array<IDialog>>([]);

  const searchUser = useFetch("get", `/users?name=${searchName}`);
  const getDialogs = useFetch("get", `/messages/dialogues`);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName) handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    const fetchDialogs = async () => {
      const fetchedDialogs = await getDialogs();
      if (fetchedDialogs) setDialogs(fetchedDialogs);
    };

    fetchDialogs();
  }, []);

  const handleSearch = async () => {
    const users = await searchUser();
    if (users) setSearchResults(users);
  };

  const handleUserClick = (user: IUserDetails) => {
    setSelectedUser(user);
  };

  return (
    <section className="messages">
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <div>
        {/* {dialogs.map((dialog) => (
          <div key={Date.now()}>{dialog.lastMessage.content}</div>
        ))} */}
      </div>
      <div>
        {searchResults.map((user) => (
          <div key={user.email} onClick={() => handleUserClick(user)}>
            {user.name}
          </div>
        ))}
      </div>
      {selectedUser && (
        <DialogWindow
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </section>
  );
};

export default MessagesPage;
