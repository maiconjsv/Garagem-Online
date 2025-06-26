const openLoginArea = document.getElementById('openLoginAreaId')
const loginArea = document.querySelector('.loginArea')
const fecharLogin = document.querySelector('#fecharLogin')

//Abrir área de login
openLoginArea.addEventListener('click', () => {
    loginArea.classList.toggle('loginAreaOpen')
})

//Fechar área de login
fecharLogin.addEventListener('click', () =>{
    loginArea.classList.remove('loginAreaOpen')
})
