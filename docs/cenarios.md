# Especificação dos cenários de teste

Cada cenário é independente: cria a própria massa de dados (via API, quando não é o objeto do teste) e a remove ao final, mesmo em caso de falha.

## API — https://serverest.dev

### CT-API-01 · Cadastrar usuário e persistir exatamente os dados enviados
`cypress/e2e/api/usuarios.cy.js` · Tipo: positivo · Recurso: `POST /usuarios`, `GET /usuarios/{_id}`

```gherkin
Dado um novo usuário com dados válidos
Quando o cadastro é solicitado
Então a API responde 201 com a mensagem "Cadastro realizado com sucesso" e o _id gerado
E a resposta respeita o contrato de cadastro
E ao consultar o usuário pelo _id, os dados retornados são idênticos aos enviados
E a consulta respeita o contrato de usuário
```

**Por que importa:** não basta a API responder 201 — o teste comprova que o dado foi gravado sem perda ou transformação.

### CT-API-02 · Não permitir cadastro com e-mail já utilizado
`cypress/e2e/api/usuarios.cy.js` · Tipo: negativo (regra de negócio) · Recurso: `POST /usuarios`

```gherkin
Dado um usuário já cadastrado
Quando outro usuário tenta se cadastrar com o mesmo e-mail
Então a API responde 400 com a mensagem "Este email já está sendo usado"
E continua existindo um único usuário com aquele e-mail, sem alterações
```

**Por que importa:** valida a regra de unicidade e garante que a tentativa rejeitada não sobrescreveu o cadastro original (o segundo payload tenta, inclusive, criar um administrador).

### CT-API-03 · Bloquear cadastro de produto por usuário não administrador
`cypress/e2e/api/produtos.cy.js` · Tipo: negativo (autorização) · Recurso: `POST /login`, `POST /produtos`

```gherkin
Dado um usuário autenticado que não é administrador
Quando ele tenta cadastrar um produto com o próprio token
Então a API responde 403 com a mensagem "Rota exclusiva para administradores"
E o produto não é persistido
```

**Por que importa:** é um controle de acesso — o tipo de falha com maior impacto de segurança.

## Frontend — https://front.serverest.dev

### CT-FE-01 · Cadastrar novo cliente e acessar a loja autenticado
`cypress/e2e/frontend/cadastro-usuario.cy.js` · Tipo: positivo (jornada)

```gherkin
Dado que um visitante acessa a tela de cadastro
Quando ele preenche o formulário com dados válidos e confirma
Então a API recebe exatamente os dados informados e responde 201
E a mensagem "Cadastro realizado com sucesso" é exibida
E ele é redirecionado para a home da loja
E a sessão está ativa (token "Bearer" salvo no navegador)
```

### CT-FE-02 · Exibir erro e não autenticar com senha incorreta
`cypress/e2e/frontend/login.cy.js` · Tipo: negativo

```gherkin
Dado um usuário cadastrado
Quando ele tenta entrar com o e-mail correto e a senha errada
Então a API recusa a autenticação com 401
E a tela exibe "Email e/ou senha inválidos"
E o usuário permanece na tela de login, sem token salvo
```

**Por que usar um usuário real com senha errada:** prova que a aplicação valida a senha, e não apenas a existência do e-mail.

### CT-FE-03 · Administrador cadastra produto e o visualiza na listagem
`cypress/e2e/frontend/cadastro-produto.cy.js` · Tipo: positivo (jornada ponta a ponta)

```gherkin
Dado um administrador cadastrado
E autenticado no painel administrativo, com a saudação "Bem Vindo <nome>"
Quando ele acessa o cadastro de produtos e cadastra um novo produto
Então a API registra o produto com 201
E ele é redirecionado para a listagem de produtos
E o produto aparece com nome, preço, descrição e quantidade informados
```
