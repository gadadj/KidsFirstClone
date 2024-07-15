/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des études - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitStudiesPage();
  });

  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Program - Kids First', () => {
    cy.validateFacetFilter('Program', 'Kids First', 'Kids First', /^34 Results$/, 0, false);
    cy.validateFacetRank(0, 'Program');
  });

  it('Domain - Cancer and Birth Defect', () => {
    cy.validateFacetFilter('Domain', 'Cancer and Birth Defect', 'CANCERANDBIRTHDEFECT', /^2 Results$/, 0, false);
    cy.validateFacetRank(1, 'Domain');
  });

  it('Data Category - Transcriptomics', () => {
    cy.validateFacetFilter('Data Category', 'Transcriptomics', 'Transcriptomics', /\d{1} Results$/, 0, false);
    cy.validateFacetRank(2, 'Data Category');
  });

  it('Experimental Strategy - RNA-Seq', () => {
    cy.validateFacetFilter('Experimental Strategy', 'RNA-Seq', 'RNA-Seq', /\d{1} Results$/, 0, false);
    cy.validateFacetRank(3, 'Experimental Strategy');
  });

  it('Family Data - False', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Family Data"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="false"]', 'POST', '**/graphql', 7);
    cy.validateTableResultsCount(/\d{1} Results$/);
    cy.validateFacetRank(4, 'Family Data');
  });
});
