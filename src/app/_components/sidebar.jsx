import Link from 'next/link';

const Sidebar = () => {
  return (
    <div>
      <h2>Chat Rooms</h2>
      <ul>
        <li>
          <Link href="/chat">
            <a>General</a>
          </Link>
        </li>
        <li>
          <Link href="/chat/room-1">
            <a>Room 1</a>
          </Link>
        </li>
        <li>
          <Link href="/chat/room-2">
            <a>Room 2</a>
          </Link>
        </li>
        {/* Add more chat room links here */}
      </ul>
    </div>
  );
};

export default Sidebar;