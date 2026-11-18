describe('Taxonomy settings', () => {
  let taxonomyName;

  beforeEach(() => {
    cy.autologin();
    cy.createTaxonomy({
      name: 'e2e-settings',
      title: 'E2E settings',
      terms: [{ key: 'mars', title: 'Mars', translations: { en: 'Mars' } }],
    }).then((name) => {
      taxonomyName = name;
      cy.visit(`/controlpanel/taxonomies/${name}`);
    });
  });

  afterEach(() => {
    cy.autologin();
    cy.removeTaxonomy(taxonomyName);
  });

  it('does not offer the field prefix and does not send it on save', () => {
    cy.contains('.item', /^Edit taxonomy$/).click();

    cy.contains('Field prefix').should('not.exist');

    cy.intercept('PATCH', '**/@taxonomy/*').as('saveSettings');
    cy.get('form').find('button[type="submit"]').click();

    cy.wait('@saveSettings').then(({ request, response }) => {
      expect(request.body).to.not.have.property('field_prefix');
      expect(response.statusCode).to.equal(204);
    });
  });
});
