import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { Personnel } from "../../../../shared/models/personnel.model";
import { takeUntil } from "rxjs";
import { ROLES } from "../../../../shared/models/roles.constant";
import { NameAndValueInterface } from "../../../../shared/models/nameAndValue.interface";
import { Organization } from "../../../../shared/models/organization.model";
import { StudyOrganization } from "../../../../shared/models/studyOrganization.model";
import { Role } from "../../../../shared/models/role.enum";
import { Population } from "../../../../shared/models/population.model";

@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit {
  personnelList: Personnel[] = [];
  organizationList: Organization[] = [];
  populationList: Population[] = [];
  selectedPopulationId: number = null;
  selectedStudyOrganization: StudyOrganization = null;
  /**
   * The role enumeration
   */
  roles: NameAndValueInterface[] = ROLES.filter(role => role.value !== Role.STUDY_OWNER);

  /**
   * The allowed roles
   */
  allowedRoles: NameAndValueInterface[] = [];
  /**
   * The selected roles for study organization
   */
  selectedRoles: string[] = [];
  selectedResponsiblePersonnelId: string = null;
  personnelRoleMap: Map<string, string[]> = new Map();
  formDisabled: boolean = true;
  studyId: number;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => this.organizationList = data.map(organization => new Organization(organization)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.OrganizationFetchError')
        });
      }
    });

    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: params => {
        this.studyId = +params.get('id');
        this.loadPopulations();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.RouteFetchError')
        });
      }
    });
  }

  private loadPopulations() {
    this.populationService.getPopulationByStudyId(this.studyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: populations => this.populationList = populations.map(pop => new Population(pop)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.PopulationFetchError')
        });
      }
    });
  }

  /**
   * Save roles and responsible person information into selectedStudyOrganization object.
   */
  private setRolesAndResponsiblePerson() {
    this.selectedStudyOrganization.personnelId = this.selectedResponsiblePersonnelId;
    this.selectedStudyOrganization.roles = this.selectedRoles.map((role: string) => Role[role as keyof typeof Role]);
    this.selectedStudyOrganization.populationId = this.selectedPopulationId;
  }

  selectAnOrganization(organizationId: number) {
    this.selectedStudyOrganization = null;
    this.selectedResponsiblePersonnelId = null;
    this.formDisabled = true;

    this.studyOrganizationService.getStudyOrganizationByStudyIdAndOrganizationId(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.selectedStudyOrganization = new StudyOrganization(response);
        this.selectedPopulationId = this.selectedStudyOrganization.populationId;
        this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
        this.selectedRoles = this.selectedStudyOrganization.roles;
        this.allowedRoles = this.roles.filter(role => this.selectedRoles.includes(role.value));
        this.formDisabled = false;

        this.fetchPersonnelForOrganization(organizationId);

        this.studyPersonnelService.getPersonnelRolesByStudyAndOrganization(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
          next: personnelRoleMap => {
            this.personnelRoleMap = new Map(
                Array.from(this.personnelRoleMap.entries()).map(([personId, _]) => [
                  personId,
                  personnelRoleMap.get(personId) || []
                ])
            );
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: this.translateService.instant('StudyManagement.Personnel.RolesFetchError')
            });
          }
        });
      },
      error: error => {
        if (error.status === 404) {
          this.fetchPersonnelForOrganization(organizationId);
          this.formDisabled = false;
          this.selectedStudyOrganization = new StudyOrganization({
            studyId: this.studyId,
            organizationId: organizationId
          });

        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: this.translateService.instant('StudyManagement.Personnel.StudyOrganizationFetchError')
          });
        }
      }
    });
  }


  private fetchPersonnelForOrganization(organizationId: number) {
    this.personnelService.getPersonnelByOrganizationId(organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: personnel => {
        this.personnelList = personnel.map(p => new Personnel(p));
        this.personnelRoleMap = new Map(this.personnelList.map(p => [p.personId, []]));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.PersonnelFetchError')
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
          this.fetchPersonnelForOrganization(this.selectedStudyOrganization.organizationId);

          this.studyPersonnelService.getPersonnelRolesByStudyAndOrganization(this.studyId, this.selectedStudyOrganization.organizationId).pipe(takeUntil(this.destroy$)).subscribe({
            next: personnelRoleMap => {
              this.personnelRoleMap = new Map(
                  Array.from(this.personnelRoleMap.entries()).map(([personId, _]) => [
                    personId,
                    personnelRoleMap.get(personId) || []
                  ])
              );
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: this.translateService.instant('StudyManagement.Personnel.RolesFetchError')
              });
            }
          });
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
          this.fetchPersonnelForOrganization(this.selectedStudyOrganization.organizationId);
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


  save() {
    const personnelRoleMap = new Map<string, string[]>();

    this.personnelRoleMap.forEach((roles, personId) => {
      personnelRoleMap.set(personId, roles);
    });

    this.studyPersonnelService.createStudyPersonnelEntries(this.studyId, this.selectedStudyOrganization.organizationId, personnelRoleMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Personnel.RolesAssignedSuccess')
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: this.translateService.instant('StudyManagement.Personnel.SaveError')
            });
          }
        });
  }


  onRoleChange(personnel: Personnel, role: string, isChecked: boolean) {
    const currentRoles = this.personnelRoleMap.get(personnel.personId) || [];
    const allowedRolesForPersonnel = this.allowedRoles.map(r => r.value);

    if (isChecked) {
      currentRoles.push(role);
    } else {
      this.personnelRoleMap.set(personnel.personId, currentRoles.filter(r => r !== role));
    }

    this.personnelRoleMap.set(personnel.personId, [...new Set(currentRoles)].filter(r => allowedRolesForPersonnel.includes(r)));
  }

}