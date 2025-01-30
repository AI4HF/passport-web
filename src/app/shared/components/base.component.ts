import {Component, Injector, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";
import {LayoutService} from "../../layout/service/app.layout.service";
import {StudyService} from "../../core/services/study.service";
import {PopulationService} from "../../core/services/population.service";
import {PersonnelService} from "../../core/services/personnel.service";
import {ExperimentService} from "../../core/services/experiment.service";
import {SurveyService} from "../../core/services/survey.service";
import {OrganizationService} from "../../core/services/organization.service";
import {StudyPersonnelService} from "../../core/services/studyPersonnel.service";
import {AuthorizationService} from "../../core/services/authorization.service";
import {ParameterService} from "../../core/services/parameter.service";
import {FeatureSetService} from "../../core/services/featureset.service";
import {FeatureService} from "../../core/services/feature.service";
import {DatasetService} from "../../core/services/dataset.service";
import {LearningDatasetService} from "../../core/services/learning-dataset.service";
import {DatasetTransformationStepService} from "../../core/services/dataset-transformation-step.service";
import {DatasetTransformationService} from "../../core/services/dataset-transformation.service";
import {DatasetCharacteristicService} from "../../core/services/dataset-characteristic.service";
import {ModelService} from "../../core/services/model.service";
import {ModelDeploymentService} from "../../core/services/model-deployment.service";
import {DeploymentEnvironmentService} from "../../core/services/deployment-environment.service";
import {StudyOrganizationService} from "../../core/services/studyOrganization.service";
import {PassportService} from "../../core/services/passport.service";
import {AlgorithmService} from "../../core/services/algorithm.service";
import {ImplementationService} from "../../core/services/implementation.service";
import {LearningProcessService} from "../../core/services/learning-process.service";
import {LearningProcessDatasetService} from "../../core/services/learning-process-dataset.service";
import {LearningProcessParameterService} from "../../core/services/learning-process-parameter.service";
import {LearningStageService} from "../../core/services/learning-stage.service";
import {LearningStageParameterService} from "../../core/services/learning-stage-parameter.service";
import {RoleService} from "../../core/services/role.service";
import {ActiveStudyService} from "../../core/services/activeStudy.service";
import {AuditLogBookService} from "../../core/services/audit-log-book.service";
import {ModelParameterService} from "../../core/services/model-parameter.service";

/**
 * Base component to provide common properties
 */
@Component({
  template: '',
  providers: [MessageService]
})
export abstract class BaseComponent implements OnDestroy {

  // Services to handle navigations
  protected router: Router;
  protected route: ActivatedRoute;
  // Http Services used in derived components
  protected translateService: TranslateService;
  protected messageService: MessageService;

  // Layout services for components
  protected layoutService: LayoutService
  // Subscription object for unsubscribing when destroying the component to avoid leaks
  destroy$ = new Subject<void>();

  // Service classes for password app
  studyService: StudyService;
  populationService: PopulationService;
  personnelService: PersonnelService;
  experimentService: ExperimentService;
  surveyService: SurveyService;
  organizationService: OrganizationService;
  studyPersonnelService: StudyPersonnelService;
  authorizationService: AuthorizationService;
  featureSetService: FeatureSetService;
  featureService: FeatureService;
  datasetService: DatasetService;
  learningDatasetService: LearningDatasetService;
  datasetTransformationService: DatasetTransformationService;
  transformationStepService: DatasetTransformationStepService;
  datasetCharacteristicService: DatasetCharacteristicService;
  parameterService: ParameterService;
  studyOrganizationService: StudyOrganizationService;
  modelService: ModelService;
  modelDeploymentService: ModelDeploymentService;
  deploymentEnvironmentService: DeploymentEnvironmentService;
  passportService: PassportService;
  algorithmService: AlgorithmService;
  implementationService: ImplementationService;
  learningProcessService: LearningProcessService;
  learningProcessDatasetService: LearningProcessDatasetService;
  learningProcessParameterService: LearningProcessParameterService;
  learningStageService: LearningStageService;
  learningStageParameterService: LearningStageParameterService;
  roleService: RoleService;
  activeStudyService: ActiveStudyService;
  auditLogBookService: AuditLogBookService;
  modelParameterService: ModelParameterService;

  constructor(injector: Injector){
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.translateService = injector.get(TranslateService);
    this.messageService = injector.get(MessageService);
    this.layoutService = injector.get(LayoutService);
    this.studyService = injector.get(StudyService);
    this.populationService = injector.get(PopulationService);
    this.personnelService = injector.get(PersonnelService);
    this.experimentService = injector.get(ExperimentService);
    this.surveyService = injector.get(SurveyService);
    this.organizationService = injector.get(OrganizationService);
    this.studyPersonnelService = injector.get(StudyPersonnelService);
    this.authorizationService = injector.get(AuthorizationService);
    this.featureSetService = injector.get(FeatureSetService);
    this.featureService = injector.get(FeatureService);
    this.datasetService = injector.get(DatasetService);
    this.datasetCharacteristicService = injector.get(DatasetCharacteristicService);
    this.datasetTransformationService = injector.get(DatasetTransformationService);
    this.learningDatasetService = injector.get(LearningDatasetService);
    this.transformationStepService = injector.get(DatasetTransformationStepService);
    this.parameterService = injector.get(ParameterService);
    this.algorithmService = injector.get(AlgorithmService);
    this.implementationService = injector.get(ImplementationService);
    this.learningProcessService = injector.get(LearningProcessService);
    this.learningProcessDatasetService = injector.get(LearningProcessDatasetService);
    this.learningStageService = injector.get(LearningStageService);
    this.learningProcessParameterService = injector.get(LearningProcessParameterService);
    this.learningStageParameterService = injector.get(LearningStageParameterService);
    this.modelService = injector.get(ModelService);
    this.modelDeploymentService = injector.get(ModelDeploymentService);
    this.deploymentEnvironmentService = injector.get(DeploymentEnvironmentService);
    this.studyOrganizationService = injector.get(StudyOrganizationService);
    this.passportService = injector.get(PassportService);
    this.roleService = injector.get(RoleService);
    this.activeStudyService = injector.get(ActiveStudyService);
    this.auditLogBookService = injector.get(AuditLogBookService);
    this.modelParameterService = injector.get(ModelParameterService);
  }

  /**
   * It is recommended to make subscriptions with takeUntil(this.destroy$) to avoid memory leaks
   * They will be automatically unsubscribed when destroying the component
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearState();
  }

  /**
   * Override this method to clear related data when destroying the component
   */
  clearState(): void {}
}
