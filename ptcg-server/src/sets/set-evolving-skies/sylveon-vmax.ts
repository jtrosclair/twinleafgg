import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, EnergyCard, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, AttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class SylveonVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Sylveon V';

  public regulationMark = 'E';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks =
    [
      {
        name: 'Precious Touch',
        cost: [CardType.PSYCHIC],
        damage: 0,
        text: 'Attach an Energy card from your hand to 1 of your Benched Pokémon. If you do, heal 120 damage from that Pokémon.'
      },
      {
        name: 'Max Harmony',
        cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        damage: 70,
        damageCalculation: '+',
        text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
      }
    ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Sylveon VMAX';

  public fullName: string = 'Sylveon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      const blocked = player.hand.cards.flatMap((card, index) =>
        card instanceof EnergyCard && (card.discardCostToAttachFromHand ?? 0) >= player.hand.cards.length ? [index] : []);
      if (!player.bench.some(slot => slot.getPokemonCard()) ||
        !player.hand.cards.some((card, index) => card instanceof EnergyCard && !blocked.includes(index))) return state;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1, blocked },
      ), transfers => {
        transfers = transfers || [];

        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (!(transfer.card instanceof EnergyCard)) continue;
          const attachment = new AttachEnergyEffect(player, transfer.card, target);
          // Ref: set-unbroken-bonds/porygon-z.ts (hand Energy costs).
          store.reduceEffect(state, new AttachEnergyFromHandEffect(player, [attachment], false, paidState => {
            store.reduceEffect(paidState, new HealEffect(player, target, 120));
          }));
        }
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const playerBench = player.bench;

      const uniqueTypes = new Set<CardType>();

      playerBench.forEach(c => {
        if (c.getPokemonCard() instanceof PokemonCard) {
          const checkEffect = new CheckPokemonTypeEffect(c);
          store.reduceEffect(state, checkEffect);
          checkEffect.cardTypes.forEach(type => uniqueTypes.add(type));
        }
      });

      // Set the damage based on the count of unique Pokémon types
      effect.damage += 30 * uniqueTypes.size;

      return state;
    }

    return state;
  }
}
