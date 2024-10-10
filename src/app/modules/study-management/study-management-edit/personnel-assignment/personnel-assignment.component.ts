import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { Personnel } from "../../../../shared/models/personnel.model";
import { combineLatest, takeUntil } from "rxjs";
import { ROLES } from "../../../../shared/models/roles.constant";
import { NameAndValueInterface } from "../../../../shared/models/nameAndValue.interface";
import { Organization } from "../../../../shared/models/organization.model";
import { StudyOrganization } from "../../../../shared/models/studyOrganization.model";
import { Role } from "../../../../shared/models/role.enum";
import { Population } from "../../../../shared/models/population.model";
import { StudyPersonnel } from "../../../../shared/models/studyPersonnel.model";

/**
 * Component responsible for assigning personnel to studies.
 */
@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit {

  /**
   * List of all personnel from the selected organization.
   */
  personnelListForOrganization: Personnel[] = [];

  /**
   * Mapped list of personnel along with their assigned roles for the study.
   */
  mappedPersonnelList: { personnel: Personnel, studyId: number, roles: Role[] }[] = [];

  /**
   * The studyId for the selected study.
   */
  studyId: number;

  /**
   * The role enumeration used for checkboxes.
   */
  roles: NameAndValueInterface[] = ROLES.filter(role => role.value !== Role.STUDY_OWNER);

  /**
   * The allowed roles for the selected study organization.
   */
  allowedRoles: NameAndValueInterface[] = [];

  /**
   * The list of organizations provided from organization service.
   */
  organizationList: Organization[] = [];

  /**
   * The selected StudyOrganization for dropdown.
   */
  selectedStudyOrganization: StudyOrganization = null;

  /**
   * The personnel list for the organization.
   */
  personnelList: Personnel[] = [];

  /**
   * The selected responsible personnel ID for dropdown.
   */
  selectedResponsiblePersonnelId: string = null;

  /**
   * The selected roles for the study organization.
   */
  selectedRoles: { [personId: string]: Role[] } = {};

  /**
   * The list of populations for the dropdown.
   */
  populationList: Population[] = [];

  /**
   * The selected population ID.
   */
  selectedPopulationId: number = null;

  /**
   * Whether the form elements are disabled or enabled.
   */
  formDisabled: boolean = true;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    // Load organizations and populations on initialization
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
   * Load the population list for the selected study.
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
   * Select an organization from dropdown menu and fetch the associated personnel and roles.
   * @param organizationId The ID of the selected organization.
   */
  selectAnOrganization(organizationId: number) {
    this.selectedResponsiblePersonnelId = null;
    this.selectedStudyOrganization = null;
    this.selectedRoles = {};
    this.formDisabled = true; // Disable form fields initially

    // Fetch organization personnel
    this.fetchOrganizationPersonnel(organizationId);

    // Check if a study organization exists
    this.studyOrganizationService.getStudyOrganizationByStudyIdAndOrganizationId(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        // Study organization exists, fill form with data and unlock personnel assignment section
        this.selectedStudyOrganization = new StudyOrganization(response);
        this.selectedPopulationId = this.selectedStudyOrganization.populationId;
        this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
        this.allowedRoles = this.roles;
        this.formDisabled = false; // Enable fields
        this.fetchPersonnelAndAssignedRoles(this.studyId, organizationId);
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
   * Fetch personnel and their assigned roles for the selected study and organization.
   * @param studyId ID of the study.
   * @param organizationId ID of the organization.
   */
  private fetchPersonnelAndAssignedRoles(studyId: number, organizationId: number) {
    combineLatest([
      this.personnelService.getPersonnelByOrganizationId(organizationId),
      this.studyPersonnelService.getStudyPersonnelByStudyId(studyId)
    ]).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ([allPersonnel, studyPersonnelRelations]) => {
            this.mappedPersonnelList = allPersonnel.map(personnel => {
              const matchedRelation = studyPersonnelRelations.find(relation => relation.personnelId === personnel.personId);
              return {
                personnel: new Personnel(personnel),
                studyId: this.studyId,
                roles: matchedRelation ? matchedRelation.roles : []
              };
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

  /**
   * Save assigned personnel and their roles.
   */
  /**
   * Save assigned personnel and their roles.
   */
  save() {
    // Create a Map where personId is used as a key
    const personnelRoleMap = new Map<string, string[]>();

    // Populate the Map with personId as key and array of roles as value
    this.mappedPersonnelList.forEach(entry => {
      personnelRoleMap.set(entry.personnel.personId, entry.roles.map(role => role.toString()));
    });

    // Convert the Map to an object to send to the backend (optional, if needed for backend)
    const serializedPersonnelRoleMap = Array.from(personnelRoleMap.entries()).reduce((acc, [personId, roles]) => {
      acc.set(personId, roles); // Map personId directly to roles
      return acc;
    }, new Map<string, string[]>()); // Use a Map here

    // Now send the serialized data to the backend
    this.studyPersonnelService.createStudyPersonnelEntries(this.studyId, this.selectedStudyOrganization.organizationId, serializedPersonnelRoleMap)
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
   * Fetch personnel of the selected organization.
   * @param organizationId The ID of the organization.
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
   * Back to population details menu.
   */
  back() {
    this.router.navigate(['../population-details'], { relativeTo: this.route });
  }
}
