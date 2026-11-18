describe('Taxonomy term deletion', () => {
  let taxonomyName;

  const terms = [
    { key: 'mars', title: 'Mars', translations: { en: 'Mars' } },
    { key: 'venus', title: 'Venus', translations: { en: 'Venus' } },
  ];

  const deleteButton = () => cy.get('[data-cy="taxonomy-delete-node"]').first();

  const dialog = () => cy.get('.ui.modal');

  beforeEach(() => {
    cy.autologin();
    cy.createTaxonomy({
      name: 'e2e-delete',
      title: 'E2E delete',
      terms: terms,
    }).then((name) => {
      taxonomyName = name;
      cy.visit(`/controlpanel/taxonomies/${name}`);
    });
  });

  afterEach(() => {
    cy.autologin();
    cy.removeTaxonomy(taxonomyName);
  });

  it('warns before deleting a term that is in use', () => {
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Mars');

    cy.intercept('GET', '**/@taxonomy/*', (req) => {
      req.continue((res) => {
        res.body.usage = { mars: 3 };
      });
    }).as('reloadTaxonomy');
    cy.intercept('PATCH', '**/@taxonomy/*').as('saveTaxonomy');

    cy.get('#save-taxonomy-data').click();
    cy.wait('@saveTaxonomy');
    cy.wait('@reloadTaxonomy');
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Mars');

    deleteButton().click();
    dialog().should('be.visible');
    dialog().should('contain', 'Delete a term that is in use?');
    dialog().should('contain', 'is used by 3 content items');

    dialog().find('.actions button').contains('Cancel').click();
    dialog().should('not.exist');
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Mars');

    deleteButton().click();
    dialog().find('.actions button').contains('Delete node').click();
    dialog().should('not.exist');
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Venus');
  });

  it('deletes the term without asking when the taxonomy has no usage', () => {
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Mars');

    deleteButton().click();

    dialog().should('not.exist');
    cy.get('.taxonomy-tree-title input').first().should('have.value', 'Venus');
  });
});
