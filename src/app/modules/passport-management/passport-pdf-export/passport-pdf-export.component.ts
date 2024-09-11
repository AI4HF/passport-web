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

@Component({
    selector: 'app-passport-pdf-export',
    templateUrl: './passport-pdf-export.component.html',
    styleUrls: ['./passport-pdf-export.component.scss']
})
export class PdfExportComponent {
    @Input() deploymentDetails: ModelDeployment | null = null;
    @Input() environmentDetails: DeploymentEnvironment | null = null;
    @Input() modelDetails: Model | null = null;
    @Input() studyDetails: Study | null = null;
    @Input() parameters: Parameter[] = [];
    @Input() populationDetails: Population[] = [];
    @Input() experiments: Experiment[] = [];
    @Input() surveys: Survey[] = [];
    @Input() datasetsWithLearningDatasets: DatasetWithLearningDatasetsDTO[] = [];
    @Input() featureSetsWithFeatures: FeatureSetWithFeaturesDTO[] = [];
    @Input() learningProcessesWithStages: LearningProcessWithStagesDTO[] = [];
    display: boolean=true;

    // Emit an event when the PDF export dialog is closed
    @Output() pdfPreviewClosed = new EventEmitter<void>();

    generatePdf() {
        const dataElement = document.getElementById('pdfPreviewContainer');
        if (dataElement) {
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

                pdf.save('DeploymentDetails.pdf');
                this.closeDialog(); // Close the dialog after PDF generation
            }).catch(error => {
                console.error('Error generating PDF:', error);
            });
        }
    }

    // Close the PDF preview dialog
    closeDialog() {
        this.pdfPreviewClosed.emit();
    }
}
