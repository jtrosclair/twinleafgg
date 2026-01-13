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

      // Attempt to decode and deserialize the state
      const base64 = new Base64();
      const serializedState = base64.decode(stateData);
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
      res.status(400).send({
        ok: false,
        valid: false,
        error: 'INVALID_STATE',
        message: error.message || 'Failed to deserialize game state'
      });
    }
  }

}
