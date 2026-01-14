import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Client } from '../client/client.interface';
import { Core } from './core';
import { State, GamePhase, GameWinner } from '../store/state/state';
import { User, Match } from '../../storage';
import { Replay } from './replay';
import { ReplayPlayer } from './replay.interface';

export class MatchRecorder {

  private finished: boolean = false;
  private client1: Client | undefined;
  private client2: Client | undefined;
  private replay: Replay;
  private transactionTimeout: NodeJS.Timeout | undefined;
  private readonly TRANSACTION_TIMEOUT_MS = 30000; // 30 seconds

  constructor(private core: Core) {
    this.replay = new Replay({ indexEnabled: false });
  }

  public onStateChange(state: State) {
    if (this.finished) {
      return;
    }

    if (state.players.length >= 2) {
      this.updateClients(state);
    }

    if (state.phase !== GamePhase.WAITING_FOR_PLAYERS) {
      //this.replay.appendState(state);
    }

    if (state.phase === GamePhase.FINISHED) {
      this.finished = true;
      if (state.winner !== GameWinner.NONE) {
        this.saveMatch(state);
      } else {
        this.cleanup();
      }
    }
  }

  @Transaction()
  private async saveMatch(state: State, @TransactionManager() manager?: EntityManager) {
    if (!this.client1 || !this.client2 || manager === undefined) {
      this.cleanup();
      return;
    }

    try {
      // Set transaction timeout
      this.transactionTimeout = setTimeout(() => {
        console.error('[MatchRecorder] Transaction timeout after', this.TRANSACTION_TIMEOUT_MS, 'ms');
        this.cleanup();
      }, this.TRANSACTION_TIMEOUT_MS);

      const match = new Match();
      match.player1 = this.client1.user;
      match.player2 = this.client2.user;
      match.winner = state.winner;
      match.created = Date.now();
      match.ranking1 = match.player1.ranking;
      match.ranking2 = match.player2.ranking;
      match.rankingStake1 = 0;
      match.rankingStake2 = 0;

      // Store archetype information based on deck analysis
      const player1Archetypes = await this.getPlayerArchetypes(state.players[0]);
      const player2Archetypes = await this.getPlayerArchetypes(state.players[1]);
      match.player1Archetype = player1Archetypes.primary;
      match.player1Archetype2 = player1Archetypes.secondary || '';
      match.player2Archetype = player2Archetypes.primary;
      match.player2Archetype2 = player2Archetypes.secondary || '';
      match.player1DeckName = `Deck ${match.player1.id}`;
      match.player2DeckName = `Deck ${match.player2.id}`;
      match.player1DeckId = state.players[0].deckId || null;
      match.player2DeckId = state.players[1].deckId || null;

      this.replay.setCreated(match.created);
      this.replay.player1 = this.buildReplayPlayer(match.player1);
      this.replay.player2 = this.buildReplayPlayer(match.player2);
      this.replay.winner = match.winner;
      match.replayData = ''; // this.replay.serialize();
      //await manager.save(match);

    } catch (error) {
      console.error('[MatchRecorder] Error saving match:', error);
    } finally {
      if (this.transactionTimeout) {
        clearTimeout(this.transactionTimeout);
      }
      this.cleanup();
    }
  }

  public cleanup(): void {
    this.finished = true;
    this.client1 = undefined;
    this.client2 = undefined;
    if (this.transactionTimeout) {
      clearTimeout(this.transactionTimeout);
      this.transactionTimeout = undefined;
    }
    this.replay = new Replay({ indexEnabled: false });
  }

  private updateClients(state: State) {
    const player1Id = state.players[0].id;
    const player2Id = state.players[1].id;
    if (this.client1 === undefined) {
      this.client1 = this.findClient(player1Id);
    }
    if (this.client2 === undefined) {
      this.client2 = this.findClient(player2Id);
    }
  }

  private findClient(clientId: number): Client | undefined {
    return this.core.clients.find(c => c.id === clientId);
  }

  private buildReplayPlayer(player: User): ReplayPlayer {
    return { userId: player.id, name: player.name, ranking: player.ranking };
  }

  private async getPlayerArchetypes(player: any): Promise<{ primary: string; secondary?: string }> {
    return { primary: 'UNKNOWN' };
  }

}
