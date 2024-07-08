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
import {OrganizationStateService} from "../../core/services/organization-state.service";
import {AuthorizationService} from "../../core/services/authorization.service";
import {StorageUtil} from "../../core/services/storageUtil.service";

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
  organizationStateService: OrganizationStateService;
  authorizationService: AuthorizationService;
  storageUtil: StorageUtil;

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
    this.organizationStateService = injector.get(OrganizationStateService);
    this.authorizationService = injector.get(AuthorizationService);
    this.storageUtil = injector.get(StorageUtil);
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
