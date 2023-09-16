
const ChatRoom = () => {
  // Implement display of chat messages
  const chatMessages = [
    { id: 1, user: 'Alice', message: 'Hello, everyone!' },
    { id: 2, user: 'Bob', message: 'Hey Alice, how are you?' },
    // Add more chat messages here
  ];

  return (
    <div>
      {chatMessages.map((msg) => (
        <ChatMessage key={msg.id} user={msg.user} message={msg.message} />
      ))}
    </div>
  );
}

export default ChatRoom