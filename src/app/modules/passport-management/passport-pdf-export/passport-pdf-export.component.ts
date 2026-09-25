import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { ModelWithOwnerName } from '../../../shared/models/modelWithOwnerName.model';
import { Study } from '../../../shared/models/study.model';
import { Parameter } from '../../../shared/models/parameter.model';
import { Population } from '../../../shared/models/population.model';
import { Experiment } from '../../../shared/models/experiment.model';
import { Survey } from '../../../shared/models/survey.model';
import { DatasetWithLearningDatasetsDTO } from '../../../shared/models/datasetWithLearningDatasetsDTO.model';
import { FeatureSetWithFeaturesDTO } from '../../../shared/models/featureSetWithFeaturesDTO.model';
import { LearningProcessWithStagesDTO } from '../../../shared/models/learningProcessWithStagesDTO.model';
import * as FileSaver from 'file-saver';
import {BaseComponent} from "../../../shared/components/base.component";
import {ModelFigure} from "../../../shared/models/modelFigure.model";
import {LinkedArticle} from "../../../shared/models/linkedArticle.model";
import {GenerateAndSignPdfOptionsDto} from "../../../shared/models/pdfGenerationDTO.model";
import {takeUntil} from "rxjs/operators";
import {LearningProcessParameter} from "../../../shared/models/learningProcessParameter.model";
import {LearningStageParameter} from "../../../shared/models/learningStageParameter.model";
import {PDF_EXPORT_TOKENS} from "./pdf-export-tokens";

/**
 * Component responsible for generating and exporting the passport PDF.
 */
@Component({
    selector: 'app-passport-pdf-export',
    templateUrl: './passport-pdf-export.component.html',
    styleUrls: ['./passport-pdf-export.component.scss']
})
export class PdfExportComponent extends BaseComponent implements OnInit{
    /** Model details to be included in the PDF */
    /** The passport being exported - the document is stored on it once signed */
    @Input() passportId: string = '';

    @Input() modelDetails: ModelWithOwnerName | null = null;
    /** Study details to be included in the PDF */
    @Input() studyDetails: Study | null = null;
    /** Parameters to be included in the PDF */
    @Input() parameters: Parameter[] = [];
    /** LearningProcessParameters to be included in the PDF */
    @Input() learningProcessParameters: LearningProcessParameter[] = [];
    /** LearningStageParameters to be included in the PDF */
    @Input() learningStageParameters: LearningStageParameter[] = [];
    /** Population details to be included in the PDF */
    @Input() populationDetails: Population[] = [];
    /** Experiments to be included in the PDF */
    @Input() experiments: Experiment[] = [];
    /** Linked Articles to be included in the PDF */
    @Input() linkedArticles: LinkedArticle[] = [];
    /** Surveys to be included in the PDF */
    @Input() surveys: Survey[] = [];
    /** Datasets with learning datasets to be included in the PDF */
    /** Quality criteria sets, each with its rules */
    @Input() qualityCriteriaWithCriterion: any[] = [];

    /** Quality assessment runs, each with its per-criterion results */
    @Input() qualityAssessmentsWithResults: any[] = [];

    @Input() datasetsWithLearningDatasets: DatasetWithLearningDatasetsDTO[] = [];
    /** Dataset transformations, each with the datasets it was applied to and its ordered steps */
    @Input() datasetTransformationsWithSteps: any[] = [];
    /** Feature sets with associated features to be included in the PDF */
    @Input() featureSetsWithFeatures: FeatureSetWithFeaturesDTO[] = [];
    /** Learning processes with stages to be included in the PDF */
    @Input() learningProcessesWithStages: LearningProcessWithStagesDTO[] = [];
    /** Evaluation Measures to be included in the PDF */
    @Input() modelEvaluationsWithMeasures: any[] = [];
    /** Model Figures to be included in the PDF */
    @Input() modelFigures: ModelFigure[] = [];

    /** Flag to control the visibility of the PDF preview */
    display: boolean = true;

    /** Locks export buttons and toggles labels while an export is running */
    exporting = false;

    /**
     * ID to be used strictly for digital signing.
     */
    private exportStudyId: string = '';

    /**
     * Name to be used strictly for file naming.
     */
    private exportStudyName: string = 'AI4HF_Export';

    public logoDataUrl?: string;

    /**
     * Parameters are modified with values
     */
    parametersWithValues: any[] = [];

    /**
     * The model detail tiles that have a value, two per row. Pairing only the filled tiles keeps a missing
     * value (e.g. no previous model) from leaving an empty half-row in the middle of the grid.
     */
    modelDetailTileRows: { labelKey: string, value: any }[][] = [];

    /** Event emitted when the PDF preview is closed */
    @Output() pdfPreviewClosed = new EventEmitter<void>();

    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Logo data url is set on initialization for global access to relative path
     */
    async ngOnInit() {
        this.modelDetailTileRows = this.buildModelDetailTileRows();

        const absLogoUrl = new URL('favicon.ico', document.baseURI).href;
        this.logoDataUrl = await this.toDataUrl(absLogoUrl);

        // Study ID/Name Initialization
        if (this.studyDetails && this.studyDetails.id) {
            this.exportStudyId = this.studyDetails.id;
            this.exportStudyName = this.studyDetails.name;
        } else {
            const activeId = this.activeStudyService.getActiveStudy();

            if (activeId) {
                this.exportStudyId = activeId;
                this.studyService.getStudyById(activeId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (study) => {
                            this.exportStudyName = study.name;
                        },
                        error: (err) => console.error('Could not fetch study name for export', err)
                    });
            }
        }

        // Assign values with parameters
        this.parameters.forEach(parameter =>{
           this.learningProcessParameters.filter(lpp => lpp.parameterId === parameter.parameterId)
               .map(lpp => lpp.value)
               .forEach(value => this.parametersWithValues.push({
                   name: parameter.name,
                   dataType: parameter.dataType,
                   description: parameter.description,
                   value: value
               }));
           this.learningStageParameters.filter(lsp => lsp.parameterId === parameter.parameterId)
               .map(lsp => lsp.value)
               .forEach(value => this.parametersWithValues.push({
                   name: parameter.name,
                   dataType: parameter.dataType,
                   description: parameter.description,
                   value: value
               }));
        });
    }

    /**
     * Collects the model detail tiles that have a value, in display order, and pairs them into rows.
     */
    private buildModelDetailTileRows(): { labelKey: string, value: any }[][] {
        if (!this.modelDetails) {
            return [];
        }
        const tiles = [
            { labelKey: 'PassportManagement.Model Name', value: this.modelDetails.name },
            { labelKey: 'PassportManagement.Model Version', value: this.modelDetails.version },
            { labelKey: 'PassportManagement.Model Type', value: this.modelDetails.modelType },
            { labelKey: 'PassportManagement.Product Identifier', value: this.modelDetails.productIdentifier },
            { labelKey: 'PassportManagement.Owner', value: this.modelDetails.ownerOrganizationName },
            { labelKey: 'PassportManagement.Retrained From', value: this.modelDetails.previousModelId },
            { labelKey: 'PassportManagement.TRL Level', value: this.modelDetails.trlLevel },
            { labelKey: 'PassportManagement.License', value: this.modelDetails.license }
        ].filter(tile => tile.value);
        const rows: { labelKey: string, value: any }[][] = [];
        for (let i = 0; i < tiles.length; i += 2) {
            rows.push(tiles.slice(i, i + 2));
        }
        return rows;
    }

    /**
     * Url converter to allow global access on absolute image links
     * @param absUrl Absolute URL of the subject
     * @private
     */
    private async toDataUrl(absUrl: string): Promise<string> {
        const res = await fetch(absUrl, { cache: 'no-cache' });
        const blob = await res.blob();
        return await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    }



    /**
     * Generates the PDF for the passport using the provided details.
     * Then conducts a PDF transaction with the server to digitally sign the pdf.
     */
    async generatePdf() {
        const container = document.getElementById('pdfPreviewContainer');
        if (!container) return;

        // Pull the current page’s styles
        const headHtml = Array
            .from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(n => (n as HTMLElement).outerHTML)
            .join('\n');

        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        ${headHtml}
      </head>
      <body>
        ${container.outerHTML}
      </body>
    </html>
  `;

        // extract Href
        const baseHref =
            (document.querySelector('base') as HTMLBaseElement)?.href || document.baseURI;

        try {
            this.exporting = true;
            const today = new Date();
            const formattedDate = today.toISOString().slice(0,10).replace(/-/g, '');
            const fileName = `${this.exportStudyName}_Passport_${formattedDate}.pdf`;
            const opts: GenerateAndSignPdfOptionsDto = {fileName: fileName, baseUrl: baseHref, passportId: this.passportId}
            this.passportService.generateAndSignPdf(html, this.exportStudyId, opts)
                .subscribe((signedBlob: Blob) => {
                    const url = URL.createObjectURL(signedBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url);
                    this.closeDialog();
                });

        } catch (err) {
            this.exporting = false;
            console.error('Signed PDF generation error:', err);
        }
    }

    /**
     * Generates a DOCX from the live preview HTML using globally-loaded html-docx-js.
     * We load the library as a classic <script> to avoid strict mode issues.
     */
    async generateDocx() {
        const container = document.getElementById('pdfPreviewContainer'); // uses your existing preview root
        if (!container) return;

        this.exporting = true;
        // Clone to avoid touching live DOM
        const clone = container.cloneNode(true) as HTMLElement;
        // Remove favicon
        clone.querySelectorAll('.passport-header').forEach((el) => el.remove());

        // Section numbering ("1. Model Details") is done with a CSS counter in the live preview/PDF
        // path — counter(section) is rendering-only generated content, not real DOM text, so it never
        // makes it into .innerHTML. html-docx-js has no CSS engine to recompute it, so number the
        // titles as real text here instead.
        clone.querySelectorAll('.section-title').forEach((el, index) => {
            el.textContent = `${index + 1}. ${(el.textContent || '').trim()}`;
        });

        // Fix table layout issues for Word. Skipped for .attribute-table and .detail-grid: both get
        // their own layout rules in the stylesheet below, and setting inline styles here would win
        // over those (inline style specificity beats an unqualified class rule).
        clone.querySelectorAll('table:not(.attribute-table):not(.detail-grid)').forEach((t) => {
            (t as HTMLElement).style.width = '100%';
            (t as HTMLElement).style.tableLayout = 'fixed';
            (t as HTMLElement).style.borderCollapse = 'collapse';
            (t as HTMLElement).style.margin = '8pt 0';
            t.querySelectorAll('td, th').forEach((cell) => {
                (cell as HTMLElement).style.wordBreak = 'break-word';
                (cell as HTMLElement).style.whiteSpace = 'normal';
                (cell as HTMLElement).style.padding = '6pt';
                (cell as HTMLElement).style.verticalAlign = 'top';
            });
        });

        // Converter function
        async function imageToBase64(url: string): Promise<string> {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        }

        // Convert logo to base64
        const logoBase64 = await imageToBase64('assets/favicon.png');

        // Styles mirror passport-pdf-export.component.scss's structure (same section headers, same
        // $pdf-* palette via PDF_EXPORT_TOKENS) — Word's CSS support is limited enough that the actual
        // rules can't be shared 1:1 with the SCSS, but the values and the grouping stay in sync.
        const ink = PDF_EXPORT_TOKENS.color.ink;
        const text = PDF_EXPORT_TOKENS.color.text;
        const textMuted = PDF_EXPORT_TOKENS.color.textMuted;
        const border = PDF_EXPORT_TOKENS.color.border;
        const tint = PDF_EXPORT_TOKENS.color.tint;
        const tableHeaderBg = PDF_EXPORT_TOKENS.color.tableHeaderBg;
        const styles = `
            <style>
              body {
                background: #ffffff;
                color: ${text};
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 11pt;
                margin: 0;
                line-height: 1.4;
              }

              /* === Header === */
              .passport-header {
                display: flex;
                align-items: center;
                gap: 8pt;
                margin-bottom: 6pt;
              }

              .passport-header img {
                width: 28pt;
                height: 28pt;
              }

              .passport-header-title {
                color: ${ink};
                font-weight: 700;
                font-size: ${PDF_EXPORT_TOKENS.fontSize.documentTitle};
                margin: 0;
                text-align: right;
                font-family: 'Segoe UI', Arial, sans-serif;
                letter-spacing: -0.25pt;
              }

              .passport-divider {
                border-top: 3pt solid ${ink};
                margin: 8pt 0 12pt 0;
              }

              /* === Section titles (numbered as real text in JS above — see clone.querySelectorAll
                 ('.section-title') — since CSS counters don't survive innerHTML cloning) === */
              .section {
                margin-bottom: 18pt;
              }

              .section-title {
                color: ${ink};
                font-weight: 700;
                font-size: ${PDF_EXPORT_TOKENS.fontSize.sectionTitle};
                margin-top: 18pt;
                border-bottom: 1pt solid ${ink};
                padding-bottom: 3pt;
              }

              .section-content {
                margin-top: 8pt;
              }

              /* === Sub-block cards: one repeating item within a section (a Quality Criteria set, a
                 Quality Assessment run, a Model Evaluation run, a Learning Process, a Feature Set, a
                 Dataset) === */
              .sub-block {
                background: ${tint};
                border: 1pt solid ${border};
                border-left: 4pt solid ${ink};
                padding: 10pt 12pt;
                margin-bottom: 14pt;
              }

              .sub-block-title {
                font-size: ${PDF_EXPORT_TOKENS.fontSize.subBlockTitle};
                font-weight: 600;
                color: ${ink};
                margin-bottom: 6pt;
              }

              /* === Attribute tables: key/value detail blocks === */
              .attribute-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 6pt;
                border: none !important;
              }

              .attribute-table td {
                padding: 4pt 0;
                border: none !important;
                border-bottom: 0.5pt solid ${border} !important;
                vertical-align: baseline;
                font-size: 10pt;
                word-break: break-word;
                white-space: normal;
              }

              .attribute-table td.attribute-title {
                font-weight: 600 !important;
                color: ${text} !important;
                width: 40%;
                text-align: left;
              }

              .attribute-table td.attribute-value {
                font-weight: 400 !important;
                color: ${text} !important;
                text-align: right;
                width: 60%;
              }

              /* === Model/Study Details: short scalar fields in a 2-column tile grid, long narrative
                 fields as full-width labeled blocks below it (mirrors the SCSS) === */
              .detail-grid {
                width: 100%;
                border-collapse: separate;
                margin: 6pt 0;
              }

              .detail-tile {
                width: 50%;
                vertical-align: top;
                background: ${tint};
                border: 1pt solid ${border};
                padding: 8pt 10pt;
              }

              .detail-tile-label {
                font-size: 8.5pt;
                font-weight: 600;
                color: ${textMuted};
                margin-bottom: 2pt;
              }

              .detail-tile-value {
                font-size: 10.5pt;
                font-weight: 600;
                color: ${text};
              }

              .detail-block {
                margin-bottom: 10pt;
              }

              .detail-block-label {
                font-size: 9pt;
                font-weight: 600;
                color: ${ink};
                margin-bottom: 3pt;
              }

              .detail-block-value {
                font-size: 10pt;
                color: ${text};
                text-align: left;
              }

              /* === Data / list tables: every non-attribute table in the document (Quality rules &
                 results, Evaluation measures, Learning stages/datasets, Feature Sets, and the flat
                 comparison tables — Population, Experiment, Parameters, Linked Articles, Survey) is
                 now .data-table, one system. Deliberately no <thead> anywhere in the markup — Word's
                 HTML import filter is known to repeat that literal tag on every page a table spans,
                 so the header is a plain first <tr class="data-table-header-row"> instead. === */
              .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8pt;
                border: 0.8pt solid ${border};
              }

              .data-table th {
                background-color: ${tableHeaderBg};
                color: ${ink};
                font-weight: 700;
                font-size: 10pt;
                text-align: left;
                border: 0.8pt solid ${border};
              }

              .data-table td {
                border: 0.8pt solid ${border};
                color: ${text};
                font-size: 10pt;
                background-color: #ffffff;
              }

              /* Feature Sets' nested feature list has up to 10 columns, so it gets its own tighter,
                 fully standalone table style rather than a modifier meant to combine with .data-table
                 on the same element — Word's HTML import filter appears to drop ALL styling on an
                 element with two space-separated classes, so this table is only ever a single class. */
              .data-table--dense {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8pt;
                border: 0.8pt solid ${border};
              }

              .data-table--dense th {
                background-color: ${tableHeaderBg};
                color: ${ink};
                font-weight: 700;
                font-size: 8.5pt !important;
                text-align: left;
                border: 0.8pt solid ${border};
                padding: 4pt 5pt !important;
              }

              .data-table--dense td {
                border: 0.8pt solid ${border};
                color: ${text};
                font-size: 8.5pt !important;
                background-color: #ffffff;
                padding: 4pt 5pt !important;
              }

              /* === Model Figures: one per row, full width, rather than shrunk side by side — also
                 sidesteps Word's built-in HTML import filter (this whole document is delegated to it
                 via an altChunk — see generateDocx() above), which is known to mis-place images sized
                 with a percentage width inside table cells. The image gets a fixed pixel width both
                 here and as a plain width="" attribute in the template. === */
              .figures-stack {
                margin-top: 6pt;
              }

              .figure-card {
                border: 1pt solid ${border};
                padding: 8pt;
                margin-bottom: 12pt;
                text-align: center;
              }

              .figure-image {
                display: block;
                width: 560px;
                height: auto;
                margin: 0 auto;
              }

              /* === Remove borders in the header table === */
              .passport-header table,
              .passport-header tr,
              .passport-header td {
                border: none !important;
                border-collapse: collapse !important;
              }
            </style>
        `;

        // Compose full HTML document
        const html = `
            <!DOCTYPE html>
            <html>
              <head><meta charset="UTF-8">${styles}</head>
              
              <body>
                
                <div class="passport-header">
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr>
                                <td style="width: 40pt; vertical-align: middle;">
                                    <img src="${logoBase64}" alt="Logo" style="width: 32pt; height: 32pt;">
                                </td>
                                <td style="vertical-align: middle;">
                                    <h2 class="passport-header-title">${this.translateService.instant('PassportManagement.AI4HF Product Passport')}</h2>
                                </td>
                            </tr>
                        </table>
                </div>
                <div class="passport-divider"></div>
                ${clone.innerHTML}
              </body>
            </html>
         `;

        try {
            // Use the global htmlDocx
            const blob = htmlDocx.asBlob(html);
            const today = new Date();
            const formattedDate = today.toISOString().slice(0,10).replace(/-/g, '');
            FileSaver.saveAs(blob, `${this.exportStudyName}_Passport_${formattedDate}.docx`);
            this.closeDialog();
        } catch (e) {
            this.exporting = false;
            console.error('Error generating DOCX:', e);
        }
    }

    /**
     * Closes the PDF preview dialog and emits the `pdfPreviewClosed` event.
     */
    closeDialog() {
        this.pdfPreviewClosed.emit();
    }
}
