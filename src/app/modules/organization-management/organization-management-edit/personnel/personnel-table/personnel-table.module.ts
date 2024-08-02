import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelTableComponent } from './personnel-table.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import {RippleModule} from "primeng/ripple";
import {DockModule} from "primeng/dock";
import {PersonnelFormModule} from "../personnel-form/personnel-form.module";

@NgModule({
    declarations: [PersonnelTableComponent],
    exports: [
        PersonnelTableComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TranslateModule,
        RippleModule,
        DockModule,
        PersonnelFormModule
    ]
})
export class PersonnelTableModule { }

