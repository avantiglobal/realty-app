import { User, Property, Payment, MaintenanceRequest, Communication, Notification, Contract, Vendor, MaintenanceActivity } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@proptrack.com',
    avatar: '/avatars/01.png',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'End User',
    email: 'user@proptrack.com',
    avatar: '/avatars/02.png',
    role: 'User',
  },
];

export const vendors: Vendor[] = [
    {
        id: 'vendor1',
        name: 'Plumb Perfect',
        contactEmail: 'contact@plumbperfect.com',
        specialty: 'Plumbing',
    },
    {
        id: 'vendor2',
        name: 'HVAC Masters',
        contactEmail: 'service@hvacmasters.com',
        specialty: 'HVAC',
    }
];

export const properties: Property[] = [
  {
    id: 'prop1',
    name: 'Modern Downtown Loft',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '1',
  },
  {
    id: 'prop2',
    name: 'Suburban Family Home',
    address: '456 Oak Ave, Suburbia, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '1',
  },
  {
    id: 'prop3',
    name: 'Cozy Studio Apartment',
    address: '789 Pine Ln, Metroville, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '1',
  },
   {
    id: 'prop4',
    name: 'Lakeside Cottage',
    address: '101 Lake Rd, Clearwater, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '1',
  },
];

export const contracts: Contract[] = [
    {
        id: 'contract1',
        propertyId: 'prop1',
        landlordId: '1',
        tenantId: '2',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'In Progress',
        rentAmount: 2500,
    },
    {
        id: 'contract2',
        propertyId: 'prop2',
        landlordId: '1',
        tenantId: '2',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: 'In Progress',
        rentAmount: 3200,
    },
    {
        id: 'contract3',
        propertyId: 'prop4',
        landlordId: '1',
        tenantId: '2',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'In Progress',
        rentAmount: 2100,
    }
];

export const payments: Payment[] = [
  {
    id: 'pay1',
    contractId: 'contract1',
    propertyId: 'prop1',
    amount: 2500,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    status: 'Upcoming',
  },
  {
    id: 'pay2',
    contractId: 'contract1',
    propertyId: 'prop1',
    amount: 2500,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    status: 'Paid',
    paidDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  },
  {
    id: 'pay3',
    contractId: 'contract2',
    propertyId: 'prop2',
    amount: 3200,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() -1, 1),
    status: 'Paid',
    paidDate: new Date(new Date().getFullYear(), new Date().getMonth() -1, 1)
  },
  {
    id: 'pay4',
    contractId: 'contract3',
    propertyId: 'prop4',
    amount: 2100,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    status: 'Overdue',
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'req1',
    propertyId: 'prop1',
    description: 'Leaky faucet in the kitchen sink.',
    status: 'In Progress',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    initiatedBy: 'Tenant',
    assignedVendorId: 'vendor1',
    activityLog: [
        { id: 'act1', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), description: 'Request submitted by tenant.', authorId: '2'},
        { id: 'act2', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Vendor "Plumb Perfect" assigned.', authorId: '1'},
    ]
  },
  {
    id: 'req2',
    propertyId: 'prop2',
    description: 'HVAC unit not cooling properly.',
    status: 'Submitted',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    initiatedBy: 'Tenant',
    activityLog: [
        { id: 'act3', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'Request submitted by tenant.', authorId: '2'}
    ]
  },
  {
    id: 'req3',
    propertyId: 'prop1',
    description: 'Front door lock is sticking.',
    status: 'Completed',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    initiatedBy: 'Tenant',
    activityLog: [
        { id: 'act4', timestamp: new Date(new Date().setDate(new Date().getDate() - 14)), description: 'Request submitted by tenant.', authorId: '2'},
        { id: 'act5', timestamp: new Date(new Date().setDate(new Date().getDate() - 13)), description: 'Marked as completed by landlord.', authorId: '1'},
    ]
  },
];

export const communications: Communication[] = [
    {
        id: 'comm1',
        propertyId: 'prop1',
        users: ['1', '2'],
        messages: [
            { id: 'msg1', userId: '1', text: 'Hi there! Just wanted to check in on the rent payment.', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
            { id: 'msg2', userId: '2', text: 'Hey! Yes, I\'ll be sending it over tomorrow.', timestamp: new Date(new Date().setDate(new Date().getDate() - 1))},
        ]
    },
    {
        id: 'comm2',
        propertyId: 'prop2',
        users: ['1', '2'],
        messages: [
            { id: 'msg3', userId: '1', text: 'The maintenance request for the HVAC has been received.', timestamp: new Date(new Date().setDate(new Date().getDate() - 2))},
        ]
    }
];

export const notifications: Notification[] = [
  {
    id: 'notif1',
    title: 'New Maintenance Request',
    description: 'Leaky faucet in the kitchen sink.',
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'notif2',
    title: 'Payment Overdue',
    description: 'Rent for Lakeside Cottage is overdue.',
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 'notif3',
    title: 'New Message',
    description: 'From Admin User regarding your property.',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: 'notif4',
    title: 'Maintenance Completed',
    description: 'Front door lock has been fixed.',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: 'notif5',
    title: 'Upcoming Payment',
    description: 'Rent for Modern Downtown Loft is due soon.',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
  },
    {
    id: 'notif6',
    title: 'Welcome!',
    description: 'Welcome to Avanti Realty!',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
];
