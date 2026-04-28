import { redirectIfNotLoggedIn, checkIfHasGroup } from './auth.js';
import { supabase } from './supabase.js';

/**
 * Verifica se o usuÃ¡rio estÃ¡ autenticado e redireciona adequadamente
 */
export async function checkUserAndRedirect() {
    const user = await redirectIfNotLoggedIn();
    if (user) {
        // Se o usuÃ¡rio estiver autenticado, verifica se tem grupo
        await checkIfHasGroup(user.id);
    }
}

/**
 * Verifica se o usuÃ¡rio tem um grupo cadastrado
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
 * Redireciona para a pÃ¡gina de cadastro de grupo se nÃ£o tiver grupo
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
 * Redireciona para a pÃ¡gina apropriada baseado no estado do cadastro
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
            // NÃ£o tem grupo, vai para cadastro do grupo
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
                // Tem grupo mas nÃ£o tem membros, vai para cadastro de membros
                sessionStorage.setItem('currentGroupId', group.id);
                window.location.href = 'cadastro-membro.html';
            } else {
                // Tem grupo e membros, vai para visualizaÃ§Ã£o
                // Verifica se veio de redirecionamento de admin
                const isFromAdmin = sessionStorage.getItem('fromAdmin');
                
                if (isFromAdmin) {
                    // Veio de admin, vai para visualizaÃ§Ã£o com ediÃ§Ã£o independente da data
                    sessionStorage.removeItem('fromAdmin');
                    window.location.href = 'visualizacao.html';
                } else {
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
                }
            }
        }
    } catch (error) {
        console.error('Erro ao redirecionar:', error);
        window.location.href = 'login.html';
    }
}
