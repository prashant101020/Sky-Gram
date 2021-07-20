// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
  
//   };
  
  import firebase from "firebase";

  const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyAGS1QNSJALIcORpxWE5kbBEyBVmnrRQvI",
    authDomain: "instagram-clone-3fb46.firebaseapp.com",
    projectId: "instagram-clone-3fb46",
    storageBucket: "instagram-clone-3fb46.appspot.com",
    messagingSenderId: "738726660987",
    appId: "1:738726660987:web:360ac58f587d3edd2a8bde",
    measurementId: "G-X2LYZCDDSX"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};