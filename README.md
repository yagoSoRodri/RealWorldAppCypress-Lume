# RealWorldApp Cypress — Framework Lume

![Cypress Tests](https://github.com/yagoSoRodri/RealWorldAppCypress-Lume/actions/workflows/cypress.yml/badge.svg)

Projeto de automação de testes end-to-end construído sobre a base do **RealWorld App**, utilizando **Cypress** com a arquitetura proprietária **Lume**. O objetivo é demonstrar domínio técnico em automação de qualidade com práticas modernas de engenharia de software.

---

## Pilares Técnicos

### Arquitetura Híbrida (Page Objects + App Actions)

- Implementação do padrão **Page Objects** do framework Lume sobre a estrutura nativa do RealWorld App
- Separação rigorosa de responsabilidades:
  - **Pages**: contêm exclusivamente localizadores de elementos e métodos de ação
  - **Testes (.cy.js / .spec.ts)**: concentram todas as asserções (`should`, `expect`)
- Estrutura organizada em `cypress/support/pages/` para máxima escalabilidade

### Massa de Dados Resiliente

- Utilização da biblioteca **@faker-js/faker** para geração dinâmica de dados a cada execução
- Campos como nome, sobrenome, usuário e senha são criados programaticamente, eliminando dependência de dados estáticos em fixtures JSON
- Cobertura ampliada de **casos de borda** através da aleatoriedade controlada dos inputs

### Integração Contínua (CI/CD)

- Pipeline configurado via **GitHub Actions** no arquivo `.github/workflows/cypress.yml`
- Execução automatizada em cada `push` e `pull_request` na branch `main`
- Ambiente padronizado em **Ubuntu Latest** com Chrome headless
- Upload automático de **screenshots e vídeos** como artefatos em caso de falha, garantindo rastreabilidade

### Expertise em Banco de Dados

- Projeto preparado para **validações de persistência direta via SQL**
- Integração configurada através de `cy.task('queryDatabase')` com suporte a **PostgreSQL**
- Possibilidade de verificar se registros foram corretamente persistidos após ações de UI

### Clean Code

- Seletores resilientes baseados no atributo `data-test`, evitando dependência de classes CSS ou IDs frágeis
- Código autoexplicativo e sem comentários desnecessários
- Comandos customizados (`cy.getBySel`, `cy.loginViaApi`) para redução de duplicação e aumento da legibilidade

---

## Diferenciais Técnicos

### Validação de Persistência via SQL

A maioria dos frameworks de teste E2E valida apenas o que é visível na interface. Este projeto vai além: após ações críticas de UI (como cadastro de usuário ou criação de transação), o sistema executa queries SQL diretamente no banco de dados via `cy.task('queryDatabase')` para confirmar que o registro foi efetivamente persistido. Essa abordagem reduz drasticamente o risco de bugs silenciosos em produção — cenários onde a UI exibe sucesso, mas o dado nunca chega ao banco. A validação em camada de dados é uma prática essencial para garantir integridade ponta a ponta.

### Massa de Dados Dinâmica com @faker-js/faker

Testes que dependem de dados fixos (hardcoded) tendem a passar repetidamente sem revelar falhas reais, criando uma falsa sensação de segurança. Ao utilizar **@faker-js/faker**, cada execução gera combinações únicas de nome, sobrenome, usuário e senha, simulando o comportamento real de usuários em produção. Essa estratégia expõe bugs de validação, encoding, truncamento e limites de campo que dados estáticos jamais alcançariam. O resultado é uma suíte de testes mais robusta, com maior cobertura efetiva e menor taxa de defeitos escapados para produção.

---

## Estrutura do Projeto

```
cypress/
├── support/
│   ├── pages/
│   │   └── LoginPage.js
│   ├── commands.ts
│   └── e2e.ts
├── tests/
│   ├── ui/
│   │   ├── auth.spec.ts
│   │   ├── execicio_login_register.spec.js
│   │   └── ...
│   └── api/
│       └── ...
├── fixtures/
└── videos/
```

---

## Pré-requisitos

- **Node.js** (versão 20 ou superior)
- **npm** ou **yarn**
- **Google Chrome**

---

## Instalação

```bash
npm install
```

---

## Execução dos Testes

**Modo interativo (Cypress GUI):**

```bash
npx cypress open
```

**Modo headless (CI/CD):**

```bash
npx cypress run --browser chrome --headless
```

---

## Tecnologias Utilizadas

| Tecnologia              | Finalidade                            |
| ----------------------- | ------------------------------------- |
| Cypress                 | Framework de testes E2E               |
| @faker-js/faker         | Geração dinâmica de massa de dados    |
| GitHub Actions          | Pipeline de integração contínua       |
| PostgreSQL (pg)         | Validação de persistência via SQL     |
| TypeScript / JavaScript | Linguagens dos testes e configurações |

---

## Autor

Desenvolvido como projeto de portfólio em engenharia de qualidade de software.
