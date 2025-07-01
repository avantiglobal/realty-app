import { User, Property, Payment, MaintenanceRequest, Communication } from './types';

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

export const properties: Property[] = [
  {
    id: 'prop1',
    name: 'Modern Downtown Loft',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '2',
    rent: 2500,
    status: 'Occupied',
  },
  {
    id: 'prop2',
    name: 'Suburban Family Home',
    address: '456 Oak Ave, Suburbia, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '2',
    rent: 3200,
    status: 'Occupied',
  },
  {
    id: 'prop3',
    name: 'Cozy Studio Apartment',
    address: '789 Pine Ln, Metroville, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '1',
    rent: 1800,
    status: 'Vacant',
  },
   {
    id: 'prop4',
    name: 'Lakeside Cottage',
    address: '101 Lake Rd, Clearwater, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    ownerId: '2',
    rent: 2100,
    status: 'Occupied',
  },
];

export const payments: Payment[] = [
  {
    id: 'pay1',
    propertyId: 'prop1',
    amount: 2500,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'Upcoming',
  },
  {
    id: 'pay2',
    propertyId: 'prop2',
    amount: 3200,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    status: 'Paid',
  },
  {
    id: 'pay3',
    propertyId: 'prop4',
    amount: 2100,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: 'Overdue',
  },
  {
    id: 'pay4',
    propertyId: 'prop1',
    amount: 2500,
    dueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    status: 'Paid',
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'req1',
    propertyId: 'prop1',
    description: 'Leaky faucet in the kitchen sink.',
    status: 'In Progress',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: 'req2',
    propertyId: 'prop2',
    description: 'HVAC unit not cooling properly.',
    status: 'Submitted',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'req3',
    propertyId: 'prop1',
    description: 'Front door lock is sticking.',
    status: 'Completed',
    submittedDate: new Date(new Date().setDate(new Date().getDate() - 14)),
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
