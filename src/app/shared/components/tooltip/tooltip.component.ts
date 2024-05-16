import {Component, Input} from '@angular/core';

/**
 * Component to add information tooltips to inputs. The content of tooltip becomes
 * visible when the user hovers over the tooltip icon.
 *
 * @example <app-tooltip message="Write the tooltip message"></app-tooltip>
 */
@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  /**
   * The message to show. The component makes use TranslateService to translate given message.
   * It prefixes the message with 'Tooltip' key.
   */
  @Input() message: string = null;
}
