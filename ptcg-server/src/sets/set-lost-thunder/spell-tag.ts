import { DamageMap, PutDamagePrompt } from '../../game';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';

import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class SpellTag extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'LOT';

  public name: string = 'Spell Tag';

  public fullName: string = 'Spell Tag LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '190';

  public text: string =
    'When the [P] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put 4 damage counters on your opponent\'s Pokémon in any way you like.';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-obsidian-flames/vengeful-punch.ts (Tool counters after lethal attack damage).
    if (!WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) || !effect.resolveBeforeDiscard
      || !effect.target.tools.includes(this) || effect.beforeDiscard.has(this)
      || IS_TOOL_BLOCKED(store, state, effect.player, this)) return state;

    const type = new CheckPokemonTypeEffect(effect.target);
    store.reduceEffect(state, type);
    if (!type.cardTypes.includes(CardType.PSYCHIC)) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    effect.beforeDiscard.set(this, {
      label: this.name,
      canResolve: () => opponent.getPokemonInPlay().length > 0,
      resolve: () => {
        const maxAllowedDamage: DamageMap[] = [];
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_slot, _card, target) => {
          maxAllowedDamage.push({ target, damage: 40 });
        });
        store.prompt(state, new PutDamagePrompt(
          player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH], 40, maxAllowedDamage, { allowCancel: false }
        ), placements => {
          for (const { target, damage } of placements ?? []) {
            store.reduceEffect(state, new PlaceDamageCountersEffect(player, StateUtils.getTarget(state, player, target), damage));
          }
        });
      }
    });
    return state;
  }
}
