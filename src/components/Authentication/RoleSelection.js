import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { FaUserMd, FaPrescriptionBottle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './RoleSelection.css';

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($role: String!) {
    updateUserRole(role: $role) {
      success
      message
    }
  }
`;

function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [updateRole] = useMutation(UPDATE_USER_ROLE);

  const handleRoleSelection = async (role) => {
    try {
      const { data } = await updateRole({ variables: { role } });
      if (data.updateUserRole.success) {
        toast.success('Role updated successfully!');
        navigate(`/${role.toLowerCase()}-dashboard`);
      }
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h2 className="role-selection-title">Select Your Role</h2>
        <p className="role-selection-subtitle">Choose your role to continue</p>
        
        <div className="role-options">
          <button 
            className={`role-option ${selectedRole === 'DOCTOR' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedRole('DOCTOR');
              handleRoleSelection('DOCTOR');
            }}
          >
            <FaUserMd className="role-icon" />
            <span className="role-label">Doctor</span>
            <p className="role-description">Prescribe medications and manage patient records</p>
          </button>
            onClick={() => {
              setSelectedRole('PHARMACIST');
              handleRoleSelection('PHARMACIST');
            }}
          <button 
            className={`role-option ${selectedRole === 'PHARMACIST' ? 'selected' : ''}`}
            onClick={() => handleRoleSelection('PHARMACIST')}
          >
            <FaPrescriptionBottle className="role-icon" />
            <span className="role-label">Pharmacist</span>
            <p className="role-description">Manage inventory and fulfill prescriptions</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;