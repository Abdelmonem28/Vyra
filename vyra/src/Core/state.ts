import { StateGetter, subscription } from "../types";

    

export function createState<T>(initialValue: T): [StateGetter<T>, (newValue: T | ((prev: T) => T)) => void] {
    let value = initialValue;

    // Set of subscribers to notify when the state changes.
    const subscribers = new Set<subscription>();

    const get = (() => value) as StateGetter<T>;

    // Subscribe function to add a subscriber.
    get._subscribe = (fn: subscription) => {
        subscribers.add(fn);
    };

    // Unsubscribe function to remove a subscriber.
    get._unsubscribe = (fn: subscription) => {
        subscribers.delete(fn);
    }

    const set = (next: T | ((prev: T) => T)) => {
        // Support both direct values and updater functions:
        //   setCount(5)              ← direct value
        //   setCount(prev => prev+1) ← updater, avoids stale closure issues
        value = typeof next === 'function'
            ? (next as (prev: T) => T)(value)
            : next;

        subscribers.forEach(fn => fn());
    }

    return [get, set];
}