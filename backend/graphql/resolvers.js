const User = require('../models/User');
const mockData = require('../data/mockData');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory prescriptions store for demonstration purposes.
mockData.prescriptions = mockData.prescriptions || [];
let prescriptionCounter = 1;

const resolvers = {
  Query: {
    getDoctorStats: async (_, __, { user }) => {
      if (!user || user.role !== 'DOCTOR') {
        throw new Error('Not authorized');
      }
      // Find the doctor from the mock data using user id.
      const doctor = mockData.doctors.find((d) => d.id === user.id);
      if (!doctor) throw new Error('Doctor not found in mock data');
      
      return {
        totalPatients: doctor.patients.length,
        todayAppointments: 5, // Simulated value
        pendingPrescriptions: 3, // Simulated value
        completedAppointments: 12 // Simulated value
      };
    },
    
    getPharmacyStats: async (_, __, { user }) => {
      if (!user || user.role !== 'PHARMACIST') {
        throw new Error('Not authorized');
      }
      
      return {
        pendingPrescriptions: 8,   // Simulated value
        completedPrescriptions: 25, // Simulated value
        lowStockItems: 3,           // Simulated value
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

    register: async (_, { email, password, role }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role, // Save the role provided by the user
        createdAt: new Date().toISOString()
      });
    
      await newUser.save();
    
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    
      return { token, user: newUser };
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
    },

    createPrescription: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      // Build the prescription object
      const newPrescription = {
        id: prescriptionCounter++,
        patientName: input.patientName,
        doctor: user,
        medications: input.medications.map(med => {
          const medicationObj = mockData.medications.find(m => m.id === med.medicationId);
          if (!medicationObj) {
            throw new Error(`Medication with id ${med.medicationId} not found`);
          }
          return {
            medication: medicationObj,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration
          };
        }),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      mockData.prescriptions.push(newPrescription);
      return newPrescription;
    },

    updateInventory: async (_, { id, quantity }, { user }) => {
      if (!user || user.role !== 'PHARMACIST') throw new Error("Not authorized");
      
      const medication = mockData.medications.find(med => med.id === id);
      if (!medication) throw new Error("Medication not found");
      
      // Update stock value (for demonstration we directly set it to quantity)
      medication.stock = quantity;
      
      return {
        success: true,
        message: "Inventory updated successfully"
      };
    },

    completePrescription: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      
      const prescription = mockData.prescriptions.find(p => p.id === id);
      if (!prescription) throw new Error("Prescription not found");
      
      prescription.status = 'COMPLETED';
      return {
        success: true,
        message: "Prescription completed successfully"
      };
    }
  }
};

module.exports = resolvers;