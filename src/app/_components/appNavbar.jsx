import { useState } from 'react';
import Sidebar from './sidebar';

const AppNavbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
      setShowSidebar(!showSidebar);
    };
  
    return (
      <div>
        <button onClick={toggleSidebar}>Toggle Sidebar</button>
        {showSidebar && <Sidebar />}
      </div>
    );
}

export default AppNavbar