const supabase = window.supabase.createClient(
    "https://camoxubutyffdyfqsbaq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbW94dWJ1dHlmZmR5ZnFzYmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODQ3NTAsImV4cCI6MjA2MzA2MDc1MH0.GFWZXOMbhBy_DT_oE1LHwJ2YwHA6gMXs7nIK-KiH4GA"
);

async function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        document.getElementById("mensagem").innerText = "Preencha todos os campos!";
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
        document.getElementById("mensagem").innerText = "Erro: " + error.message;
    } else if (data?.user) {
        localStorage.setItem("usuarioEmail", email);
        document.getElementById("mensagem").innerText = "Login realizado com sucesso!";
        setTimeout(() => window.location.href = "inicio.html", 2000);
    } else {
        document.getElementById("mensagem").innerText = "Falha no login.";
    }
}

async function cadastrar() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        document.getElementById("mensagem").innerText = "Preencha todos os campos!";
        return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password: senha });

    if (error) {
        document.getElementById("mensagem").innerText = "Erro: " + error.message;
    } else if (data?.user) {
        document.getElementById("mensagem").innerText = "Cadastro realizado com sucesso! Verifique seu email.";
    } else {
        document.getElementById("mensagem").innerText = "Falha no cadastro.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("inicio.html")) {
        carregarTarefas();
    }
});

async function adicionarTarefa() {
    const descricao = document.getElementById("novaTarefa").value.trim();
    const usuario = localStorage.getItem("usuarioEmail");

    if (!descricao || !usuario) return;

    const { error } = await supabase
        .from("tarefas")
        .insert([{ usuario, descricao, concluida: false }]);

    if (!error) {
        document.getElementById("novaTarefa").value = "";
        carregarTarefas();
    }
}

async function carregarTarefas() {
    const usuario = localStorage.getItem("usuarioEmail");
    const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .eq("usuario", usuario)
        .order("criado_em", { ascending: false });

    const lista = document.getElementById("listaTarefas");
    lista.innerHTML = "";

    if (error) return;

    if (data) {
        data.forEach(tarefa => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = tarefa.concluida;
            checkbox.dataset.id = tarefa.id;
            checkbox.onchange = () => marcarComoConcluida(tarefa.id, checkbox.checked);

            const texto = document.createElement("span");
            texto.textContent = tarefa.descricao;
            if (tarefa.concluida) texto.classList.add("concluida");

            li.appendChild(checkbox);
            li.appendChild(texto);
            lista.appendChild(li);
        });
    }
}

async function marcarComoConcluida(id, novoStatus) {
    const { error } = await supabase
        .from("tarefas")
        .update({ concluida: novoStatus })
        .eq("id", id);

    if (error) {
        console.error("Erro ao marcar tarefa:", error);
        alert("Erro ao atualizar a tarefa. Tente novamente.");
        carregarTarefas();
        return;
    }

    const lista = document.getElementById("listaTarefas");
    const itens = lista.getElementsByTagName("li");
    for (let li of itens) {
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (!checkbox) continue;
        if (checkbox.dataset.id == id) {
            const texto = li.querySelector("span");
            if (novoStatus) {
                texto.classList.add("concluida");
            } else {
                texto.classList.remove("concluida");
            }
            break;
        }
    }
}

function sair() {
    localStorage.removeItem("usuarioEmail");
    window.location.href = "index.html";
}
