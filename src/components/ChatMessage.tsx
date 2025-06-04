import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : isSystem
            ? 'bg-blue-50 text-blue-900 border border-blue-200'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.metadata && (
          <div className={`mt-2 text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.metadata.sources && (
              <div className="flex items-center space-x-2">
                <span>Sources:</span>
                {message.metadata.sources.map((source, index) => (
                  <span key={index} className="underline cursor-pointer hover:opacity-80">
                    {source}
                  </span>
                ))}
              </div>
            )}
            {message.metadata.confidence && (
              <div>Confidence: {Math.round(message.metadata.confidence * 100)}%</div>
            )}
          </div>
        )}
        
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;