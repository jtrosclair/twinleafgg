import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { getAttachedEnergyOfType, registerKnockOutEnergyTransfer } from '../../game/store/prefabs/knock-out-effects';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chinchou';
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 110;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Energy Grounding',
      powerType: PowerType.ABILITY,
      text: 'When 1 of your Pokémon is Knocked Out by damage from an opponent\'s attack, you may move a basic Energy card from that Pokémon to this Pokémon.'
    }
  ];

  public attacks = [
    {
      name: 'Lightning Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 70,
      damageCalculation: '+',
      text: 'You may discard all [L] Energy from this Pokémon. If you do, this attack does 70 more damage.'
    }
  ];

  public set: string = 'CES';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn CES';

  public readonly ENERGY_GROUNDING_MARKER = 'ENERGY_GROUNDING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-scarlet-and-violet/exp-share.ts (transfer Basic Energy before discard).
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard) {
      const { player, target } = effect;
      const recipient = [player.active, ...player.bench].find(slot => slot.getPokemonCard() === this);
      if (recipient && recipient !== target && !IS_ABILITY_BLOCKED(store, state, player, this)) {
        registerKnockOutEnergyTransfer(store, state, effect, this, { max: 1, recipient });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player } = effect;
      const source = effect.source;
      const lightning = getAttachedEnergyOfType(store, state, player, source, CardType.LIGHTNING);
      if (lightning.length > 0) {
        CONFIRMATION_PROMPT(store, state, player, confirmed => {
          if (!confirmed) return;
          MOVE_CARDS(store, state, source, player.discard, { cards: lightning, sourceCard: this, sourceEffect: effect });
          if (lightning.every(card => !source.cards.includes(card) && !source.energies.cards.includes(card))) {
            effect.damage += 70;
          }
        }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
      }
    }

    return state;
  }
}
