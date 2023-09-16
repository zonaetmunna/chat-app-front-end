import { useState } from 'react';

const MessageInput = () => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Implement sending the message to the chat room
      console.log('Sending message:', message);
      setMessage('');
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={handleChange} />
          <button type="submit">Send</button>
        </form>
      </div>
    );
}

export default MessageInput