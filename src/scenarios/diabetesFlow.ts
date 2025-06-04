import type { Scenario, KnowledgeSpace, ChatMessage } from '../types';

// Personal Knowledge Spaces for Diabetes Scenario
const diabetesPersonalSpaces: KnowledgeSpace[] = [
  {
    id: 'p1',
    name: 'My Clinical Notes',
    type: 'personal',
    isActive: true,
    documentCount: 47,
    description: 'Personal clinical observations'
  },
  {
    id: 'p2',
    name: 'Saved Research',
    type: 'personal',
    isActive: true,
    documentCount: 23,
    description: 'Research papers and articles'
  },
  {
    id: 'p3',
    name: 'Case Studies',
    type: 'personal',
    isActive: true,
    documentCount: 15,
    description: 'Interesting clinical cases'
  }
];

// Organization Knowledge Spaces for Diabetes Scenario
const diabetesOrgSpaces: KnowledgeSpace[] = [
  {
    id: 'o1',
    name: 'Emergency Medicine Protocols',
    type: 'organization',
    isActive: false,
    documentCount: 156,
    description: 'Hospital emergency procedures'
  },
  {
    id: 'o2',
    name: 'Critical Care Guidelines',
    type: 'organization',
    isActive: false,
    documentCount: 89,
    description: 'ICU and critical care protocols'
  },
  {
    id: 'o3',
    name: 'Pharmacy Treatment Standards',
    type: 'organization',
    isActive: false,
    documentCount: 234,
    description: 'Drug protocols and formulary'
  }
];

// Initial messages for Diabetes scenario
const diabetesInitialMessages: ChatMessage[] = [
  {
    id: 'welcome-diabetes',
    content: 'Welcome to Diabetes Management consultation! I can search your personal knowledge spaces and suggest organizational resources when needed. What would you like to know?',
    sender: 'assistant',
    timestamp: new Date(),
    quickReplies: [
      { id: 'q1', text: 'Show my active spaces', action: 'show_active' },
      { id: 'q2', text: 'Diabetes management protocols', action: 'search_diabetes_protocols' },
      { id: 'q3', text: 'Recent medical research', action: 'search_research' }
    ]
  }
];

export const diabetesScenario: Scenario = {
  id: 'diabetes',
  name: 'Diabetes Management',
  description: 'Focused consultation for diabetes treatment protocols and management guidelines',
  icon: '🩺',
  initialPersonalSpaces: diabetesPersonalSpaces,
  initialOrgSpaces: diabetesOrgSpaces,
  initialMessages: diabetesInitialMessages,
  workflowType: 'diabetes'
};