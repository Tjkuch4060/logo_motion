import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Conversation, updateConversationTitle, deleteConversation } from '../services/firestoreService';

interface ChatHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onConversationsUpdate: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ conversations, onSelectConversation, onNewConversation, onConversationsUpdate }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const handleRename = async (id: string) => {
        if (!newTitle.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await updateConversationTitle(id, newTitle);
            onConversationsUpdate();
        } catch (error) {
            console.error("Failed to rename conversation:", error);
        }
        setEditingId(null);
        setNewTitle('');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this conversation?")) {
            try {
                await deleteConversation(id);
                onConversationsUpdate();
            } catch (error) {
                console.error("Failed to delete conversation:", error);
            }
        }
    };

  return (
    <div className="w-64 bg-slate-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
        <button onClick={onNewConversation} className="p-2 text-slate-400 hover:text-white">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {conversations.map((convo) => (
            <li key={convo.id} className="mb-2 group">
              <div className="flex items-center justify-between p-2 rounded-md bg-slate-700 hover:bg-slate-600">
                {editingId === convo.id ? (
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleRename(convo.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(convo.id)}
                        className="bg-slate-600 text-white w-full px-1"
                        autoFocus
                    />
                ) : (
                    <button 
                        onClick={() => onSelectConversation(convo.id)} 
                        className="flex-1 text-left"
                    >
                        {convo.title}
                    </button>
                )}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(convo.id); setNewTitle(convo.title); }} className="p-1 text-slate-400 hover:text-white">
                        <EditIcon />
                    </button>
                    <button onClick={() => handleDelete(convo.id)} className="p-1 text-slate-400 hover:text-white">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatHistory;
