/**
 * Shared design tokens for the passport PDF/DOCX export.
 *
 * The PDF preview/export path is styled via `passport-pdf-export.component.scss` (SCSS variables,
 * compile-time only). The DOCX export path builds its own inline `<style>` string at runtime in
 * `generateDocx()` and can't reference SCSS, so it imports this object instead. Keep the hex values
 * here in sync with the `$pdf-*` SCSS variables at the top of the `.scss` file — they're two copies
 * of the same palette by necessity, not by accident.
 */
export const PDF_EXPORT_TOKENS = {
    color: {
        /** Headings, section titles, primary accent. */
        ink: '#1E3A5F',
        /** Body text. */
        text: '#2D2D2D',
        /** Secondary/meta text. */
        textMuted: '#6B7280',
        /** Table borders, dividers. */
        border: '#D9DEE5',
        /** Background tint for nested sub-blocks. */
        tint: '#F5F7FA',
        /** Table header background. */
        tableHeaderBg: '#EEF1F5',
    },
    fontSize: {
        documentTitle: '20pt',
        sectionTitle: '14pt',
        subBlockTitle: '11pt',
        tableHeader: '10pt',
        body: '10pt',
    },
    spacing: {
        sectionGap: '24pt',
        subBlockGap: '14pt',
        cellPaddingV: '6pt',
        cellPaddingH: '8pt',
    },
};
