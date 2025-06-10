import type { Scenario, KnowledgeSpace, ChatMessage } from '../types';

// Personal Knowledge Spaces for Care Coordinator Multi-Domain Scenario
const multiDomainPersonalSpaces: KnowledgeSpace[] = [
  {
    id: 'mp1',
    name: 'Patient Lifestyle Assessments',
    type: 'personal',
    isActive: true,
    documentCount: 42,
    description: 'Patient dietary habits, exercise patterns, and lifestyle data'
  },
  {
    id: 'mp2',
    name: 'Care Coordination Notes',
    type: 'personal',
    isActive: true,
    documentCount: 38,
    description: 'Personal notes on patient progress and adherence'
  }
];

// Organization Knowledge Spaces for Care Coordinator Multi-Domain Scenario
const multiDomainOrgSpaces: KnowledgeSpace[] = [
  {
    id: 'mo1',
    name: 'Nutrition Guidelines for Diabetes',
    type: 'organization',
    isActive: true, // Already active from previous consultation
    documentCount: 95,
    description: 'Evidence-based dietary recommendations for diabetic patients'
  },
  {
    id: 'mo2',
    name: 'Exercise & Physical Activity Protocols',
    type: 'organization',
    isActive: false,
    documentCount: 78,
    description: 'Safe exercise guidelines for various health conditions'
  },
  {
    id: 'mo3',
    name: 'Behavioral Change Strategies',
    type: 'organization',
    isActive: false,
    documentCount: 62,
    description: 'Motivational techniques and habit formation protocols',
    icon: '🎯'
  },
  {
    id: 'mo4',
    name: 'Meal Planning Resources',
    type: 'organization',
    isActive: false,
    documentCount: 84,
    description: 'Culturally diverse meal plans and recipes',
    icon: '🍽️'
  }
];

// Shared Knowledge Spaces for Care Coordinator Multi-Domain Scenario
const multiDomainSharedSpaces: KnowledgeSpace[] = [
  {
    id: 'ms1',
    name: 'Community Success Stories',
    type: 'shared',
    isActive: false,
    documentCount: 71,
    description: 'Patient testimonials and successful lifestyle interventions',
    icon: '👥'
  },
  {
    id: 'ms2',
    name: 'Care Team Collaboration Hub',
    type: 'shared',
    isActive: false,
    documentCount: 53,
    description: 'Shared insights from dietitians, therapists, and health coaches',
    icon: '🤝'
  }
];

// Specialized Knowledge Spaces (hidden initially, added dynamically)
const multiDomainSpecializedSpaces: KnowledgeSpace[] = [];

// Initial messages for Care Coordinator Multi-Domain scenario
const multiDomainInitialMessages: ChatMessage[] = [
  {
    id: 'welcome-multidomain',
    content: 'Welcome to your Care Coordination session! I have nutrition guidelines for diabetes already active from your previous consultation. I can help create personalized diet and lifestyle plans for your patients.',
    sender: 'assistant',
    timestamp: new Date(),
    quickReplies: [
      { id: 'q1', text: 'View active lifestyle resources', action: 'show_active' },
      { id: 'q2', text: 'Patient has heart condition too', action: 'search_heart_lifestyle' },
      { id: 'q3', text: 'Need cultural meal adaptations', action: 'search_cultural_meals' }
    ]
  }
];

export const multiDomainScenario: Scenario = {
  id: 'multi-domain',
  name: 'Care Coordinator Consultation',
  description: 'Multi-domain lifestyle and diet coordination for patients with complex health conditions',
  icon: '🫀',
  initialPersonalSpaces: multiDomainPersonalSpaces,
  initialOrgSpaces: multiDomainOrgSpaces,
  initialSharedSpaces: multiDomainSharedSpaces,
  specializedSpaces: multiDomainSpecializedSpaces,
  initialMessages: multiDomainInitialMessages,
  workflowType: 'multi-domain'
};