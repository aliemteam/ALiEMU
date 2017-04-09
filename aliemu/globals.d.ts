declare const __DEV__: boolean;
declare const _AU_API: {
    root: string;
    nonce: string;
};
declare const ajaxurl: string;
declare const jQuery;

declare interface UserMeta {
    completedCourses: {
        [id: number]: {
            date: number;
            hours: number;
        };
    };
    graduationYear: number|null;
    group: {
        id: string;
        members: number[];
    };
    lastActivity: number;
}
