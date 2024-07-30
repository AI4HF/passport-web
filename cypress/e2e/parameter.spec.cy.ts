/**
 * Parameter CRUD testing
 */
describe('Parameter Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Parameter Management page', () => {
        cy.visit('/parameter-management');
        cy.url().should('include', '/parameter-management');
    });

    it('should create, update, and delete a parameter entry', () => {
        cy.visit('/parameter-management');
        cy.wait(500);

        // cancel parameter creation
        cy.get('button .pi-plus').click();
        cy.get('p-dialog').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.wait(500);
        cy.get('p-dialog').should('not.exist');

        // create new parameter
        cy.get('button .pi-plus').click();
        cy.get('button[pbutton][type="submit"]').should('be.disabled');
        cy.get('input[formControlName="name"]').type('Test Parameter');
        cy.get('input[formControlName="dataType"]').type('String');
        cy.get('textarea[formControlName="description"]').type('This is a test parameter.');
        cy.get('button[pbutton][type="submit"]').should('not.be.disabled');
        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'Test Parameter');
            cy.get('td').eq(2).should('contain.text', 'String');
            cy.get('td').eq(3).should('contain.text', 'This is a test parameter.');
        });

        // edit parameter
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-pencil').click();
        });

        cy.get('input[formControlName="name"]').clear().type('Test Parameter 2');
        cy.get('input[formControlName="dataType"]').clear().type('String 2');
        cy.get('textarea[formControlName="description"]').clear().type('This is a test parameter 2.');

        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'Test Parameter 2');
            cy.get('td').eq(2).should('contain.text', 'String 2');
            cy.get('td').eq(3).should('contain.text', 'This is a test parameter 2.');
        });

        // delete parameter
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });
        cy.get('table tbody tr').should('not.exist');
    });
});