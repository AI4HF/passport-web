import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreationStepAssignmentTableModule } from './creation-step-assignment-table/creation-step-assignment-table.module';
import { CreationStepAssignmentFormModule } from './creation-step-assignment-form/creation-step-assignment-form.module';
import { CreationStepAssignmentRoutingModule } from './creation-step-assignment-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CreationStepAssignmentRoutingModule,
        CreationStepAssignmentTableModule,
        CreationStepAssignmentFormModule
    ]
})
export class CreationStepAssignmentModule { }