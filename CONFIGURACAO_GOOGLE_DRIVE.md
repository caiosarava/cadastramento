# Configuração para Upload de Arquivos no Google Drive

## Passos Necessários

### 1. Configurar o Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as APIs:
   - Google Drive API
   - Google Sheets API (opcional)

4. Crie uma credencial OAuth 2.0:
   - Vá para "Credenciais" no menu esquerdo
   - Clique em "Criar credencial" → "Credencial OAuth 2.0"
   - Tipo: "Aplicativo web"
   - URIs autorizadas de redirecionamento: `http://localhost:3000`, `https://seu-dominio.com`
   - Salve o **Client ID** e **Client Secret**

5. Crie uma chave de API:
   - Clique em "Criar credencial" → "Chave de API"
   - Restrinja para Google Drive API
   - Salve a **API Key**

### 2. Criar Pasta no Google Drive

1. Faça login em [Google Drive](https://drive.google.com) com a conta `cadastrocomesol@gmail.com`
2. Crie uma nova pasta chamada "Documentos Cadastramento COMESOL"
3. Copie o **ID da pasta** da URL (entre `/folders/` e `/`)
4. Compartilhe a pasta com a conta de serviço (se usada)

### 3. Atualizar as Credenciais no HTML

No arquivo `visualizacao.html`, atualize as seguintes linhas:

```javascript
// Google Drive API Configuration
const GOOGLE_CLIENT_ID = 'SEU_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'SUA_API_KEY';
const DRIVE_FOLDER_ID = 'ID_DA_PASTA_DO_DRIVE';
```

Substitua:
- `SEU_CLIENT_ID` com o Client ID do Google Cloud Console
- `SUA_API_KEY` com a API Key
- `ID_DA_PASTA_DO_DRIVE` com o ID da pasta criada no Google Drive

### 4. Criar Tabela no Supabase

Execute o seguinte SQL no editor SQL do Supabase:

```sql
CREATE TABLE group_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX idx_group_files_group_id ON group_files(group_id);
CREATE INDEX idx_group_files_uploaded_at ON group_files(uploaded_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE group_files ENABLE ROW LEVEL SECURITY;

-- Criar policy para usuários verem apenas arquivos de seus grupos
CREATE POLICY "Usuários podem ver arquivos de seus grupos" ON group_files
  FOR SELECT
  USING (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );

-- Criar policy para usuários inserirem arquivos em seus grupos
CREATE POLICY "Usuários podem inserir arquivos em seus grupos" ON group_files
  FOR INSERT
  WITH CHECK (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );

-- Criar policy para usuários deletarem arquivos de seus grupos
CREATE POLICY "Usuários podem deletar arquivos de seus grupos" ON group_files
  FOR DELETE
  USING (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );
```

### 5. Configurações de Segurança (Recomendado)

Para maior segurança em produção:

1. **Usar um backend de autenticação**: Implemente um servidor backend que autentique usuários e crie tokens de acesso limitados para o Google Drive
2. **Validar tipos de arquivo no servidor**: Não confiar apenas na validação do cliente
3. **Implementar limite de quota**: Limitar quantidade e tamanho de uploads por usuário
4. **Usar Cloud Functions**: Implementar uploads através de Cloud Functions do Firebase ou Google Cloud

## Notas Importantes

- O upload atual requer autenticação OAuth no cliente. Para um sistema mais seguro, considere usar um backend.
- Os arquivos são armazenados no Google Drive da conta `cadastrocomesol@gmail.com`
- O limite de tamanho de arquivo é 25MB
- Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX

## Troubleshooting

**Problema**: "Google Drive API não inicializada"
- Verifique se as credenciais estão corretas no HTML
- Certifique-se de que a Google Drive API está habilitada no Google Cloud Console

**Problema**: "Erro de CORS"
- Adicione o seu domínio nas "URIs autorizadas" no Google Cloud Console
- Para localhost, agrege `http://localhost:3000` e variações de porta

**Problema**: "Arquivo não aparece na pasta"
- Verifique se o `DRIVE_FOLDER_ID` está correto
- Certifique-se que a conta de serviço tem permissão para escrever na pasta
