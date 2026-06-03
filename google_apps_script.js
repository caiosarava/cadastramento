/**
 * Google Apps Script para receber arquivos do formulário COMESOL e salvar no Google Drive.
 *
 * Instruções de Instalação:
 * 1. Acesse script.google.com com a conta cadastrocomesol@gmail.com
 * 2. Crie um "Novo projeto"
 * 3. Cole este código no editor (substituindo qualquer código existente)
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Selecione o tipo "App da Web"
 * 6. Em "Quem pode acessar", selecione "Qualquer pessoa" (isso permite que o formulário envie os arquivos)
 * 7. Clique em "Implantar" e autorize as permissões
 * 8. Copie o "URL do app da Web" e cole na constante GOOGLE_SCRIPT_URL no arquivo cadastro-grupo.html
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var base64Data = data.base64;
    var fileName = data.name;
    var contentType = data.type;

    // Decodifica o base64
    var decodedData = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedData, contentType, fileName);

    // Procura ou cria a pasta "Uploads COMESOL"
    var folderName = "Uploads COMESOL";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    // Salva o arquivo
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var response = {
      'status': 'success',
      'url': file.getUrl(),
      'name': fileName
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errorResponse = {
      'status': 'error',
      'message': error.toString()
    };

    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lida com requisições OPTIONS para CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
