export interface Service {
  id: string;
  name: string;
  office: string;
  requirements: string[];
  queueAhead: number;
  averageServiceMinutes: number;
  closingTime: string;
  travelMinutes: number;
}

export const services: Service[] = [
  {
    id: "migration",
    name: "Migration Certificate",
    office: "Academic Administration",
    requirements: [
      "Student ID",
      "Application Form",
      "Fee Receipt",
      "Passport Photograph",
    ],
    queueAhead: 7,
    averageServiceMinutes: 10,
    closingTime: "17:00",
    travelMinutes: 14,
  },
  {
    id: "bonafide",
    name: "Bonafide Certificate",
    office: "Student Service Centre",
    requirements: ["Student ID", "Application Form"],
    queueAhead: 4,
    averageServiceMinutes: 7,
    closingTime: "17:30",
    travelMinutes: 8,
  },
  {
    id: "fee",
    name: "Fee Payment",
    office: "Finance Office",
    requirements: ["Student ID", "Fee Amount"],
    queueAhead: 18,
    averageServiceMinutes: 5,
    closingTime: "16:30",
    travelMinutes: 10,
  },
  {
    id: "id-card",
    name: "Student ID Replacement",
    office: "Student Service Centre",
    requirements: ["Student ID", "Application Form"],
    queueAhead: 6,
    averageServiceMinutes: 8,
    closingTime: "17:30",
    travelMinutes: 8,
  },
];

export const demoUser = {
  name: "Demo Student",
  documents: [
    "Student ID",
    "Application Form",
    "Fee Receipt",
    "Passport Photograph",
  ],
};