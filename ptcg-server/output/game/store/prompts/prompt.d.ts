import { State } from '../state/state';
export declare abstract class Prompt<T> {
    playerId: number;
    readonly abstract type: string;
    id: number;
    result: T | undefined;
    /** If false, unresolved prompt does not block non-resolve Store.dispatch actions. */
    blocksDispatch: boolean;
    constructor(playerId: number);
    decode(result: any, state: State): T | null;
    validate(result: T | null, state: State): boolean;
}
