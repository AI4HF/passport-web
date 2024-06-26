import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Population} from "../../../../shared/models/population.model";

/**
 * Component for managing the population related to the study
 */
@Component({
  selector: 'app-population-details',
  templateUrl: './population-details.component.html',
  styleUrl: './population-details.component.scss'
})
export class PopulationDetailsComponent extends BaseComponent implements OnInit{

  /**
   * The selected population for the component
   */
  selectedPopulation: Population;

  /**
   * The form object keeping the population information.
   */
  populationForm: FormGroup;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.populationService.getPopulationByStudyId(data['study'].id).pipe(takeUntil(this.destroy$))
            .subscribe({
              next: population => {
                this.selectedPopulation = population;
                this.initializeForm();
              },
              error: (error: any) => {
                if(error.status === 404){
                  this.selectedPopulation = new Population({populationId: 0, studyId: data['study'].id});
                  this.initializeForm();
                }else{
                  this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                  });
                }
              }
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
   * Initializes the form object for the given population.
   */
  initializeForm() {
    this.populationForm = new FormGroup({
      populationUrl: new FormControl(this.selectedPopulation.populationUrl, Validators.required),
      description: new FormControl(this.selectedPopulation.description, Validators.required),
      characteristics: new FormControl(this.selectedPopulation.characteristics, Validators.required)
    });
  }

  /**
   * Back to study management menu
   */
  back(){
    this.router.navigate([`../study-details`], {relativeTo: this.route});
  }

  /**
   * Save population details
   */
  save(){
    if(this.selectedPopulation.populationId === 0){
      const newPopulation: Population = new Population({ studyId: this.selectedPopulation.studyId, ...this.populationForm.value});
      this.populationService.createPopulation(newPopulation)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: population => {
              this.selectedPopulation = population;
              this.initializeForm();this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Sucess'),
                detail: this.translateService.instant('StudyManagement.Population.Population is created successfully')
              });
              this.router.navigate([`../personnel-assignment`], {relativeTo: this.route});
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            }
          });
    }else{
      const updatedPopulation: Population = {populationId: this.selectedPopulation.populationId, studyId: this.selectedPopulation.studyId,  ...this.populationForm.value};
      this.populationService.updatePopulation(updatedPopulation)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (population: Population) => {
            this.selectedPopulation = population;
            this.initializeForm();
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Sucess'),
              detail: this.translateService.instant('StudyManagement.Population.Population is updated successfully')
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          },
        });
    }
  }

}
