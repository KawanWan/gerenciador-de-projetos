-- Tabelas
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
  dueDate DATE,
  projectId INT,
  userId INT,
  FOREIGN KEY (projectId) REFERENCES project(id),
  FOREIGN KEY (userId) REFERENCES user(id)
);

-- Inserir Usuários
INSERT INTO user (name, photo, email, password)
VALUES 
  ('João Silva', 'https://example.com/joao.jpg', 'joao@example.com', 'hashedPassword1'),
  ('Maria Souza', 'https://example.com/maria.jpg', 'maria@example.com', 'hashedPassword2');

-- Inserir Projetos
INSERT INTO project (name, description)
VALUES 
  ('Desenvolvimento de API', 'API REST para gerenciamento de projetos'),
  ('Site de Portfólio', 'Site pessoal para exibir portfólio de projetos');

-- Inserir Tarefas
INSERT INTO task (name, description, status, dueDate, projectId, userId)
VALUES 
  ('Configurar ambiente de desenvolvimento', 'Instalar dependências e configurar servidor local.', 'IN_PROGRESS', '2024-09-30', 1, 1),
  ('Criar endpoints de autenticação', 'Endpoints de login e registro de usuários.', 'PENDING', '2024-10-05', 1, 2),
  ('Desenvolver página inicial', 'Criar layout e implementar responsividade.', 'PENDING', '2024-10-10', 2, 1);
