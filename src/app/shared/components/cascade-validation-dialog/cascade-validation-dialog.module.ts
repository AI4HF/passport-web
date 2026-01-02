import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CascadeValidationDialogComponent } from './cascade-validation-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [CascadeValidationDialogComponent],
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        RippleModule,
        TranslateModule
    ],
    exports: [CascadeValidationDialogComponent]
})
export class CascadeValidationDialogModule { }