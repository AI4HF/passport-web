import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedArticlesTableModule } from './linked-articles-table/linked-articles-table.module';
import { LinkedArticlesFormModule } from './linked-articles-form/linked-articles-form.module';
import { LinkedArticlesRoutingModule } from './linked-articles-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        LinkedArticlesRoutingModule,
        LinkedArticlesTableModule,
        LinkedArticlesFormModule
    ]
})
export class LinkedArticlesModule { }
