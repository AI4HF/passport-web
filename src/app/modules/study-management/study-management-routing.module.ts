import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {StudyManagementDashboardComponent} from "./study-management-dashboard/study-management-dashboard.component";
import {StudyManagementResolver} from "../../core/resolvers/study-management.resolver";


const routes: Routes = [
    {
        path: '',
        component: StudyManagementDashboardComponent,
    },
    {
        path: ':id',
        pathMatch: 'prefix',
        children:[
            {
                path: '',
                loadChildren: () => import('./study-management-edit/study-management-edit.module')
                    .then(m => m.StudyManagementEditModule)
            }
        ],
        resolve: {study: StudyManagementResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudyManagementRoutingModule {
    public static readonly route = 'study-management';
}
