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
        'city',
        'state'
    ],

    // Member form required fields
    memberRequiredFields: [
        'name',
        'cpf',
        'phone',
        'gender',
        'role'
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
        gender: ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'],
        ethnicity: ['Branco', 'Pardo', 'Preto', 'Amarelo', 'Indígena', 'Prefiro não informar'],
        education: [
            'Fundamental Incompleto',
            'Fundamental Completo',
            'Médio Incompleto',
            'Médio Completo',
            'Superior Incompleto',
            'Superior Completo',
            'Pós-graduação'
        ],
        monthlyIncome: [
            'Até R$ 1.000',
            'R$ 1.001 a R$ 2.000',
            'R$ 2.001 a R$ 3.000',
            'R$ 3.001 a R$ 4.000',
            'R$ 4.001 a R$ 5.000',
            'Acima de R$ 5.000'
        ],
        role: [
            'Artesão(ã)',
            'Costureiro(a)',
            'Cozinheiro(a)',
            'Produtor(a) Rural',
            'Administrador(a)',
            'Vendedor(a)',
            'Outro'
        ]
    }
};