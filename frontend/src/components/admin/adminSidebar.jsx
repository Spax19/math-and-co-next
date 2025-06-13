'use client';
import { useState } from 'react';
import { FaWineBottle, FaHome, FaCalendarAlt, FaBoxes, FaUserCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiWineBottle } from 'react-icons/gi';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h3>Admin Panel</h3>}
        <button 
          className="collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => setActiveTab('home')}
          title="Dashboard"
        >
          <FaHome className="sidebar-icon" />
          {!collapsed && <span>Dashboard</span>}
        </li>
        <li 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
          title="Profile"
        >
          <FaUserCog className="sidebar-icon" />
          {!collapsed && <span>Profile</span>}
        </li>
        <li 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
          title="Events"
        >
          <FaCalendarAlt className="sidebar-icon" />
          {!collapsed && <span>Events</span>}
        </li>
        <li 
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
          title="Inventory"
        >
          <FaBoxes className="sidebar-icon" />
          {!collapsed && <span>Inventory</span>}
        </li>
      </ul>
      <div className="sidebar-footer">
        <div className="wine-animation">
          <GiWineBottle className="bottle-animation" />
          {!collapsed && <FaWineBottle className="bottle-animation" style={{ marginLeft: '10px' }} />}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;