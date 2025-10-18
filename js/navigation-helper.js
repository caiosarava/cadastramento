import { supabase } from './supabase.js';
import { config } from './config.js';

/**
 * Helper class para gerenciar navegação entre páginas
 */
export class NavigationHelper {
    
    /**
     * Verifica autenticação e retorna usuário
     */
    static async checkAuth() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) throw error;
            
            if (!user) {
                window.location.href = config.routes.login;
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            window.location.href = config.routes.login;
            return null;
        }
    }

    /**
     * Busca o grupo do usuário atual
     */
    static async fetchUserGroup(userId) {
        try {
            const { data: group, error } = await supabase
                .from('groups')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
            
            if (error) throw error;
            
            return group;
        } catch (error) {
            console.error('Erro ao buscar grupo:', error);
            return null;
        }
    }

    /**
     * Busca os membros de um grupo
     */
    static async fetchGroupMembers(groupId) {
        try {
            const { data: members, error } = await supabase
                .from('members')
                .select('*')
                .eq('group_id', groupId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            
            return members || [];
        } catch (error) {
            console.error('Erro ao buscar membros:', error);
            return [];
        }
    }

    /**
     * Redireciona para a página de cadastro do grupo
     */
    static goToGroupForm() {
        window.location.href = config.routes.groupForm;
    }

    /**
     * Redireciona para a página de cadastro de membros
     */
    static goToMemberForm(groupId = null) {
        if (groupId) {
            sessionStorage.setItem(config.storageKeys.currentGroupId, groupId);
        }
        window.location.href = config.routes.memberForm;
    }

    /**
     * Redireciona para a página de visualização
     */
    static goToVisualization() {
        window.location.href = config.routes.visualization;
    }

    /**
     * Redireciona para o login
     */
    static goToLogin() {
        window.location.href = config.routes.login;
    }

    /**
     * Realiza logout e redireciona
     */
    static async logout() {
        try {
            await supabase.auth.signOut();
            sessionStorage.clear();
            this.goToLogin();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, limpa e redireciona
            sessionStorage.clear();
            this.goToLogin();
        }
    }

    /**
     * Verifica o estado do cadastro e redireciona apropriadamente
     */
    static async checkAndRedirect() {
        const user = await this.checkAuth();
        if (!user) return;

        const group = await this.fetchUserGroup(user.id);

        if (!group) {
            // Não tem grupo, vai para cadastro do grupo
            this.goToGroupForm();
            return;
        }

        const members = await this.fetchGroupMembers(group.id);

        if (members.length === 0) {
            // Tem grupo mas não tem membros
            this.goToMemberForm(group.id);
            return;
        }

        // Tem grupo e membros, vai para visualização
        this.goToVisualization();
    }

    /**
     * Obtém o ID do grupo atual do sessionStorage
     */
    static getCurrentGroupId() {
        return sessionStorage.getItem(config.storageKeys.currentGroupId);
    }

    /**
     * Define o ID do grupo atual no sessionStorage
     */
    static setCurrentGroupId(groupId) {
        sessionStorage.setItem(config.storageKeys.currentGroupId, groupId);
    }

    /**
     * Remove o ID do grupo do sessionStorage
     */
    static clearCurrentGroupId() {
        sessionStorage.removeItem(config.storageKeys.currentGroupId);
    }

    /**
     * Verifica se está na página correta baseado no estado do cadastro
     * @param {string} expectedPage - Página esperada ('group', 'member', 'view')
     */
    static async ensureCorrectPage(expectedPage) {
        const user = await this.checkAuth();
        if (!user) return false;

        const group = await this.fetchUserGroup(user.id);

        switch (expectedPage) {
            case 'group':
                // Página de cadastro do grupo - pode acessar sempre
                return true;

            case 'member':
                // Página de cadastro de membros - precisa ter grupo
                if (!group) {
                    this.goToGroupForm();
                    return false;
                }
                this.setCurrentGroupId(group.id);
                return true;

            case 'view':
                // Página de visualização - precisa ter grupo e membros
                if (!group) {
                    this.goToGroupForm();
                    return false;
                }
                
                const members = await this.fetchGroupMembers(group.id);
                if (members.length === 0) {
                    this.goToMemberForm(group.id);
                    return false;
                }
                return true;

            default:
                return true;
        }
    }

    /**
     * Configura o botão de logout em uma página
     */
    static setupLogoutButton(buttonId = 'logoutButton') {
        const logoutButton = document.getElementById(buttonId);
        if (logoutButton) {
            logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
    }

    /**
     * Exibe loading em um botão
     */
    static setButtonLoading(buttonId, isLoading, loadingText = 'Carregando...') {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const originalHTML = button.getAttribute('data-original-html') || button.innerHTML;
        
        if (isLoading) {
            button.setAttribute('data-original-html', originalHTML);
            button.disabled = true;
            button.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${loadingText}
            `;
        } else {
            button.disabled = false;
            button.innerHTML = originalHTML;
            button.removeAttribute('data-original-html');
        }
    }

    /**
     * Exibe uma mensagem de status
     */
    static showStatus(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        element.textContent = `${icons[type] || ''} ${message}`;
        
        const colors = {
            success: 'text-green-600',
            error: 'text-red-600',
            warning: 'text-yellow-600',
            info: 'text-gray-600'
        };

        element.className = `text-sm ${colors[type] || colors.info}`;
    }
}

/**
 * Funções auxiliares para máscaras de input
 */
export const InputMasks = {
    /**
     * Aplica máscara de CEP
     */
    cep: (value) => {
        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{5})(\d)/, "$1-$2");
        return value.substring(0, 9);
    },

    /**
     * Aplica máscara de CPF
     */
    cpf: (value) => {
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value.substring(0, 14);
    },

    /**
     * Aplica máscara de telefone
     */
    phone: (value) => {
        value = value.replace(/\D/g, "");
        
        if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        
        if (value.length > 10 && value.length <= 15) {
            value = value.replace(/(\d{4,5})(\d)/, "$1-$2");
        } else if (value.length > 9) {
            value = value.replace(/(\d{4})(\d)/, "$1-$2");
        }

        return value.substring(0, 15);
    },

    /**
     * Configura máscaras em inputs
     */
    setup: (inputId, maskType) => {
        const input = document.getElementById(inputId);
        if (!input) return;

        const maskFn = InputMasks[maskType];
        if (!maskFn) return;

        input.addEventListener('input', (e) => {
            e.target.value = maskFn(e.target.value);
        });
    }
};