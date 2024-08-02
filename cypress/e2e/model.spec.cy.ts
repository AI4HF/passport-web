/**
 * Model CRUD testing
 */
describe('Model Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Model Management page', () => {
        cy.visit('/model-management');
        cy.url().should('include', '/model-management');
    });

    it('should create, update, and delete a model entry', () => {
        cy.visit('/model-management');
        cy.wait(500);

        // Select a study
        cy.contains('Select a study').click();
        cy.wait(500);
        cy.get('ul.p-dropdown-items').within(() => {
            cy.contains('li', 'Risk').click();
        });

        // cancel create model
        cy.get('button .pi-plus').click();
        cy.get('button').contains('Cancel').click();
        cy.wait(500);
        cy.get('app-model-management-form').should('not.exist');

        // create model
        cy.get('button .pi-plus').click();
        cy.get('button[pbutton][type="submit"]').should('be.disabled');
        cy.get('input[formControlName="name"]').type('Test Model');
        cy.get('input[formControlName="version"]').type('1.0');
        cy.get('input[formControlName="tag"]').type('Tag1');
        cy.get('input[formControlName="modelType"]').type('Type1');
        cy.get('input[formControlName="productIdentifier"]').type('PID123');
        cy.get('input[formControlName="trlLevel"]').type('Level1');
        cy.get('input[formControlName="license"]').type('MIT');
        cy.get('input[formControlName="primaryUse"]').type('Primary Use');
        cy.get('input[formControlName="secondaryUse"]').type('Secondary Use');
        cy.get('input[formControlName="intendedUsers"]').type('Users');
        cy.get('input[formControlName="counterIndications"]').type('None');
        cy.get('input[formControlName="ethicalConsiderations"]').type('Considerations');
        cy.get('input[formControlName="limitations"]').type('Limitations');
        cy.get('input[formControlName="fairnessConstraints"]').type('Constraints');
        cy.get('button[pbutton][type="submit"]').should('not.be.disabled').click();

        cy.contains('th', 'ID').should('be.visible').click();

        // Verify the model creation
        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'Test Model');
            cy.get('td').eq(2).should('contain.text', '1.0');
            cy.get('td').eq(3).should('contain.text', 'Tag1');
            cy.get('td').eq(4).should('contain.text', 'Type1');
        });

        // Edit model
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-pencil').click();
        });

        cy.get('input[formControlName="name"]').should('have.value', 'Test Model').clear().type('Updated Model');
        cy.get('input[formControlName="version"]').should('have.value', '1.0').clear().type('2.0');
        cy.get('input[formControlName="tag"]').should('have.value', 'Tag1').clear().type('UpdatedTag');
        cy.get('input[formControlName="modelType"]').should('have.value', 'Type1').clear().type('UpdatedType');
        cy.get('input[formControlName="productIdentifier"]').should('have.value', 'PID123').clear().type('UpdatedPID');
        cy.get('input[formControlName="trlLevel"]').should('have.value', 'Level1').clear().type('UpdatedLevel');
        cy.get('input[formControlName="license"]').should('have.value', 'MIT').clear().type('Apache');
        cy.get('input[formControlName="primaryUse"]').should('have.value', 'Primary Use').clear().type('Updated Primary Use');
        cy.get('input[formControlName="secondaryUse"]').should('have.value', 'Secondary Use').clear().type('Updated Secondary Use');
        cy.get('input[formControlName="intendedUsers"]').should('have.value', 'Users').clear().type('Updated Users');
        cy.get('input[formControlName="counterIndications"]').should('have.value', 'None').clear().type('Updated None');
        cy.get('input[formControlName="ethicalConsiderations"]').should('have.value', 'Considerations').clear().type('Updated Considerations');
        cy.get('input[formControlName="limitations"]').should('have.value', 'Limitations').clear().type('Updated Limitations');
        cy.get('input[formControlName="fairnessConstraints"]').should('have.value', 'Constraints').clear().type('Updated Constraints');

        cy.get('button').contains('Save').should('not.be.disabled').click();

        // Verify the model update
        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'Updated Model');
            cy.get('td').eq(2).should('contain.text', '2.0');
            cy.get('td').eq(3).should('contain.text', 'UpdatedTag');
            cy.get('td').eq(4).should('contain.text', 'UpdatedType');
        });

        // Delete model
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });

        // Verify the model deletion
        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('not.contain.text', 'Updated Model');
        });
    });
});
