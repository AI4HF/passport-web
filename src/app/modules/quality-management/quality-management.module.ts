import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { QualityManagementComponent } from './quality-management.component';
import { QualityCriteriaTableComponent } from './quality-criteria-table/quality-criteria-table.component';
import { QualityAssessmentTableComponent } from './quality-assessment-table/quality-assessment-table.component';
import { QualityManagementRoutingModule } from './quality-management-routing.module';

@NgModule({
    declarations: [
        QualityManagementComponent,
        QualityCriteriaTableComponent,
        QualityAssessmentTableComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        TranslateModule,
        QualityManagementRoutingModule
    ]
})
export class QualityManagementModule { }
