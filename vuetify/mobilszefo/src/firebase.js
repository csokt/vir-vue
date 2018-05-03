import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Store from './store'

const config = {
  apiKey: 'AIzaSyCavLxcswj_3XZeC9Ta-nHltiVEDWXpT3M',
  authDomain: 'szefo-users.firebaseapp.com',
  databaseURL: 'https://szefo-users.firebaseio.com',
  projectId: 'szefo-users',
  storageBucket: 'szefo-users.appspot.com',
  messagingSenderId: '621506010716'
}

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged((user) => {
  console.log('onAuthStateChanged')
  Store.fireUser = user
})

const db = firebase.firestore()

function signIn (email, password) {
  firebase.auth()
    .signInWithEmailAndPassword(email, password)
//        .signInWithEmailAndPassword('fekete.alicja@szefo.local', 'fekete.alicja')
    .then(
      user => {
        console.log(user)
      },
      error => {
        alert(error.message)
      }
    )
}

function signOut () {
  firebase.auth()
    .signOut()
    .then(
      () => {
        console.log('Kilépett')
      },
      error => {
        alert(error.message)
      }
    )
}

export { db, signIn, signOut }
