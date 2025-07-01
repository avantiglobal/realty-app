export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User';
};

export type Property = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  ownerId: string;
  rent: number;
  status: 'Occupied' | 'Vacant';
};

export type Payment = {
  id: string;
  propertyId: string;
  amount: number;
  dueDate: Date;
  status: 'Paid' | 'Upcoming' | 'Overdue';
};

export type MaintenanceRequest = {
  id: string;
  propertyId: string;
  description: string;
  status: 'Submitted' | 'In Progress' | 'Completed';
  submittedDate: Date;
};

export type Communication = {
  id: string;
  propertyId: string;
  users: string[]; // user ids
  messages: {
    id: string;
    userId: string;
    text: string;
    timestamp: Date;
  }[];
};
