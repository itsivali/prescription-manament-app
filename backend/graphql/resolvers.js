const User = require('../models/User');
const mockData = require('../data/mockData');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const resolvers = {
  Query: {
    getDoctorStats: async (_, __, { user }) => {
      if (!user || user.role !== 'DOCTOR') {
        throw new Error('Not authorized');
      }
      
      const doctor = mockData.doctors.find(d => d.id === user.id);
      return {
        totalPatients: doctor.patients.length,
        todayAppointments: 5,
        pendingPrescriptions: 3,
        completedAppointments: 12
      };
    },
    
    getPharmacyStats: async (_, __, { user }) => {
      if (!user || user.role !== 'PHARMACIST') {
        throw new Error('Not authorized');
      }
      
      return {
        pendingPrescriptions: 8,
        completedPrescriptions: 25,
        lowStockItems: 3,
        totalInventoryItems: mockData.medications.length
      };
    }
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user };
    },

    updateUserRole: async (_, { role }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      await User.findByIdAndUpdate(
        user.id,
        { role },
        { new: true }
      );

      return {
        success: true,
        message: 'Role updated successfully'
      };
    }
  }
};

module.exports = resolvers;