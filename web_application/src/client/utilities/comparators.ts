import { Job } from "../models/Job";

export namespace Compare {
    export namespace Map {
        export type ByKey<T> = (a: [T, any], b: [T, any]) => number;
        export type ByValue<T> = (a: [any, T], b: [any, T]) => number;
    }
}

export namespace Comparators {
    export const unsorted = () => 0;
    export const sorted = <T>(key: keyof T, descending = true) => (a: [string, T], b: [string, T]) => (b[1][key] > a[1][key] ? -1 : 1) * (descending ? 1 : -1);
}

export enum Ordering {
    UNSORTED = "unsorted",
    POSITION = "jobTitle",
    COMPANY = "company",
    DATE = "appDate",
    STATUS = "status"
}