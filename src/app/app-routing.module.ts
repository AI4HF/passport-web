import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { authGuard } from './core/guards/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
            {
                path: 'study-management',
                loadChildren: () => import('./modules/study-management/study-management.module').then(m => m.StudyManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'survey-management',
                loadChildren: () => import('./modules/survey-management/survey-management.module').then(m => m.SurveyManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'organization-management',
                loadChildren: () => import('./modules/organization-management/organization-management.module').then(m => m.OrganizationManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'parameter-management',
                loadChildren: () => import('./modules/parameter-management/parameter-management.module').then(m => m.ParameterManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'dataset-management',
                loadChildren: () => import('./modules/dataset-management/dataset-management.module').then(m => m.DatasetManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'featureset-management',
                loadChildren: () => import('./modules/featureset-management/featureset-management.module').then(m => m.FeatureSetManagementModule),
                canActivate: [authGuard]
            },
            {
                path: 'deployment-management',
                loadChildren: () => import('./modules/deployment-management/deployment-management.module').then(m => m.DeploymentManagementModule),
                canActivate: [authGuard] // Apply the guard here
            },
            {
                path: 'model-management',
                loadChildren: () => import('./modules/model-management/model-management.module').then(m => m.ModelManagementModule),
                canActivate: [authGuard] // Apply the guard here
            },
            {
                path: 'deployment-management',
                loadChildren: () => import('./modules/deployment-management/deployment-management.module').then(m => m.DeploymentManagementModule),
                canActivate: [authGuard] // Apply the guard here
            },
            {
                path: 'model-management',
                loadChildren: () => import('./modules/model-management/model-management.module').then(m => m.ModelManagementModule),
                canActivate: [authGuard] // Apply the guard here
            },

            {
                path: 'passport-management',
                loadChildren: () => import('./modules/passport-management/passport-management.module').then(m => m.PassportManagementModule),
                canActivate: [authGuard] // Apply the guard here
            },

            { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

