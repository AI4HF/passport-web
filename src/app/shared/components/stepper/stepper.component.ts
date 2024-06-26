import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {NavigationEnd} from "@angular/router";
import {filter} from "rxjs/operators";
import {takeUntil} from "rxjs";


/**
 * Stepper component for navigation between menu
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent extends BaseComponent implements OnInit{

  /**
   * The steps of the menu
   */
  @Input()  steps: any[];

  ngOnInit(){
    this.steps.forEach(stepElement => {
      stepElement.selected = stepElement.routerLink === this.router.url.split('/').at(-1);
    });

    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.steps.forEach(stepElement => {
        stepElement.selected = stepElement.routerLink === url.split('/').at(-1);
      });
    });
  }


  /**
   * Navigate to a step from left menu
   */
  navigateStep(step: any) {
    this.router.navigate([`${step.routerLink}`], {relativeTo: this.route});
  }
}
