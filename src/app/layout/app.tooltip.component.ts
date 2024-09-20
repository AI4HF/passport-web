import { Component, Input } from '@angular/core';

/**
 * Layout component for Tooltip elements all around the project
 */
@Component({
    selector: 'app-tooltip',
    templateUrl: './app.tooltip.component.html',
    styleUrls: ['./app.tooltip.component.scss']
})
export class TooltipComponent {
    /**
     * Message that is served inside the Tooltip
     */
    @Input() message: string;
}
