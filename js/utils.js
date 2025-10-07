/**
 * Converte boolean para "Sim" ou "Não"
 * @param {boolean} value - O valor booleano
 * @returns {string} "Sim" para true, "Não" para false
 */
export function booleanToYesNo(value) {
    return value ? "Sim" : "Não";
}

/**
 * Converte "Sim" ou "Não" para boolean
 * @param {string} value - "Sim" ou "Não"
 * @returns {boolean} true para "Sim", false para "Não"
 */
export function yesNoToBoolean(value) {
    return value === "Sim";
}

/**
 * Formats a CEP string by adding hyphen
 * @param {string} value - The CEP to format
 * @returns {string} Formatted CEP
 */
export function formatCEP(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    return value;
}

/**
 * Formats a CPF string by adding dots and hyphen
 * @param {string} value - The CPF to format
 * @returns {string} Formatted CPF
 */
export function formatCPF(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
}

/**
 * Formats a phone number string by adding parentheses and hyphen
 * @param {string} value - The phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

/**
 * Displays a custom alert dialog
 * @param {string} message - The message to display
 * @param {string} type - The type of alert ('success', 'error', 'warning')
 * @param {number} duration - Duration in milliseconds to show the alert (0 for no auto-hide)
 */
export function showAlert(message, type = 'info', duration = 5000) {
    const alertEl = document.getElementById('custom-alert');
    if (!alertEl) return;

    const classes = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800'
    };

    alertEl.className = `p-4 rounded-lg ${classes[type]}`;
    alertEl.textContent = message;
    alertEl.classList.remove('hidden');

    if (duration > 0) {
        setTimeout(() => alertEl.classList.add('hidden'), duration);
    }
}

/**
 * Sets loading state on a button
 * @param {HTMLButtonElement} button - The button element
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} loadingText - Text to show while loading
 * @param {string} defaultText - Default button text
 */
export function setButtonLoading(button, isLoading, loadingText = 'Carregando...', defaultText = 'Salvar') {
    const spinner = button.querySelector('.loading-spinner');
    const textSpan = button.querySelector('.button-text');

    button.disabled = isLoading;
    
    if (isLoading) {
        spinner?.classList.remove('hidden');
        if (textSpan) textSpan.textContent = loadingText;
    } else {
        spinner?.classList.add('hidden');
        if (textSpan) textSpan.textContent = defaultText;
    }
}