export {};

declare global {
    interface Window {
        readonly AU_AJAX: {
            readonly nonce: string;
        };
        readonly AU_API: {
            readonly nonce: string;
            readonly url: string;
        };
        readonly ajaxurl: string;
    }
}
