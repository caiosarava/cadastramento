/**
 * Configuration for form validation and data structures
 */
export const config = {
    // Group form required fields
    groupRequiredFields: [
        'group_name',
        'representative',
        'email',
        'phone',
        'has_headquarters'
    ],

    // Member form required fields
    memberRequiredFields: [
        'member_name',
        'member_birth_date',
        'member_mothers_name',
        'member_address',
        'member_cep',
        'member_phone',
        'member_email',
        'member_rg',
        'member_cpf',
        'member_gender',
        'member_ethnicity',
        'member_education',
        'member_household_size',
        'member_role',
        'member_products',
        'member_raw_materials',
        'member_monthly_income',
        'member_solidarity_involvement',
        'member_other_activity_toggle'
    ],

    // Validation patterns
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\(\d{2}\) \d{4,5}-\d{4}$/,
        cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        cep: /^\d{5}-\d{3}$/
    },

    // Form options
    options: {
        gender: [
            'Mulher cisgênero',
            'Homem cisgênero',
            'Mulher transgênero',
            'Homem transgênero',
            'Não-Binário',
            'Outro'
        ],
        ethnicity: [
            'Branca',
            'Preta',
            'Parda',
            'Amarela',
            'Indígena'
        ],
        education: [
            'Analfabeto',
            'Ensino Fundamental Incompleto',
            'Ensino Fundamental Completo',
            'Ensino Médio Incompleto',
            'Ensino Médio Completo',
            'Ensino Superior Incompleto',
            'Ensino Superior Completo',
            'Pós-graduação/Mestrado/Doutorado'
        ],
        monthlyIncome: [
            'Ate 1 SM',
            'Mais de 1 SM ate 2 SM',
            'Mais de 2 SM ate 3 SM',
            'Mais de 3 SM ate 5 SM',
            'Acima de 5 SM'
        ],
        role: [
            'Coordenador(a)',
            'Produção',
            'Financeiro',
            'Vendas',
            'Artesão(ã)',
            'Costureiro(a)',
            'Cozinheiro(a)',
            'Produtor(a) Rural',
            'Administrador(a)',
            'Outro'
        ],
        yesNo: ['Sim', 'Não']
    },

    // Session storage keys
    storageKeys: {
        currentGroupId: 'currentGroupId',
        tempMemberData: 'tempMemberData'
    },

    // Page routes
    routes: {
        login: 'login.html',
        groupForm: 'cadastro-grupo.html',
        memberForm: 'cadastro-membro.html',
        visualization: 'visualizacao.html',
        index: 'index.html'
    }
};