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
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
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
                    this.messageService.add({
                      severity: 'error',
                      summary: this.translateService.instant('Error'),
                      detail: error.message
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
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
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

  editStudy(id: number) {
    this.router.navigate([`/${StudyManagementRoutingModule.route}/${id}`]);
  }

  deleteStudy(id: number) {
    this.loadingOwnedStudies = true;
    this.studyService.deleteStudy(id).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadStudyPersonnelAndStudies();
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Study is deleted successfully')
            });},
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          },
          complete: () => this.loadingOwnedStudies = false
        });
  }

  accessStudy(studyId: number) {
    const studyPersonnelEntry = this.studyPersonnelEntries.find(entry => entry.id.studyId === studyId);
    if (studyPersonnelEntry) {

      const roles = studyPersonnelEntry.rolesAsList;
      const thisStudy = this.assignedStudies.filter(study => study.id == studyId)
      if(thisStudy.at(0).owner == StorageUtil.retrieveUserId() && !roles.includes(Role.STUDY_OWNER))
      {
        roles.push(Role.STUDY_OWNER);
      }
      this.roleService.setRoles(roles);
      this.activeStudyService.setActiveStudy(studyId);
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('Success'),
        detail: this.translateService.instant('StudyManagement.A new study is set as the active study')
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant('Warning'),
        detail: this.translateService.instant('StudyManagement.NoRolesFound')
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
