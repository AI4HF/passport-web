import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {StudyDetailsComponent} from "./study-details/study-details.component";
import {StudyManagementEditComponent} from "./study-management-edit.component";
import {PopulationDetailsComponent} from "./population-details/population-details.component";
import {PersonnelAssignmentComponent} from "./personnel-assignment/personnel-assignment.component";
import {ExperimentQuestionsComponent} from "./experiment-questions/experiment-questions.component";



const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'study-details',
                pathMatch: 'full' // match the full url to avoid infitine redirection
            },
            {
                path: 'study-details',
                component: StudyDetailsComponent,
            },
            {
                path: 'population-details',
                component: PopulationDetailsComponent,
            },
            {
                path: 'personnel-assignment',
                component: PersonnelAssignmentComponent,
            },
            {
                path: 'experiment-questions',
                component: ExperimentQuestionsComponent,
            }
        ],
        component: StudyManagementEditComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudyManagementEditRoutingModule {
}
