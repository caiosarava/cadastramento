export const SUPABASE_URL = 'https://egarccprmvgqsvivnerc.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYXJjY3BybXZncXN2aXZuZXJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NTQ1OSwiZXhwIjoyMDc0NzQxNDU5fQ.CIZo0X0ua2teiR4zfUJnSA1WfOP_HFzDZPA0dBjsGtY';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.4/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkAuthState = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const redirectBasedOnAuth = async () => {
    const user = await checkAuthState();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
};