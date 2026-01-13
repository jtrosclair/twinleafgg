import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { Base64 } from '../../utils/base64';
import { StateSerializer } from '../../game/serializer/state-serializer';


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
        info: {
          turn: state.turn,
          phase: state.phase,
          playerCount: state.players.length
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
