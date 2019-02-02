type Omit<T, K extends keyof T> = T extends any
    ? Pick<T, Exclude<keyof T, K>>
    : never;

type Scalar = string | number | boolean;
