import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TingLuex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 240;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cursed Land',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Pokémon in play that have any damage counters on them have no Abilities, except for Pokémon ex.'
  }];

  public attacks = [{
    name: 'Land Scoop',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
    damage: 150,
    text: 'Put 2 damage counters on 1 of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name: string = 'Ting-Lu ex';

  public fullName: string = 'Ting-Lu ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect
      || (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY
        && effect.power.name !== this.powers[0].name)) {
      const owner = state.players.find(player => player.active.getPokemonCard() === this);
      if (!owner) return state;

      const pokemon = effect instanceof PowerEffect ? effect.card : effect.target;
      if (pokemon.tags.includes(CardTag.POKEMON_ex)) return state;
      const opponent = StateUtils.getOpponent(state, owner);
      const target = opponent.getPokemonInPlay().find(slot => slot.getPokemonCard() === pokemon);
      if (!target || target.damage === 0) return state;

      try {
        store.reduceEffect(state, new PowerEffect(owner, this.powers[0], this, owner.active));
      } catch (error) {
        if (!(error instanceof GameError)) throw error;
        return state;
      }

      const land = new EffectOfAbilityEffect(owner, this.powers[0], this, target);
      store.reduceEffect(state, land);
      if (land.preventDefault || !land.target) return state;

      if (effect instanceof CheckPokemonPowersEffect) {
        effect.powers = effect.powers.filter(power => power.powerType !== PowerType.ABILITY || power.exemptFromAbilityLock);
      } else if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }
    return state;
  }
}