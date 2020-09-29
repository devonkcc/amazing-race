import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAPTGs0suPmOAhtibnIaUYapX4WKcJ7-WE",
  authDomain: "amazing-race-4f517.firebaseapp.com",
  databaseURL: "https://amazing-race-4f517.firebaseio.com",
  projectId: "amazing-race-4f517",
  storageBucket: "amazing-race-4f517.appspot.com",
  messagingSenderId: "893569189125",
  appId: "1:893569189125:web:626bd6c4729c84c50f636c",
  measurementId: "G-YQ32LK8J5K"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
export const storage_ref = firebase.storage().ref();