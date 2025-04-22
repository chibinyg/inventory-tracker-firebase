import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    where,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

import { app } from "./firebase_core.js";
import { Inventory } from "../model/Inventory.js";
import { currentUser } from "./firebase_auth.js";

const db = getFirestore(app);
const COLLECTION_INVENTORY = 'inventory';

export async function addInventory(item) {
    const collRef = collection(db, COLLECTION_INVENTORY);
    const docRef = await addDoc(collRef, item);
    return docRef.id;
}

export async function getInventoryList() {
    let inventoryList = [];
    const q = query(collection(db, COLLECTION_INVENTORY),
        where('email', '==', currentUser.email),
        orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const i = doc.data();
        const item = new Inventory(
            i.email,
            i.name,
            i.qty,
            i.timestamp
        );
        item.set_docId(doc.id);
        inventoryList.push(item);
    });
    return inventoryList;
}

export async function updateInventoryById(docId, update) {
    const docRef = doc(db, COLLECTION_INVENTORY, docId);
    await updateDoc(docRef, update);
}

export async function deleteInventoryById(docId) {
    const docRef = doc(db, COLLECTION_INVENTORY, docId);
    await deleteDoc(docRef);
}

export async function getInventoryQtyById(docId) {
    const docRef = doc(db, COLLECTION_INVENTORY, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return data.qty;
    }
}

export async function inventoryItemExists(email, name) {
    const q = query(
        collection(db, COLLECTION_INVENTORY),
        where('email', '==', email),
        where('name', '==', name)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}