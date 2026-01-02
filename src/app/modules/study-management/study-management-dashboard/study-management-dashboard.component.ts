import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../shared/models/study.model";
import {Table} from "primeng/table";
import {StudyManagementRoutingModule} from "../study-management-routing.module";
import {StudyPersonnel} from "../../../shared/models/studyPersonnel.model";
import {Role} from "../../../shared/models/role.enum";
import {StorageUtil} from "../../../core/services/storageUtil.service";

/**
 * Dashboard component for study management.
 */
@Component({
  selector: 'app-study-management-dashboard',
  templateUrl: './study-management-dashboard.component.html',
  styleUrl: './study-management-dashboard.component.scss'
})
export class StudyManagementDashboardComponent extends BaseComponent implements OnInit {

  ownedStudies: Study[] = [];
  assignedStudies: Study[] = [];
  allStudies: Study[] = [];
  columns: any[];
  loadingOwnedStudies: boolean = true;
  loadingAssignedStudies: boolean = true;
  studyPersonnelEntries: StudyPersonnel[] = [];
  userRoles: Role[] = [];

  /** Visibility flag for cascade validation dialog */
  displayCascadeDialog: boolean = false;

  /** List of tables to display in the validation dialog */
  cascadeTables: string = '';

  /** Authorization status for the validation dialog */
  cascadeAuthorized: boolean = false;

  /** Temporary storage of the study ID pending deletion */
  pendingDeletionId: string = null;


  constructor(
      protected injector: Injector,
  ) {
    super(injector);

    this.columns = [
      {header: 'ID', field: 'id'},
      {header: 'Name', field: 'name'},
      {header: 'Description', field: 'description'},
      {header: 'Objectives', field: 'objectives'},
      {header: 'Ethics', field: 'ethics'}
    ];
  }

  ngOnInit() {
    this.loadStudyPersonnelAndStudies();
  }

  /**
   * Load all StudyPersonnel entries and fetch all studies.
   * Filter the studies based on the personnel entries (owned vs assigned).
   */
  loadStudyPersonnelAndStudies() {
    this.loadingOwnedStudies = true;
    this.loadingAssignedStudies = true;

    this.studyService.getStudyList()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (allStudies: Study[]) => {
            this.allStudies = allStudies;
            this.filterStudiesBasedOnPersonnel();
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
          }
        });
  }

  filterStudiesBasedOnPersonnel() {
    this.studyPersonnelService.getStudyPersonnelEntries(StorageUtil.retrieveUserId())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (entries: StudyPersonnel[]) => {
            this.studyPersonnelEntries = entries;
            const userId = StorageUtil.retrieveUserId();

            const ownedStudyIds = this.allStudies
                .filter(study => study.owner === userId)
                .map(study => study.id);

            const assignedStudyIds = entries
                .filter(entry => (entry.rolesAsList && entry.rolesAsList.length > 0) && !(entry.rolesAsList.includes(Role.STUDY_OWNER) && entry.rolesAsList.length == 1))
                .map(entry => entry.id.studyId);

            this.roleService.getRolesAsObservable().pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: roles => {
                    this.userRoles = roles;
                  },
                  error: (error: any) => {
                    this.translateService.get('Error').subscribe(translation => {
                      this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                      });
                    });
                  }
                });

            if(this.userRoles.includes(Role.STUDY_OWNER)){
              this.ownedStudies = this.allStudies.filter(study => ownedStudyIds.includes(study.id));
            }
            this.assignedStudies = this.allStudies.filter(
                study => assignedStudyIds.includes(study.id)
            );
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
          },
          complete: () => {
            this.loadingOwnedStudies = false;
            this.loadingAssignedStudies = false;
          }
        });
  }


  // Ownership study management (create, update, delete)
  createStudy() {
    this.router.navigate([`/${StudyManagementRoutingModule.route}/new`]);
  }

  editStudy(id: string) {
    this.router.navigate([`/${StudyManagementRoutingModule.route}/${id}`]);
  }

  /**
   * Initiates the deletion process by validating permissions first.
   * @param id The ID of the Study to be deleted
   */
  deleteStudy(id: string) {
    this.pendingDeletionId = id;
    this.loadingOwnedStudies = true;

    this.studyService.validateStudyDeletion(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: string) => {
            this.loadingOwnedStudies = false;
            if (!response || response.trim() === '') {
              this.executeDeletion(this.pendingDeletionId);
            } else {
              this.cascadeTables = response;
              this.cascadeAuthorized = true;
              this.displayCascadeDialog = true;
            }
          },
          error: (error: any) => {
            this.loadingOwnedStudies = false;
            if (error.status === 409) {
              this.cascadeTables = error.error || '';
              this.cascadeAuthorized = false;
              this.displayCascadeDialog = true;
            } else {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
              });
              this.pendingDeletionId = null;
            }
          }
        });
  }

  /**
   * Executes the actual deletion after validation or confirmation.
   * @param id The ID of the Study to be deleted
   */
  executeDeletion(id: string) {
    this.loadingOwnedStudies = true;
    this.studyService.deleteStudy(id).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadStudyPersonnelAndStudies();
            this.translateService.get(['Success', 'StudyManagement.Study is deleted successfully']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['StudyManagement.Study is deleted successfully']
              });
            });
            this.pendingDeletionId = null;
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
            this.pendingDeletionId = null;
          },
          complete: () => this.loadingOwnedStudies = false
        });
  }

  /**
   * Handles the cancellation of the cascade dialog.
   */
  onCascadeDialogCancel() {
    this.displayCascadeDialog = false;
    this.pendingDeletionId = null;
    this.cascadeTables = '';
  }

  selectStudy(studyId: string) {
    const studyPersonnelEntry = this.studyPersonnelEntries.find(entry => entry.id.studyId === studyId);
    if (studyPersonnelEntry) {

      const roles = studyPersonnelEntry.rolesAsList;
      if(this.roleService.getRoles().includes(Role.STUDY_OWNER))
      {
        roles.push(Role.STUDY_OWNER);
      }
      this.roleService.setRoles(roles);
      this.activeStudyService.setActiveStudy(studyId);
      this.translateService.get(['Success', 'StudyManagement.A new study is set as the active study']).subscribe(translations => {
        this.messageService.add({
          severity: 'success',
          summary: translations['Success'],
          detail: translations['StudyManagement.A new study is set as the active study']
        });
      });
    } else {
      this.translateService.get(['Warning', 'StudyManagement.NoRolesFound']).subscribe(translations => {
        this.messageService.add({
          severity: 'warn',
          summary: translations['Warning'],
          detail: translations['StudyManagement.NoRolesFound']
        });
      });
      console.warn(`No roles found for study ID: ${studyId}`);
    }
  }

  viewStudy(studyId: string) {
    const studyPersonnelEntry = this.studyPersonnelEntries.find(entry => entry.id.studyId === studyId);
    if (studyPersonnelEntry) {
      this.router.navigate(
          [`/${StudyManagementRoutingModule.route}/${studyId}/study-details`],
          { queryParams: { viewMode: true } }
      );

    } else {
      this.translateService.get(['Warning', 'StudyManagement.NoRolesFound']).subscribe(translations => {
        this.messageService.add({
          severity: 'warn',
          summary: translations['Warning'],
          detail: translations['StudyManagement.NoRolesFound']
        });
      });
      console.warn(`No roles found for study ID: ${studyId}`);
    }
  }


  /**
   * Filters a table of information based on a given search criteria.
   * @param table Table to be filtered.
   * @param event Keyboard type event where search text is captured.
   */
  filter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  protected readonly Role = Role;
}
