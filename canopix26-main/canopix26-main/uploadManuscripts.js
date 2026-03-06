import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    const firebaseConfig = {
    apiKey: "AIzaSyBhTJ88rN4Lj4fGogNCjUbJQke-7QiRbeo",
    authDomain: "canopix2026-83ceb.firebaseapp.com",
    projectId: "canopix2026-83ceb",
    storageBucket: "canopix2026-83ceb.firebasestorage.app",
    messagingSenderId: "646414631175",
    appId: "1:646414631175:web:af5a68adba29bbf4d085a2",
    measurementId: "G-66W234047H"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadManuscripts() {
    try {
        const search = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?q=manuscript");
        const data = await search.json();

        // first 50 manuscripts
        const ids = data.objectIDs.slice(0, 50);

        // save each manuscript to Firestore
        for (let id of ids) {
            const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            const item = await res.json();

            // make sure it has a title and image before adding to Firestore
            if(item.title && item.primaryImageSmall){
                await addDoc(collection(db, "manuscripts"), {
                    title: item.title,
                    culture: item.culture || "Unknown",
                    date: item.objectDate || "Unknown",
                    image: item.primaryImageSmall,
                    country: item.country || "Unknown",
                    department: item.department || "Unknown"
                });

                console.log("Added:", item.title);
            }
        }

        console.log("All manuscripts added successfully!");
    } catch (err) {
        console.error("Error loading manuscripts:", err);
    }
}

loadManuscripts();