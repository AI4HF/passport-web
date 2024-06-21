import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelComponent } from './personnel.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {DockModule} from "primeng/dock";

@NgModule({
    declarations: [PersonnelComponent],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        FormsModule,
        RippleModule,
        TranslateModule,
        AutoCompleteModule,
        DockModule
    ]
})
export class PersonnelModule { }
