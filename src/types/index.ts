// Knowledge Space Types
export interface KnowledgeSpace {
  id: string;
  name: string;
  type: 'personal' | 'organization';
  isActive: boolean;
  documentCount: number;
  description?: string;
  lastUpdated?: Date;
  accessLevel?: 'private' | 'department' | 'organization';
  category?: string;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  sources?: SourceReference[];
  quickReplies?: QuickReply[];
  actions?: MessageAction[];
  systemSuggestion?: boolean;
  metadata?: {
    sources?: string[];
    confidence?: number;
  };
}

export interface SourceReference {
  spaceId: string;
  spaceName: string;
  documentName?: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export interface MessageAction {
  id: string;
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

// Search Result Types
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  spaceId: string;
  spaceName: string;
  spaceType: 'personal' | 'organization';
  documentPath: string;
  matchScore: number;
  lastModified: Date;
  highlights?: string[];
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  personalSpaceIds: string[];
}