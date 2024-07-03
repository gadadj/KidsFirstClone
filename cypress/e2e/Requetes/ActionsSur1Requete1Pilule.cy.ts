/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration - Requêtes', () => {

  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=245ad812-f2a3-4401-9506-a98c647c3779');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
  });

  it('Éditer une pilule via la facette', () => {
    cy.checkValueFacetAndApply('Sample Type', 'RNA');

    cy.validatePillSelectedQuery('Sample Type', ['DNA','RNA']);
    cy.validateTotalSelectedQuery(/(27.2K|26.2K|32K|32.1K)/);
    cy.validateTableResultsCount(/(27,172|26,173|27,192|32,036|32,056)/);
    cy.validateClearAllButton(false);
  });

  it('Éditer une pilule via son popup', () => {
    cy.get('[class*="QueryValues_queryValuesContainer"]').contains('DNA').click({force:true});
    cy.get('[class*="filtersDropdown"] input[id="input-RNA"]').check({force: true});
    cy.clickAndIntercept('[class*="filtersDropdown"] [data-cy="Apply_Sample Type"]', 'POST', '**/graphql', 15);

    cy.validatePillSelectedQuery('Sample Type', ['DNA','RNA']);
    cy.validateTotalSelectedQuery(/(27.2K|26.2K|32K|32.1K)/);
    cy.validateTableResultsCount(/(27,172|26,173|27,192|32,036|32,056)/);
    cy.validateClearAllButton(false);
  });

  it('Ajouter une pilule à une requête', () => {
    cy.checkValueFacetAndApply('Collection Sample Type', 'Saliva');

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validatePillSelectedQuery('Collection Sample Type', ['Saliva'], 1);
    cy.validateOperatorSelectedQuery('and');
    cy.validateTotalSelectedQuery(/(3,181|3,260|3,261|5,335|5,336)/);
    cy.validateTableResultsCount(/(3,181|3,260|3,261|5,335|5,336)/);
    cy.validateClearAllButton(false);
  });

  it('Construire une deuxième requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('button[class*="QueryTools_button"]').contains('New query').click({force:true});
    for (let i = 0; i < 16; i++) {
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
    };

    cy.get('body').contains('Use the search tools & facets on the left to build a query').should('exist');
    cy.validateTotalSelectedQuery(/\d{2}\.\d{1}K/);
    cy.validateTableResultsCount(/\d{2}\,\d{3}/);
    cy.validateClearAllButton(false);

    cy.get('[data-cy="SidebarMenuItem_Study"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').click({force: true}); // data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button').contains('Collapse all').should('exist'); // data-cy="ExpandAll"
    cy.checkValueFacetAndApply('Study Code', 'KF-CDH');

    cy.validatePillSelectedQuery('Study Code', ['KF-CDH']);
    cy.validateTotalSelectedQuery('2,031');
    cy.validateTableResultsCount('2,031');
    cy.validateClearAllButton(true);
  });

  it('Dupliquer une requête', () => {
    cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
    cy.get('[class*="QueryBar_selected"]').find('[data-icon="copy"]').click({force: true});
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.validatePillSelectedQuery('Sample Type', ['DNA']);
    cy.validateTotalSelectedQuery(/(27K|26.1K|31.9K|32K)/);
    cy.validateTableResultsCount(/(26,073|26,978|26,998|31,933|31,953)/);
    cy.validateClearAllButton(true);
  });
});
