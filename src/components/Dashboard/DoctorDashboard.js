import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaPrescription, 
  FaChartLine,
  FaSignOutAlt,
  FaBell,
  FaSearch
} from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DoctorDashboard.css';

const GET_DOCTOR_STATS = gql`
  query GetDoctorStats {
    doctorStats {
      totalPatients
      todayAppointments
      pendingPrescriptions
      completedAppointments
    }
  }
`;

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { error, data } = useQuery(GET_DOCTOR_STATS);
  const [date, setDate] = useState(new Date());
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (data) {
        setLoading(false);
    }
}, [data]);

if (loading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div>Error loading data</div>;
}

  const stats = data?.doctorStats || {
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
    completedAppointments: 0
  };

  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <FaUserMd className="doctor-icon" />
          <h2>Dr. Smith</h2>
          <p>Cardiologist</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine />
            <span>Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FaPrescription />
            <span>Prescriptions</span>
          </button>
        </nav>

        <button className="logout-button">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Search patients..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="profile-menu">
              <img src="https://via.placeholder.com/40" alt="Doctor profile" className="profile-pic" />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Patients</h3>
            <p className="stat-value">{stats.totalPatients}</p>
            <span className="stat-label">Active patients</span>
          </div>
          
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p className="stat-value">{stats.todayAppointments}</p>
            <span className="stat-label">Scheduled today</span>
          </div>
          
          <div className="stat-card">
            <h3>Pending Prescriptions</h3>
            <p className="stat-value">{stats.pendingPrescriptions}</p>
            <span className="stat-label">Need review</span>
          </div>
          
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completedAppointments}</p>
            <span className="stat-label">This week</span>
          </div>
        </div>

        {/* Calendar and Appointments */}
        <div className="dashboard-grid">
          <div className="calendar-section">
            <h3>Calendar</h3>
            <Calendar 
              onChange={setDate} 
              value={date}
              className="dashboard-calendar"
            />
          </div>

          <div className="appointments-section">
            <h3>Upcoming Appointments</h3>
            <div className="appointment-list">
              {/* Sample appointments */}
              <div className="appointment-card">
                <div className="appointment-time">09:00 AM</div>
                <div className="appointment-info">
                  <h4>John Doe</h4>
                  <p>Follow-up consultation</p>
                </div>
                <button className="appointment-action">View</button>
              </div>
              
              <div className="appointment-card">
                <div className="appointment-time">10:30 AM</div>
                <div className="appointment-info">
                  <h4>Jane Smith</h4>
                  <p>New patient consultation</p>
                </div>
                <button className="appointment-action">View</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;