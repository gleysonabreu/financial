# Financial

Projeto com objetivo guardar o fluxo caixa de qualquer tipo de empresa.

## Checklist Features

- Login
  - [x] Autenticação com JWT token
  - [x] Autenticar usuário
  - [x] Validar permissões
    - [x] Administrador
    - [x] Gerente
    - [x] Financeiro
  - [] Sistema de esqueci minha senha
    - [x] Enviar email com link para alterar senha
    - [] Alterar senha
- Users

  - [] Remover usuário, somente admins
  - [x] Buscar todos os usuários (com filtros), somente admins
    - Buscar
      - [x] Por cpf
      - [x] Por nome
    - Paginação
      - [x] Itens por página
      - [x] Página
  - [x] Buscar um usuário em especifico, somente admins
    - [x] id
  - [x] Cadastrar usuários, somente admins
  - [x] Atualizar usuário, todos os usuários poderão atualizar seus dados
  - [x] Visualizar perfil

- Permissões

  - [x] Remover permissões, somente admins
  - [x] Adicionar permissão, somente admins

- Tipos de contas

  - [x] Buscar todos os tipos de contas, somente admin e financeiro.
  - [x] Buscar uma conta em especifico, somente admin e financeiro.
    - [x] id
  - [x] Atualizar tipo de conta, somente admin e Financeiro
  - [x] Remover tipo de conta, somente admin e financeiro.
  - [x] Cadastrar tipo de conta, somente admin e financeiro.

- Contas
  - [x] Cadastrar contas, somente admin e financeiro
  - [x] Atualizar conta, somente admin e financeiro.
  - [x] Buscar todas contas (com filtros), todos autenticados poderão ver
    - Buscar
      - [x] Por justificativa
      - [x] Por tipo de conta
      - [x] Por data inicio e fim
    - Paginação
      - [x] Itens por página
      - [x] Página
  - [x] Buscar uma conta em especifico, todos autenticados poderão ver
    - [x] id
  - [x] Remover conta, somente admin e financeiro
    - [x] id

## Requisições

- Users

  - /users/:id

    - tipo: get
    - header: Authorization
    - parâmetros: id
    - retorna: `{ id, firstName, lastName, email, cpf, birthDate, phone, permissions": [], createdAt, updatedAt }`

  - /users

    - tipo: get
    - header: Authorization
    - queryParams (opcionais):
      - page
      - per_page
      - cpf
      - name
    - retorna: `[{ id, firstName, lastName, email, cpf, birthDate, phone, permissions": [], createdAt, updatedAt }]`

  - /users

    - tipo: post
    - header: Authorization
    - body: ` { first_name, last_name, email, password, birth_date, cpf, phone permissions: [ { type } ] }`

  - /users

    - tipo: put
    - header: Authorization
    - body: `{ first_name, last_name, email, phone, cpf, birth_date }`
    - retorna: `{ id, firstName, lastName, email, cpf, birthDate, phone, permissions: [], createdAt, updatedAt }`

  - /auth

    - tipo: post
    - header: Authorization
    - body: `{ email, password }`
    - retorna: `{ user: { id, email, firstName, lastName }, token, permissions: [] }`

  - /profile

    - tipo: get
    - header: Authorization
    - retorna: `{ id, firstName, lastName, email, cpf, birthDate, phone, permissions": [], createdAt, updatedAt }`

- Permissões

  - /permissions

    - tipo: post
    - header: Authorization
    - body: `{ user_id, type, }`
    - retorna: `{ id, userId, type, createdAt, updatedAt }`

  - /permissions/:id
    - tipo: delete
    - header: Authorization
    - parâmetros: id

- Tipos de contas

  - /account-types/:id

    - tipo: get
    - header: Authorization
    - parâmetros: id
    - retorna: `{ id, name, createdAt, updatedAt }`

  - /account-type

    - tipo: get
    - header: Authorization
    - retorna: `[{ id, name, createdAt, updatedAt }]`

  - /account-types/:id

    - tipo: put
    - header: Authorization
    - parâmetros: id
    - body: `{name}`

  - /account-types/:id

    - tipo: delete
    - header: Authorization
    - parâmetros: id

  - /account-types
    - tipo: post
    - header: Authorization
    - body: `{name}`

- Contas

  - /bills

    - tipo: get
    - header: Authorization
    - queryParams (opcionais):
      - page
      - per_page
      - account_type_id
      - justification
      - date_start
      - date_finish
    - retorna: `[{id, accountTypeId, value, justification, date, accountType: { id, name, createdAt, updatedAt }}]`

  - /bills/:id

    - tipo: get
    - header: Authorization
    - parâmetros: id
    - retorna: `{id, accountTypeId, value, justification, date, accountType: { id, name, createdAt, updatedAt }}`

  - /bills/:id

    - tipo: delete
    - header: Authorization
    - parâmetros: id

  - /bills/:id

    - tipo: put
    - header: Authorization
    - parâmetros: id
    - body: `{ account_type_id, justification, value }`
    - retorna: `{ id, accountTypeId, value, justification, date, accountType": { id, name, createdAt, updatedAt } }`

  - /bills

    - tipo: post
    - header: Authorization
    - body: `{ account_type_id, justification, value, date }`
    - retorna: `{ id, account_type_id, justification, value, date }`

- Esqueci minha senha
  - /password/forgot
  - tipo: post
  - body: `{email}`
