const form = document.getElementById("form");
const nome = document.getElementById("nome");
const sobrenome = document.getElementById("sobrenome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const cidade = document.getElementById("cidade");
const volume = document.getElementById("volume");
const politica = document.getElementById("politica");
const prodSim = document.getElementById("prodSim");
const prodNao = document.getElementById("prodNao");
const mensagem = document.getElementById("mensagem");
const msgUser = document.getElementById("msg-user")
const prodList = document.getElementById("list");

document.addEventListener("DOMContentLoaded", () => {
    // marca o type=radio 'prodSim' como checked por padrão
    prodSim.checked = true;

    // por padrão, mostra a lista de produtos e oculta a textarea ao carregar a página
    prodList.style.display = "block";
    mensagem.style.display = "none";
    msgUser.style.display = "none";
});

function atualizarCampos() {
    if (prodSim.checked) {
        prodList.style.display = "block";
        mensagem.style.display = "none";
        msgUser.style.display = "none";
    } else if (prodNao.checked) {
        prodList.style.display = "none";
        mensagem.style.display = "block";
        msgUser.style.display = "block";
    }
}

// listener change para mudanças nos type=radio, para permitir as opções condicionais
prodSim.addEventListener("change", atualizarCampos);
prodNao.addEventListener("change", atualizarCampos);

// listener para envio do formulário
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne envio padrão do formulário

    // check dos campos obrigatórios
    const todosCamposValidos = checaInputs();

    if (todosCamposValidos) {
        let formData = {
            nome: nome.value,
            sobrenome: sobrenome.value,
            email: email.value,
            telefone: telefone.value,
            cidade: cidade.value || '', 
            volume: volume.value,
            politica: politica.checked ? 'Aceito' : 'Não aceito'
        };

        // Adiciona dados específicos com base na escolha do usuário
        if (prodSim.checked) {
            const produtosSelecionados = capturaProd();
            formData.produtos = produtosSelecionados;
        } else if (prodNao.checked) {
            const mensagemText = mensagem.value.trim();
            if (mensagemText !== "") {
                formData.mensagem = mensagemText;
            }
        }

        // Envia os dados para a SheetDB via requisição fetch
        try {
            const response = await fetch('https://sheetdb.io/api/v1/w41amuoomerdc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = 'success.html'; // redireciona para a página de sucesso após envio de dados
            } else {
                ;
            }
        } catch (error) {
            console.error('Erro durante o envio dos dados:', error);
            alert("Ver console para mais detalhes do erro");
        }
    } else {
        alert("Por favor, verifique os campos e preencha-os corretamente.");
    }
});

// essa função captura os produtos selecionados no form e separa-os com vírgula
function capturaProd() {
    const checkboxes = document.querySelectorAll('.listaprodutos input[type="checkbox"]:checked');
    const produtosSelecionados = Array.from(checkboxes).map(checkbox => checkbox.value);
    return produtosSelecionados.join(', '); // para retornar os produtos separados por vírgulas
}

// validações dos campos
function checaInputs() {
    const valorNome = nome.value;
    const valorSobrenome = sobrenome.value;
    const valorEmail = email.value;
    const valorTelefone = telefone.value;
    const regexNumeros = /^\d+$/;

    let todosValidos = true;

    if(valorNome === ""){
        erroInput(nome, "Insira seu nome");
        todosValidos = false;
    }else{
        sucesso(nome);
    }

    if(valorSobrenome === ""){
        erroInput(sobrenome, "Insira seu sobrenome");
        todosValidos = false;
    }else{
        sucesso(sobrenome);
    }

    if(valorEmail === ""){
        erroInput(email, "Insira seu e-mail");
        todosValidos = false;
    }else{
        sucesso(email);
    }

    if(!regexNumeros.test(valorTelefone)){
        erroInput(telefone, "Insira um número com DDD");
        todosValidos = false;
    }else{
        sucesso(telefone);
    }

    if(!politica.checked) {
        erroInput(politica, "Você precisa concordar com a Política de Privacidade para continuar");
        todosValidos = false;
    }else{
        sucesso(politica);
    }

    return todosValidos;
}

// essa função exibe a mensagem de erro caso o usuário não preencha o campo
function erroInput(input, message){
    const formControl =  input.parentElement;
    const small = formControl.querySelector("small");

    small.innerText = message;

    formControl.className = "erro-form-content";
}

// essa função aplica o estilo de form-content caso o campo seja preenchido corretamente
function sucesso(input) {
    const formControl = input.parentElement;
  
    formControl.className = "form-content";
  }