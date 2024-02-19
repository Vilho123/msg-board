// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, documentId, deleteField  } from "firebase/firestore";
import 'firebaseui/dist/firebaseui.css'
import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, signOut, updateProfile, } from "firebase/auth"


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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize Firebase auth
const auth = getAuth();

export async function loginUser(object) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, object.email, object.password);
    if (userCredential.user) {
      // Signed in
      const user = userCredential.user;
      return user;
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return { errorCode, errorMessage }
  };
};

export async function createUser(userObject) {
  try {
    const docRef = doc(db, "users", "usernames");
    await createUserWithEmailAndPassword(auth, userObject.email, userObject.password);
    await updateProfile(auth.currentUser, { displayName: userObject.username });
    await updateDoc(docRef, {
      usernames: arrayUnion(userObject.username)
    });

    // Return the current user if the operations succeed
    return auth.currentUser;
  } catch (error) {
    // Handle errors here
    const errorCode = error.code;
    const errorMessage = error.message;
    
    // Return an object with error details
    return { errorCode, errorMessage };
  };
};


export async function addData(msg) {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('fi-FI');
  const formattedTime = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      userId: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      message: msg,
      date: formattedDate,
      time: formattedTime,
      likes: [],
      // add index in order to sort messages
      index: (await getDocs(collection(db, "messages"))).size + 1
    });
  } catch(error) {
    console.error("Error adding document: ", error);
  };
};

export async function handleDocumentLike(documentId) {
  try {
    const docRef = doc(db, "messages", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const foundDoc = docSnap.data();

      if (!foundDoc.likes || !foundDoc.likes.includes(auth.currentUser.uid)) {
        await updateDoc(docRef, {
          likes: arrayUnion(auth.currentUser.uid)
        });
      };
    };
  } catch(error) {
    console.error("Error handling like: ", error);
  };
};

export async function handleDocumentDislike(documentId){
  try {
    const docRef = doc(db, "messages", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const foundDoc = docSnap.data();

      if (foundDoc.likes.includes(auth.currentUser.uid)) {
        await updateDoc(docRef, {
          likes: arrayRemove(auth.currentUser.uid)
        });
      }
    };
  } catch(error) {
    console.error("Error handling dislike: ", error);
  };
};

export async function fetchMessages() {
  let messages = [];
  try {
    const docRef = await getDocs(collection(db, "messages"));
    docRef.forEach((doc) => {
      messages.push({ documentId: doc.id, index: doc.index, ...doc.data() })
    });
    const sortedMessages = messages.sort(function (a, b) {
      return a.index - b.index
    });
    return sortedMessages;
  } catch (error) {
    console.error("Error fetching data", error);
  };
};

export async function scanUsername(username) {
  // Check if username already exists
  const docRef = doc(db, "users", "usernames");
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data().usernames;
    if (!data) {
      return null;
    };

    let result = "";

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element === username) {
        result = "Username already exists";
        break
      } else {
        return 0;
      };
    };
    return result;
  };
};

export async function deleteDocument(documentId) {
  await deleteDoc(doc(db, "messages", documentId));
};

export async function deleteUserData() {
  const user = auth.currentUser;

  const messagesRef = await getDocs(collection(db, "messages"));
  if (messagesRef.size === 0) {
     console.error("Messages table is empty");  
  } else {
    messagesRef.forEach((doc) => {
      const data = doc.data();
      if (data.userId === user.uid) {
        deleteDocument(doc.id);
      };
    });
  };

  const usersRef = doc(db, "users", "usernames");
  const docSnap = await getDoc(usersRef);

  if (docSnap.exists()) {
    const usernameData = docSnap.data();
    usernameData.usernames.forEach((nickname) => {
      if (nickname === user.displayName) {
        updateDoc(usersRef, {
          usernames: deleteField()
        })
      } else {
        return null;
      };
    })
  } else {
    console.error("Users or usernames table do not exist");;
  };

  await deleteUser(user);
  return 0;
};