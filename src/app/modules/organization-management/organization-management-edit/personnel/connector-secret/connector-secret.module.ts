import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorSecretComponent } from './connector-secret.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ConnectorSecretComponent],
    exports:      [ConnectorSecretComponent],
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        FormsModule,
        TranslateModule
    ]
})
export class ConnectorSecretModule { }
