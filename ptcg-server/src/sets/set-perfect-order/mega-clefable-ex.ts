import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, StateUtils, SuperType, ChooseCardsPrompt, GameMessage } from '../../game';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaClefableex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clefairy';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_SV_MEGA];
  public cardType: CardType = P;
  public hp: number = 320;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Wings of Light',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s Abilities done to this Pokemon.'
  }];

  public attacks = [{
    name: 'Shooting Moon',
    cost: [P, P],
    damage: 120,
    text: 'You may discard up to 4 Energy cards from you hand. If you do, this attack does 40 more damage for each card discarded in this way.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public usSetNumber = 'POR 31';
  public name: string = 'Mega Clefable ex';
  public fullName: string = 'Mega Clefable ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-pitch-black/ghost-veil.ts (prevent effects of opposing Abilities).
    if (effect instanceof EffectOfAbilityEffect && effect.target?.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player !== owner && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.target = undefined;
      }
    }
    if (effect instanceof AddSpecialConditionsPowerEffect && effect.target.getPokemonCard() === this
      && effect.source instanceof PokemonCard) {
      const owner = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, owner);
      if (StateUtils.isPokemonInPlay(opponent, effect.source)
        && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.preventDefault = true;
      }
    }

    // Shooting Moon - discard energy from hand for damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energiesInHand = player.hand.cards.filter(card =>
        card.superType === SuperType.ENERGY
      );

      if (energiesInHand.length === 0) {
        return state;
      }

      const maxToDiscard = Math.min(4, energiesInHand.length);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: maxToDiscard }
      ), selected => {
        if (!selected?.length) return;
        state = MOVE_CARDS(store, state, player.hand, player.discard, {
          cards: selected, sourceCard: effect.source.getPokemonCard() ?? this, sourceEffect: effect,
        });
        const discarded = selected.filter(card => player.discard.cards.includes(card) || player.lostzone.cards.includes(card));
        effect.damage += discarded.length * 40;
      });
    }

    return state;
  }
}
