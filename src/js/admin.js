// --- SEU CÓDIGO EXISTENTE INÍCIO ---
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

    // --- NOVO: CAPTURA DE REFERÊNCIAS PARA A SEÇÃO DE SAÍDA DE VEÍCULOS ---
    // Essas variáveis precisam ser definidas AQUI dentro do DOMContentLoaded
    // para que o listener do registrarSaidaButton as "enxergue".
    const placaSaidaInput = document.getElementById("placaSaida");
    const motivoSaidaInput = document.getElementById("motivoSaida"); // Renomeado para clareza
    const registrarSaidaButton = document.getElementById("registrarSaida");
    const removeCarWorkDiv = document.getElementById("removeCarWorkId");


    // Chamada da função de registro de veículo 

    // Funcionamento da seção WorkLink (seletores e listeners)
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
        //  Limpar o input da placa ao voltar
        if (licensePlateInput) {
            licensePlateInput.value = '';
        }
    });

    //Lógica da seção de SubInfos  ===========
    const patioLink = document.querySelector('#patioLink')
    const patioDiv = document.querySelector('.patioDiv')
    const fecharPatioDiv = document.querySelector('#patioCloseButton')

    patioLink.addEventListener('click', () => {
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
        patioDiv.classList.remove('patioDivOff')
    })

    fecharPatioDiv.addEventListener('click', () => {
        patioDiv.classList.add('patioDivOff')
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
    })


    const removeCarWork = document.querySelector('.removeCarWork')
    const closeRemoveCarWork = document.querySelector('#closeRemoveCarWork')
    const removeCarLink = document.querySelector('#removeCar')

    removeCarLink.addEventListener('click', () => {
        esconderHud.forEach(div => div.classList.add('workLinkOff'));
        removeCarWork.classList.remove('removeCarWorkOff')
    })

    // Listener para o botão de "Voltar" da tela de saída
    closeRemoveCarWork.addEventListener('click', () => {
        removeCarWork.classList.add('removeCarWorkOff')
        esconderHud.forEach(div => div.classList.remove('workLinkOff'));
        // Adicionado: Limpar os campos ao fechar a tela de saída
        if (placaSaidaInput) placaSaidaInput.value = '';
        if (motivoSaidaInput) motivoSaidaInput.value = '';
    })


    // --- NOVO: LÓGICA DE REGISTRAR SAÍDA DE VEÍCULOS (MOVEU PARA CÁ!) ---
    // Este listener AGORA tem acesso a placaSaidaInput, motivoSaidaInput, registrarSaidaButton, removeCarWorkDiv
    registrarSaidaButton.addEventListener("click", async () => {
        const placaDigitada = placaSaidaInput.value.trim().toUpperCase();
        const motivoSaida = motivoSaidaInput.value.trim(); // Usa a variável corrigida

        if (!placaDigitada) {
            alert("Por favor, digite a placa do veículo para registrar a saída.");
            return;
        }

        if (!motivoSaida) {
            alert("Por favor, digite o motivo da saída do veículo.");
            return;
        }

        // Confirmação para o usuário
        const confirmarSaida = confirm(`Tem certeza que deseja registrar a saída do veículo de placa "${placaDigitada}"?`);
        if (!confirmarSaida) {
            return; // Usuário cancelou
        }

        // Verificar se o usuário está autenticado antes de prosseguir
        if (!auth.currentUser) {
            alert('Você precisa estar logado para registrar a saída de veículos.');
            console.warn('Operação negada: Usuário não autenticado.');
            return;
        }

        try {
            const veiculosCollectionRef = db.collection("veiculosHigienizados");

            const querySnapshot = await veiculosCollectionRef.where("placa", "==", placaDigitada).get();

            if (querySnapshot.empty) {
                alert(`Veículo com a placa "${placaDigitada}" não encontrado nos registros de higienização.`);
                console.warn(`Tentativa de registrar saída de veículo não existente: ${placaDigitada}`);
            } else {
                querySnapshot.forEach(async (documentoVeiculo) => {
                    const documentId = documentoVeiculo.id;
                    const docRef = veiculosCollectionRef.doc(documentId);

                    await docRef.update({
                        status: "saida_patio",
                        dataSaida: new Date(),
                        motivoSaida: motivoSaida,
                        registradoPorSaida: auth.currentUser.uid
                    });

                    alert(`Saída do veículo de placa "${placaDigitada}" registrada com sucesso!`);
                    console.log(`Documento do veículo ${placaDigitada} (ID: ${documentId}) atualizado para 'saída_patio'.`);

                    // Limpar os campos e fechar a div após sucesso
                    placaSaidaInput.value = '';
                    motivoSaidaInput.value = '';
                    removeCarWorkDiv.classList.add("removeCarWorkOff");
                    // Opcional: Voltar os outros elementos para o estado original (se necessário)
                    esconderHud.forEach(div => div.classList.remove('workLinkOff'));
                });
            }

        } catch (error) {
            console.error("Erro ao registrar saída do veículo:", error);
            alert(`Ocorreu um erro ao registrar a saída: ${error.message}. Verifique o console para mais detalhes.`);

            if (error.code === 'permission-denied') {
                alert("Erro de permissão: Você não tem autorização para registrar a saída. Verifique se está logado.");
            }
        }
    });

    // =============================================================
    // LÓGICA DE CONSULTA DE VEÍCULOS 
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

                        let dataFormatadaHigienizacao = 'N/A';
                        if (dadosVeiculo.dataHigienizacao && typeof dadosVeiculo.dataHigienizacao.toDate === 'function') {
                            dataFormatadaHigienizacao = dadosVeiculo.dataHigienizacao.toDate().toLocaleDateString('pt-BR');
                        } else if (dadosVeiculo.dataHigienizacao) {
                            try {
                                dataFormatadaHigienizacao = new Date(dadosVeiculo.dataHigienizacao).toLocaleDateString('pt-BR');
                            } catch (e) {
                                dataFormatadaHigienizacao = dadosVeiculo.dataHigienizacao;
                            }
                        }

                        // --- NOVO: LÓGICA PARA EXIBIR O STATUS DE SAÍDA ---
                        let statusVeiculo = dadosVeiculo.status || 'no_patio'; // Assume 'no_patio' se não houver status
                        let infoSaida = '';

                        if (statusVeiculo === 'saida_patio') {
                            let dataSaidaFormatada = 'N/A';
                            // Verifica se dataSaida é um Timestamp do Firebase ou uma string/data normal
                            if (dadosVeiculo.dataSaida && typeof dadosVeiculo.dataSaida.toDate === 'function') {
                                dataSaidaFormatada = dadosVeiculo.dataSaida.toDate().toLocaleDateString('pt-BR') + ' às ' + dadosVeiculo.dataSaida.toDate().toLocaleTimeString('pt-BR');
                            } else if (dadosVeiculo.dataSaida) {
                                try {
                                    // Tenta converter para Date caso seja uma string de data
                                    dataSaidaFormatada = new Date(dadosVeiculo.dataSaida).toLocaleDateString('pt-BR') + ' às ' + new Date(dadosVeiculo.dataSaida).toLocaleTimeString('pt-BR');
                                } catch (e) {
                                    // Se não for uma data válida, exibe como está
                                    dataSaidaFormatada = dadosVeiculo.dataSaida;
                                }
                            }
                            infoSaida = `<p style="color: red; font-weight: bold;">STATUS: SAÍDA DO PÁTIO</p>
                                         <p><strong>Data da Saída:</strong> ${dataSaidaFormatada}</p>

                                         <p><strong>Motivo da Saída:</strong> ${dadosVeiculo.motivoSaida || 'N/A'}</p>
                                         <p><strong>Registrado por (Saída):</strong> ${dadosVeiculo.registradoPorSaida || 'N/A'}</p>`;
                        } else {
                            infoSaida = `<p style="color: green; font-weight: bold;">STATUS: NO PÁTIO</p>`;
                        }
                        // --- FIM DA LÓGICA DE EXIBIÇÃO DE STATUS ---


                        htmlContent += `
                            <div style="border-bottom: 1px dashed #eee; padding-bottom: 10px; margin-bottom: 10px;">
                                <p><strong>Placa:</strong> ${dadosVeiculo.placa}</p>
                                <p><strong>Modelo:</strong> ${dadosVeiculo.modelo}</p>
                                <p><strong>Cor:</strong> ${dadosVeiculo.cor}</p>
                                <p><strong>Última Higienização:</strong> ${dataFormatadaHigienizacao}</p>
                                <p><strong>Registrado por (Higienização):</strong> ${dadosVeiculo.userId || 'N/A'}</p>
                                ${infoSaida} <!-- Insere as informações de status aqui -->
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
