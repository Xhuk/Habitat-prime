

import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import paths for types and services.
import { type ChatMessage, type AuthenticatedUser } from '../types';
import { getChatMessages, sendChatMessage } from '../services/mockFirebaseService';

interface ChatDashboardProps {
  user: AuthenticatedUser;
}

const ChatDashboard: React.FC<ChatDashboardProps> = ({ user }) => {
  // In a real app, you'd manage multiple conversations.
  // For this mock, we'll simulate a single chat with "Residente Demo".
  const contactId = 'user-resident1'; 
  const contactName = 'Residente Demo';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const data = await getChatMessages(contactId);
      setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, [contactId]);
  
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // FIX: Pass the 'user' object as the third argument to sendChatMessage
      const sentMessage = await sendChatMessage(newMessage, contactId, user);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden h-[calc(100vh-10rem)] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-dark-gray">Chat con {contactName}</h2>
        <p className="text-sm text-gray-500">Responde las dudas de los residentes.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center">Cargando mensajes...</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                  msg.senderId === user.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-dark-gray'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                    msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border border-gray-300 rounded-md"
            disabled={isSending}
          />
          <button 
            type="submit" 
            disabled={isSending || !newMessage.trim()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:bg-gray-400"
          >
            {isSending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDashboard;