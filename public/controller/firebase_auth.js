import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { app } from "./firebase_core.js";
import { router } from "./app.js";

const auth = getAuth(app);

export let currentUser = null;

export async function loginFirebase(email, password) {

    await signInWithEmailAndPassword(auth, email, password);

}

export async function logoutFirebase() {
    await signOut(auth);
}

onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) {
        console.log('AuthStateChanged: User logged in', user.email);
        //hide login form
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-block', 'd-none');
        //show nav menu
        const navMenu = document.getElementById('navMenuContainer');
        navMenu.classList.replace('d-none', 'd-block');
        //show spa root
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-none', 'd-block');
        router.navigate(window.location.pathname);
    } else {
        console.log('AuthStateChanged: User logged out');
        //show login form
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-none', 'd-block');
        //hide nav menu
        const navMenu = document.getElementById('navMenuContainer');
        navMenu.classList.replace('d-block', 'd-none');
        //hide spa root
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-block', 'd-none');
        router.currentView = null;
        spaRoot.innerHTML = ''; //clear the view
    }
});

export async function createAccount(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
}