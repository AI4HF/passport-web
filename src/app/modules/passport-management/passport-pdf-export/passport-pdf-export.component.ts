import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import {PassportService} from "../../../core/services/passport.service";

/**
 * Component responsible for generating and exporting the passport PDF.
 */
@Component({
    selector: 'app-passport-pdf-export',
    templateUrl: './passport-pdf-export.component.html',
    styleUrls: ['./passport-pdf-export.component.scss']
})
export class PdfExportComponent {
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

    /** Flag to control the visibility of the PDF preview */
    display: boolean = true;

    /** Event emitted when the PDF preview is closed */
    @Output() pdfPreviewClosed = new EventEmitter<void>();

    constructor(private passportService: PassportService) {}

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
                scale: 2,
                scrollY: 0,
                useCORS: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
                    link.download = 'Passport_signed.pdf';
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
     * Closes the PDF preview dialog and emits the `pdfPreviewClosed` event.
     */
    closeDialog() {
        this.pdfPreviewClosed.emit();
    }
}
