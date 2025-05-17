const supabase = window.supabase.createClient(
    "https://camoxubutyffdyfqsbaq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbW94dWJ1dHlmZmR5ZnFzYmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODQ3NTAsImV4cCI6MjA2MzA2MDc1MH0.GFWZXOMbhBy_DT_oE1LHwJ2YwHA6gMXs7nIK-KiH4GA"
);

async function login() {
    console.log("Tentando fazer login...");
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        document.getElementById("mensagem").innerText = "Preencha todos os campos!";
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
        document.getElementById("mensagem").innerText = "Erro: " + error.message;
    } else {
        document.getElementById("mensagem").innerText = "Login realizado com sucesso!";
        localStorage.setItem("usuarioEmail", email);
        setTimeout(() => {
            window.location.href = "inicio.html";
        }, 2000);
    }
}

async function cadastrar() {
    console.log("Tentando cadastrar...");
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
        document.getElementById("mensagem").innerText = "Preencha todos os campos!";
        return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password: senha });

    if (error) {
        document.getElementById("mensagem").innerText = "Erro: " + error.message;
    } else {
        document.getElementById("mensagem").innerText = "Cadastro realizado com sucesso!";
    }
}
