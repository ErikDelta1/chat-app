import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "../styles/dashboard.css";

interface User {
  id: string;
  username: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        const filteredUsers = userList.filter((user) => user.id !== currentUserId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      <h1>Welcome to the Dashboard</h1>
      <p>This is your dashboard after successful login.</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="user-list">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-item">
            <p>{user.username}</p>
            <button onClick={() => navigate(`/chat/${user.id}`)}>Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;