import { State, StateLog } from 'ptcg-server';
import { Observable } from 'rxjs';

/** Ephemeral UI state for one puzzle. */
export class Session {
  clientId = 0;
  lastGameId = 0;
  gameStates: LocalGameState[] = [];
}

export interface LocalGameState {
  gameId: number;
  localId: number;
  clientSide: true;
  stateData: string;
  state: State;
  deleted: boolean;
  gameOver: boolean;
  promptMinimized: boolean;
  turnComplete: boolean;
  logs: StateLog[];
}

export interface SessionGetters {
  get<T>(selector: (session: Session) => T): Observable<T>;
  get<T, R>(s1: (session: Session) => T, s2: (session: Session) => R): Observable<[T, R]>;
  get<T, R, S>(s1: (session: Session) => T, s2: (session: Session) => R, s3: (session: Session) => S): Observable<[T, R, S]>;
}
