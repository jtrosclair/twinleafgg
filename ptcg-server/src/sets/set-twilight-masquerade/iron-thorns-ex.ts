import { PokemonCard, pokemonHasRuleBox } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ActiveAbilityLock, applyActiveAbilityLock } from '../../game/store/prefabs/active-ability-lock';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronThornsex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Initialization',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'As long as this Pokémon is in the Active Spot, Pokémon with a Rule Box in play ' +
      '(both yours and your opponent\'s) have no Abilities, except for Future Pokémon. ' +
      '(Pokémon ex, Pokémon V, etc. have Rule Boxes.) '
  }];

  public attacks = [
    {
      name: 'Volt Cyclone',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Iron Thorns ex';

  public fullName: string = 'Iron Thorns ex TWM';

  public activeAbilityLock(): ActiveAbilityLock {
    return {
      power: this.powers[0],
      checkTargetProtection: true,
      affects: (_store, _state, _owner, { card, slot, enteringBench }) =>
        (!!slot || !!enteringBench) && pokemonHasRuleBox(card) && !card.tags.includes(CardTag.FUTURE),
    };
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    applyActiveAbilityLock(store, state, effect, this);

    // Ref: set-journey-together/volcanion-ex.ts (move Energy after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, source } = effect;
      afterAttackDamage(state, effect, (store, state) => {
        if (!source.cards.some(card => card.superType === SuperType.ENERGY)
          || !player.bench.some(slot => slot.getPokemonCard())) return state;

        return store.prompt(state, new AttachEnergyPrompt(
          player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, source, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH],
          { superType: SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 },
        ), transfers => {
          for (const transfer of transfers ?? []) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this, sourceEffect: effect });
          }
        });
      });
    }

    return state;
  }
}
