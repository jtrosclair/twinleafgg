import { PlayerType } from '../../game/store/actions/play-card-action';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { wasActiveWhenDamaged } from '../../game/store/prefabs/knock-out-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class DusknoirLvX extends PokemonCard {
  public stage = Stage.LV_X;
  public tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom = 'Dusknoir';
  public cardType = CardType.PSYCHIC;
  public hp = 140;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Ectoplasm',
    powerType: PowerType.POKEPOWER,
    text: 'When your Active Dusknoir LV.X is Knocked Out by damage from an opponent’s attack, you may put this card into play as the Stadium and discard the rest of the stack. Your opponent takes a Prize as usual. During Pokémon Checkup, put 1 damage counter on each of your opponent’s Pokémon. Return this card to your hand if it is discarded as a Stadium.',
  }];

  public set = 'SF';
  public cardImage = 'assets/cardback.png';
  public setNumber = '96';
  public name = 'Dusknoir';
  public fullName = 'DusknLv.X SF';

  public get returnsToHandWhenDiscardedAsStadium(): boolean { return true; }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: prefabs/knock-out-effects.ts (resolve optional Knock Out effects before the stack leaves play)
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && effect.target.getPokemonCard() === this && wasActiveWhenDamaged(effect)) {
      const { player, target } = effect;
      effect.beforeDiscard.set(this, {
        label: this.powers[0].name,
        canResolve: () => target.getPokemonCard() === this && !IS_POKEPOWER_BLOCKED(store, state, player, this),
        resolve: () => {
          CONFIRMATION_PROMPT(store, state, player, yes => {
            if (yes) effect.stadiumReplacement = this;
          });
        },
      });
    }

    if ((effect instanceof BetweenTurnsEffect || effect instanceof UseStadiumEffect)
      && StateUtils.getStadiumCard(state) === this) {
      if (effect instanceof UseStadiumEffect) throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      const owner = effect.player;
      if (!owner.stadium.cards.includes(this)) return state;
      const opponent = StateUtils.getOpponent(state, owner);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, target => {
        if (!IS_STADIUM_EFFECT_BLOCKED(store, state, owner, target, this)) {
          // The installed Stadium, rather than the original Poké-Power, places these counters.
          store.reduceEffect(state, new PlaceDamageCountersEffect(owner, target, 10, this));
        }
      });
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard() === this) {
      const previousLevel = StateUtils.getPreviousLevel(effect.player.active);
      if (previousLevel) effect.attacks.push(...previousLevel.attacks);
    }
    if (effect instanceof CheckPokemonPowersEffect && effect.target === this) {
      const slot = effect.player.getPokemonInPlay().find(list => list.getPokemonCard() === this);
      const previousLevel = slot && StateUtils.getPreviousLevel(slot);
      if (previousLevel) effect.powers = [...effect.powers, ...previousLevel.powers];
    }
    return state;
  }
}

export class DusknoirLVXExactPrint extends DusknoirLvX {
  public fullName = 'Dusknoir LV.X SF';
}
