// Script auxiliar para testar a conexão com Google Drive API
// Use este arquivo para debug se houver problemas na implementação

async function testGoogleDriveConnection() {
  console.log('🧪 Iniciando teste de conexão com Google Drive...');
  
  // 1. Verificar se as credenciais estão configuradas
  console.log('1️⃣  Verificando credenciais...');
  const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Deve estar no visualizacao.html
  const apiKey = 'YOUR_GOOGLE_API_KEY'; // Deve estar no visualizacao.html
  const folderId = 'YOUR_DRIVE_FOLDER_ID'; // Deve estar no visualizacao.html
  
  if (clientId === 'YOUR_GOOGLE_CLIENT_ID' || 
      apiKey === 'YOUR_GOOGLE_API_KEY' || 
      folderId === 'YOUR_DRIVE_FOLDER_ID') {
    console.error('❌ Credenciais não configuradas. Edite visualizacao.html');
    return false;
  }
  console.log('✅ Credenciais detectadas');
  
  // 2. Verificar se a Google API está carregada
  console.log('2️⃣  Verificando Google API...');
  if (typeof gapi === 'undefined') {
    console.error('❌ Google API não carregada');
    return false;
  }
  console.log('✅ Google API carregada');
  
  // 3. Verificar se Google Drive API está inicializada
  console.log('3️⃣  Verificando Google Drive API...');
  try {
    const response = await gapi.client.drive.files.list({
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1
    });
    console.log('✅ Google Drive API funcional');
  } catch (err) {
    console.error('❌ Erro ao acessar Google Drive API:', err);
    return false;
  }
  
  // 4. Verificar pasta
  console.log('4️⃣  Verificando pasta no Drive...');
  try {
    const response = await gapi.client.drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType'
    });
    if (response.result.mimeType === 'application/vnd.google-apps.folder') {
      console.log(`✅ Pasta encontrada: "${response.result.name}"`);
    } else {
      console.error('❌ ID não corresponde a uma pasta');
      return false;
    }
  } catch (err) {
    console.error('❌ Erro ao acessar pasta:', err);
    return false;
  }
  
  // 5. Verificar permissões
  console.log('5️⃣  Verificando permissões...');
  try {
    const response = await gapi.client.drive.files.get({
      fileId: folderId,
      fields: 'capabilities(canUploadFile)'
    });
    if (response.result.capabilities.canUploadFile) {
      console.log('✅ Permissões de upload OK');
    } else {
      console.error('❌ Sem permissão para fazer upload');
      return false;
    }
  } catch (err) {
    console.error('❌ Erro ao verificar permissões:', err);
    return false;
  }
  
  console.log('\n✅ TODOS OS TESTES PASSARAM! Sistema pronto para usar.');
  return true;
}

// Para usar este script:
// 1. Abra o console do navegador (F12)
// 2. Cole e execute este código:
//    testGoogleDriveConnection()

// Ou adicione em um <script> tag no HTML:
// <script>
//   // Aguardar carregamento da página
//   window.addEventListener('load', () => {
//     setTimeout(() => {
//       testGoogleDriveConnection();
//     }, 2000);
//   });
// </script>

/**
 * DICAS DE DEBUG
 * 
 * 1. Verificar se Google API está carregada:
 *    console.log(typeof gapi);
 * 
 * 2. Verificar token de autenticação:
 *    console.log(gapi.auth.getToken());
 * 
 * 3. Listar arquivos da pasta:
 *    gapi.client.drive.files.list({
 *      q: `'${folderId}' in parents`,
 *      spaces: 'drive',
 *      fields: 'files(id, name, createdTime, size)',
 *      pageSize: 10
 *    }).then(response => console.log(response.result.files));
 * 
 * 4. Verificar quota de uso:
 *    gapi.client.drive.about.get({
 *      fields: 'storageQuota'
 *    }).then(response => console.log(response.result.storageQuota));
 * 
 * 5. Ver erro de CORS:
 *    - Abra DevTools (F12)
 *    - Vá para Console
 *    - Procure por mensagens de erro com "CORS"
 *    - Adicione o domínio em Google Cloud Console → Credenciais
 */
