import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:8000";

const ChatComponent = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username');
  const room = searchParams.get('room');
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {

    const newSocket = io(SOCKET_SERVER_URL, {
      query: { username, room },
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.emit('joinRoom', { username, room });

    newSocket.on('join-room-message', (message) => {
      alert(message);
    });

    newSocket.on('message', (message) => {
      console.log("message",message);
      
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room, username]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    socket.emit('event:message', { room, message: newMessage});

    setNewMessage('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Chat Room: {room}</h1>
      <div className="chat-window" style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>{msg.message}</div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.inputField}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '1000px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  chatWindow: {
    width: '100%',
    height: '300px',
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '20px',
    overflowY: 'scroll',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  message: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    wordBreak: 'break-word',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
  },
  inputField: {
    flexGrow: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '16px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  sendButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default ChatComponent;
