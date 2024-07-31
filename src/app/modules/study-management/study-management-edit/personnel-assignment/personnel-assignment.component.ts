import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {Personnel} from "../../../../shared/models/personnel.model";
import {combineLatest, takeUntil} from "rxjs";
import {ROLES} from "../../../../shared/models/roles.constant";
import {NameAndValueInterface} from "../../../../shared/models/nameAndValue.interface";
import {Organization} from "../../../../shared/models/organization.model";
import {StudyOrganization} from "../../../../shared/models/studyOrganization.model";
import {Role} from "../../../../shared/models/role.enum";

/**
 * Shows list of assigned personnel for the study
 */
@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit{

  /**
   * The original personnel list provided from personnel service
   */
  personnelList: Personnel[] = [];

  /**
   * The left side list for picklist
   */
  sourcePersonnelList: Personnel[] = [];

  /**
   * The right side list for picklist
   */
  targetPersonnelList: Personnel[] = [];

  /**
   * The studyId for selected study
   */
  studyId: number;
  /**
   * The role enumeration
   */
  roles: NameAndValueInterface[] = ROLES;

  /**
   * The allowed roles
   */
  allowedRoles: NameAndValueInterface[] = [];

  /**
   * The organization list provided from organization service
   */
  organizationList: Organization[] = [];

  /**
   * The selected StudyOrganization for dropdown
   */
  selectedStudyOrganization: StudyOrganization = null;

  /**
   * The personnel list for organization
   */
  personnelListForOrganization: Personnel[] = [];

  /**
   * The selected responsible personnel ID for dropdown
   */
  selectedResponsiblePersonnelId: string = null;

  /**
   * The selected roles for study organization
   */
  selectedRoles: string[] = [];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.organizationList = data.map(organization => new Organization(organization));
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });

    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.studyId = data['study'].id;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

  /**
   * Fetch Available personnel and assigned personnel lists
   * @param studyId ID of the study
   * @param organizationId ID of the organization
   */
  private fetchPersonnelAndAssignmentLists(studyId: number, organizationId: number) {
    combineLatest([this.personnelService.getPersonnelByOrganizationId(organizationId), this.studyPersonnelService.getPersonnelListByStudyIdAndOrganizationId(studyId, organizationId)],
      (allPersonnel, assignedPersonnel) => ({allPersonnel, assignedPersonnel}))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: personnelList => {
          this.personnelList = personnelList.allPersonnel;
          this.sourcePersonnelList = this.removeAssignedPersonnelFromPersonnelList(personnelList.allPersonnel, personnelList.assignedPersonnel);
          this.targetPersonnelList = personnelList.assignedPersonnel.map(personnel => new Personnel(personnel));
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
   * Remove Assigned personnel from all personnel list
   * @param personnelList Personnel list includes all personnel
   * @param assignedPersonnelList Personnel list includes only assigned personnel
   */
  private removeAssignedPersonnelFromPersonnelList(personnelList: Personnel[],
                                                   assignedPersonnelList: Personnel[]): Personnel[] {
    return personnelList.filter(allPersonnelElement =>
        !assignedPersonnelList.some(assignedPersonnelElement =>
            assignedPersonnelElement.personId === allPersonnelElement.personId))
        .map(personnel => new Personnel(personnel));
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../population-details`], {relativeTo: this.route});
  }

  /**
   * Save assigned personnel
   */
  save(){
    this.studyPersonnelService.createStudyPersonnelAssignment(this.studyId, this.selectedStudyOrganization.organizationId, this.targetPersonnelList)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Personnel.Personnel are assigned successfully')
            });
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
   * Handle the event when items are moved to source list
   */
  onMoveToSource(event: any) {
    event.items.forEach((item: Personnel) => {
      // Change the role to default role of the personnel
      const targetPersonnel = this.personnelList.find(personnel => personnel.personId === item.personId);
      item.role = targetPersonnel.role;
    });
  }

  /**
   * Check personnel whether it is in the target list
   */
  isPersonnelInTarget(personnel: Personnel): boolean {
    return this.targetPersonnelList.includes(personnel);
  }

  /**
   * Select an organization from dropdown menu
   * @param organizationId The ID of the organization
   */
  selectAnOrganization(organizationId: number) {
    this.selectedResponsiblePersonnelId = null;
    this.selectedStudyOrganization = null;
    this.selectedRoles = [];
    this.allowedRoles = [];
    this.fetchOrganizationPersonnel(organizationId);
    this.fetchPersonnelAndAssignmentLists(this.studyId, organizationId);

    this.studyOrganizationService.getStudyOrganizationByStudyIdAndOrganizationId(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.selectedStudyOrganization = new StudyOrganization(response);
        this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
        this.selectedRoles = this.selectedStudyOrganization.roles;
        this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
      },
      error: error => {
        if(error.status === 404) {
          this.createNewStudyOrganization(organizationId);
        }else{
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: error.message
          });
        }
      }
    })
  }

  /**
   * Create a new study organization object
   * @param organizationId The ID of the organization
   */
  private createNewStudyOrganization(organizationId: number) {
    this.populationService.getPopulationByStudyId(this.studyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.selectedStudyOrganization = new StudyOrganization({studyId: this.studyId, organizationId: organizationId, populationId: response.populationId});
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

  /**
   * Fetch personnel of the selected organization
   * @param organizationId The ID of the organization
   */
  private fetchOrganizationPersonnel(organizationId: number){
    this.personnelService.getPersonnelByOrganizationId(organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.personnelListForOrganization = response.map(personnel => new Personnel(personnel));
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

  /**
   * Save study organization information
   */
  saveStudyOrganization(){
    if(this.selectedStudyOrganization.personnelId){
      this.setRolesAndResponsiblePerson();
      this.studyOrganizationService.updateStudyOrganization(this.studyId,
          this.selectedStudyOrganization.organizationId,
          this.selectedStudyOrganization).pipe(takeUntil(this.destroy$)).subscribe({
        next: response => {
          this.selectedStudyOrganization = new StudyOrganization(response);
          this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
          this.selectedRoles = this.selectedStudyOrganization.roles;
          this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
          this.fetchPersonnelAndAssignmentLists(this.studyId, this.selectedStudyOrganization.organizationId);
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Success'),
            detail: this.translateService.instant('StudyManagement.Personnel.StudyOrganization is updated successfully')
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: error.message
          });
      }});
    }else{
      this.setRolesAndResponsiblePerson();
      this.studyOrganizationService.createStudyOrganization(this.selectedStudyOrganization)
          .pipe(takeUntil(this.destroy$)).subscribe({
        next: response => {
          this.selectedStudyOrganization = new StudyOrganization(response);
          this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
          this.selectedRoles = this.selectedStudyOrganization.roles;
          this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Success'),
            detail: this.translateService.instant('StudyManagement.Personnel.StudyOrganization is created successfully')
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: error.message
          });
        }
      });
    }
  }

  /**
   * Save roles and responsible person information into selectedStudyOrganization object.
   */
  private setRolesAndResponsiblePerson(){
    this.selectedStudyOrganization.personnelId = this.selectedResponsiblePersonnelId;
    this.selectedStudyOrganization.roles = this.selectedRoles.map((role: string) => Role[role as keyof typeof Role]);
  }
}
