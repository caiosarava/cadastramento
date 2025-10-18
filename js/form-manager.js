import { formatCEP, formatCPF, formatPhone, showAlert } from './utils.js';
import { config } from './config.js';

export class FormManager {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.warn(`Form with id "${formId}" not found`);
        } else {
            this.setupFormMasks();
        }
    }

    setupFormMasks() {
        if (!this.form) return;

        const maskedInputs = {
            '[data-mask="cep"]': formatCEP,
            '[data-mask="cpf"]': formatCPF,
            '[data-mask="phone"]': formatPhone
        };

        Object.entries(maskedInputs).forEach(([selector, maskFn]) => {
            this.form.querySelectorAll(selector).forEach(input => {
                input.addEventListener('input', (e) => {
                    e.target.value = maskFn(e.target.value);
                });
            });
        });
    }

    populateSelects() {
        if (!this.form) return;

        Object.entries(config.options).forEach(([field, options]) => {
            const select = this.form.querySelector(`select[name="${field}"]`);
            if (select) {
                select.innerHTML = `
                    <option value="">Selecione...</option>
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                `;
            }
        });
    }

    getFormData() {
        if (!this.form) return {};

        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        return data;
    }

    validateForm(requiredFields) {
        const data = this.getFormData();
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            showAlert(`Campos obrigatórios faltando: ${missingFields.join(', ')}`, 'error');
            return false;
        }

        // Validate patterns
        for (const [field, pattern] of Object.entries(config.patterns)) {
            if (data[field] && !pattern.test(data[field])) {
                showAlert(`Campo ${field} com formato inválido`, 'error');
                return false;
            }
        }

        return data;
    }

    fillFormData(data) {
        if (!this.form) return;

        Object.entries(data).forEach(([key, value]) => {
            const field = this.form.elements[key];
            if (field) {
                field.value = value;
            }
        });
    }

    clearForm() {
        if (!this.form) return;
        this.form.reset();
    }

    /**
     * Valida um campo específico
     * @param {string} fieldId - ID do campo a validar
     * @param {object} options - Opções de validação
     * @returns {boolean} True se válido, false caso contrário
     */
    validateField(fieldId, options = {}) {
        const field = document.getElementById(fieldId);
        if (!field) return false;

        const value = field.value.trim();
        
        if (options.required && !value) {
            field.setCustomValidity(`O campo é obrigatório`);
            field.reportValidity();
            return false;
        }

        if (options.pattern && value && !options.pattern.test(value)) {
            field.setCustomValidity(`Formato inválido`);
            field.reportValidity();
            return false;
        }

        if (options.minLength && value.length < options.minLength) {
            field.setCustomValidity(`Mínimo de ${options.minLength} caracteres`);
            field.reportValidity();
            return false;
        }

        field.setCustomValidity('');
        return true;
    }

    /**
     * Adiciona validação em tempo real a um campo
     * @param {string} fieldId - ID do campo
     * @param {object} options - Opções de validação
     */
    addRealtimeValidation(fieldId, options = {}) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('blur', () => {
            this.validateField(fieldId, options);
        });

        field.addEventListener('input', () => {
            field.setCustomValidity('');
        });
    }
}