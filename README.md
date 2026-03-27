# Cypress RealWorld App: Automação E2E e CI/CD

Esta é uma versão aprimorada do **Cypress RealWorld App** focada em demonstrar padrões avançados de automação de testes End-to-End (E2E), boas práticas de qualidade de software e implementação madura de **Integração e Entrega Contínuas (CI/CD)**.

O projeto utiliza **Cypress** e implementa um ecossistema robusto para testes contínuos, garantindo segurança na entrega de código em cenários reais complexos, como aplicações bancárias e de transações financeiras.

---

## 🚀 Arquitetura de Testes e Design

A arquitetura e os princípios de design adotados focam em **manutenibilidade, velocidade e resiliência**:

### 1. Page Object Model (POM) + App Actions

- Separação rigorosa de responsabilidades: lógicas de iteração ficam isoladas dos testes que as invocam.
- Os módulos de teste em `*.spec.ts` concentram estritamente fluxos de negócio e validações (`expect`, `should`).
- Seletores resilientes baseados no padrão `data-test`.

### 2. Gestão de Estado e Dados Dinâmicos

- **Faker.js**: Uso ativo para geração de massa de dados aleatória e segura em cada execução (nomes, CPFs, transações), revelando gaps na validação e garantindo um portfólio rico de testes não viciados.
- **Database Seeding Limpo**: A aplicação expõe e consome instâncias via API para reset explícito e populamento do banco (`yarn db:seed`) antes da execução da suíte, assegurando um princípio E2E real: **nenhum teste deverá ser dependente da execução do anterior**.

### 3. Integração em Camadas Diferentes (UI vs API)

- Testes voltados especificamente à **API** via `cy.request()`. Validamos diretamente operações sensíveis sem precisar sobrecarregar as suítes da UI.
- Uso de **Agile JSON Schemas (Ajv)** para realizar **Testes de Contrato**. Assegura-se de que qualquer mudança no response do backend que fira a interface documentada será imediatamente barrada pela esteira de testes.

---

## ⚙️ CI/CD com GitHub Actions

O core deste repositório reside no pipeline `.github/workflows/cypress.yml`. Ele executa um processo de integração profissional, focado na prevenção precoce de bugs.

**Características da Esteira:**

- 🛡️ **Gatilhos (Triggers)**: Rodando em `push` e `pull_request` para a `main`, bem como em execução de manutenções via **Cron agendado (diário às 09:00 BRT)**, protegendo contra degradações silenciosas causadas por dependências de terceiros ("software rot").
- 🚦 **Filtragem por Tags (`@cypress/grep`)**: Dividimos as execuções de forma paralelizável no GitHub Actions. Passamos as tags como parâmetros de ambiente (`@smoke`, `@api`, `@regression`).
- ⚡ **Desempenho**: Estratégia nativa do `setup-node` acoplada ao repositório de binários para realizar o **Cache** otimizado de pacotes Node (`node_modules`) e do executável Cypress.
- 🧹 **Análise Estática (Lint)**: Nenhum teste roda se o código for submetido com erros de esqueleto, má indentação ou lints inseguros. A esteira força execução do `eslint`.
- 📊 **Notificação & Geração de Reports**: Resultados aglomeram de testes independentes no CI e viram uma interface HTML via **Mochawesome**. Além de upload direto em instâncias no Artifact, notificadores integrados via SMTP disparam comunicados do Job (Success/Failure) por e-mail no final.

---

## 🛠️ Execução do Projeto

### Pré-requisitos

- Node.js versão `20` ou `22`
- Yarn `1.x`

### 1. Instalação e Inicialização

```bash
# Clone e entre no projeto
git clone https://github.com/SeuUsername/RealWorldAppCypress-Lume.git
cd RealWorldAppCypress-Lume

# Instale as dependências
yarn install

# Inicie o back-end, banco de testes e front-end simultaneamente
yarn dev
```

### 2. Formas de rodar os Testes

O projeto separa os testes por comandos práticos descritos no `package.json`:

```bash
# Abrir Interface Interativa Cypress
yarn cypress:open

# Rodar todos os testes no Terminal
yarn test:ui

# Rodar apenas jornada crítica de negócio (@smoke)
yarn test:smoke

# Rodar a regressão completa do software
yarn test:regression

# Rodar os testes focados apenas em backend API
yarn test:api:tags
```

---

## Decisões de Engenharia e Resolução de Problemas Críticos

### Otimização de Resolvers de Modulos no Node v22 (@cypress/grep)

A atualização do ecossistema para o Node v22 introduziu breaking changes em relação aos Export Maps, afetando as resoluções do pacote `@cypress/grep`. A correção foi implementada isolando as dependências nativas estritas diretamente nos módulos do projeto, garantindo uma compatibilidade estável da execução do Mocha com as novas restrições de segurança do Node v22, permitindo executar as validações via TAGs (`@smoke`) sem interrupções de import.

### Cache Strategy Optimization (Vite vs. Legacy Build)

Uma análise apurada dos logs do GitHub Actions CI demonstrou que a estratégia padrão de cache do setup Node gastava créditos buscando o output nativo padrão de outros bundlers (como a pasta `dist`). Como o front-end deste rep foi migrado para a velocidade do Vite gerando na diretória de build específica, mapear explicitamente essa ação de cache no pipeline (ignorando o fallback padrão e focando na árvore de pacotes lógica) eliminou os warmups desnecessários e cortou drasticamente o tempo líquido das execuções (`execution time`).

### Implementação de CI/CD Parallel Matrix

Com o intuito estratégico de garantir **Fast Feedback**, estruturei as esteiras de teste no GitHub Actions rodando horizontalmente através da funcionalidade `matrix`. Isso dilui os workflows e paraleliza de forma inteligente as execuções das tags de negócio (`@smoke`, `@api`, `@regression`). Este paralelismo assegura a resiliência da stack sem gargalar os deploy reviews e poupando minutagem máquina das frotas da Actions, gerando escala eficiente em ambientes Enterprise.

---

_Repositório construído sob o intuito de estudo real e comprovação empírica de melhores práticas em Engenharia de Qualidade E2E._
