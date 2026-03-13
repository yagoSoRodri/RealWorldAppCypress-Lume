import { isMobile } from "../../support/utils";

// Previne que erros de DOM não capturados quebrem o teste
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Cannot read properties of null (reading 'document')")) {
    return false;
  }
});

describe("Visualizar histórico de transações com sucesso", () => {
  const ctx = {};

  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Cannot read properties of null (reading 'document')")) {
        return false;
      }
    });

    cy.task("db:seed");

    cy.intercept("GET", "/transactions*").as("personalTransactions");
    cy.intercept("GET", "/transactions/public*").as("publicTransactions");
    cy.intercept("GET", "/notifications").as("notifications");

    cy.database("filter", "users").then((users) => {
      ctx.user = users[0];

      cy.visit("/");
      cy.loginByXstate(ctx.user.username);
    });
  });

  it("Deve exibir o histórico de transações de um usuário corretamente", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();
    cy.getBySelLike("personal-tab").should("have.class", "Mui-selected");

    cy.wait("@personalTransactions")
      .its("response.body.results")
      .then((transactions) => {
        expect(transactions).to.have.length.greaterThan(0);

        cy.getBySel("transaction-list").should("be.visible");

        cy.getBySelLike("transaction-item").should("have.length", transactions.length);

        transactions.forEach((transaction) => {
          cy.getBySel("transaction-list").should("contain", transaction.description);
        });

        cy.log(`✅ Exibindo ${transactions.length} transações no histórico`);

        const firstTransaction = transactions[0];
        cy.getBySelLike("transaction-item")
          .first()
          .within(() => {
            cy.getBySelLike("sender").should("be.visible");
            cy.getBySelLike("receiver").should("be.visible");
            cy.getBySelLike("amount").should("be.visible");
          });

        cy.getBySelLike("transaction-item").first().click({ force: true });

        cy.location("pathname").should("include", "/transaction/");
        cy.getBySel("transaction-detail-header").should("be.visible");
        cy.getBySelLike("transaction-description").should("contain", firstTransaction.description);
      });
  });

  it("Deve permitir filtrar o histórico por data", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();
    cy.wait("@personalTransactions");

    cy.database("find", "transactions").then((transaction) => {
      const dateRangeStart = new Date(transaction.createdAt);
      const dateRangeEnd = new Date(transaction.createdAt);

      cy.pickDateRange(dateRangeStart, dateRangeEnd);

      cy.wait("@personalTransactions")
        .its("response.body.results")
        .then((filteredTransactions) => {
          cy.log(`📅 Filtrado para ${filteredTransactions.length} transações`);

          if (filteredTransactions.length > 0) {
            cy.getBySelLike("transaction-item").should("have.length", filteredTransactions.length);
          }
        });
    });
  });

  it("Deve permitir filtrar o histórico por valor", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();
    cy.wait("@personalTransactions");

    const amountRange = {
      min: 100,
      max: 500,
    };

    cy.setTransactionAmountRange(amountRange.min, amountRange.max);

    cy.getBySelLike("filter-amount-range-text").should(
      "contain",
      `$${amountRange.min} - $${amountRange.max}`
    );

    cy.wait("@personalTransactions")
      .its("response.body.results")
      .then((filteredTransactions) => {
        cy.log(`💰 Filtrado para ${filteredTransactions.length} transações`);

        const rawAmountMin = amountRange.min * 100;
        const rawAmountMax = amountRange.max * 100;

        filteredTransactions.forEach((transaction) => {
          expect(transaction.amount).to.be.within(rawAmountMin, rawAmountMax);
        });
      });
  });

  it("Deve permitir paginar o histórico de transações", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();

    cy.wait("@personalTransactions")
      .its("response.body.results")
      .should("have.length", Cypress.env("paginationPageSize"));

    cy.log("📃 Rolando para a próxima página");
    cy.getBySel("transaction-list").children().scrollTo("bottom");

    cy.wait("@personalTransactions")
      .its("response.body")
      .then(({ results, pageData }) => {
        expect(results).to.have.length.greaterThan(0);
        expect(pageData.page).to.equal(2);
        cy.log(`✅ Página ${pageData.page} de ${pageData.totalPages} carregada`);
      });
  });
});

describe("Tentar visualizar o histórico de transações sem transações anteriores", () => {
  const ctx = {};

  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Cannot read properties of null (reading 'document')")) {
        return false;
      }
    });

    cy.task("db:seed");

    cy.intercept("GET", "/transactions*").as("personalTransactions");
    cy.intercept("GET", "/transactions/public*").as("publicTransactions");
    cy.intercept("GET", "/notifications").as("notifications");

    cy.database("filter", "users").then((users) => {
      ctx.user = users[0];

      cy.visit("/");
      cy.loginByXstate(ctx.user.username);
    });
  });

  it("Deve exibir uma mensagem indicando que não há transações quando filtro não retorna resultados", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();
    cy.wait("@personalTransactions");

    const futureDate = new Date(2030, 0, 1);
    cy.pickDateRange(futureDate, futureDate);

    cy.wait("@personalTransactions").its("response.body.results").should("have.length", 0);

    cy.getBySel("empty-list-header").should("be.visible").and("contain", "No Transactions");

    cy.getBySelLike("empty-create-transaction-button")
      .should("be.visible")
      .and("have.attr", "href", "/transaction/new")
      .contains("create a transaction", { matchCase: false });

    cy.log("✅ Mensagem de lista vazia exibida corretamente");

    cy.getBySelLike("empty-create-transaction-button").click();
    cy.location("pathname").should("equal", "/transaction/new");
  });

  it("Deve exibir lista vazia ao aplicar filtro de valor sem resultados", () => {
    cy.wait("@notifications");
    cy.wait("@publicTransactions");

    cy.getBySelLike("personal-tab").click();
    cy.wait("@personalTransactions");

    const impossibleAmountRange = {
      min: 99999,
      max: 100000,
    };

    cy.setTransactionAmountRange(impossibleAmountRange.min, impossibleAmountRange.max);

    cy.wait("@personalTransactions").its("response.body.results").should("have.length", 0);

    cy.getBySel("empty-list-header").should("be.visible").and("contain", "No Transactions");

    cy.log("✅ Lista vazia exibida para filtro de valor sem resultados");
  });
});
