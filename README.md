# RealWorldApp Cypress — Framework Lume

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

| Tecnologia | Finalidade |
|---|---|
| Cypress | Framework de testes E2E |
| @faker-js/faker | Geração dinâmica de massa de dados |
| GitHub Actions | Pipeline de integração contínua |
| PostgreSQL (pg) | Validação de persistência via SQL |
| TypeScript / JavaScript | Linguagens dos testes e configurações |

---

## Autor

Desenvolvido como projeto de portfólio em engenharia de qualidade de software.
