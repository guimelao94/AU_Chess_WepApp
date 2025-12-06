import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Fire';

export async function addSongToQueue({ title, category, tempo }) {
  return addDoc(collection(db, 'queue'), {
    title,
    category,
    tempo,
    createdAt: serverTimestamp()
  });
}

export async function removeFromQueue(id) {
  return deleteDoc(doc(db, 'queue', id));
}
