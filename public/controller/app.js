import { HomeView } from "../view/HomeView.js";
import { ProfileView } from "../view/ProfileView.js";
import { HomeController } from "./HomeController.js";
import { ProfileController } from "./ProfileController.js";
import { Router } from './Router.js';
import { loginFirebase } from './firebase_auth.js';
import { logoutFirebase } from './firebase_auth.js';

document.getElementById('appHeader').textContent = 'Cloud Web Template';
document.title = 'App Template';

const routes = [
    { path: '/', view: HomeView, controller: HomeController },
    { path: '/profile', view: ProfileView, controller: ProfileController },
];

//create an instance of Router
const router = new Router(routes);
router.navigate(window.location.pathname);

const menuItems = document.querySelectorAll('a[data-path');
menuItems.forEach(item => {
    item.onclick = function (e) {
        const path = item.getAttribute('data-path');
        router.navigate(path);
    }
});

//login form
document.forms.loginForm.onsubmit = async function (e) {
    e.preventDefault(); //prevent form page reload
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        await loginFirebase(email, password);
        console.log('User logged in', email);
    } catch (e) {
        console.error('Error logging in', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('Sign in failed: ' + e.code + ', ' + e.message);
    }
};

//logout button
document.getElementById('logoutButton').onclick = async function (e) {
    try {
        await logoutFirebase();
        console.log('User logged out');
    }
    catch (e) {
        console.error('Error logging out', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('Sign out failed: ' + e.code + ', ' + e.message);
    }
};