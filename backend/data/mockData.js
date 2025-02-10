const mockData = {
    patients: [
      {
        id: "P1",
        name: "John Doe",
        age: 45,
        conditions: ["Hypertension", "Diabetes"],
        prescriptions: ["PRE001", "PRE002"]
      },
      {
        id: "P2",
        name: "Jane Smith",
        age: 32,
        conditions: ["Asthma"],
        prescriptions: ["PRE003"]
      }
    ],
    doctors: [
      {
        id: "D1",
        name: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        patients: ["P1", "P2"],
        licenseNumber: "MED123456"
      }
    ],
    medications: [
      {
        id: "M1",
        name: "Lisinopril",
        stock: 100,
        minThreshold: 20,
        type: "Prescription"
      }
    ]
  };
  
  module.exports = mockData;