const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # User type for authentication and profile data
  type User {
    id: ID!
    email: String!
    role: String!
    name: String
    specialization: String
    licenseNumber: String
    createdAt: String
  }

  # Response type for login mutation
  type AuthResponse {
    token: String!
    user: User!
  }

  # Response type for generic updates
  type UpdateResponse {
    success: Boolean!
    message: String!
  }

  # Doctor statistics type
  type DoctorStats {
    totalPatients: Int!
    todayAppointments: Int!
    pendingPrescriptions: Int!
    completedAppointments: Int!
  }

  # Pharmacy statistics type
  type PharmacyStats {
    pendingPrescriptions: Int!
    completedPrescriptions: Int!
    lowStockItems: Int!
    totalInventoryItems: Int!
  }

  # Medication type used by prescriptions and inventory
  type Medication {
    id: ID!
    name: String!
    stock: Int!
    minThreshold: Int!
    type: String!
  }

  # Prescription Medication type (detailed prescription item)
  type PrescriptionMedication {
    medication: Medication!
    dosage: String!
    frequency: String!
    duration: String!
  }

  # Prescription type linking patient, doctor, and medications
  type Prescription {
    id: ID!
    patientName: String!
    doctor: User!
    medications: [PrescriptionMedication!]!
    status: String!
    createdAt: String!
  }

  # Input types for prescription mutations
  input PrescriptionMedicationInput {
    medicationId: ID!
    dosage: String!
    frequency: String!
    duration: String!
  }

  input PrescriptionInput {
    patientName: String!
    doctorId: ID!
    medications: [PrescriptionMedicationInput!]!
  }

  # Queries for dashboards and data
  type Query {
    getDoctorStats: DoctorStats!
    getPharmacyStats: PharmacyStats!
    # Additional queries can be defined here as needed
  }

  # Mutations for authentication, role management, and prescription/inventory actions
  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    updateUserRole(role: String!): UpdateResponse!
    createPrescription(input: PrescriptionInput!): Prescription!
    updateInventory(id: ID!, quantity: Int!): UpdateResponse!
    completePrescription(id: ID!): UpdateResponse!
  }
`;

module.exports = typeDefs;