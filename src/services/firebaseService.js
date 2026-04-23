// src/services/firebaseService.js
import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    setDoc 
} from 'firebase/firestore';

// --- Users & Roles ---
export const createUserProfile = async (uid, email, extraInfo = {}) => {
    await setDoc(doc(db, 'users', uid), {
        email,
        nom: extraInfo.nom || '',
        tel: extraInfo.tel || '',
        adresse: extraInfo.adresse || '',
        isAdmin: false,
        createdAt: new Date()
    });
};

export const getUserProfile = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// --- Clients CRUD ---
const clientsCol = collection(db, 'clients');

export const getClients = async () => {
    const snapshot = await getDocs(clientsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = async (clientData) => {
    const docRef = await addDoc(clientsCol, clientData);
    return { id: docRef.id, ...clientData };
};

export const updateClient = async (id, clientData) => {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, clientData);
};

export const deleteClient = async (id) => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
};

// --- Invoices CRUD ---
const invoicesCol = collection(db, 'factures');

export const getInvoices = async () => {
    const snapshot = await getDocs(invoicesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addInvoice = async (invoiceData) => {
    const docRef = await addDoc(invoicesCol, {
        ...invoiceData,
        createdAt: new Date(),
        validated_by_admin: false
    });
    return { id: docRef.id, ...invoiceData };
};

export const updateInvoice = async (id, invoiceData) => {
    const docRef = doc(db, 'factures', id);
    await updateDoc(docRef, invoiceData);
};

export const deleteInvoice = async (id) => {
    const docRef = doc(db, 'factures', id);
    await deleteDoc(docRef);
};
