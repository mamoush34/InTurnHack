import DynamicOrderedMap from "./dynamic_map";
import { Job } from "../models/Job";
import { Ordering } from "./comparators";

export default class DynamicJobMap extends DynamicOrderedMap<string, Job> {

    constructor(initial: Map<string, Job>) {
        super(
            initial,
            Ordering.UNSORTED,
            () => true,
        );
    }

}