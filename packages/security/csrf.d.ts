export declare function issue(): {
    cookie: string;
    value: string;
};
export declare function verify(serverToken: string, clientToken: string): boolean | "";
