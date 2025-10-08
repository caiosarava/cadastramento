import { redirectIfNotLoggedIn, checkIfHasGroup } from './auth.js';

export async function checkUserAndRedirect() {
    const user = await redirectIfNotLoggedIn();
    if (user) {
        // Se o usuário estiver autenticado, verifica se tem grupo
        await checkIfHasGroup(user.id);
    }
}