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

  constructor(
      protected injector: Injector,
  ) {
    super(injector);

    // Initialize columns for both tables
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

    // Fetch all studies first
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

  /**
   * After fetching all studies, filter them based on StudyPersonnel entries.
   */
  filterStudiesBasedOnPersonnel() {
    // Fetch study personnel entries
    this.studyPersonnelService.getStudyPersonnelEntries(StorageUtil.retrieveUserId())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (entries: StudyPersonnel[]) => {
            // Separate studies based on the roles in StudyPersonnel
            const ownedStudyIds = entries
                .filter(entry => entry.roles.includes(Role.STUDY_OWNER))
                .map(entry => entry.studyId);
            const assignedStudyIds = entries
                .filter(entry => !entry.roles.includes(Role.STUDY_OWNER))
                .map(entry => entry.studyId);

            // Filter the studies based on the IDs
            this.ownedStudies = this.allStudies.filter(study => ownedStudyIds.includes(study.id));
            this.assignedStudies = this.allStudies.filter(study => assignedStudyIds.includes(study.id));
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
          next: () => this.loadStudyPersonnelAndStudies(),
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

  /**
   * Access a study by setting it as active and updating roles.
   */
  accessStudy(studyId: number, roles: Role[]) {
    this.roleService.setRoles(roles);  // Set the roles in RoleService
    this.activeStudyService.setActiveStudy(studyId);  // Set the active study
    this.router.navigate([`/study/${studyId}/overview`]);  // Navigate to study overview page
  }

  /**
   * Filters a table of information based on a given search criteria.
   * @param table Table to be filtered.
   * @param event Keyboard type event where search text is captured.
   */
  filter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
