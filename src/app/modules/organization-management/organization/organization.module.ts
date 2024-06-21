import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TranslateModule } from '@ngx-translate/core';
import {RippleModule} from "primeng/ripple";
import {DockModule} from "primeng/dock";

@NgModule({
    declarations: [OrganizationComponent],
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TranslateModule,
        RippleModule,
        DockModule
    ]
})
export class OrganizationModule { }
