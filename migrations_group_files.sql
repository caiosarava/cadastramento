-- Criar tabela para armazenar informações dos arquivos enviados
CREATE TABLE IF NOT EXISTS group_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance nas queries
CREATE INDEX IF NOT EXISTS idx_group_files_group_id ON group_files(group_id);
CREATE INDEX IF NOT EXISTS idx_group_files_uploaded_at ON group_files(uploaded_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE group_files ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários podem ver arquivos de seus grupos" ON group_files;
DROP POLICY IF EXISTS "Usuários podem inserir arquivos em seus grupos" ON group_files;
DROP POLICY IF EXISTS "Usuários podem deletar arquivos de seus grupos" ON group_files;

-- Criar política para SELECT (visualizar)
CREATE POLICY "Usuários podem ver arquivos de seus grupos" ON group_files
  FOR SELECT
  USING (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );

-- Criar política para INSERT (adicionar)
CREATE POLICY "Usuários podem inserir arquivos em seus grupos" ON group_files
  FOR INSERT
  WITH CHECK (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );

-- Criar política para DELETE (deletar)
CREATE POLICY "Usuários podem deletar arquivos de seus grupos" ON group_files
  FOR DELETE
  USING (
    group_id IN (
      SELECT id FROM groups WHERE user_id = auth.uid()
    )
  );
