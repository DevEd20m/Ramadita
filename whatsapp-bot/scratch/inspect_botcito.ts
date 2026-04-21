import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (admin.apps.length === 0) {
    admin.initializeApp({
        projectId: 'bot-ia-3b90b'
    });
}

async function checkData() {
    try {
        const db = getFirestore('botcito');
        console.log('Consultando colección "sessions" en base de datos "botcito"...');
        const snapshot = await db.collection('sessions').limit(5).get();
        
        if (snapshot.empty) {
            console.log('La colección "sessions" está VACÍA.');
        } else {
            console.log(`Se encontraron ${snapshot.size} documentos en "sessions".`);
            snapshot.forEach(doc => {
                console.log(`- ID: ${doc.id}, History length: ${doc.data().history?.length || 0}`);
            });
        }
    } catch (err: any) {
        console.error('ERROR al consultar Firestore:', err.message);
    }
}

checkData();
