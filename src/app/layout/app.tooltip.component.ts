import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './app.tooltip.component.html',
    styleUrls: ['./app.tooltip.component.scss']
})
export class TooltipComponent {
    @Input() message: string;
}
