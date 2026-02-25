# Upload de Arquivos para Google Drive - Implementação Completa

## 📋 O que foi implementado

### 1. **Interface de Upload** (visualizacao.html)
   - Campo de seleção de arquivos com suporte a múltiplos arquivos
   - Botão de upload com ícone
   - Suporte para drag-and-drop
   - Validação de tipos de arquivo (PDF, DOC, DOCX, XLS, XLSX)
   - Limite de tamanho de arquivo (25MB)

### 2. **Funcionalidades**
   - ✅ Upload de até 25MB por arquivo
   - ✅ Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX
   - ✅ Visualização de arquivos enviados
   - ✅ Download/Visualização direta do Google Drive
   - ✅ Exclusão de arquivos (tanto do Drive quanto do banco)
   - ✅ Histórico de uploads com data e tamanho
   - ✅ Status de upload em tempo real

### 3. **Banco de Dados** (Supabase)
   - Tabela `group_files` para armazenar metadados
   - Row Level Security (RLS) configurado
   - Índices para performance

---

## 🔧 Próximos Passos para Ativar

### Passo 1: Google Cloud Console
```
1. Acesse https://console.cloud.google.com/
2. Crie ou selecione um projeto
3. Ative Google Drive API:
   - Menu → APIs e Serviços → Biblioteca
   - Pesquise "Google Drive API"
   - Clique em "Ativar"
4. Crie Credencial OAuth 2.0:
   - Menu → APIs e Serviços → Credenciais
   - Clique em "Criar Credencial" → "ID do cliente OAuth"
   - Tipo: "Aplicação web"
   - URIs autorizadas:
     * http://localhost:5000
     * http://localhost:3000
     * https://seu-dominio.com
   - Clique em "Criar" e copie o Client ID
5. Crie Chave de API:
   - Clique em "Criar Credencial" → "Chave de API"
   - Copie a chave
```

### Passo 2: Google Drive
```
1. Faça login em https://drive.google.com
   - Conta: cadastrocomesol@gmail.com
2. Crie uma nova pasta:
   - Clique com botão direito → Nova pasta
   - Nome: "Documentos Cadastramento COMESOL"
3. Copie o ID da pasta:
   - Abra a pasta
   - Copie da URL: https://drive.google.com/drive/folders/[AQUI_ESTA_O_ID]
```

### Passo 3: Banco de Dados (Supabase)
```
1. Acesse seu projeto no Supabase
2. Vá para SQL Editor
3. Clique em "Nova Query"
4. Cole o conteúdo do arquivo: migrations_group_files.sql
5. Clique em "Executar"
```

### Passo 4: Atualizar Credenciais
```
Edite: visualizacao.html (linhas ~200-207)

Substitua:
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';

Por (seus valores reais):
const GOOGLE_CLIENT_ID = 'xxxxx.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIza...';
const DRIVE_FOLDER_ID = '1A2B3C4D...';
```

---

## 📁 Arquivos Criados/Modificados

### Modificados:
- **visualizacao.html** - Adicionada interface de upload e funções Google Drive

### Criados:
- **CONFIGURACAO_GOOGLE_DRIVE.md** - Guia completo de configuração
- **migrations_group_files.sql** - Script SQL para criar tabelas
- **google-drive-config.example.js** - Exemplo de configuração
- **README.md** - Este arquivo

---

## 🔐 Segurança e Boas Práticas

### Atual (Desenvolvimento):
- Validação de tipo de arquivo no cliente
- Limite de 25MB por arquivo
- Autenticação via Supabase
- RLS configurado no banco de dados

### Recomendado para Produção:
1. **Backend OAuth Flow**
   - Implementar servidor backend que autentique e gera tokens
   - Não expor Client Secret no frontend
   - Usar refreshTokens com expiração

2. **Validação de Servidor**
   - Validar tipos de arquivo no backend
   - Validar tamanho de arquivo
   - Varificar integridade de arquivo (hash)

3. **Quotas e Limites**
   - Limitar uploads por usuário (ex: 100MB/mês)
   - Implementar rate limiting
   - Monitorar espaço do Drive

4. **Auditoria**
   - Registrar todos os uploads/deletions
   - Implementar soft delete (não deletar imediatamente)
   - Manter histórico de quem fez o quê

---

## 🎯 Como Usar

### Para o Usuário Final:
1. Acesse a página de visualização do grupo
2. Na seção "Upload de Documentos":
   - Clique em "Escolher arquivos" ou arraste para a área
   - Selecione múltiplos arquivos (PDF, DOC, DOCX, XLS, XLSX)
   - Clique em "Upload"
3. Veja o status do upload em tempo real
4. Visualize ou delete arquivos na lista abaixo

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Google Drive API não inicializada" | Verifique as credenciais no HTML |
| "Erro de CORS" | Adicione seu domínio nas URIs autorizadas |
| "Arquivo não aparece no Drive" | Verifique o ID da pasta |
| "Erro de autenticação" | Certifique-se de estar logado no Google |
| "Arquivo muito grande" | Máximo é 25MB por arquivo |

---

## 📞 Suporte

Para dúvidas sobre:
- **Google Cloud**: https://cloud.google.com/docs/authentication
- **Google Drive API**: https://developers.google.com/drive/api/v3/about-sdk
- **Supabase**: https://supabase.io/docs

---

## ✅ Checklist de Implementação

- [ ] Criar projeto no Google Cloud Console
- [ ] Ativar Google Drive API
- [ ] Criar credencial OAuth 2.0
- [ ] Criar chave de API
- [ ] Copiar Client ID e API Key
- [ ] Criar pasta no Google Drive (cadastrocomesol@gmail.com)
- [ ] Copiar ID da pasta
- [ ] Executar SQL no Supabase (migrations_group_files.sql)
- [ ] Atualizar credenciais em visualizacao.html
- [ ] Testar upload de arquivo
- [ ] Verificar arquivo no Google Drive
- [ ] Testar visualização de arquivo
- [ ] Testar exclusão de arquivo

---

**Última atualização**: 25 de Fevereiro de 2026
**Status**: Implementado e pronto para configuração
