/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Dashboard - Bouton Analyze in Cavatica (déconnecté)', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('tr[data-row-key="GF_0023NT7Z"]').find('[type="checkbox"]').check({force: true});
    cy.get('button[aria-label="Analyze in Cavatica"]').clickAndWait({force: true});
  });

  it('Vérifier les informations affichées - Modal', () => {
    cy.get('[class="ant-modal-confirm-body"]').contains('Connect to Cavatica').should('exist');
    cy.get('[class="ant-modal-confirm-body"]').contains('In order to analyze your files you must first connect your Cavatica account. Once you are connected, you will be redirected back to this page.').should('exist');
    cy.get('[class="ant-modal-confirm-btns"] button[class*="ant-btn-default"]').contains('Cancel').should('exist');
    cy.get('[class="ant-modal-confirm-btns"] button[class*="ant-btn-primary"]').contains('Connect').should('exist');
  });
});

describe('Page Dashboard - Bouton Analyze in Cavatica (connecté)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/cavatica/authenticated', {
      statusCode: 200,
      body: {
        "authenticated": true,
        "expiration": 1722180513
      },
    }).as('cavaticaAuthenticated');
    cy.intercept('GET', '**/cavatica2/v2/projects', {
      statusCode: 200,
      body: {
        "href": "https://cavatica-api.sbgenomics.com/v2/projects?offset=0&limit=50",
        "items": [
            {
                "href": "https://cavatica-api.sbgenomics.com/v2/projects/mock/cypress-project",
                "id": "mock/cypress-project",
                "name": "Cypress-Project",
                "category": "PRIVATE",
                "created_by": "mock",
                "created_on": "2024-07-05T00:00:00Z",
                "modified_on": "2024-07-05T00:00:00Z"
            }
        ],
        "links": []
    },
    }).as('cavaticaProjects');

    cy.visitDataExploration('datafiles', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.wait('@cavaticaAuthenticated');
    cy.wait('@cavaticaProjects');
    cy.get('tr[data-row-key="GF_0023NT7Z"]').find('[type="checkbox"]').check({force: true});
    cy.get('button[aria-label="Analyze in Cavatica"]').clickAndWait({force: true});
  });

  it('Vérifier les informations affichées - Modal', () => {
    cy.get('[class="ant-modal-title"]').contains('Analyze in Cavatica').should('exist');
    cy.get('[class="ant-modal-body"]').contains('Copy files to...').should('exist');
    cy.get('[class="ant-modal-body"]').contains('You are authorized to copy').should('exist');
    cy.get('[class="ant-modal-body"]').contains('1 files').should('exist');
    cy.get('[class="ant-modal-body"]').contains('(out of 1 selected) to your Cavatica workspace.').should('exist');
    cy.get('[class*="CavaticaAnalyzeModal_studiesList"]').contains('Kids First: Genomic Analysis of Congenital Heart Defects and Acute Lymphoblastic Leukemia in Children with Down Syndrome').should('exist');
    cy.get('[class*="CavaticaAnalyzeModal_studiesList"] [class*="ant-typography-secondary"]').contains('1').should('exist');
    cy.get('[class*="CavaticaAnalyzeModal_studiesList"] [data-icon="file-text"]').should('exist');
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-default"]').contains('Cancel').should('exist');
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-primary"]').contains('Copy files').should('exist');
  });

  it('Vérifier les informations affichées - Projet', () => {
    cy.get('[class*="CavaticaAnalyzeModal"] [class="ant-select-selector"]').clickAndWait({force: true});
    cy.get('[class*="CavaticaAnalyzeModal"] [class="ant-select-tree-list-holder"]').contains('Cypress-Project').should('exist');
  });

  it('Valider les liens disponibles - Bouton New project', () => {
    cy.intercept('GET', '**/cavatica2/v2/billing/groups', {
      statusCode: 200,
      body: {
        "href": "https://cavatica-api.sbgenomics.com/v2/billing/groups?offset=0&limit=50",
        "items": [
            {
                "id": "project_billing_group_id",
                "href": "https://cavatica-api.sbgenomics.com/v2/billing/groups/project_billing_group_id",
                "name": "Pilot Funds (mock)"
            }
        ],
        "links": []
    },
    }).as('cavaticaAuthenticated');

    cy.get('[class*="CavaticaAnalyzeModal"] [class="ant-select-selector"]').clickAndWait({force: true});
    cy.get('[class*="CavaticaAnalyzeModal_cavaticaTreeDropdownFooter"] button').clickAndWait({force: true});
    cy.get('[class="ant-modal-title"]').contains('New project').should('exist');
    cy.get('label[for="project_name"]').contains('Project name').should('exist');
    cy.get('[class="ant-modal-content"] input').should('have.attr', 'placeholder', 'e.g. KF-NBL Neuroblastoma Aligned Reads');
    cy.get('label[for="project_billing_group"]').contains('Project billing group').should('exist');
    cy.get('[class="ant-select-selection-item"]').contains('Pilot Funds (mock)').should('exist');
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-default"]').contains('Cancel').should('exist');
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-primary"]').contains('Create project').should('exist');
  });
});
