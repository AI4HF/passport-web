/**
 * Personnel CRUD testing
 */
describe('Personnel Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Organization and Personnel pages', () => {
        cy.visit('/organization-management/organization');
        cy.url().should('include', '/organization-management/organization');
        cy.wait(500);
        cy.visit('/organization-management/personnel');
        cy.url().should('include', '/organization-management/personnel');
    });

    it('should create, update, and delete a personnel entry', () => {
        cy.visit('/organization-management/organization');
        cy.visit('/organization-management/personnel');
        cy.wait(500);

        // cancel personnel creation
        cy.get('button .pi-plus').click();
        cy.get('p-dialog').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.wait(500);
        cy.get('p-dialog').should('not.exist');

        // create personnel
        cy.get('button .pi-plus').click();
        cy.get('button[pbutton][type="submit"]').should('be.disabled');
        cy.get('input[formControlName="username"]').type('test');
        cy.get('input[formControlName="password"]').type('test');
        cy.get('input[formControlName="firstName"]').type('test');
        cy.get('input[formControlName="lastName"]').type('test');
        cy.get('input[formControlName="email"]').type('test@gmail.com');

        cy.get('p-dropdown[formControlName="role"]').click();
        cy.get('.p-dropdown-item').contains('Study Owner').click();

        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(0).should('contain.text', 'test');
            cy.get('td').eq(1).should('contain.text', 'test');
            cy.get('td').eq(2).should('contain.text', 'Study Owner');
            cy.get('td').eq(3).should('contain.text', 'test');
        });

        // edit personnel
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-pencil').click();
        });
        cy.get('input[formControlName="firstName"]').clear().type('test2');
        cy.get('input[formControlName="lastName"]').clear().type('test2');
        cy.get('input[formControlName="email"]').clear().type('test2@gmail.com');
        cy.get('p-dropdown[formControlName="role"]').click();
        cy.get('.p-dropdown-item').contains('Study Owner').click();
        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(0).should('contain.text', 'test2');
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'Study Owner');
            cy.get('td').eq(3).should('contain.text', 'test2');
        });

        // delete personnel
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });
    });
});
