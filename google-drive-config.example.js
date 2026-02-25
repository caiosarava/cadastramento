// Arquivo de exemplo de configuração das credenciais do Google Drive
// Copie este arquivo para google-drive-config.js e preencha com suas credenciais

export const GOOGLE_DRIVE_CONFIG = {
  // Client ID obtido do Google Cloud Console
  // Formato: 123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
  CLIENT_ID: 'SEU_CLIENT_ID_AQUI',

  // API Key obtida do Google Cloud Console
  // Esta chave é pública e pode ser usada no frontend
  API_KEY: 'SUA_API_KEY_AQUI',

  // ID da pasta no Google Drive onde os arquivos serão salvos
  // Para obter este ID:
  // 1. Abra a pasta no Google Drive
  // 2. Copie o ID da URL entre "/folders/" e "/view" ou no final da URL
  // Formato: 1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P
  DRIVE_FOLDER_ID: 'ID_DA_PASTA_AQUI',

  // Escopos de permissão necessários
  SCOPES: [
    'https://www.googleapis.com/auth/drive.file', // Acesso a arquivos criados pela app
    'https://www.googleapis.com/auth/drive.appdata' // Acesso a dados da app
  ],

  // Configurações opcionais
  UPLOAD_SETTINGS: {
    maxFileSize: 25 * 1024 * 1024, // 25MB em bytes
    acceptedMimetypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    acceptedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
  }
};

/**
 * INSTRUÇÕES DE CONFIGURAÇÃO
 * 
 * 1. Acesse https://console.cloud.google.com/
 * 2. Crie ou selecione um projeto
 * 3. Ative a Google Drive API
 * 4. Vá para "Credenciais"
 * 5. Crie uma credencial OAuth 2.0 do tipo "Aplicação web"
 * 6. Adicione como URIs autorizadas de redirecionamento:
 *    - http://localhost:5000
 *    - http://localhost:3000
 *    - https://seu-dominio.com (seu domínio em produção)
 * 7. Crie uma Chave de API
 * 8. Copie os valores para este arquivo
 * 
 * OBTENDO O ID DA PASTA:
 * 1. Acesse Google Drive
 * 2. Crie ou abra a pasta desejada
 * 3. Na barra de endereço, copie o ID entre "/folders/" e fim da URL
 *    Exemplo: https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J1K2L => ID é 1A2B3C4D5E6F7G8H9I0J1K2L
 */
