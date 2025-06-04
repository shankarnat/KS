import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, FileText, ChevronRight } from 'lucide-react';
import type { ChatMessage as ChatMessageType, QuickReply } from '../types';
import ChatMessage from './ChatMessage';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
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

  const MessageWithActions = ({ message }: { message: ChatMessageType }) => {
    const { quickReplies, actions, systemSuggestion } = message;

    return (
      <div className={`${message.sender === 'assistant' ? 'bg-gray-50' : 'bg-white'} rounded-lg p-4`}>
        <ChatMessage message={message} />
        
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
            <p className="text-xs text-gray-600 mb-2">Information sourced from:</p>
            <div className="space-y-1">
              {message.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-3 h-3 mr-1.5" />
                    <span className={`${source.relevance === 'high' ? 'font-medium text-gray-800' : ''}`}>
                      {source.spaceName}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
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

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction?.(action.action)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${action.variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
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
          <div className="mt-3 space-y-1">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onQuickReply?.(reply.action)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-left text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors group"
              >
                <span>{reply.text}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl font-semibold text-gray-900">Healthcare Assistant</h2>
        <p className="text-sm text-gray-600">Ask questions about protocols, procedures, and guidelines</p>
      </header>
      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && suggestedQuestions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-3">Get started with these questions:</p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(question)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-left text-blue-700 bg-white rounded-md hover:bg-blue-100 transition-colors group"
                  >
                    <span>{question}</span>
                    <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageWithActions key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500 pl-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-4 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;