import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ChatComponent from "./pages/ChatComponent";
import "./App.css"; // Import the CSS file for styling

const Home = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (username && room) {
      navigate(`/chat?username=${username}&room=${room}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="home-container">
      <h2 className="title">Join a Chat Room</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="join-button" onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
