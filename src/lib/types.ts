export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User'; // Admin = Landlord, User = Tenant
};

export type Vendor = {
  id: string;
  name: string;
  contactEmail: string;
  specialty: string;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  ownerId: string; // Landlord's user ID
};

export type ContractStatus = 'Sent' | 'Signed' | 'In Progress' | 'Renewed' | 'Finished';

export type Contract = {
    id: string;
    propertyId: string;
    landlordId: string;
    tenantId: string;
    startDate: Date;
    endDate: Date;
    status: ContractStatus;
    rentAmount: number;
};

export type PaymentStatus = 'Upcoming' | 'Paid' | 'Overdue';

export type Payment = {
  id: string;
  contractId: string;
  propertyId: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paidDate?: Date;
};

export type MaintenanceRequestStatus = 'Submitted' | 'In Progress' | 'Completed';

export type MaintenanceActivity = {
    id:string;
    timestamp: Date;
    description: string;
    authorId: string;
};

export type MaintenanceRequest = {
  id: string;
  propertyId: string;
  description: string;
  status: MaintenanceRequestStatus;
  submittedDate: Date;
  initiatedBy: 'Tenant' | 'Landlord';
  assignedVendorId?: string;
  activityLog: MaintenanceActivity[];
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

export type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
};
