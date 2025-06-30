// SUA CONFIGURAÇÃO DO FIREBASE (a mesma que você usou no index.html e dashboard.html)
        const firebaseConfig = {
          apiKey: "AIzaSyCy3aUY2OWKXFMyZBkX1NQEL8haZbdHSyk", // Sua API Key
          authDomain: "garagem-online-34080.firebaseapp.com",
          projectId: "garagem-online-34080",
          storageBucket: "garagem-online-34080.firebasestorage.app",
          messagingSenderId: "804666498964",
          appId: "1:804666498964:web:934f99d6b039c453eaf981"
        };

        // Inicialize o Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth(); // Obtenha a instância de autenticação

        // Referências aos elementos HTML nesta página
        const nameInfoDiv = document.getElementById('nameInfo');
        const companyInfoDiv = document.getElementById('companyInfo');
        const logoutButton = document.getElementById('logoutButton'); // Renomeei o ID para evitar conflito com 'logout' de classes genéricas



        // *** AQUI É A PARTE CRÍTICA DA PROTEÇÃO! ***
        // Monitorar o estado da autenticação ao carregar esta página
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Usuário está logado
                console.log("Usuário logado no Painel:", user.email, user.uid);

                // Exemplo de atualização das informações do usuário na header
                // user.displayName pode não estar preenchido se o usuário só cadastrou com e-mail/senha.
                // Você pode querer armazenar o nome e a empresa em um banco de dados (ex: Cloud Firestore)
                // e buscá-los aqui após o login.
                nameInfoDiv.textContent = user.displayName || user.email;
                companyInfoDiv.textContent = "Localiza SemiNovos"; // Ou buscar de um perfil de usuário

            } else {
                // Usuário NÃO está logado ou a sessão expirou
                console.log("Usuário não logado. Redirecionando para a página de login.");
                // Redireciona de volta para a página de login (seu index.html)
                window.location.assign('/index.html');
            }
        });




        // Lógica para o botão de Desconectar-se
        logoutButton.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    // Logout bem-sucedido
                    console.log("Deslogado do Painel. Redirecionando para a página de login.");
                    // Redireciona para a página de login após o logout
                    window.location.assign('/index.html');
                })
                .catch((error) => {
                    console.error("Erro ao deslogar:", error.message);
                    alert(`Erro ao deslogar: ${error.message}`);
                });
        });

        // =============================================================
        // Se você tiver outras lógicas em src/js/admin.js (como manipulação de cliques em "Pátio", "Consultar veículo", etc.)
        // você pode copiar o conteúdo desse arquivo e colar aqui, DENTRO desta tag <script>,
        // DEPOIS da lógica do Firebase.



// Funcionamento da seção WorkLink

const registrarHigien = document.querySelector('.higienStart');
const wOff = document.querySelector('.wOff');
const startHigien = document.getElementById('workStart');
const esconderHud = document.querySelectorAll('.workLink');
const backToWorkLinks = document.getElementById('backToWorkLinks');

startHigien.addEventListener('click', () => {
    registrarHigien.classList.remove('wOff');
    esconderHud.forEach(div => div.classList.add('workLinkOff')); // <- esconde todas
});

backToWorkLinks.addEventListener('click', () => {
    registrarHigien.classList.add('wOff');
    esconderHud.forEach(div => div.classList.remove('workLinkOff')); // <- mostra todas de novo
});