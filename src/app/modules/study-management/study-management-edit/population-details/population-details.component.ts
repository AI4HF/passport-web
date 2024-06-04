import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Population} from "../../../../shared/models/population.model";

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
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.populationService.getPopulationById(data['study'].id).pipe(takeUntil(this.destroy$))
          .subscribe(population => this.selectedPopulation = population);
      this.initializeForm();
    });
  }

  /**
   * Initializes the form object for the given population.
   */
  initializeForm() {

    const populationUrl = this.selectedPopulation.populationUrl ?? '';
    const description = this.selectedPopulation.description ?? '';
    const characteristics = this.selectedPopulation.characteristics ?? '';

    this.populationForm = new FormGroup({
      populationUrl: new FormControl(populationUrl, Validators.required),
      description: new FormControl(description, Validators.required),
      characteristics: new FormControl(characteristics, Validators.required)
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
    //TODO:
    this.router.navigate([`../personnel-assignment`], {relativeTo: this.route});
  }

}
