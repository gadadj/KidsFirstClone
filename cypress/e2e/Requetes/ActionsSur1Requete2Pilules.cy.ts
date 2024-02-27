/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=c32c1174-fad6-4e02-a6eb-09e1454e2d21');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click();
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Modifier l\'opérateur d\'une requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
    cy.get('[class*="QueryBar_selected"]').find('[class*="Combiner_operator"]').click({force: true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql1', {timeout: 20*1000});
    };

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000'], 1);
    cy.validateOperatorSelectedQuery('or');
    cy.validateTotalSelectedQuery('15.7K');
    cy.validateTableResultsCount('15,707');
    cy.validateClearAllButton(false);

    cy.intercept('POST', '**/graphql').as('getPOSTgraphql2');
    cy.get('[class*="QueryBar_selected"]').find('[class*="Combiner_operator"]').click({force: true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql2', {timeout: 20*1000});
    };

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000'], 1);
    cy.validateOperatorSelectedQuery('and');
    cy.validateTotalSelectedQuery('76');
    cy.validateTableResultsCount('76');
    cy.validateClearAllButton(false);
  });

  it('Supprimer une des pilules d\'une requête avec le X', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_selected"]').find('button[class*="QueryPill_close"]').eq(0).click();
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
    };

    cy.validatePillSelectedQuery('Age at Biospec. Collection (days)', ['20000']);
    cy.validateTotalSelectedQuery('76');
    cy.validateTableResultsCount('76');
    cy.validateClearAllButton(false);
  });
});
