const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

console.log('Type of pdf export:', typeof pdf);
console.log('pdf export:', pdf);

// Test with one of the existing files
const uploadsDir = path.join(__dirname, 'uploads');
try {
    const files = fs.readdirSync(uploadsDir);
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    const docxFile = files.find(f => f.endsWith('.docx'));

    if (pdfFile) {
        console.log('Testing PDF:', pdfFile);
        const pdfPath = path.join(uploadsDir, pdfFile);
        const buffer = fs.readFileSync(pdfPath);
        if (typeof pdf === 'function') {
            pdf(buffer).then(data => console.log('PDF text length:', data.text.length))
                .catch(e => console.error('PDF error:', e));
        } else {
            console.error('Skipping PDF test because pdf is not a function');
        }
    }

    if (docxFile) {
        console.log('Testing DOCX:', docxFile);
        const docxPath = path.join(uploadsDir, docxFile);
        mammoth.extractRawText({ path: docxPath })
            .then(result => console.log('DOCX text length:', result.value.length))
            .catch(e => console.error('DOCX error:', e));
    }

} catch (e) {
    console.error('Error listing uploads:', e);
}
