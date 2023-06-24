import "./messagesPage.scss";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { IUserDetails } from "../../types";
import DialogWindow from "../../components/DialogWindow/DialogWindow";

const MessagesPage = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<Array<IUserDetails>>([]);
  const [selectedUser, setSelectedUser] = useState<IUserDetails | null>(null);

  const searchUser = useFetch("get", `/users?name=${searchName}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName) handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName]);

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
