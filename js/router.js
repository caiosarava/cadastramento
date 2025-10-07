import { supabase } from './supabase.js';

export async function checkUserAndRedirect() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const { data: group } = await supabase
            .from('groups')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        window.location.href = group ? 'visualizacao.html' : 'cadastro.html';
    } catch (error) {
        console.error('Error during routing:', error);
        window.location.href = 'login.html';
    }
}