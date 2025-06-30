// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCy3aUY2OWKXFMyZBkX1NQEL8haZbdHSyk",
  authDomain: "garagem-online-34080.firebaseapp.com",
  projectId: "garagem-online-34080",
  storageBucket: "garagem-online-34080.firebasestorage.app",
  messagingSenderId: "804666498964",
  appId: "1:804666498964:web:934f99d6b039c453eaf981"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const authUiDiv = document.getElementById('auth-ui');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const userUidSpan = document.getElementById('user-uid');

// Monitorar o estado da autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário está logado
        console.log("Usuário logado:", user.email, user.uid);
        userInfoDiv.style.display = 'block';
        authUiDiv.style.display = 'none';
        signOutButton.style.display = 'block';

        userEmailSpan.textContent = user.email;
        userUidSpan.textContent = user.uid;
    } else {
        // Usuário não está logado
        console.log("Nenhum usuário logado.");
        userInfoDiv.style.display = 'none';
        authUiDiv.style.display = 'block';
        signOutButton.style.display = 'none';
        userEmailSpan.textContent = '';
        userUidSpan.textContent = '';
    }
});






// ... (código anterior, dentro da mesma tag <script>)

// Funções para cadastro, login e logout
signUpButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Usuário criado com sucesso
            const user = userCredential.user;
            console.log("Usuário cadastrado com sucesso:", user.email);
            alert("Conta criada com sucesso!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro no cadastro:", errorMessage, errorCode);
            alert(`Erro no cadastro: ${errorMessage}`);
        });
});

signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            console.log("Login realizado com sucesso:", user.email);
            alert("Login realizado com sucesso!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro no login:", errorMessage, errorCode);
            alert(`Erro no login: ${errorMessage}`);
        });
});

signOutButton.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            // Logout bem-sucedido
            console.log("Usuário deslogado com sucesso.");
            alert("Você saiu da sua conta.");
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error.message);
            alert(`Erro ao deslogar: ${error.message}`);
        });
});



