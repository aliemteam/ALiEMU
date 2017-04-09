jest.mock('../browserDetect');
import browserDetect from '../browserDetect';
import downloadPolyfill from '../downloadPolyfill';

URL.createObjectURL = jest.fn();
navigator.msSaveBlob = jest.fn();

const detect = <jest.Mock<any>>browserDetect;
const alertSpy = (<any>jest).spyOn(window, 'alert');

const getBlob = () => new Blob(['tester'], { type: 'text/plain' });

beforeAll(() => {
    document.body.innerHTML = `
        <div>
            <a id="test-id">Testing</a>
        </div>
    `;
});

afterEach(() => jest.clearAllMocks());

describe('downloadPolyfill', () => {
    it('should work properly for supported browsers', () => {
        detect.mockReturnValueOnce('chrome');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        detect.mockReturnValueOnce('firefox');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        detect.mockReturnValueOnce('opera');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        detect.mockReturnValueOnce('edge');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        expect(URL.createObjectURL).toHaveBeenCalledTimes(4);
        expect(alertSpy).not.toHaveBeenCalled();
    });
    it('should fallback properly on internet explorer', () => {
        detect.mockReturnValueOnce('ie');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        expect(navigator.msSaveBlob).toHaveBeenCalled();
        expect(alertSpy).not.toHaveBeenCalled();
        expect(URL.createObjectURL).not.toHaveBeenCalled();
    });
    it('should fallback properly for safari', () => {
        detect.mockReturnValueOnce('safari');
        downloadPolyfill('test.txt', getBlob(), 'test-id');
        expect(alertSpy).toHaveBeenCalled();
        expect(URL.createObjectURL).toHaveBeenCalled();
    });
});
