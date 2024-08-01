/**
 * Dataset CRUD testing
 */
describe('Dataset Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Dataset Management page', () => {
        cy.visit('/dataset-management');
        cy.url().should('include', '/dataset-management');
    });

    it('should create, update, and delete a dataset entry using the multi-step form', () => {
        cy.visit('/dataset-management');
        cy.wait(500);

        // create dataset
        cy.get('button .pi-plus').click();
        cy.get('button').should('be.disabled');
        cy.get('input[formControlName="title"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="version"]').type('test');
        cy.get('input[formControlName="referenceEntity"]').type('test');

        cy.get('p-dropdown[formControlName="featureset"]').click();
        cy.get('.p-dropdown-item').contains('AI4HF').click();

        cy.get('p-dropdown[formControlName="population"]').click();
        cy.get('.p-dropdown-item').contains('study1').click();

        cy.get('p-dropdown[formControlName="organization"]').click();
        cy.get('.p-dropdown-item').contains('Amsterdam').click();

        cy.get('input[formControlName="numOfRecords"]').clear().type("100");
        cy.get('p-checkbox[formControlName="synthetic"]').click();

        cy.get('button').should('not.be.disabled');
        cy.get('button').contains('Next').click();

        // create dataset characteristic
        cy.wait(500);
        cy.url().should('include', '/dataset-characteristics');
        cy.get('button .pi-plus').click();
        cy.get('button').should('be.disabled');

        cy.get('p-dropdown[formControlName="feature"]').click();
        cy.get('.p-dropdown-item').contains('age').click();

        cy.get('input[formControlName="characteristicName"]').type('test');
        cy.get('input[formControlName="value"]').type('test');
        cy.get('input[formControlName="valueDataType"]').type('test');
        cy.get('button').contains('Save').should('not.be.disabled');
        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(0).should('contain.text', 'test');
            cy.get('td').eq(1).should('contain.text', 'age');
            cy.get('td').eq(2).should('contain.text', 'test');
            cy.get('td').eq(3).should('contain.text', 'test');
        });

        // create learning dataset
        cy.get('.stepper').contains('Learning Dataset Creation').click();
        cy.url().should('include', '/learning-dataset-creation');
        cy.get('button .pi-plus').click();
        cy.get('input[formControlName="transformationTitle"]').type('test');
        cy.get('input[formControlName="transformationDescription"]').type('test');
        cy.get('input[formControlName="learningDatasetDescription"]').type('test');
        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(0).should('contain.text', 'test');
            cy.get('td').eq(1).should('contain.text', 'test');
            cy.get('td').eq(2).should('contain.text', 'test');
        });

        //edit dataset
        cy.visit('/dataset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-pencil').click();
        });

        cy.get('input[formControlName="title"]').should('have.value', 'test');
        cy.get('input[formControlName="description"]').should('have.value', 'test');
        cy.get('input[formControlName="version"]').should('have.value', 'test');
        cy.get('input[formControlName="referenceEntity"]').should('have.value', 'test');
        cy.get('p-dropdown[formControlName="featureset"] .p-dropdown-label').should('contain.text', 'AI4HF');
        cy.get('p-dropdown[formControlName="population"] .p-dropdown-label').should('contain.text', 'study1');
        cy.get('p-dropdown[formControlName="organization"] .p-dropdown-label').should('contain.text', 'Amsterdam');
        cy.get('input[formControlName="numOfRecords"]').should('have.value', '100');
        cy.get('p-checkbox[formControlName="synthetic"] input').should('be.checked');

        cy.get('input[formControlName="title"]').clear().type('test2');
        cy.get('input[formControlName="description"]').clear().type('test2');
        cy.get('input[formControlName="version"]').clear().type('test2');
        cy.get('input[formControlName="referenceEntity"]').clear().type('test2');
        cy.get('p-dropdown[formControlName="featureset"]').click();
        cy.get('.p-dropdown-item').contains('AI4HF').click();
        cy.get('p-dropdown[formControlName="population"]').click();
        cy.get('.p-dropdown-item').contains('study1').click();
        cy.get('p-dropdown[formControlName="organization"]').click();
        cy.get('.p-dropdown-item').contains('Amsterdam').click();
        cy.get('input[formControlName="numOfRecords"]').clear().type('200');
        cy.get('button').contains('Save').click();

        cy.visit('/dataset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'test2');
            cy.get('td').eq(3).should('contain.text', 'test2');
            cy.get('td').eq(4).should('contain.text', 'test2');
        });

        // delete dataset
        cy.visit('/dataset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });
    });

    it('should stepper be disabled if dataset is created, otherwise stepper should be active to allow switching between forms', () => {
        cy.visit('/dataset-management');
        cy.wait(500);
        cy.get('button .pi-plus').click();

        cy.get('.p-timeline-event-content .cursor-pointer').each(($step, index) => {
            cy.wrap($step).click();
            cy.url().should('include', '/dataset-management/new/dataset-details');
        });

        cy.visit('/dataset-management');
        cy.wait(500);
        cy.get('button .pi-pencil').click();

        cy.get('.p-timeline-event-content .cursor-pointer').each(($step, index) => {
            const stepName = $step.text().trim().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
            cy.wrap($step).click();
            const expectedUrl = `/${stepName}`;
            cy.url().should('include', expectedUrl);
        });
    });
});
