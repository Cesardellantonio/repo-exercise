import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      content: "Hello! I'm your AI garage manager. I can help you manage vehicles, track maintenance, monitor inventory, and provide smart recommendations. What would you like to do today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        actionType: 'welcome',
        confidence: 1.0
      }
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.processMessage(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          actionType: 'error',
          confidence: 0
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    
    return (
      <div
        key={message.id}
        className={`chat-message flex items-start space-x-3 mb-4 ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-garage-200 text-garage-600'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          <div className={`inline-block px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-white text-garage-800 border border-garage-200 rounded-bl-md shadow-sm'
          }`}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          </div>
          
          <div className={`text-xs text-garage-500 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  const suggestedQuestions = [
    "What's my garage status?",
    "Check maintenance schedule",
    "Show inventory levels",
    "Add a new vehicle",
    "Schedule oil change"
  ];

  return (
    <div className={`flex flex-col h-full bg-garage-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-garage-200 px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-garage-800">AI Garage Manager</h1>
            <p className="text-sm text-garage-500">Your intelligent garage assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-garage-200 text-garage-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-2 rounded-2xl bg-white border border-garage-200 shadow-sm rounded-bl-md">
                <div className="flex items-center space-x-2 text-garage-500">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-garage-200 bg-white">
          <p className="text-xs text-garage-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="px-3 py-1 text-xs bg-garage-100 text-garage-600 rounded-full hover:bg-garage-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-garage-200 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-garage-400 hover:text-garage-600 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about your garage..."
              className="w-full px-4 py-2 border border-garage-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="button"
            className="p-2 text-garage-400 hover:text-garage-600 transition-colors"
          >
            <Mic size={20} />
          </button>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;