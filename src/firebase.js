import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: 'AIzaSyBnBgGY5-7fFPhkoI2CSoruDlCsT5wCjTk',
  authDomain: 'react-livechat-b0892.firebaseapp.com',
  projectId: 'react-livechat-b0892',
  storageBucket: 'react-livechat-b0892.appspot.com',
  messagingSenderId: '648235896020',
  appId: '1:648235896020:web:650f782852afe240713f41',
  measurementId: 'G-R4K2JSX9JN',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
