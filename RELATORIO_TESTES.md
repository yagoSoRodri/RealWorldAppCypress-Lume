# Relatório Detalhado de Testes — Cypress RealWorld App

Este documento descreve todos os testes automatizados presentes no projeto, detalhando o que cada um valida, a lógica executada e o status atual.

---

## 1. Exercícios Lume (Customizados/Refatorados)

Estes testes foram criados ou refatorados para seguir as melhores práticas de Clean Code e Page Object Model (POM).

### `execicio_login_register.spec.js` (Refatorado ✅)

- **Login com sucesso**:
  - **O que ocorre**: Visita a página de login, utiliza o `LoginPage` POM para preencher credenciais de um usuário existente na base (`db:seed`).
  - **Validação**: Verifica se o `pathname` mudou para `/` e se o nome do usuário aparece no Sidenav.
- **Login com falha**:
  - **O que ocorre**: Tenta login com usuário e senha inválidos via POM.
  - **Validação**: Verifica se a mensagem "Username or password is invalid" é exibida.
- **Registro com sucesso**:
  - **O que ocorre**: Preenche o formulário de Sign Up com dados dinâmicos (Faker) e submete.
  - **Validação**: Verifica se é redirecionado para a página de Sign In após o cadastro.
- **Validação de campos obrigatórios**:
  - **O que ocorre**: Foca e sai dos campos sem preencher (blur).
  - **Validação**: Verifica mensagens de erro como "First Name is required" e se o botão submit está desabilitado.

### `exercicio_enviar_dinheiro.spec.js`

- **Envio com saldo suficiente**:
  - **O que ocorre**: Seleciona um usuário da lista, define valor e descrição, e confirma.
  - **Validação**: Verifica o alerta de sucesso, a redução do saldo do remetente e o aumento do saldo do destinatário via banco de dados.
- **Envio com saldo insuficiente**:
  - **O que ocorre**: Tenta enviar um valor maior que o saldo atual.
  - **Validação**: Verifica se a aplicação exibe erro de saldo insuficiente ou se previne a transação.

### `exercicio_historico_transacoes.spec.js`

- **Visualização básica**:
  - **O que ocorre**: Acessa a aba "Personal" e lista transações.
  - **Validação**: Garante que a lista não está vazia e que os detalhes da transação (remetente, valor) estão visíveis.
- **Filtros (Data e Valor)**:
  - **O que ocorre**: Aplica filtros de intervalo de datas e sliders de valores.
  - **Validação**: Verifica se os itens listados correspondem exatamente aos critérios do filtro.
- **Paginação**:
  - **O que ocorre**: Rola a lista até o fim.
  - **Validação**: Verifica se a próxima página de dados é carregada automaticamente (Infinite Scroll).

---

## 2. Testes de Interface (UI)

### `auth.spec.ts` (Refatorado ✅)

- **Redirecionamento**: Garante que usuários deslogados sejam jogados para `/signin`.
- **Login & Logout**: Valida o fluxo completo de autenticação e destruição de sessão.
- **Erros de Formulário**: Valida mensagens de erro para senhas curtas ou campos vazios no login e cadastro.

### `bankaccounts.spec.ts`

- **Criação de conta**: Valida o cadastro de uma nova conta bancária e sua aparição na lista.
- **Exclusão (Soft Delete)**: Verifica se ao deletar, a conta é marcada como deletada mas permanece no histórico (lógica do app).
- **Onboarding**: Valida se o modal de boas-vindas aparece para usuários sem conta bancária.

### `new-transaction.spec.ts`

- **Fluxo de busca**: Valida a busca de usuários por Nome, Username, Email ou Telefone.
- **Pagamento vs Requisição**: Testa a diferença entre enviar dinheiro diretamente e solicitar um pagamento de outro usuário.

### `notifications.spec.ts`

- **Interações em tempo real**:
  - Valida se o Usuário A recebe notificação quando o Usuário B curte ou comenta sua transação.
  - Valida a marcação de notificações como "Lidas".

---

## 3. Testes de API (Backend)

Estes testes validam diretamente os endpoints REST e GraphQL sem passar pela interface gráfica.

- **`api-users.spec.ts`**: Valida busca de usuários, criação via POST, atualização via PATCH e login via API.
- **`api-transactions.spec.ts`**: Garante que transações pendentes e completas retornem o status code correto (200/204) e payloads válidos.
- **`api-bankaccounts.spec.ts`**: Testa o CRUD de contas bancárias e integrações via GraphQL (Queries e Mutations).

---

## Resumo de Status

| Categoria              | Status      | Observação                                                    |
| ---------------------- | ----------- | ------------------------------------------------------------- |
| **Exercícios Lume**    | ✅ PASSANDO | Refatorados para corrigir bugs de Faker API e integração POM. |
| **Auth UI**            | ✅ PASSANDO | Corrigido erro de casting do Faker v6.                        |
| **Bank Accounts**      | ✅ PASSANDO | Estáveis.                                                     |
| **Transactions/Feeds** | ✅ PASSANDO | Cobrem fluxos críticos de envio/recebimento.                  |
| **API Suite**          | ✅ PASSANDO | Verificam integridade do backend diretamente.                 |

> [!NOTE]
> Os testes marcados com ✅ foram revisados manualmente e corrigidos para garantir compatibilidade com as dependências do projeto (especialmente `@faker-js/faker@6.3.1`).
