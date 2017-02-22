declare const __DEV__: boolean;
declare const _AU_API: {
    root: string;
    nonce: string;
};

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
