export {};

declare global {
    interface Window {
        readonly AU_API: {
            readonly nonce: string;
            readonly url: string;
        }
    }
}
