import { getApps, initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyANoDO7MLAGHQ-tBcU5YcJFsShch0Mr4I0',
  authDomain: 'fir-messagingtest-9565d.firebaseapp.com',
  databaseURL:
    'https://fir-messagingtest-9565d-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'fir-messagingtest-9565d',
  storageBucket: 'fir-messagingtest-9565d.appspot.com',
  messagingSenderId: '38861134966',
  appId: '1:38861134966:web:3b4d36cfb1f90e3b129357',
};

if (!getApps().length) {
  console.info('Firebase app initialization');
  initializeApp(firebaseConfig);
}
