import type { Scenario, KnowledgeSpace, ChatMessage } from '../types';

// Personal Knowledge Spaces for Multi-Domain Scenario
const multiDomainPersonalSpaces: KnowledgeSpace[] = [
  {
    id: 'mp1',
    name: 'Patient Medical Reports',
    type: 'personal',
    isActive: true,
    documentCount: 32,
    description: 'Current patient medical history and reports'
  },
  {
    id: 'mp2',
    name: 'Clinical Notes',
    type: 'personal',
    isActive: true,
    documentCount: 45,
    description: 'Personal clinical observations and notes'
  }
];

// Organization Knowledge Spaces for Multi-Domain Scenario (includes diabetes from previous consultation)
const multiDomainOrgSpaces: KnowledgeSpace[] = [
  {
    id: 'mo1',
    name: 'Diabetes Guidelines',
    type: 'organization',
    isActive: true, // Already active from previous consultation
    documentCount: 89,
    description: 'Comprehensive diabetes treatment guidelines'
  },
  {
    id: 'mo2',
    name: 'Emergency Medicine Protocols',
    type: 'organization',
    isActive: false,
    documentCount: 156,
    description: 'Hospital emergency procedures'
  },
  {
    id: 'mo3',
    name: 'Cardiology Guidelines',
    type: 'organization',
    isActive: false,
    documentCount: 124,
    description: 'Organization-wide cardiology protocols',
    icon: '🫀'
  }
];

// Shared Knowledge Spaces for Multi-Domain Scenario
const multiDomainSharedSpaces: KnowledgeSpace[] = [
  {
    id: 'mo4',
    name: 'Peer Curated Heart Studies',
    type: 'shared',
    isActive: false,
    documentCount: 67,
    description: 'Co-doctor network curated case studies',
    icon: '👥'
  }
];

// Specialized Knowledge Spaces (hidden initially)
const multiDomainSpecializedSpaces: KnowledgeSpace[] = [];

// Initial messages for Multi-Domain scenario
const multiDomainInitialMessages: ChatMessage[] = [
  {
    id: 'welcome-multidomain',
    content: 'Welcome to Multi-Domain consultation! You have diabetes protocols already active from your previous consultation. I can help with related conditions and cross-specialty questions.',
    sender: 'assistant',
    timestamp: new Date(),
    quickReplies: [
      { id: 'q1', text: 'Current active spaces', action: 'show_active' },
      { id: 'q2', text: 'Heart complications in diabetes', action: 'search_heart_diabetes' },
      { id: 'q3', text: 'Multi-organ considerations', action: 'search_multi_organ' }
    ]
  }
];

export const multiDomainScenario: Scenario = {
  id: 'multi-domain',
  name: 'Multi-Domain Consultation',
  description: 'Cross-specialty consultation combining diabetes management with cardiology and other specialties',
  icon: '🫀',
  initialPersonalSpaces: multiDomainPersonalSpaces,
  initialOrgSpaces: multiDomainOrgSpaces,
  initialSharedSpaces: multiDomainSharedSpaces,
  specializedSpaces: multiDomainSpecializedSpaces,
  initialMessages: multiDomainInitialMessages,
  workflowType: 'multi-domain'
};