import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareAgentTableComponent } from './software-agent-table.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { SoftwareAgentFormModule } from "../software-agent-form/software-agent-form.module";

@NgModule({
    declarations: [SoftwareAgentTableComponent],
    exports: [
        SoftwareAgentTableComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TranslateModule,
        RippleModule,
        TooltipModule,
        SoftwareAgentFormModule
    ]
})
export class SoftwareAgentTableModule { }
