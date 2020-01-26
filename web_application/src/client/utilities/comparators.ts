import { Job } from "../models/Job";

export namespace Compare {
    export namespace Map {
        export type ByKey<T> = (a: [T, any], b: [T, any]) => number;
        export type ByValue<T> = (a: [any, T], b: [any, T]) => number;
    }
}

export default class Comparators {
    static unsorted = () => 0;
    static sorted = (key: keyof Job) => (a: [number, Job], b: [number, Job]) => b[1][key] > a[1][key] ? 1 : -1;
}

export enum Ordering {
    UNSORTED = "Unsorted",
    POSITION = "Position Title",
    COMPANY = "Company",
    DATE = "Date",
    STATUS = "Status"
}