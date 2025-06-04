import React from 'react';
import KnowledgeSpacesSidebar from './KnowledgeSpacesSidebar';
import ChatInterface from './ChatInterface';
import { KnowledgeSpace, ChatMessage } from '../types';

interface AppLayoutProps {
  personalSpaces: KnowledgeSpace[];
  organizationSpaces: KnowledgeSpace[];
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onToggleSpace?: (spaceId: string) => void;
  onQuickReply?: (action: string) => void;
  onAction?: (action: string) => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

const AppLayout: React.FC<AppLayoutProps> = ({
  personalSpaces,
  organizationSpaces,
  messages,
  onSendMessage,
  onToggleSpace,
  onQuickReply,
  onAction,
  isLoading,
  suggestedQuestions
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <KnowledgeSpacesSidebar 
        personalSpaces={personalSpaces}
        organizationSpaces={organizationSpaces}
        onToggleSpace={onToggleSpace}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface 
          messages={messages}
          onSendMessage={onSendMessage}
          onQuickReply={onQuickReply}
          onAction={onAction}
          isLoading={isLoading}
          suggestedQuestions={suggestedQuestions}
        />
      </div>
    </div>
  );
};

export default AppLayout;