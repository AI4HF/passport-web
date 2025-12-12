import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModelFigureGalleryComponent} from "./model-figure-gallery.component";

const routes: Routes = [
    {
        path: '',
        component: ModelFigureGalleryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModelFigureGalleryRoutingModule { }
