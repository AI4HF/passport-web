import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkedArticlesTableComponent } from './linked-articles-table/linked-articles-table.component';

const routes: Routes = [
    {
        path: '',
        component: LinkedArticlesTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LinkedArticlesRoutingModule {}
