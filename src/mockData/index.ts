import { KnowledgeSpace, ChatMessage, SearchResult, UserProfile } from '../types';

// Personal Knowledge Spaces - User's own content
export const personalKnowledgeSpaces: KnowledgeSpace[] = [
  {
    id: 'personal-1',
    name: 'My Clinical Notes',
    type: 'personal',
    isActive: true,
    documentCount: 47,
    description: 'Personal clinical observations and case notes',
    lastUpdated: new Date('2024-06-03T14:30:00'),
    accessLevel: 'private',
    category: 'Clinical'
  },
  {
    id: 'personal-2',
    name: 'Saved Research',
    type: 'personal',
    isActive: true,
    documentCount: 23,
    description: 'Research papers and articles for reference',
    lastUpdated: new Date('2024-06-02T09:15:00'),
    accessLevel: 'private',
    category: 'Research'
  },
  {
    id: 'personal-3',
    name: 'Personal Guidelines',
    type: 'personal',
    isActive: false,
    documentCount: 15,
    description: 'My preferred treatment approaches and protocols',
    lastUpdated: new Date('2024-05-28T16:45:00'),
    accessLevel: 'private',
    category: 'Guidelines'
  },
  {
    id: 'personal-4',
    name: 'Case Studies',
    type: 'personal',
    isActive: true,
    documentCount: 31,
    description: 'Interesting cases and learning experiences',
    lastUpdated: new Date('2024-06-01T11:20:00'),
    accessLevel: 'private',
    category: 'Education'
  }
];

// Organization Knowledge Spaces - Org-wide content
export const organizationKnowledgeSpaces: KnowledgeSpace[] = [
  {
    id: 'org-1',
    name: 'Emergency Medicine Protocols',
    type: 'organization',
    isActive: true,
    documentCount: 156,
    description: 'Hospital-wide emergency response procedures',
    lastUpdated: new Date('2024-06-04T08:00:00'),
    accessLevel: 'organization',
    category: 'Emergency'
  },
  {
    id: 'org-2',
    name: 'Pharmacy Guidelines',
    type: 'organization',
    isActive: true,
    documentCount: 289,
    description: 'Drug formulary and medication protocols',
    lastUpdated: new Date('2024-06-03T12:00:00'),
    accessLevel: 'organization',
    category: 'Pharmacy'
  },
  {
    id: 'org-3',
    name: 'Infection Control Standards',
    type: 'organization',
    isActive: false,
    documentCount: 78,
    description: 'Infection prevention and control policies',
    lastUpdated: new Date('2024-06-02T15:30:00'),
    accessLevel: 'organization',
    category: 'Safety'
  },
  {
    id: 'org-4',
    name: 'Quality & Safety Procedures',
    type: 'organization',
    isActive: true,
    documentCount: 92,
    description: 'Patient safety and quality improvement guidelines',
    lastUpdated: new Date('2024-06-01T10:00:00'),
    accessLevel: 'department',
    category: 'Quality'
  }
];

// Combined list for easy access
export const allKnowledgeSpaces: KnowledgeSpace[] = [
  ...personalKnowledgeSpaces,
  ...organizationKnowledgeSpaces
];

// Sample chat messages
export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    content: 'Welcome! I can help you search across your personal notes and organizational guidelines. What would you like to know?',
    sender: 'assistant',
    timestamp: new Date(),
    quickReplies: [
      { id: 'qr-1', text: 'Show my active spaces', action: 'show_active_personal' },
      { id: 'qr-2', text: 'Search org protocols', action: 'search_org_protocols' },
      { id: 'qr-3', text: 'Recent updates', action: 'show_recent_updates' }
    ]
  }
];

// Sample search results
export const mockSearchResults: SearchResult[] = [
  {
    id: 'result-1',
    title: 'Sepsis Management Protocol',
    snippet: 'Early recognition and management of sepsis including initial resuscitation...',
    spaceId: 'org-1',
    spaceName: 'Emergency Medicine Protocols',
    spaceType: 'organization',
    documentPath: '/protocols/sepsis-management.md',
    matchScore: 0.95,
    lastModified: new Date('2024-05-15'),
    highlights: ['sepsis', 'management', 'protocol']
  },
  {
    id: 'result-2',
    title: 'Personal Notes: Sepsis Cases',
    snippet: 'Three interesting sepsis cases from last month with unique presentations...',
    spaceId: 'personal-1',
    spaceName: 'My Clinical Notes',
    spaceType: 'personal',
    documentPath: '/notes/sepsis-cases-may-2024.md',
    matchScore: 0.89,
    lastModified: new Date('2024-05-28'),
    highlights: ['sepsis', 'cases']
  }
];

// Mock user profile
export const currentUser: UserProfile = {
  id: 'user-1',
  name: 'Dr. Sarah Johnson',
  role: 'Emergency Medicine Physician',
  department: 'Emergency Department',
  personalSpaceIds: ['personal-1', 'personal-2', 'personal-3', 'personal-4']
};