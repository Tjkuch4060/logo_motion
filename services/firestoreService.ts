import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, writeBatch } from 'firebase/firestore';

export interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp: Timestamp;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: Timestamp;
}

// Create a new conversation in Firestore
export const addConversation = async (title: string): Promise<string> => {
    const docRef = await addDoc(collection(db, 'conversations'), {
        title: title,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

// Get all conversations from Firestore
export const getConversations = async (): Promise<Conversation[]> => {
    const q = query(collection(db, 'conversations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Conversation));
};

// Get all messages for a specific conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Message);
};

// Add a new message to a conversation
export const addMessage = async (conversationId: string, message: Omit<Message, 'timestamp'>) => {
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        ...message,
        timestamp: Timestamp.now(),
    });
};

// Update a conversation's title
export const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, { title: newTitle });
};

// Delete a conversation and all its messages
export const deleteConversation = async (conversationId: string) => {
    const conversationRef = doc(db, 'conversations', conversationId);
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    
    // Delete all messages in a batch
    const messagesSnapshot = await getDocs(messagesRef);
    const batch = writeBatch(db);
    messagesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete the conversation itself
    await deleteDoc(conversationRef);
};
