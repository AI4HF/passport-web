import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
            { path: 'study-management', loadChildren: () => import('./modules/study-management/study-management.module')
                    .then(m => m.StudyManagementModule) },
            { path: 'survey-management', loadChildren: () => import('./modules/survey-management/survey-management.module')
                    .then(m => m.SurveyManagementModule) },
            { path: 'organization-management', loadChildren: () => import('./modules/organization-management/organization-management.module').then(m => m.OrganizationManagementModule) },
            { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
