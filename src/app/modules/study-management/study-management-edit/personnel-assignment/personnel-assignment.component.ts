import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { Personnel } from "../../../../shared/models/personnel.model";
import { combineLatest, takeUntil } from "rxjs";
import { ROLES } from "../../../../shared/models/roles.constant";
import { NameAndValueInterface } from "../../../../shared/models/nameAndValue.interface";
import { Organization } from "../../../../shared/models/organization.model";
import { StudyOrganization } from "../../../../shared/models/studyOrganization.model";
import { Role } from "../../../../shared/models/role.enum";
import { Population } from "../../../../shared/models/population.model"; // New import

/**
 * Shows list of assigned personnel for the study
 */
@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit {

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
  roles: NameAndValueInterface[] = ROLES.filter(role => role.value !== Role.STUDY_OWNER);

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

  /**
   * The list of populations for the dropdown
   */
  populationList: Population[] = [];

  /**
   * The selected population ID
   */
  selectedPopulationId: number = null;

  /**
   * Whether the form elements are disabled or enabled
   */
  formDisabled: boolean = true;

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

    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: params => {
        this.studyId = +params.get('id');
        this.loadPopulations(); // Load populations based on studyId
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
   * Load the population list for the selected study
   */
  private loadPopulations() {
    this.populationService.getPopulationByStudyId(this.studyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: populations => {
        this.populationList = populations.map(pop => new Population(pop));
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
   * Select an organization from dropdown menu
   * @param organizationId The ID of the organization
   */
  selectAnOrganization(organizationId: number) {
    this.selectedResponsiblePersonnelId = null;
    this.selectedStudyOrganization = null;
    this.selectedRoles = [];
    this.allowedRoles = [];
    this.formDisabled = true; // Disable form fields initially
    this.fetchOrganizationPersonnel(organizationId);

    // Check if a study organization exists
    this.studyOrganizationService.getStudyOrganizationByStudyIdAndOrganizationId(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        // Study organization exists, fill form with data and unlock personnel assignment section
        this.selectedStudyOrganization = new StudyOrganization(response);
        this.selectedPopulationId = this.selectedStudyOrganization.populationId;
        this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
        this.selectedRoles = this.selectedStudyOrganization.roles;
        this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
        this.formDisabled = false; // Enable fields
        this.fetchPersonnelAndAssignmentLists(this.studyId, organizationId);
      },
      error: error => {
        if (error.status === 404) {
          // No study organization exists, unlock the form fields to create a new one
          this.formDisabled = false;
          this.selectedStudyOrganization = new StudyOrganization({
            studyId: this.studyId,
            organizationId: organizationId
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: error.message
          });
        }
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
        (allPersonnel, assignedPersonnel) => ({ allPersonnel, assignedPersonnel }))
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
        .filter(personnelElement => this.allowedRoles.some(allowedRole => allowedRole.value === personnelElement.role))
        .map(personnel => new Personnel(personnel));
  }

  /**
   * Save assigned personnel
   */
  save() {
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
   * Fetch personnel of the selected organization
   * @param organizationId The ID of the organization
   */
  private fetchOrganizationPersonnel(organizationId: number) {
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
  saveStudyOrganization() {
    if (this.selectedStudyOrganization.personnelId) {
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
    } else {
      this.setRolesAndResponsiblePerson();
      this.studyOrganizationService.createStudyOrganization(this.selectedStudyOrganization)
          .pipe(takeUntil(this.destroy$)).subscribe({
        next: response => {
          this.selectedStudyOrganization = new StudyOrganization(response);
          this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
          this.selectedRoles = this.selectedStudyOrganization.roles;
          this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
          this.fetchPersonnelAndAssignmentLists(this.studyId, this.selectedStudyOrganization.organizationId);
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
  private setRolesAndResponsiblePerson() {
    this.selectedStudyOrganization.personnelId = this.selectedResponsiblePersonnelId;
    this.selectedStudyOrganization.roles = this.selectedRoles.map((role: string) => Role[role as keyof typeof Role]);
  }

  /**
   * Convert personnel role into readable form
   * @param RoleValue The value of the role
   */
  public convertPersonnelRoleValueToName(RoleValue: string) {
    return this.roles.find(role => role.value === RoleValue).name;
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate(['../population-details'], {relativeTo: this.route});
  }
}
