import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DamageMap, GameError, GameMessage, MoveDamagePrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class DamageMover extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Damage Mover';

  public fullName: string = 'Damage Mover SLG';

  public text: string =
    'Move 3 damage counters from 1 of your Pokémon to 1 of your other Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Check if any Pokémon have damage
      let hasDamagedPokemon = false;
      const damagedPokemon: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      effect.preventDefault = true;

      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 1, allowCancel: false, blockedFrom: [], blockedTo: [], singleSourceTarget: true, singleDestinationTarget: true }
      ), transfers => {
        if (transfers === null) {
          player.hand.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);

          if (source && target && source !== target && source.damage > 0) {
            // Move exactly 3 damage counters (or less if source has less than 3)
            const damageToMove = Math.min(3, source.damage);
            source.damage -= damageToMove;
            target.damage += damageToMove;
          }
        }

        player.hand.moveCardTo(effect.trainerCard, player.discard);
        return state;
      });
    }
    return state;
  }

}
