import {Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { ModelDeployment } from '../../../shared/models/modelDeployment.model';
import { DeploymentEnvironment } from '../../../shared/models/deploymentEnvironment.model';
import { Model } from '../../../shared/models/model.model';
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
import {EvaluationMeasure} from "../../../shared/models/evaluationMeasure.model";
import {ModelFigure} from "../../../shared/models/modelFigure.model";

/**
 * Component responsible for generating and exporting the passport PDF.
 */
@Component({
    selector: 'app-passport-pdf-export',
    templateUrl: './passport-pdf-export.component.html',
    styleUrls: ['./passport-pdf-export.component.scss']
})
export class PdfExportComponent extends BaseComponent{
    /** Deployment details to be included in the PDF */
    @Input() deploymentDetails: ModelDeployment | null = null;
    /** Environment details to be included in the PDF */
    @Input() environmentDetails: DeploymentEnvironment | null = null;
    /** Model details to be included in the PDF */
    @Input() modelDetails: Model | null = null;
    /** Study details to be included in the PDF */
    @Input() studyDetails: Study | null = null;
    /** Parameters to be included in the PDF */
    @Input() parameters: Parameter[] = [];
    /** Population details to be included in the PDF */
    @Input() populationDetails: Population[] = [];
    /** Experiments to be included in the PDF */
    @Input() experiments: Experiment[] = [];
    /** Surveys to be included in the PDF */
    @Input() surveys: Survey[] = [];
    /** Datasets with learning datasets to be included in the PDF */
    @Input() datasetsWithLearningDatasets: DatasetWithLearningDatasetsDTO[] = [];
    /** Feature sets with associated features to be included in the PDF */
    @Input() featureSetsWithFeatures: FeatureSetWithFeaturesDTO[] = [];
    /** Learning processes with stages to be included in the PDF */
    @Input() learningProcessesWithStages: LearningProcessWithStagesDTO[] = [];
    /** Evaluation Measures to be included in the PDF */
    @Input() evaluationMeasures: EvaluationMeasure[] = [];
    /** Model Figures to be included in the PDF */
    @Input() modelFigures: ModelFigure[] = [];

    /** Flag to control the visibility of the PDF preview */
    display: boolean = true;

    /** Event emitted when the PDF preview is closed */
    @Output() pdfPreviewClosed = new EventEmitter<void>();

    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Generates the PDF for the passport using the provided details.
     * Then conducts a PDF transaction with the server to digitally sign the pdf.
     */
    generatePdf() {
        const dataElement = document.getElementById('pdfPreviewContainer');
        if (!dataElement) return;

        const opt = {
            margin:       0,
            filename:     'Passport.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  {
                width: 1200,
                scrollY: 0,
                useCORS: true
            },
            jsPDF:        { unit: 'mm', format: 'a2', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(dataElement).outputPdf('blob').then((pdfBlob: Blob) => {
            if (!this.studyDetails?.id) {
                throw new Error("Study Details not available - Inapplicable Passport");
            }

            const studyId = this.studyDetails.id;

            this.passportService.signPdf(pdfBlob, studyId).subscribe({
                next: (signedPdfBlob: Blob) => {
                    const downloadUrl = URL.createObjectURL(signedPdfBlob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    const today = new Date();
                    const formattedDate = today.toISOString().slice(0,10).replace(/-/g, '');
                    link.download = `${this.studyDetails.name}_Passport_${formattedDate}.pdf`;
                    link.click();
                    URL.revokeObjectURL(downloadUrl);
                    this.closeDialog();
                },
                error: (err) => {
                    console.error('Error signing PDF:', err);
                }
            });
        }).catch((error: any) => {
            console.error('Error generating PDF:', error);
        });
    }

    /**
     * Generates a DOCX from the live preview HTML using globally-loaded html-docx-js.
     * We load the library as a classic <script> to avoid strict mode issues.
     */
    async generateDocx() {
        const container = document.getElementById('pdfPreviewContainer'); // uses your existing preview root
        if (!container) return;

        // Clone to avoid touching live DOM
        const clone = container.cloneNode(true) as HTMLElement;
        // Remove favicon
        clone.querySelectorAll('.passport-header').forEach((el) => el.remove());
        // Fix table layout issues for Word
        clone.querySelectorAll('table').forEach((t) => {
            t.style.width = '100%';
            t.style.tableLayout = 'fixed';
            t.style.borderCollapse = 'collapse';
            t.style.margin = '8pt 0';
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

        // Minimal styles
        const styles = `
            <style>
              body {
                background: #ffffff;
                color: #333333;
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
                color: #E57373;
                font-weight: 700;
                font-size: 18pt;
                margin: 0;
                text-align: right;
                font-family: 'Segoe UI', Arial, sans-serif;
                letter-spacing: -0.25pt;
              }
            
              .passport-divider {
                border-top: 3pt solid #E87B7B;
                margin: 8pt 0 12pt 0;
              }
            
              /* === Section Headings === */
              .section-title {
                color: #E87B7B;
                font-weight: 700;
                font-size: 13pt;
                margin-top: 18pt;
                border-bottom: 1pt solid #E87B7B;
                padding-bottom: 3pt;
              }
            
              /* === Section Content === */
              .section-content {
                margin-top: 8pt;
              }
            
              /* === Generic Row Layout (DOCX-friendly) === */
              .row {
                border-bottom: 0.5pt solid #eee;
                padding: 3pt 0;
              }
            
              /* Block layout for .col-12 to prevent inline-block spacing issues */
              .row .col-12 {
                display: block !important;
                width: 100%;
                font-size: 0; /* Removes inline-block gaps */
              }
            
              /* Two-column row layout: left title + right value */
              .row .col-12 .attribute-title,
              .row .col-12 .attribute-value {
                display: inline-block !important;
                vertical-align: baseline;
                box-sizing: border-box;
                width: 49%;
                font-size: 11pt; /* Reset because parent font-size is 0 */
                padding: 2pt 0;
              }
            
              /* Left column (attribute title) */
              .row .col-12 .attribute-title {
                text-align: left;
                color: #333333;
                font-weight: 600;
              }
            
              /* Right column (attribute value) */
              .row .col-12 .attribute-value {
                text-align: right;
                color: #333333;
                white-space: nowrap; /* Keep in a single line */
              }
            
              /* === Table-like Blocks (Matching PDF color theme) === */
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8pt;
                border: 0.8pt solid #F2BDBD;
              }
            
              th {
                background-color: #f9fafb; /* Soft pastel pink background */
                color: #E07373;            /* Warm pink text */
                font-weight: 700;
                font-size: 10.5pt;
                padding: 6pt 5pt;
                text-align: left;
                border: 0.8pt solid #F2BDBD;
              }
            
              td {
                border: 0.8pt solid #F2BDBD;
                padding: 5pt;
                color: #333333;
                font-size: 10.5pt;
                background-color: #ffffff;
              }
            
              tr:nth-child(even) td {
                background: #ffffff;
              }
            
              /* === Inner Table Title Bars (e.g., “Learning Dataset Description”) === */
              .sub-table-header {
                background-color: #f9fafb;
                color: #E07373;
                font-weight: 700;
                font-size: 11pt;
                padding: 5pt;
                border: 0.8pt solid #F2BDBD;
              }
            
              /* === Section Spacing === */
              .section {
                margin-bottom: 18pt;
              }
            
              /* === Attribute Tables (Details sections) === */
              /* Make attribute titles bold to match PDF style */
              .section-content .attribute-table td.attribute-title {
                font-weight: bold !important;
                color: #222222 !important;
                font-size: 11pt !important;
              }
            
              /* Attribute values remain normal weight */
              .section-content .attribute-table td.attribute-value {
                font-weight: 400 !important;
                color: #333333 !important;
                text-align: right;
                white-space: nowrap;
              }
            
              /* Keep other data tables (datasets, features, etc.) unchanged */
              .datasets-table td:first-child,
              .feature-sets-table td:first-child,
              .learning-datasets-table td:first-child,
              .learning-processes-table td:first-child,
              .parameters-table td:first-child,
              .population-table td:first-child,
              .experiment-table td:first-child,
              .survey-table td:first-child,
              .study-table td:first-child {
                font-weight: 400 !important;
                color: #333333 !important;
              }
            
              /* === Match attribute tables to clean PDF look === */
              .section-content .attribute-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 6pt;
                border: none !important; /* Remove outer border */
              }
            
              .section-content .attribute-table td {
                padding: 4pt 0;
                border: none !important;
                border-bottom: 0.5pt solid #eeeeee !important; /* Only bottom line */
                vertical-align: baseline;
                font-size: 10.5pt;
              }
            
              /* Title column */
              .section-content .attribute-table td.attribute-title {
                font-weight: bold !important;
                color: #222222 !important;
                width: 40%;
                text-align: left;
              }
            
              /* Value column */
              .section-content .attribute-table td.attribute-value {
                font-weight: 400 !important;
                color: #333333 !important;
                text-align: right;
                width: 60%;
                white-space: nowrap;
              }
            
              /* === Keep regular dataset/feature tables with borders === */
              .datasets-table td,
              .feature-sets-table td,
              .learning-datasets-table td,
              .learning-processes-table td,
              .parameters-table td,
              .population-table td,
              .experiment-table td,
              .survey-table td,
              .study-table td {
                border: 0.8pt solid #F2BDBD !important;
                padding: 5pt;
              }
            
              /* === Remove borders in header table === */
              .passport-header table,
              .passport-header tr,
              .passport-header td {
                border: none !important;
                border-collapse: collapse !important;
              }
            
              /* === Compact cell spacing in details tables === */
              .section-content table td {
                padding-top: 0.6pt !important;
                padding-bottom: 0.6pt !important;
                line-height: 1.05 !important;
              }
            
              /* === Slightly more compact font in titles/values === */
              .section-content .attribute-title,
              .section-content .attribute-value {
                font-size: 10pt !important;
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
            FileSaver.saveAs(blob, `${this.studyDetails.name}_Passport_${formattedDate}.docx`);
            this.closeDialog();
        } catch (e) {
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
