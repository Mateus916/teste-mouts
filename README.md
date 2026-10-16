# ServeRest · Automação de testes com Cypress

Suíte de testes automatizados da aplicação [ServeRest](https://serverest.dev), cobrindo **3 cenários E2E de frontend** e **3 cenários de API**, escrita em JavaScript com Cypress.

| Camada | Alvo |
|---|---|
| Frontend | https://front.serverest.dev |
| API | https://serverest.dev (Swagger) |

## Cenários

| ID | Camada | Cenário | Tipo |
|---|---|---|---|
| CT-API-01 | API | Cadastrar usuário e persistir exatamente os dados enviados | Positivo + contrato |
| CT-API-02 | API | Não permitir cadastro de usuário com e-mail já utilizado | Negativo · regra de negócio |
| CT-API-03 | API | Bloquear cadastro de produto por usuário não administrador | Negativo · autorização |
| CT-FE-01 | Frontend | Cadastrar novo cliente e acessar a loja autenticado | Positivo · jornada |
| CT-FE-02 | Frontend | Exibir erro e não autenticar com senha incorreta | Negativo |
| CT-FE-03 | Frontend | Administrador cadastra produto e o visualiza na listagem | Positivo · jornada ponta a ponta |

A especificação de cada cenário, no formato Dado/Quando/Então, está em [`docs/cenarios.md`](docs/cenarios.md).

## Como executar

**Pré-requisitos:** Node.js 22.13+ (há um `.nvmrc` no projeto) e npm 10+.

```bash
npm ci                 # instala as dependências (inclui o binário do Cypress)

npm test               # executa toda a suíte em modo headless
npm run test:api       # apenas os testes de API
npm run test:frontend  # apenas os testes de frontend
npm run cy:open        # abre o Cypress em modo interativo

npm run lint           # análise estática com ESLint
```

### Executando contra outro ambiente

As URLs são configuráveis por variável de ambiente, sem alterar código. Exemplo com o ServeRest rodando localmente (`npx serverest`):

```bash
BASE_URL=http://localhost:3001 API_URL=http://localhost:3000 npm test
```

| Variável | Padrão |
|---|---|
| `BASE_URL` | `https://front.serverest.dev` |
| `API_URL` | `https://serverest.dev` |

## Arquitetura

```
cypress/
├── e2e/
│   ├── api/                      # specs de API, organizados por recurso
│   │   ├── usuarios.cy.js        # CT-API-01, CT-API-02
│   │   └── produtos.cy.js        # CT-API-03
│   └── frontend/                 # specs E2E, organizados por funcionalidade
│       ├── cadastro-usuario.cy.js  # CT-FE-01
│       ├── login.cy.js             # CT-FE-02
│       └── cadastro-produto.cy.js  # CT-FE-03
├── fixtures/schemas/             # JSON Schemas usados nos testes de contrato
└── support/
    ├── assertions/               # assertiva Chai customizada (matchSchema)
    ├── commands/                 # comandos de preparação, limpeza e seleção
    ├── constants/                # status HTTP, mensagens da API e rotas
    ├── factories/                # geração de massa de dados (Faker pt-BR)
    ├── pages/                    # Page Objects
    ├── services/                 # Service Objects da API
    └── e2e.js                    # ponto de entrada e teardown global
```

## Padrões de projeto e decisões técnicas

**Page Object** (`support/pages`): cada tela encapsula seus seletores e ações. Os specs descrevem *o que* o usuário faz; *como* isso acontece na interface fica num único lugar. As assertivas ficam nos specs, nunca nos Page Objects, para que o teste mostre claramente o que está sendo validado.

**Service Object** (`support/services`): toda chamada à API passa por um `ApiClient` base, que centraliza URL e autenticação. Os serviços usam `failOnStatusCode: false` para que o teste receba e valide também respostas de erro (400, 401, 403), em vez de ser interrompido pelo Cypress.

**Factory** (`support/factories`): cada teste gera sua própria massa com Faker (locale pt-BR) e e-mails/nomes únicos. Nenhum teste depende de dados pré-existentes nem de outro teste, o que permite rodá-los em qualquer ordem, isoladamente ou em paralelo.

**Arrange via API**: pré-condições que não são o objeto do teste (ex.: "dado um usuário cadastrado") são montadas pela API, o que deixa os testes de interface mais rápidos e estáveis. Esses comandos têm assertivas de guarda: se a pré-condição falhar, o teste para com uma mensagem clara.

**Limpeza da massa de dados**: o ServeRest público é compartilhado. Todo registro criado é agendado para exclusão e removido num `afterEach` global, mesmo quando o teste falha, em ordem inversa à criação (o produto é excluído antes do administrador que o cadastrou). A limpeza não faz assertivas, para nunca mascarar o resultado real do teste.

**Teste de contrato**: além dos valores, as respostas da API são validadas contra JSON Schemas (com `additionalProperties: false`) por meio de uma assertiva Chai customizada: `expect(body).to.matchSchema(schema)`. Isso detecta campos removidos, renomeados, com tipo alterado ou inesperados.

**Seletores**: a interface é acessada por `data-testid` (comando `cy.getByTestId`), a estratégia mais resiliente a mudanças de layout e texto. Onde a aplicação não expõe `data-testid` (alertas), são usados atributos semânticos como `role="alert"`.

**Sincronização sem esperas fixas**: nenhum `cy.wait(ms)`. Os testes esperam pelas requisições reais com `cy.intercept` + `cy.wait('@alias')` e validam também o que foi enviado e recebido pela interface (camada de rede), não só o que aparece na tela.

**Assertivas**: cada cenário valida o resultado em mais de uma camada (status, mensagem, contrato, persistência, estado da tela e da sessão). Mensagens e status vêm de constantes nomeadas (`HTTP_STATUS.FORBIDDEN`, `MENSAGENS.ROTA_EXCLUSIVA_ADMIN`), o que torna a intenção explícita.

**Retries**: uma nova tentativa em modo headless (`retries.runMode: 1`) absorve instabilidades de rede do ambiente público. Um teste que falha duas vezes seguidas continua reprovando a execução.

## Integração contínua

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) executa, a cada push e pull request na `main`:

1. **ESLint** (com `eslint-plugin-cypress`, que proíbe, entre outros, esperas fixas e `force: true`);
2. as suítes de **API** e **frontend** em paralelo (matrix), publicando os screenshots como artefato em caso de falha.

## Convenção de commits

O histórico segue o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com mensagens em português, no imperativo e com corpo explicando o motivo da mudança quando ele não é óbvio:

```
<tipo>(<escopo opcional>): <descrição>
```

Tipos usados: `chore`, `test`, `ci` e `docs`.

## Stack

Cypress 16 · JavaScript (ES Modules) · @faker-js/faker · Ajv (JSON Schema) · ESLint 10 + eslint-plugin-cypress · GitHub Actions
