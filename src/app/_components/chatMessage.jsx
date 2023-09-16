
const chatMessage = ({ user, message }) => {
    return (
        <div>
          <strong>{user}:</strong> {message}
        </div>
      );
}

export default chatMessage