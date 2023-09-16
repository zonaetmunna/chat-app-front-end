import React from 'react';

const Chats = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <ChatRoom />
      <MessageInput />
    </div>
  );
}

export default Chats