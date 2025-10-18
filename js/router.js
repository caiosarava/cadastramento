import { redirectIfNotLoggedIn, checkIfHasGroup } from './auth.js';
import { supabase } from './supabase.js';

/**
 * Verifica se o usuário está autenticado e redireciona adequadamente
 */
export async function checkUserAndRedirect() {
    const user = await redirectIfNotLoggedIn();
    if (user) {
        // Se o usuário estiver autenticado, verifica se tem grupo
        await checkIfHasGroup(user.id);
    }
}

/**
 * Verifica se o usuário tem um grupo cadastrado
 * @returns {Promise<object|null>} Retorna o grupo ou null
 */
export async function checkUserHasGroup() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            window.location.href = 'login.html';
            return null;
        }

        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (groupError) throw groupError;

        return group;
    } catch (error) {
        console.error('Erro ao verificar grupo:', error);
        return null;
    }
}

/**
 * Redireciona para a página de cadastro de grupo se não tiver grupo
 */
export async function ensureGroupExists() {
    const group = await checkUserHasGroup();
    
    if (!group) {
        window.location.href = 'cadastro-grupo.html';
        return null;
    }
    
    return group;
}

/**
 * Redireciona para a página apropriada baseado no estado do cadastro
 */
export async function redirectToAppropriateScreen() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            window.location.href = 'login.html';
            return;
        }

        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (groupError) throw groupError;

        if (!group) {
            // Não tem grupo, vai para cadastro do grupo
            window.location.href = 'cadastro-grupo.html';
        } else {
            // Tem grupo, verifica se tem membros
            const { data: members, error: membersError } = await supabase
                .from('members')
                .select('id')
                .eq('group_id', group.id)
                .limit(1);

            if (membersError) throw membersError;

            if (!members || members.length === 0) {
                // Tem grupo mas não tem membros, vai para cadastro de membros
                sessionStorage.setItem('currentGroupId', group.id);
                window.location.href = 'cadastro-membro.html';
            } else {
                // Tem grupo e membros, vai para visualização
                window.location.href = 'visualizacao.html';
            }
        }
    } catch (error) {
        console.error('Erro ao redirecionar:', error);
        window.location.href = 'login.html';
    }
}