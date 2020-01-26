import { action, observable } from "mobx";
import { PredicateFilter, IterateHandler, Opt, MapUtils } from "./map_types";
import { Compare, Ordering } from "./comparators";
import { AssertionError } from "assert";

export default class DynamicOrderedMap<K, V> {
    @observable private initial_state: Map<K, V>;
    @observable private current_state: Map<K, V>;

    private _predicate: PredicateFilter<K, V, string>;
    private _orderingHandler: Opt<IterateHandler<K, V, string>>;
    @observable protected isCaseSensitive: boolean = false;


    @observable private _orderingCache: Map<string, K[]>;
    @observable private _currentOrdering: string;
    @observable private _currentFilter: string;
    @observable private _currentComparator?: Compare.Map.ByValue<V>;

    constructor(init: Map<K, V>, d: string, p: PredicateFilter<K, V, string>, h?: IterateHandler<K, V, string>) {
        this.initial_state = MapUtils.deepCopy(init);
        this.current_state = MapUtils.deepCopy(init);
        this._predicate = p;

        this._orderingCache = new Map<string, K[]>();
        this._orderingHandler = h;

        this._currentOrdering = d;
        this._currentFilter = ""

        this.cache(this.initial_state, this.currentOrdering);
    }

    public get currentOrdering() {
        return this._currentOrdering;
    }

    public get initial() {
        return this.initial_state;
    }

    public get current() {
        return this.current_state
    }

    @action
    setCaseSensitivity = (value: boolean) => {
        this.isCaseSensitive = value;
        this.filterBy(undefined);
    }

    @action
    sortBy = (comparator: Compare.Map.ByValue<V>, ordering: string, updateGui: boolean = true) => {
        let source: Opt<Map<K, V>> = null;
        this._currentComparator = comparator;

        if (updateGui) {
            // if it is in the cache, we have no need to...
            if (!this.apply(ordering)) source = this.current_state;
        } else source = new Map();

        // ...rebuild it here
        if (source !== null) {
            source = new Map(Array.from(this.initial_state.entries()).sort(comparator))
            if (this._orderingHandler) MapUtils.iterate(source, this._orderingHandler, ordering);
            this.cache(source, ordering);
        }

        if (updateGui) this.filterBy(this._currentFilter);
    }

    @action
    insert = (key: K, value: V) => {
        this.initial_state.set(key, value);
        this._orderingCache = new Map<string, K[]>();
        this.sortBy(this._currentComparator!, this.currentOrdering);
    }

    @action
    filterBy = (phrase?: string) => {
        if (phrase !== undefined) this._currentFilter = phrase.trim();
        // reconstruct full ordered map from ranking cache (ignores previous filter state)
        // order it appropriately
        if (!this.apply(this._currentOrdering))
            throw new AssertionError({ message: `This ordering (${this._currentOrdering}) should be in cache!` });

        // if no filter phrase, no need to remove entries
        if (this._currentFilter.length === 0) return;
        // set this.activities to a deep copy of itself containing only matching entries
        this.current_state = MapUtils.deepCopy(this.current_state, { predicate: this._predicate, info: this._currentFilter });
    }

    @action
    invalidateOrdering = (ordering: string) => this._orderingCache.delete(ordering);

    // maintains an insertion-ordered list of activity ids,
    // capturing a lightweight snapshot of the map ordering
    @action
    cache = (src: Map<K, V>, ordering: string) => {
        let record: K[] = [];
        MapUtils.iterate(src, (e) => record.push(e.key));
        this._orderingCache.set(ordering, record);
    }

    @action
    apply = (ordering: string) => {
        this._currentOrdering = ordering
        let cached = this._orderingCache.get(ordering);
        if (!cached) return false;

        let record = new Map<K, V>();
        cached.forEach(key => record.set(key, this.initial_state.get(key)!));

        this.current_state = record;
        return true;
    }
}