import {Component, Input} from '@angular/core';


/**
 * Stepper component for navigation between menu
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {

  /**
   * The steps of the menu
   */
  @Input()  steps: any[];

  /**
   * Navigate to a step from left menu
   */
  navigateStep() {
    //TODO:
  }
}
