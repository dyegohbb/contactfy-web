# Contactfy Web

Frontend da aplicação de Agendamento Telefônico **Contactfy**, desenvolvido em Angular.

## 📋 Funcionalidades

* Tela de login
* Cadastro de usuário
* Listagem de contatos
* Cadastro de contatos
* Edição de contatos
* Inativação de contatos
* Marcar/desmarcar como favorito
* Filtros por nome, email, celular, telefone e datas
* Validação de campos e tratamento de erros
* Integração total com a API `contactfy-api`

## 🚀 Tecnologias utilizadas

* Angular TS (versão mais recente)
* Guards
* Tailwind CSS

## 🚧 Estrutura de diretórios

```bash
src/
  app/
  assets/
  environments/
```

## 📅 Requisitos

* Node.js (recomendado: LTS)
* Angular CLI instalado globalmente:

  ```bash
  npm install -g @angular/cli
  ```

## 🏁 Como rodar o projeto localmente

1. Clone o repositório:

   ```bash
   git clone git@github.com:seu-usuario/contactfy-web.git
   cd contactfy-web
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure a URL da API no ambiente:

   Edite `src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080' // ou a porta da contactfy-api
   };
   ```

4. Rode a aplicação:

   ```bash
   ng serve
   ```

5. Acesse em:

   ```
   http://localhost:4200
   ```

## 🧪 Testes

* Telas de login, cadastros, listagem, visualização e edição de contatos
* Guards implementados para rotas protegidas
* Testes unitários cobrindo os componentes principais, serviços e guards

## 🔐 Autenticação

O frontend consome a API de autenticação da `contactfy-api` e armazena o token JWT em `localStorage`. As rotas privadas são protegidas com Guards.

## 📖 Documentação

* Este projeto possui uma collection do Postman e um arquivo de especificação OpenAPI dentro do repositório da API: `contactfy-api/src/main/resources/api`

---

Contribuições, melhorias e issues são bem-vindas! 🚀
