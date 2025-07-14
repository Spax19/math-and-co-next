'use client';
import { useState, useEffect } from "react";
import ProtectedRoute from '../../../components/protectedRoutes';
import { FaWineBottle, FaHome, FaCalendarAlt, FaBoxes, FaUserCog, FaExclamationTriangle, FaEdit, FaTrash, FaSalesforce, FaUser } from 'react-icons/fa';
import { GiWineBottle } from 'react-icons/gi';
import LoadingSpinner from "../../../components/loadingSpinner";
import "../../globals.css";
import AdminSidebar from '../../../components/admin/adminSidebar';


export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content p-6">
          <Dashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}

// const AdminSidebar = () => {
//   const [activeTab, setActiveTab] = useState('home');

//   return (
//     <div className="admin-sidebar">
//       <div className="sidebar-header">
//         <h3>Admin Panel</h3>
//       </div>
//       <ul className="sidebar-menu">
//         <li
//           className={activeTab === 'home' ? 'active' : ''}
//           onClick={() => setActiveTab('home')}
//         >
//           <FaHome className="sidebar-icon" />
//           <span>Dashboard</span>
//         </li>
//         <li
//           className={activeTab === 'profile' ? 'active' : ''}
//           onClick={() => setActiveTab('profile')}
//         >
//           <FaUserCog className="sidebar-icon" />
//           <span>Profile</span>
//         </li>
//         <li
//           className={activeTab === 'events' ? 'active' : ''}
//           onClick={() => setActiveTab('events')}
//         >
//           <FaCalendarAlt className="sidebar-icon" />
//           <span>Events</span>
//         </li>
//         <li
//           className={activeTab === 'inventory' ? 'active' : ''}
//           onClick={() => setActiveTab('inventory')}
//         >
//           <FaBoxes className="sidebar-icon" />
//           <span>Inventory</span>
//         </li>
//       </ul>
//       <div className="sidebar-footer">
//         <div className="wine-animation">
//           <GiWineBottle className="bottle-animation" />
//         </div>
//       </div>
//     </div>
//   );
// };

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [disModal, setDisModal] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    time: '',
    location: '',
    phoneNo: '',
    email: '',
    date: '',
    description: '',
    active: true,
    image: null
  });
  const [disData, setDisData] = useState({
    name: '',
    contacts: '',
    address: '',
    email: '',
    image: null
  });
  const [visitCount, setVisitCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [events, setEvents] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [dis, setDis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null); // Store selected distributor for deletion

  const wineCategories = [
    { name: 'Red', value: 40 },
    { name: 'White', value: 35 },
    { name: 'MCC', value: 25 },
    { name: 'Pentagon', value: 25 },
    { name: 'Hydrology', value: 25 },

  ];

  const COLORS = ['#8B0000', '#FFD700', '#A0522D', '#000', '#aaa']; // Red, Gold, Brown

  useEffect(() => {
    //Fetch all available distributors
    //const fetchDistributors = async () => {
     // try {
    //     const response = await fetch('http://localhost:5174/get_distributors');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setDistributors(data);
    //     } else {
    //       toast.error('Error fetching distributors');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching distributors:', error);
    //   }
    // };

    // fetchDistributors();

    // Fetch the visit count when the component mounts
    // const getVisitCount = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5174/get-visits');
    //     setVisitCount(response.data.count);
    //   } catch (error) {
    //     console.error('Error fetching visit count:', error);
    //   }
    // };

    // getVisitCount();


    // const fetchUsers = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5174/get_users');
    //     setUsers(response.data);  // Store the users in state
    //     setLoading(false);         // Set loading to false after data is fetched
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //     setLoading(false);         // Set loading to false if an error occurs
    //   }
    // };

    // fetchUsers();

    // const fetchTotalUsers = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5174/get_total_users');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setTotalUsers(data.totalUsers);
    //     } else {
    //       console.error('Error fetching total users');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching total users:', error);
    //   }
    // };

    // fetchTotalUsers()

    // Fetch events from the backend
    // const fetchEvents = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5174/get_events');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setEvents(data);
    //     } else {
    //       console.error('Error fetching events');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching events:', error);
    //   }
    // };

    // fetchEvents();

  }, []);

  const handleDelete = async () => {
    if (!selectedDistributor) return;

    try {
      const response = await fetch(`http://localhost:5174/delete_distributor/${selectedDistributor.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDistributors(distributors.filter(d => d.id !== selectedDistributor.id));
        toast.success("Distributor deleted successfully");
        setIsModalOpen(false); // Close modal after deletion
      } else {
        toast.error('Error deleting distributor');
      }
    } catch (error) {
      console.error('Error deleting distributor:', error);
    }
  };

  const handleInputChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });

  };

  const handleDisInputChange = (e) => {

    setDisData({
      ...disData,
      [e.target.name]: e.target.value
    })
  };


  const handleDisImageChange = (e) => {

    setDisData({ ...disData, image: e.target.files[0] });
  };

  const handleImageChange = (e) => {
    setEventData({ ...eventData, image: e.target.files[0] });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const requiredFields = [
      'name', 'time', 'location', 'phoneNo', 'email', 'date', 'description', 'image'
    ];

    for (let field of requiredFields) {
      if (!eventData[field]) {
        toast.error(`${field} is required`);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', eventData.name);
    formData.append('time', eventData.time);
    formData.append('location', eventData.location);
    formData.append('phoneNo', eventData.phoneNo);
    formData.append('email', eventData.email);
    formData.append('date', eventData.date);
    formData.append('description', eventData.description);
    formData.append('active', eventData.active ? 'true' : 'false');
    formData.append('image', eventData.image);

    try {
      const response = await axios.post('http://localhost:5174/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log("Event saved:", response.data);
      toast.success("Event Added.")
      setShowModal(false);
      setEventData({
        name: '', date: '', description: '', time: '', location: '', email: '', phoneNo: '', active: true, image: null
      });
    } catch (error) {
      console.error("Error saving event:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmitDis = async (e) => {

    e.preventDefault();
    console.log(disData);
    // Check if all required fields are filled
    const requiredFields = [
      'name', 'contacts', 'address', 'email', 'image',
    ];

    for (let field of requiredFields) {
      if (!disData[field]) {
        toast.error(`${field} is required`);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', disData.name);
    formData.append('contacts', disData.contacts);
    formData.append('address', disData.address);
    formData.append('email', disData.email);
    formData.append('image', disData.image);

    try {
      const response = await axios.post('http://localhost:5174/distributors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log("Distributor added:", response.data);
      toast.success("Distributor Added.")
      setDisModal(false);
      setDisData({
        name: '', contacts: '', email: '', address: '', image: null
      });
    } catch (error) {
      console.error("Error saving distributor:", error.response ? error.response.data : error.message);
    }
  };

  // if (loading) {
  //   return <LoadingSpinner/>;
  // }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Dummy sales data
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];


  // Enhanced wine inventory data with stock levels
  const [wineInventory, setWineInventory] = useState([
    { id: 1, name: 'Cabernet Sauvignon', type: 'Red', stock: 42, threshold: 20, price: 25.99 },
    { id: 2, name: 'Chardonnay', type: 'White', stock: 35, threshold: 15, price: 19.99 },
    { id: 3, name: 'Pinot Noir', type: 'Red', stock: 18, threshold: 20, price: 29.99 },
    { id: 4, name: 'Sauvignon Blanc', type: 'White', stock: 27, threshold: 15, price: 22.50 },
    { id: 5, name: 'Merlot', type: 'Red', stock: 15, threshold: 20, price: 18.99 },
    { id: 6, name: 'Brut Reserve', type: 'MCC', stock: 30, threshold: 10, price: 35.00 },
  ]);

  // Calculate total inventory value
  const totalInventoryValue = wineInventory.reduce((total, wine) => {
    return total + (wine.stock * wine.price);
  }, 0);

  // Calculate low stock items
  const lowStockItems = wineInventory.filter(wine => wine.stock < wine.threshold);

  // Calculate total sales (you can replace with real data)
  const totalSales = 12450.75;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5174/delete_event/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId));
        toast.success("Event deleted successfully");
      } else {
        toast.error('Error deleting event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <>


      {/* Dashboard Overview Section */}
      <div className="dashboard-overview">
        <h2 className="dashboard-title">Dashboard Overview</h2>

        <div className="overview-cards">
          <div className="overview-card sales-card">
            <div className="card-icon">
              <FaSalesforce />
            </div>
            <div className="card-content">
              <h3>Total Sales</h3>
              <p>{formatCurrency(totalSales)}</p>
              <span className="trend-up">+12% from last month</span>
            </div>
          </div>

          <div className="overview-card inventory-card">
            <div className="card-icon">
              <FaBoxes />
            </div>
            <div className="card-content">
              <h3>Inventory Value</h3>
              <p>{formatCurrency(totalInventoryValue)}</p>
              <span>{wineInventory.length} products in stock</span>
            </div>
          </div>

          <div className="overview-card users-card">
            <div className="card-icon">
              <FaUser />
            </div>
            <div className="card-content">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
              <span>{visitCount} visits this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="dashboard-section">
        <h2 className="section-title">
          <FaWineBottle className="title-icon" />
          Wine Inventory
          {lowStockItems.length > 0 && (
            <span className="low-stock-alert">
              <FaExclamationTriangle /> {lowStockItems.length} items low in stock
            </span>
          )}
        </h2>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Wine Name</th>
                <th>Type</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wineInventory.map(wine => (
                <tr key={wine.id} className={wine.stock < wine.threshold ? 'low-stock' : ''}>
                  <td>{wine.name}</td>
                  <td>{wine.type}</td>
                  <td>{wine.stock} bottles</td>
                  <td>{formatCurrency(wine.price)}</td>
                  <td>
                    {wine.stock < wine.threshold ? (
                      <span className="stock-warning">
                        <FaExclamationTriangle /> Reorder
                      </span>
                    ) : (
                      <span className="stock-ok">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events Section */}
      <div className="dashboard-section">
        <h2 className="section-title">
          <FaCalendarAlt className="title-icon" />
          Upcoming Events
          <button onClick={() => setShowModal(true)} className="add-event-btn">
            + Add Event
          </button>
        </h2>

        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              {event.image && (
                <div className="event-image">
                  <img
                    src={`http://localhost:5174/uploads/${event.image}`}
                    alt={event.name}
                  />
                </div>
              )}
              <div className="event-details">
                <h3>{event.name}</h3>
                <p className="event-date">
                  <FaCalendarAlt /> {formatDate(event.date)} at {event.time}
                </p>
                <p className="event-location">{event.location}</p>
                <p className="event-description">
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </p>
                <div className="event-actions">
                  <button className="edit-btn" onClick={() => {/* Add edit functionality */ }}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  );
};

