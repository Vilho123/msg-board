// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, QuerySnapshot, getDoc  } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX1gZV_oAkGGQ0hmmeGhP1886EwDto4Sc",
  authDomain: "clean-4840d.firebaseapp.com",
  projectId: "clean-4840d",
  storageBucket: "clean-4840d.appspot.com",
  messagingSenderId: "90069705023",
  appId: "1:90069705023:web:1a9d39a7d99be00a6e738a",
  measurementId: "G-2CJE7FTPHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// References
const messagesRef = collection(db, "messages");

export async function addData(nickname, msg) {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('fi-FI');
  const formattedTime = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
  try {
    const docRef = await addDoc(messagesRef, {
      name: nickname.username,
      message: msg,
      date: formattedDate,
      time: formattedTime,
      likes: 0,
      // add id in order to sort messages by the lowest index
      index: (await getDocs(messagesRef)).size + 1
    });
    console.log("Document written with ID: ", docRef.id);
  } catch(error) {
    console.error("Error adding document: ", error);
  };
};

export async function updateDocumentLikes(documentId) {
  try {
    const docRef = await getDoc(messagesRef);
    console.log(docRef)
  } catch(error) {
    console.error("Error updating document: ", error);
  };
};

export async function fetchMessages() {
  let messages = [];
  try {
    const docRef = await getDocs(messagesRef);
    docRef.forEach((doc) => {

      messages.push({ id: doc.id, ...doc.data() })
    });
    // Sort messages array by id
    const sortedMessages = messages.sort(function (a, b) {
      return a.id - b.id
    });
    return sortedMessages;
  } catch (error) {
    console.error("Error fetching data", error);
  } 
};

