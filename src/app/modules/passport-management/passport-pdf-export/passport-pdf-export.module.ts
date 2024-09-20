import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfExportComponent } from './passport-pdf-export.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import {ButtonModule} from "primeng/button";

@NgModule({
    declarations: [PdfExportComponent],
    imports: [
        CommonModule,
        DialogModule,
        TableModule,
        TranslateModule,
        ButtonModule
    ],
    exports: [PdfExportComponent]
})
export class PassportPdfExportModule { }
