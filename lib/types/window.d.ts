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
        readonly AU_SESSION_TOKEN: string;
        readonly ajaxurl: string;
    }
}
