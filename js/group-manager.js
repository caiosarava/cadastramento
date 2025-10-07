import { supabase } from './supabase.js';
import { showAlert, booleanToYesNo, yesNoToBoolean } from './utils.js';

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
                // Converte boolean para "Sim"/"Não" ao carregar
                const formattedGroup = {
                    ...group,
                    has_headquarters: booleanToYesNo(group.has_headquarters)
                };

                const { data: members } = await supabase
                    .from('members')
                    .select('*')
                    .eq('group_id', group.id);

                this.members = members || [];
                return { group: formattedGroup, members: this.members };
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
            // Certifica-se de que has_headquarters seja um boolean antes de salvar
            const has_headquarters = typeof groupData.has_headquarters === 'boolean' 
                ? groupData.has_headquarters 
                : groupData.has_headquarters === 'Sim';

            const dataToSave = {
                ...groupData,
                has_headquarters,
                user_id: this.user.id,
                updated_at: new Date().toISOString()
            };

            console.log('Dados a serem salvos:', dataToSave); // Para debug

            const { data: group, error } = await supabase
                .from('groups')
                .upsert(dataToSave)
                .select()
                .single();

            if (error) {
                console.error('Erro do Supabase:', error); // Para debug
                throw error;
            }

            // Converte o boolean de volta para "Sim"/"Não" para exibição
            return {
                ...group,
                has_headquarters: group.has_headquarters ? "Sim" : "Não"
            };
        } catch (error) {
            console.error('Erro ao salvar grupo:', error);
            throw new Error(`Erro ao salvar grupo: ${error.message}`);
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