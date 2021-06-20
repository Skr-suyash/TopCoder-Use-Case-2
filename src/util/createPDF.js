const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk');

/**
 * Module to create a PDF File out pf a PNG Image
 * @param {String} name - The Name of the image file
 * @param {String} id - Unique id assigned to the PDF FIle
 */
const createPDF = async function(name, id) {
    try {
        // Initial setup, create credentials instance.
        const credentials = PDFToolsSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile('tools-api-key/pdftools-api-credentials.json')
            .build();
        // Create an ExecutionContext using credentials and create a
        // new operation instance.
        const executionContext = PDFToolsSdk.ExecutionContext.create(
            credentials);
        const createPdfOperation = PDFToolsSdk.CreatePDF.Operation.createNew();
        // Set operation input from a source file.
        const input = PDFToolsSdk.FileRef.createFromLocalFile(name);
        createPdfOperation.setInput(input);
        // Execute the operation and Save the result to the specified location.
        try {
            const result = await createPdfOperation.execute(executionContext);
            result.saveAsFile('temp/' + id); // Save to a temporary location
        } catch (error) {
            if (error instanceof PDFToolsSdk.Error.ServiceApiError ||
                error instanceof PDFToolsSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation',
                    error);
            } else {
                console.log('Exception encountered while executing operation',
                    error);
            }
        }
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
};

module.exports = createPDF;

