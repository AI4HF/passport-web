/**
 * Input parameters for PDF generation request parameters
 */
export class GenerateAndSignPdfOptionsDto {
    baseUrl?: string;
    fileName?: string;
    width?: string;
    height?: string;
    landscape?: boolean;
}

/**
 * Final request body sent for PDF generation
 */
export class GenerateAndSignPdfRequestDto {
    htmlContent: string;
    baseUrl: string;
    fileName: string;
    width: string;
    height: string;
    landscape: boolean;
    studyId: String;
}
