import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found-page.component';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [NotFoundComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', component: NotFoundComponent},
        ]),
        CardModule,
        ButtonModule,
        TranslateModule,
    ],
})
export class NotFoundModule {}
