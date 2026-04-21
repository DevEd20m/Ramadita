import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: 'bot-ia-3b90b'
  });
}

async function testFirestore() {
  try {
    const db = getFirestore('botcito');
    console.log('Attempting to access database "botcito"...');
    const collections = await db.listCollections();
    console.log('Available collections:', collections.map(c => c.id));
  } catch (err: any) {
    console.error('Error accessing Firestore:', err.message);
  }
}

testFirestore();
