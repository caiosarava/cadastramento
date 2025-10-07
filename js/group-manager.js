import { supabase } from './supabase.js';
import { showAlert } from './utils.js';

export class GroupManager {
    constructor() {
        this.members = [];
        this.user = null;
    }

    async initialize() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = 'login.html';
            return false;
        }
        this.user = user;
        return true;
    }

    async loadExistingGroup() {
        try {
            const { data: group } = await supabase
                .from('groups')
                .select('*')
                .eq('user_id', this.user.id)
                .maybeSingle();

            if (group) {
                const { data: members } = await supabase
                    .from('members')
                    .select('*')
                    .eq('group_id', group.id);

                this.members = members || [];
                return { group, members: this.members };
            }
            return null;
        } catch (error) {
            console.error('Error loading group:', error);
            showAlert('Erro ao carregar dados do grupo', 'error');
            return null;
        }
    }

    async saveGroup(groupData) {
        try {
            const { data: group, error } = await supabase
                .from('groups')
                .upsert({
                    ...groupData,
                    user_id: this.user.id,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return group;
        } catch (error) {
            console.error('Error saving group:', error);
            throw error;
        }
    }

    async saveMembers(groupId, members) {
        try {
            // Delete existing members
            await supabase
                .from('members')
                .delete()
                .eq('group_id', groupId);

            // Insert new members
            if (members.length > 0) {
                const { error } = await supabase
                    .from('members')
                    .insert(members.map(member => ({
                        ...member,
                        group_id: groupId
                    })));

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error saving members:', error);
            throw error;
        }
    }

    async saveGroupAndMembers(groupData, members) {
        try {
            const group = await this.saveGroup(groupData);
            await this.saveMembers(group.id, members);
            return group;
        } catch (error) {
            showAlert('Erro ao salvar dados do grupo', 'error');
            throw error;
        }
    }

    validateGroupData(groupData) {
        const requiredFields = [
            'group_name',
            'representative',
            'email',
            'phone',
            'city',
            'state'
        ];

        const missingFields = requiredFields.filter(field => !groupData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }

        return true;
    }

    validateMemberData(member) {
        const requiredFields = [
            'name',
            'cpf',
            'phone',
            'gender',
            'role'
        ];

        const missingFields = requiredFields.filter(field => !member[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando para membro ${member.name || ''}: ${missingFields.join(', ')}`);
        }

        return true;
    }
}