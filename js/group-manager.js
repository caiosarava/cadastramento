import { supabase } from './supabase.js';
import { showAlert, booleanToYesNo, yesNoToBoolean } from './utils.js';

export class GroupManager {
    constructor() {
        this.members = [];
        this.user = null;
        this.currentGroupId = null;
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
                this.currentGroupId = group.id;
                
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

            console.log('Dados a serem salvos:', dataToSave);

            // Verifica se já existe um grupo
            const { data: existingGroup } = await supabase
                .from('groups')
                .select('id')
                .eq('user_id', this.user.id)
                .maybeSingle();

            let group;
            if (existingGroup) {
                // Atualiza grupo existente
                const { data, error } = await supabase
                    .from('groups')
                    .update(dataToSave)
                    .eq('id', existingGroup.id)
                    .select()
                    .single();

                if (error) throw error;
                group = data;
            } else {
                // Insere novo grupo
                const { data, error } = await supabase
                    .from('groups')
                    .insert([dataToSave])
                    .select()
                    .single();

                if (error) throw error;
                group = data;
            }

            this.currentGroupId = group.id;

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
            if (!groupId) {
                throw new Error('ID do grupo não fornecido');
            }

            // Delete existing members
            await supabase
                .from('members')
                .delete()
                .eq('group_id', groupId);

            // Insert new members
            if (members.length > 0) {
                const membersToInsert = members.map(member => ({
                    group_id: groupId,
                    member_name: member.member_name || member.name,
                    member_birth_date: member.member_birth_date || member.birthDate,
                    member_mothers_name: member.member_mothers_name || member.mothersName,
                    member_address: member.member_address || member.address,
                    member_cep: member.member_cep || member.cep,
                    member_phone: member.member_phone || member.phone,
                    member_email: member.member_email || member.email,
                    member_rg: member.member_rg || member.rg,
                    member_cpf: member.member_cpf || member.cpf,
                    member_cnpj: member.member_cnpj || member.cnpj,
                    member_education: member.member_education || member.education,
                    member_gender: member.member_gender || member.gender,
                    member_ethnicity: member.member_ethnicity || member.ethnicity,
                    member_household_size: member.member_household_size || member.householdSize,
                    member_role: member.member_role || member.memberRole,
                    member_products: member.member_products || member.memberProducts,
                    member_raw_materials: member.member_raw_materials || member.memberRawMaterials,
                    member_monthly_income: member.member_monthly_income || member.monthlyIncome,
                    member_solidarity_involvement: member.member_solidarity_involvement || member.solidarityInvolvement,
                    member_other_activity_toggle: member.member_other_activity_toggle || member.otherActivityToggle,
                    member_other_activity: member.member_other_activity || member.otherActivity,
                }));

                const { error } = await supabase
                    .from('members')
                    .insert(membersToInsert);

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
            'phone'
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

    getCurrentGroupId() {
        // Tenta primeiro do sessionStorage, depois da instância
        return sessionStorage.getItem('currentGroupId') || this.currentGroupId;
    }

    setCurrentGroupId(groupId) {
        this.currentGroupId = groupId;
        sessionStorage.setItem('currentGroupId', groupId);
    }

    clearCurrentGroupId() {
        this.currentGroupId = null;
        sessionStorage.removeItem('currentGroupId');
    }
}