import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, FileText, ChevronRight, CheckCircle, Database, BookOpen, Activity, Bell } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onQuickReply?: (action: string) => void;
  onAction?: (action: string) => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  onQuickReply,
  onAction,
  isLoading = false,
  suggestedQuestions = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for knowledge update messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.content?.includes('Knowledge article updated')) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleQuickReply = (text: string) => {
    if (!isLoading) {
      onSendMessage(text);
    }
  };

  const getSpaceIcon = (spaceName: string) => {
    if (spaceName.toLowerCase().includes('nutrition') || spaceName.toLowerCase().includes('meal')) return '🍽️';
    if (spaceName.toLowerCase().includes('exercise') || spaceName.toLowerCase().includes('physical')) return '🏃‍♂️';
    if (spaceName.toLowerCase().includes('heart') || spaceName.toLowerCase().includes('cardio')) return '🫀';
    if (spaceName.toLowerCase().includes('behavioral')) return '🎯';
    if (spaceName.toLowerCase().includes('community')) return '👥';
    if (spaceName.toLowerCase().includes('collaboration')) return '🤝';
    return '📚';
  };

  const SystemMessage = ({ content }: { content: string }) => {
    // Check if this is a knowledge space activation message
    const isActivation = content.includes('activated') || content.includes('Activated');
    const hasSpaceInfo = content.includes('docs)') || content.includes('documents');

    if (isActivation && hasSpaceInfo) {
      // Parse the content to extract space information
      const lines = content.split('\n').filter(line => line.trim());
      const activatedSpaces: Array<{name: string, docs: string, description?: string}> = [];
      
      lines.forEach(line => {
        const match = line.match(/(?:✅\s*)?(?:Activated:\s*)?(.+?)\s*\((\d+)\s*docs?\)/);
        if (match) {
          activatedSpaces.push({
            name: match[1].trim(),
            docs: match[2],
            description: lines.find(l => l.includes('-') && l.includes(match[1]))?.split('-')[1]?.trim()
          });
        }
      });

      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Spaces Activated</h3>
          </div>
          
          <div className="space-y-3">
            {activatedSpaces.map((space, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getSpaceIcon(space.name)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {space.name}
                        </h4>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Database className="w-4 h-4 mr-1" />
                          <span className="font-medium">{space.docs}</span>
                          <span className="ml-1">documents available</span>
                        </div>
                        {space.description && (
                          <p className="text-sm text-gray-600 mt-2">{space.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-3" />
                </div>
              </div>
            ))}
          </div>

          {content.includes('Would you like') && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-700">{content.split('Would you like')[1]?.split('?')[0] ? `Would you like${content.split('Would you like')[1].split('?')[0]}?` : ''}</p>
            </div>
          )}
        </div>
      );
    }

    // For other system messages
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="whitespace-pre-wrap text-gray-700">{content}</div>
        </div>
      </div>
    );
  };

  const MessageWithActions = ({ message }: { message: ChatMessageType }) => {
    const { quickReplies, actions, systemSuggestion } = message;
    const isSystemMessage = message.content.includes('activated') || message.content.includes('I\'ve activated');

    return (
      <div className={`${message.sender === 'assistant' ? '' : 'bg-white rounded-lg p-4'}`}>
        {message.sender === 'assistant' && isSystemMessage ? (
          <SystemMessage content={message.content} />
        ) : (
          <div className={`${message.sender === 'assistant' ? 'bg-gray-50 rounded-lg p-4' : ''}`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* System Suggestion Indicator */}
            {systemSuggestion && (
              <div className="flex items-center mt-2 text-xs text-blue-600">
                <Info className="w-3 h-3 mr-1" />
                <span>System Suggestion</span>
              </div>
            )}

            {/* Source Attribution */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">Information sourced from:</p>
                <div className="space-y-2">
                  {message.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-md p-2 border border-gray-100">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`${source.relevance === 'high' ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                          {source.spaceName}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        source.relevance === 'high' 
                          ? 'bg-green-100 text-green-700' 
                          : source.relevance === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {source.relevance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction?.(action.action)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105
                  ${action.variant === 'primary' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md' : ''}
                  ${action.variant === 'secondary' ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400' : ''}
                  ${action.variant === 'ghost' ? 'text-blue-600 hover:bg-blue-50' : ''}
                  ${!action.variant ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Quick Replies */}
        {quickReplies && quickReplies.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-600 font-medium mb-2">Quick actions:</p>
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onQuickReply?.(reply.action)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-left text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{getSpaceIcon(reply.text)}</span>
                  <span className="font-medium group-hover:text-blue-700">{reply.text}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Notification component
  const NotificationToast = () => (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-center space-x-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <Bell className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Knowledge Article Updated</p>
          <p className="text-xs text-gray-600 mt-1">Successfully updated at {new Date().toLocaleTimeString()}</p>
        </div>
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full bg-white">
      <NotificationToast />
      
      <header className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl font-semibold text-gray-900">Care Coordination Assistant</h2>
        <p className="text-sm text-gray-600">Your partner in creating personalized health plans</p>
      </header>
      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && suggestedQuestions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm font-semibold text-blue-900">Get started with these questions:</p>
              </div>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(question)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm text-left text-blue-700 bg-white rounded-lg hover:bg-blue-100 transition-all duration-200 group border border-blue-200 hover:border-blue-300"
                  >
                    <span className="font-medium">{question}</span>
                    <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageWithActions key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-500 ml-2">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex space-x-4 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about diet plans, lifestyle changes, or patient care..."
            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;