import { Globals } from '../../../../../typings/ALiEMU.d';

export function browserDetect(): Globals.BrowserType {
    const UA: string = navigator.userAgent;
    let broswer: Globals.BrowserType;

    switch (true) {
        case UA.indexOf('Edge') > -1:
            return 'edge';
        case UA.indexOf('Safari') > -1:
            if (UA.indexOf('OPR') > -1) { return 'opera'; }
            if (UA.indexOf('Chrome') > -1) { return 'chrome'; }
            return 'safari';
        case UA.indexOf('Opera') > -1:
            return 'opera';
        case UA.indexOf('Firefox') > -1:
            return 'firefox';
        case UA.indexOf('MSIE') > -1:
            return 'ie';
        case UA.indexOf('Trident') > -1:
            return 'ie';
        default:
            return 'chrome';
    }
}
