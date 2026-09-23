import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { StewardManagementComponent } from './steward-management.component';
import { StewardDatasetTableComponent } from './steward-dataset-table/steward-dataset-table.component';
import { StewardMetadataFormComponent } from './steward-metadata-form/steward-metadata-form.component';
import { StewardManagementRoutingModule } from './steward-management-routing.module';

@NgModule({
    declarations: [
        StewardManagementComponent,
        StewardDatasetTableComponent,
        StewardMetadataFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        DialogModule,
        DividerModule,
        RippleModule,
        TooltipModule,
        TranslateModule,
        StewardManagementRoutingModule
    ]
})
export class StewardManagementModule { }
