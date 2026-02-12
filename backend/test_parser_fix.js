const { parseResume } = require('./utils/resumeParser');
const fs = require('fs');
const path = require('path');

async function test() {
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        const files = fs.readdirSync(uploadsDir);
        const pdfFile = files.find(f => f.endsWith('.pdf'));
        const docxFile = files.find(f => f.endsWith('.docx'));

        console.log('--- Testing PDF ---');
        if (pdfFile) {
            console.log(`Parsing ${pdfFile}...`);
            try {
                const data = await parseResume(path.join(uploadsDir, pdfFile));
                console.log('Success! extracted length:', data.summary.length);
            } catch (e) {
                console.error('PDF Parse FAIL:', e.message);
            }
        } else {
            console.log('No PDF file found to test.');
        }

        console.log('\n--- Testing DOCX ---');
        if (docxFile) {
            console.log(`Parsing ${docxFile}...`);
            try {
                const data = await parseResume(path.join(uploadsDir, docxFile));
                console.log('Success! extracted length:', data.summary.length);
            } catch (e) {
                console.error('DOCX Parse FAIL:', e.message);
            }
        } else {
            console.log('No DOCX file found to test.');
        }

    } catch (e) {
        console.error('Test setup error:', e);
    }
}

test();
