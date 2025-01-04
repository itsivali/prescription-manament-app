// src/components/Dashboard/PharmacistDashboard.js
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { 
  FaClinicMedical, 
  FaPrescriptionBottleAlt, 
  FaBoxes, 
  FaChartLine,
  FaSignOutAlt, 
  FaBell, 
  FaSearch,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// GraphQL Queries and Mutations
const GET_PHARMACY_STATS = gql`
  query GetPharmacyStats {
    pharmacyStats {
      pendingPrescriptions
      completedPrescriptions
      lowStockItems
      totalInventoryItems
      recentPrescriptions {
        id
        patientName
        medication
        status
        date
      }
      inventoryAlerts {
        id
        medicationName
        currentStock
        minThreshold
      }
    }
  }
`;

const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($id: ID!, $quantity: Int!) {
    updateInventory(id: $id, quantity: $quantity) {
      success
      message
    }
  }
`;

const COMPLETE_PRESCRIPTION = gql`
  mutation CompletePrescription($id: ID!) {
    completePrescription(id: $id) {
      success
      message
    }
  }
`;

function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_PHARMACY_STATS, {
    pollInterval: 30000, // Refresh every 30 seconds
  });
const [updateInventory] = useMutation(UPDATE_INVENTORY, {
  onCompleted: (data) => {
    if (data.updateInventory.success) {
      toast.success('Inventory updated successfully');
      refetch();
    } else {
      toast.error(data.updateInventory.message || 'Failed to update inventory');
    }
  },
  onError: () => {
    toast.error('Failed to update inventory');
  },
});
  const [completePrescription] = useMutation(COMPLETE_PRESCRIPTION);

  useEffect(() => {
    if (error) toast.error('Error loading dashboard data');
  }, [error]);


  const handlePrescriptionComplete = async (prescriptionId) => {
    try {
      const response = await completePrescription({ variables: { id: prescriptionId } });
      if (response.data.completePrescription.success) {
        toast.success('Prescription marked as complete');
        refetch();
      } else {
        toast.error(response.data.completePrescription.message || 'Failed to complete prescription');
      }
    } catch (error) {
      toast.error('Failed to complete prescription');
    }
  };

  const handleUpdateInventory = async (id, quantity) => {
    try {
      await updateInventory({ variables: { id, quantity } });
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = data?.pharmacyStats || {};
  const filteredInventory =
    stats.inventoryAlerts?.filter((alert) =>
      alert.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

const filteredPrescriptions = stats.recentPrescriptions?.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <FaClinicMedical className="text-4xl text-blue-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-center">Pharmacy Portal</h2>
        </div>
        <nav className="mt-6">
          {['overview', 'prescriptions', 'inventory'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center w-full px-6 py-3 text-left ${
                activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' && <FaChartLine className="w-5 h-5 mr-3" />}
              {tab === 'prescriptions' && <FaPrescriptionBottleAlt className="w-5 h-5 mr-3" />}
              {tab === 'inventory' && <FaBoxes className="w-5 h-5 mr-3" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-0 w-64 p-6 flex items-center text-red-600 hover:text-red-800"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="relative p-2">
            <FaBell className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        {/* Main Dashboard Content */}
        {activeTab === 'overview' && <div>{/* Overview Stats */}</div>}
        {activeTab === 'prescriptions' && (
          <div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Patient Name</th>
                  <th className="py-2">Medication</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
        {activeTab === 'inventory' && (
          <div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Medication Name</th>
                  <th className="py-2">Current Stock</th>
                  <th className="py-2">Min Threshold</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((alert) => (
                  <tr key={alert.id}>
                    <td className="py-2">{alert.medicationName}</td>
                    <td className="py-2">{alert.currentStock}</td>
                    <td className="py-2">{alert.minThreshold}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleUpdateInventory(alert.id, alert.currentStock + 10)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td className="py-2">{prescription.patientName}</td>
                    <td className="py-2">{prescription.medication}</td>
                    <td className="py-2">{prescription.status}</td>
                    <td className="py-2">{prescription.date}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handlePrescriptionComplete(prescription.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'inventory' && <div>{/* Inventory Table */}</div>}
      </main>
    </div>
  );
}

export default PharmacistDashboard;
