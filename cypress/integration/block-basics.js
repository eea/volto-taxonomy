import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block: Empty', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.image').contains('Image').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.contains('My Add-on Page');
    cy.get('.block.image');



    cy.get('.toolbar-bottom #toolbar-personal').click();
    cy.get('.toolbar-content.show .pastanaga-menu-list').contains('Site Setup').click();

    //install taxonomies

    cy.get('.controlpanel').contains('Add-Ons').click();
    cy.get('.accordion.ui').contains('collective.taxonomy').click();

    cy.get('.content.active button').then(($btn) => {
      if ($btn.hasClass('installAction')) {
        cy.get('.content.active button').click();
    }});

    cy.get('.accordion.ui').contains('eea.api.taxonomy').click();
    cy.get('.content.active button').then(($btn) => {
      if ($btn.hasClass('installAction')) {
        cy.get('.content.active button').click();
    }});
    
    cy.get('.toolbar-actions a').first().click();
    
    cy.get('.controlpanel').contains('Taxonomies').click();
    cy.get('.controlpanel-taxonomies .single.line.striped.compact.table').contains('NUTS Levels').click();

    cy.get('.single.line.attached.compact.table').contains('Level 0').click();

    cy.get('.ui.input').eq(1).type("Test");
    cy.get('.ui.compact.button').contains("OK").click();

    cy.get('.ui.segment button').contains('Add new entry').click();

    cy.get('.single.line.attached.compact.table svg').first().trigger('mousedown', { which: 1 }, { force: true }).trigger('mousemove', 0, 120, {force: true}).trigger('mouseup');
    cy.contains('Save').click();

    // then the page view should contain our changes
    
  });
});
