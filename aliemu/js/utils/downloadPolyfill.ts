import browserDetect from './browserDetect';

/**
 * Either immediately triggers a file download or saves a downloadable file blob
 *   to an HTML anchor element, depending on browser support for the "download"
 *   attribute.
 *
 * @param filename  The name of the file (with .csv as the suffix).
 * @param blob      A prepared file blob for download.
 * @param elementId The HTML ID of the target element.
 * @return {void}
 */
export default function downloadPolyfill(filename: string, blob: Blob, elementId: string): void {
    switch (browserDetect()) {
        case 'chrome':
        case 'firefox':
        case 'opera':
        case 'edge':
            const a: HTMLAnchorElement = document.createElement('a');
            document.body.appendChild(a);
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            document.body.removeChild(a);
            break;
        case 'ie':
            window.navigator.msSaveBlob(blob, filename);
            break;
        default:
            const target = document.getElementById(elementId);
            target.setAttribute('href', URL.createObjectURL(blob));
            target.setAttribute('download', filename);
            alert('Right click the button and select "save target as" to download CSV file.');
    }
}
