
const firebaseConfig = {
    apiKey: "AIzaSyCy3aUY2OWKXFMyZBkX1NQEL8haZbdHSyk", 
    authDomain: "garagem-online-34080.firebaseapp.com",
    projectId: "garagem-online-34080",
    storageBucket: "garagem-online-34080.firebasestorage.app",
    messagingSenderId: "804666498964",
    appId: "1:804666498964:web:934f99d6b039c453eaf981"
};

// Inicialize o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

// Referências aos elementos HTML da header 
const nameInfoDiv = document.getElementById('nameInfo');
const companyInfoDiv = document.getElementById('companyInfo');
const logoutButton = document.getElementById('logoutButton');

// Monitorar o estado da autenticação (executa quando o app Firebase estiver pronto)


/*
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuário logado no Painel:", user.email, user.uid);
        nameInfoDiv.textContent = user.displayName || user.email;
        companyInfoDiv.textContent = "Localiza SemiNovos";
    } else {
        console.log("Usuário não logado. Redirecionando para a página de login.");
        window.location.assign('/index.html');
    }
});
*/



// Lógica para o botão de Desconectar-se
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("Deslogado do Painel. Redirecionando para a página de login.");
            window.location.assign('/index.html');
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error.message);
            alert(`Erro ao deslogar: ${error.message}`);
        });
});

// =============================================================
// FUNÇÃO PARA REGISTRAR VEÍCULO HIGIENIZADO
// Esta função e seu listener são chamados APÓS o DOM ser completamente carregado
async function registrarVeiculoHigienizado() {
    // 1. Pegar os elementos HTML pelos seus IDs
    const placaInput = document.getElementById('placaInput');
    const modeloInput = document.getElementById('modeloInput');
    const corInput = document.getElementById('corInput');
    const dataInput = document.getElementById('dataInput');
    const registerButton = document.getElementById('registerHigien');

    // Verificação básica para garantir que todos os inputs existem
    if (!placaInput || !modeloInput || !corInput || !dataInput || !registerButton) {
        console.error("Um ou mais elementos HTML para registro não foram encontrados. Verifique os IDs.");
        return;
    }

    // 2. Adicionar um "ouvinte de evento" ao botão Registrar
    registerButton.addEventListener('click', async () => {
        // Pega os valores dos inputs
        const placa = placaInput.value.trim().toUpperCase();
        const modelo = modeloInput.value.trim();
        const cor = corInput.value.trim();
        const data = dataInput.value;

        // Validação simples
        if (!placa || !modelo || !cor || !data) {
            alert('Por favor, preencha todos os campos para registrar!');
            return;
        }

        // Verificar se o usuário está autenticado antes de registrar
        if (!auth.currentUser) {
            alert('Você precisa estar logado para registrar veículos.');
            console.warn('Registro negado: Usuário não autenticado.');
            return;
        }

        try {
            const veiculosCollectionRef = db.collection("veiculosHigienizados");

            const docRef = await veiculosCollectionRef.add({
                placa: placa,
                modelo: modelo,
                cor: cor,
                dataHigienizacao: data,
                dataRegistro: new Date(),
                userId: auth.currentUser.uid
            });

            console.log("Documento escrito com ID: ", docRef.id);
            alert("Informações do veículo registradas com sucesso!");

            // Limpar os campos do formulário após o registro
            placaInput.value = '';
            modeloInput.value = '';
            corInput.value = '';
            dataInput.value = '';

        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
            alert("Erro ao registrar o veículo. Tente novamente.");
        }
    });
}


// =============================================================
// NOVO: Adicionar TODOS os listeners e referências que dependem do DOM
// dentro de um DOMContentLoaded para garantir que os elementos HTML existam.
document.addEventListener('DOMContentLoaded', () => {

    // Chamada da função de registro de veículo (aqui ela será configurada)
    registrarVeiculoHigienizado();

    // Funcionamento da seção WorkLink (seus seletores e listeners)
    const registrarHigien = document.querySelector('.higienStart');
    const startHigien = document.getElementById('workStart');
    const esconderHud = document.querySelectorAll('.workLink');
    const backToWorkLinks = document.getElementById('backToWorkLinks');

    const consultarVeiculo = document.querySelector('#consult');
    const carConsult = document.querySelector('.carConsult');
    const backToWorkLinksConsult = document.querySelector('#backToWorkLinksConsult');

    startHigien.addEventListener('click', () => {
        registrarHigien.classList.remove('wOff');
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
    });

    backToWorkLinks.addEventListener('click', () => {
        registrarHigien.classList.add('wOff');
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
    });

    consultarVeiculo.addEventListener('click', () => {
        carConsult.classList.remove('carConsultOff');
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
    });

    backToWorkLinksConsult.addEventListener('click', () => {
        carConsult.classList.add('carConsultOff');
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
        // Limpar os resultados da consulta ao clicar em Voltar, se a div existir
        if (consultInfos) {
            consultInfos.innerHTML = '<p>Aguardando consulta da placa...</p>';
        }
        // Opcional: Limpar o input da placa ao voltar
        if (licensePlateInput) {
            licensePlateInput.value = '';
        }
    });

    //Lógica da seção de SubInfos  ===========
    const patioLink = document.querySelector('#patioLink')
    const patioDiv = document.querySelector('.patioDiv')
    const fecharPatioDiv = document.querySelector('#patioCloseButton')

    patioLink.addEventListener('click', () =>{
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
        patioDiv.classList.remove('patioDivOff')
    })

    fecharPatioDiv.addEventListener('click', () =>{
        patioDiv.classList.add('patioDivOff')
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
    })


    const removeCarWork = document.querySelector('.removeCarWork')
    const closeRemoveCarWork = document.querySelector('#closeRemoveCarWork')
    const removeCarLink = document.querySelector('#removeCar')
    
    removeCarLink.addEventListener('click', () =>{
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
        removeCarWork.classList.remove('removeCarWorkOff')
    })

    closeRemoveCarWork.addEventListener('click', () =>{
        removeCarWork.classList.add('removeCarWorkOff')
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
    })



    // =============================================================
    // LÓGICA DE CONSULTA DE VEÍCULOS (seus seletores e listeners)
    // ESTES ELEMENTOS SÃO GARANTIDOS DE EXISTIREM AQUI DENTRO DO DOMContentLoaded
    const licensePlateInput = document.getElementById('carPlacaConsult');
    const consultCarButton = document.getElementById('carConsultButton');
    const consultInfos = document.getElementById('consultInfos');

    // Verificar se os elementos foram encontrados (para ajudar no debug, caso os IDs no HTML estejam errados)
    if (!licensePlateInput) console.error("ERRO: Elemento 'carPlacaConsult' não encontrado! Verifique o ID no seu HTML.");
    if (!consultCarButton) console.error("ERRO: Elemento 'carConsultButton' não encontrado! Verifique o ID no seu HTML.");
    if (!consultInfos) console.error("ERRO: Elemento 'consultInfos' não encontrado! Verifique o ID no seu HTML.");


    consultCarButton.addEventListener('click', async () => {

        const licensePlate = licensePlateInput.value.trim().toUpperCase();

        // Limpa o conteúdo da div de informações a cada nova consulta e dá feedback
        consultInfos.innerHTML = '<p>Buscando dados...</p>';

        if (licensePlate.length === 7) {
            console.log(`Tentando consultar dados para a placa: ${licensePlate}`);

            if (!auth.currentUser) {
                console.warn('Consulta Firestore negada: Usuário não autenticado.');
                consultInfos.innerHTML = '<p style="color: red;">Erro: Você precisa estar logado para consultar veículos. Por favor, faça login.</p>';
                return;
            }

            try {
                const veiculosCollectionRef = db.collection("veiculosHigienizados");

                const querySnapshot = await veiculosCollectionRef
                                            .where('placa', '==', licensePlate)
                                            .get();

                if (querySnapshot.empty) {
                    console.log('Nenhum veículo higienizado encontrado com esta placa.');
                    consultInfos.innerHTML = '<p style="color: orange;">Placa não encontrada nos registros de higienização.</p>';
                } else {
                    let htmlContent = '<h3>Detalhes do Veículo Encontrado:</h3>';
                    querySnapshot.forEach((doc) => {
                        const dadosVeiculo = doc.data();
                        console.log(`Veículo encontrado: ${doc.id} => `, dadosVeiculo);

                        let dataFormatada = 'N/A';
                        if (dadosVeiculo.dataHigienizacao && typeof dadosVeiculo.dataHigienizacao.toDate === 'function') {
                            dataFormatada = dadosVeiculo.dataHigienizacao.toDate().toLocaleDateString('pt-BR');
                        } else if (dadosVeiculo.dataHigienizacao) {
                            try {
                                dataFormatada = new Date(dadosVeiculo.dataHigienizacao).toLocaleDateString('pt-BR');
                            } catch (e) {
                                dataFormatada = dadosVeiculo.dataHigienizacao;
                            }
                        }

                        htmlContent += `
                            <div style="border-bottom: 1px dashed #eee; padding-bottom: 10px; margin-bottom: 10px;">
                                <p><strong>Placa:</strong> ${dadosVeiculo.placa}</p>
                                <p><strong>Modelo:</strong> ${dadosVeiculo.modelo}</p>
                                <p><strong>Cor:</strong> ${dadosVeiculo.cor}</p>
                                <p><strong>Última Higienização:</strong> ${dataFormatada}</p>
                                <p><strong>Registrado por (UID):</strong> ${dadosVeiculo.userId || 'N/A'}</p>
                            </div>
                        `;
                    });
                    consultInfos.innerHTML = htmlContent;
                }
            } catch (error) {
                console.error("Erro ao consultar veículo no Firestore:", error);
                consultInfos.innerHTML = `<p style="color: red;">Erro ao consultar veículo: ${error.message}</p>`;
            }
        } else {
            consultInfos.innerHTML = '<p style="color: orange;">Por favor, digite uma placa válida com 7 caracteres (ex: ABC1234).</p>';
        }
    });

}); // FIM DO DOMContentLoaded principal
