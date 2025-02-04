import { Component, EventEmitter, Input, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
     */
    generatePdf() {
        const dataElement = document.getElementById('pdfPreviewContainer');
        if (!dataElement) {
            return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        html2canvas(dataElement, {
            scrollY: -window.scrollY,
            scale: 2,
            windowWidth: dataElement.scrollWidth,
            windowHeight: dataElement.scrollHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const pdfBlob: Blob = pdf.output('blob') as Blob;

            if (!this.studyDetails?.id) {
                throw new Error("Study Details not available - Inapplicable Passport");
            }
            const studyId = this.studyDetails.id;

            this.passportService.signPdf(pdfBlob, studyId).subscribe({
                next: (signedPdfBlob: Blob) => {
                    const downloadUrl = URL.createObjectURL(signedPdfBlob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = 'DeploymentDetails_signed.pdf';
                    link.click();

                    URL.revokeObjectURL(downloadUrl);
                    this.closeDialog();
                },
                error: (err) => {
                    console.error('Error signing PDF:', err);
                }
            });
        }).catch(error => {
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
