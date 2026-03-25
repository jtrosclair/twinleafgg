import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { Base64 } from '../../utils/base64';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { SuperType } from '../../game/store/card/card-types';
import { Card } from '../../game/store/card/card';
import { Player } from '../../game/store/state/player';


export class Game extends Controller {

  @Get('/:id/logs')
  @AuthToken()
  public async onLogs(req: Request, res: Response) {
    const gameId: number = parseInt(req.params.id, 10);
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      res.send({ error: ApiErrorEnum.GAME_INVALID_ID });
      return;
    }
    const logs = game.state.logs;
    res.send({ ok: true, logs });
  }

  @Get('/:id/playerStats')
  @AuthToken()
  public async onPlayerStats(req: Request, res: Response) {
    const gameId: number = parseInt(req.params.id, 10);
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      res.send({ error: ApiErrorEnum.GAME_INVALID_ID });
      return;
    }
    const playerStats = game.playerStats;
    res.send({ ok: true, playerStats });
  }

  @Post('/validate-cards')
  public async onValidateCards(req: Request, res: Response) {
    try {
      const { stateData } = req.body;

      if (!stateData || typeof stateData !== 'string') {
        res.status(400).send({
          valid: false,
          errors: ['stateData is required and must be a string']
        });
        return;
      }

      if (!StateSerializer.knownCards || StateSerializer.knownCards.length === 0) {
        res.status(500).send({
          valid: false,
          errors: ['Card database not initialized']
        });
        return;
      }

      const base64 = new Base64();
      let decoded: string;

      try {
        decoded = base64.decode(stateData);
      } catch (e: any) {
        res.status(400).send({
          valid: false,
          errors: ['Failed to decode base64 string: ' + (e.message || 'Invalid base64')]
        });
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(decoded);
      } catch (e: any) {
        res.status(400).send({
          valid: false,
          errors: ['Failed to parse state JSON: ' + (e.message || 'Invalid JSON')]
        });
        return;
      }

      const cardNames: string[] = parsed[1]?.cardNames;
      if (!Array.isArray(cardNames)) {
        res.status(400).send({
          valid: false,
          errors: ['Game state does not contain a cardNames array']
        });
        return;
      }

      const errors: string[] = [];
      for (const originalName of cardNames) {
        const normalized = StateSerializer.normalizeCardName(originalName);
        if (!normalized) {
          errors.push(`Invalid Card: ${originalName}`);
        }
      }

      res.send({
        valid: errors.length === 0,
        errors
      });
    } catch (error: any) {
      res.status(500).send({
        valid: false,
        errors: [error.message || 'Unexpected error during validation']
      });
    }
  }

  @Post('/extract-decklists')
  public async onExtractDecklists(req: Request, res: Response) {
    try {
      const { stateData } = req.body;

      if (!stateData || typeof stateData !== 'string') {
        res.status(400).send({
          ok: false,
          error: 'stateData is required and must be a string'
        });
        return;
      }

      if (!StateSerializer.knownCards || StateSerializer.knownCards.length === 0) {
        res.status(500).send({
          ok: false,
          error: 'Card database not initialized'
        });
        return;
      }

      const base64 = new Base64();
      let serializedState: string;

      try {
        serializedState = base64.decode(stateData);
      } catch (e: any) {
        res.status(400).send({
          ok: false,
          error: 'Failed to decode base64 string: ' + (e.message || 'Invalid base64')
        });
        return;
      }

      try {
        const parsed = JSON.parse(serializedState);
        if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
          parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
            name = name.replace('é', 'e');
            const normalizedName = StateSerializer.normalizeCardName(name);
            return normalizedName || name;
          });
          serializedState = JSON.stringify(parsed);
        }
      } catch (e: any) {
        res.status(400).send({
          ok: false,
          error: 'Failed to parse state JSON: ' + (e.message || 'Invalid JSON')
        });
        return;
      }

      const serializer = new StateSerializer();
      const state = serializer.deserialize(serializedState);

      const decklists = state.players.map((player, index) => ({
        playerIndex: index,
        playerName: player.name,
        decklist: this.formatDecklist(this.collectAllCards(player))
      }));

      res.send({ ok: true, decklists });
    } catch (error: any) {
      res.status(400).send({
        ok: false,
        error: error.message || 'Failed to extract decklists'
      });
    }
  }

  private collectAllCards(player: Player): Card[] {
    const cards: Card[] = [];
    const seen = new Set<Card>();

    const addCards = (cardArray: Card[]) => {
      for (const card of cardArray) {
        if (!seen.has(card)) {
          seen.add(card);
          cards.push(card);
        }
      }
    };

    // Standard zones
    addCards(player.deck.cards);
    addCards(player.hand.cards);
    addCards(player.discard.cards);
    addCards(player.lostzone.cards);
    addCards(player.stadium.cards);
    addCards(player.supporter.cards);

    // Active pokemon slot
    addCards(player.active.cards);
    addCards(player.active.tools);
    addCards(player.active.energies.cards);

    // Bench slots
    for (const benchSlot of player.bench) {
      addCards(benchSlot.cards);
      addCards(benchSlot.tools);
      addCards(benchSlot.energies.cards);
    }

    // Prize cards
    for (const prizeStack of player.prizes) {
      addCards(prizeStack.cards);
    }

    return cards;
  }

  private formatDecklist(cards: Card[]): string {
    const counts = new Map<string, { count: number; name: string; set: string; setNumber: string; superType: SuperType }>();

    for (const card of cards) {
      const key = `${card.fullName}`;
      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        counts.set(key, {
          count: 1,
          name: card.name,
          set: card.set,
          setNumber: card.setNumber,
          superType: card.superType
        });
      }
    }

    const pokemon: string[] = [];
    const trainer: string[] = [];
    const energy: string[] = [];
    let pokemonCount = 0;
    let trainerCount = 0;
    let energyCount = 0;

    Array.from(counts.values()).forEach(entry => {
      const line = `${entry.count} ${entry.name} ${entry.set} ${entry.setNumber}`;
      switch (entry.superType) {
        case SuperType.POKEMON:
          pokemon.push(line);
          pokemonCount += entry.count;
          break;
        case SuperType.TRAINER:
          trainer.push(line);
          trainerCount += entry.count;
          break;
        case SuperType.ENERGY:
          energy.push(line);
          energyCount += entry.count;
          break;
      }
    });

    const sections: string[] = [];

    if (pokemon.length > 0) {
      sections.push(`Pokémon: ${pokemonCount}\n${pokemon.join('\n')}`);
    }
    if (trainer.length > 0) {
      sections.push(`Trainer: ${trainerCount}\n${trainer.join('\n')}`);
    }
    if (energy.length > 0) {
      sections.push(`Energy: ${energyCount}\n${energy.join('\n')}`);
    }

    return sections.join('\n\n');
  }

  @Post('/validate-state')
  public async onValidateState(req: Request, res: Response) {
    try {
      const { stateData } = req.body;

      if (!stateData || typeof stateData !== 'string') {
        res.status(400).send({
          ok: false,
          valid: false,
          error: 'INVALID_REQUEST',
          message: 'stateData is required and must be a string'
        });
        return;
      }

      // Check if known cards are initialized
      if (!StateSerializer.knownCards || StateSerializer.knownCards.length === 0) {
        res.status(500).send({
          ok: false,
          valid: false,
          error: 'SERVER_NOT_READY',
          message: 'Card database not initialized'
        });
        return;
      }

      // Attempt to decode and deserialize the state
      const base64 = new Base64();
      let serializedState: string;

      try {
        serializedState = base64.decode(stateData);
      } catch (decodeError: any) {
        res.status(400).send({
          ok: false,
          valid: false,
          error: 'INVALID_BASE64',
          message: 'Failed to decode base64 string: ' + (decodeError.message || 'Invalid base64')
        });
        return;
      }

      // Preprocess the card names by normalizing them before deserialization
      try {
        const parsed = JSON.parse(serializedState);
        if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
          parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
            name = name.replace("é", 'e')
            const normalizedName = StateSerializer.normalizeCardName(name);
            // If normalization returns empty string, keep the original name
            // to let the deserializer produce a proper error message
            return normalizedName || name;
          });
          serializedState = JSON.stringify(parsed);
        }
      } catch (parseError: any) {
        res.status(400).send({
          ok: false,
          valid: false,
          error: 'INVALID_JSON',
          message: 'Failed to parse state JSON: ' + (parseError.message || 'Invalid JSON')
        });
        return;
      }

      const serializer = new StateSerializer();
      const state = serializer.deserialize(serializedState);

      // If we reach here without errors, the state is valid
      res.send({
        ok: true,
        valid: true,
        serializedState: btoa(serializedState),
        info: {
          turn: state.turn,
          phase: state.phase,
          playerCount: state.players.length,
          state: state
        }
      });
    } catch (error: any) {
      // If deserialization fails, the state is invalid
      // Check if it's a card-related error
      const errorMessage = error.message || 'Failed to deserialize game state';
      const isCardError = errorMessage.includes('Unknown card');

      res.status(400).send({
        ok: false,
        valid: false,
        error: isCardError ? 'UNKNOWN_CARD' : 'INVALID_STATE',
        message: errorMessage
      });
    }
  }

}
