import { formatCEP, formatCPF, formatPhone, showAlert } from './utils.js';
import { config } from './config.js';

export class FormManager {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.setupFormMasks();
    }

    setupFormMasks() {
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
        Object.entries(data).forEach(([key, value]) => {
            const field = this.form.elements[key];
            if (field) {
                field.value = value;
            }
        });
    }

    clearForm() {
        this.form.reset();
    }
}