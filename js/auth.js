import { supabase } from './supabase.js';

let currentMode = 'login';
const elements = {
    authForm: document.getElementById('authForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    authButton: document.getElementById('authButton'),
    toggleModeButton: document.getElementById('toggleModeButton'),
    formTitle: document.getElementById('formTitle'),
    statusMessage: document.getElementById('statusMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    buttonText: document.getElementById('buttonText')
};

function displayStatus(message, className, duration = 0) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `p-3 mb-4 rounded-lg text-sm text-center ${className}`;
    elements.statusMessage.classList.remove('hidden');
    if (duration > 0) setTimeout(() => elements.statusMessage.classList.add('hidden'), duration);
}

function setLoading(isLoading) {
    elements.authButton.disabled = isLoading;
    if (isLoading) {
        elements.buttonText.textContent = currentMode === 'login' ? 'Entrando...' : 'Cadastrando...';
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.buttonText.textContent = currentMode === 'login' ? 'Entrar' : 'Cadastrar Novo Grupo';
        elements.loadingSpinner.classList.add('hidden');
    }
}

function toggleAuthMode() {
    currentMode = currentMode === 'login' ? 'signup' : 'login';
    elements.formTitle.textContent = currentMode === 'login' ? 'Login' : 'Cadastro de Acesso';
    elements.buttonText.textContent = currentMode === 'login' ? 'Entrar' : 'Cadastrar Novo Grupo';
    elements.toggleModeButton.textContent = currentMode === 'login'
        ? 'Ainda nÃ£o tem acesso? Cadastrar Novo Grupo'
        : 'JÃ¡ tem acesso? Fazer Login';
}

async function checkIfHasGroup(userId) {
    try {
        const { data: groupData, error } = await supabase
            .from('groups')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        if (groupData) {
            // Se jÃ¡ tem um grupo cadastrado, vai para visualizaÃ§Ã£o
            // Verifica se o perÃ­odo de ediÃ§Ã£o ainda estÃ¡ ativo
            const now = new Date();
            const startDate = new Date('2026-07-01T00:00:00');
            const endDate = new Date('2026-07-31T23:59:59');
            
            if (now < startDate || now > endDate) {
                // PerÃ­odo de ediÃ§Ã£o encerrado, vai para visualizaÃ§Ã£o sem ediÃ§Ã£o
                window.location.href = 'visualizacao_sem_edicao.html';
            } else {
                // Ainda estÃ¡ no perÃ­odo de ediÃ§Ã£o, vai para visualizaÃ§Ã£o com ediÃ§Ã£o
                window.location.href = 'visualizacao.html';
            }
        } else {
            // Se nÃ£o tem grupo, vai para o cadastro do grupo
            window.location.href = 'cadastro-grupo.html';
        }
    } catch (err) {
        console.error('Erro ao verificar grupo:', err);
        displayStatus(`Erro ao verificar dados: ${err.message}`, 'bg-red-100 text-red-700');
    }
}

async function handleAuth(e) {
    e.preventDefault();

    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value.trim();

    if (!email || !password) {
        displayStatus('Preencha email e senha.', 'bg-yellow-100 text-yellow-700', 3000);
        return;
    }

    setLoading(true);

    try {
        let response;
        if (currentMode === 'signup') {
            response = await supabase.auth.signUp({ email, password });
        } else {
            response = await supabase.auth.signInWithPassword({ email, password });
        }

        const { data, error } = response;
        if (error) throw error;

        if (data.user) {
            checkIfHasGroup(data.user.id);
        } else {
            displayStatus('Verifique seu email para confirmar o cadastro.', 'bg-blue-100 text-blue-700', 5000);
            setLoading(false);
        }
    } catch (error) {
        console.error("Erro de AutenticaÃ§Ã£o:", error.message);
        displayStatus(`âŒ Erro: ${error.message}`, 'bg-red-100 text-red-700', 5000);
        setLoading(false);
    }
}

async function redirectIfNotLoggedIn() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (!user) {
            window.location.href = 'login.html';
            return null;
        }

        return user;
    } catch (err) {
        console.error('Erro ao verificar autenticaÃ§Ã£o:', err);
        displayStatus(`Erro ao verificar autenticaÃ§Ã£o: ${err.message}`, 'bg-red-100 text-red-700');
        window.location.href = 'login.html';
        return null;
    }
}

// Event Listeners
if (elements.authForm) {
    elements.authForm.addEventListener('submit', handleAuth);
}
if (elements.toggleModeButton) {
    elements.toggleModeButton.addEventListener('click', toggleAuthMode);
}

// Export functions
export { redirectIfNotLoggedIn, checkIfHasGroup };
