import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, AttachEnergyPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { getAttackPayment } from '../../game/store/prefabs/attack-after-damage';
import { canPayAttackCostWithExtraEnergy } from '../../game/store/prefabs/attack-energy';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useUltimateRay(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 3 }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.deck.moveCardTo(transfer.card, target);
      next();
    }
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);

  });
}

export class ArceusDialgaPalkiaGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 280;
  public weakness = [{ type: Y }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ultimate Ray',
    cost: [W, M, C],
    damage: 150,
    text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
  },
  {
    name: 'Altered Creation-GX',
    cost: [M],
    damage: 0,
    text: 'For the rest of this game, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). If this Pokémon has at least 1 extra [W] Energy attached to it (in addition to this attack\'s cost), when your opponent\'s Active Pokémon is Knocked Out by damage from those attacks, take 1 more Prize card. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CEC';
  public name = 'Arceus & Dialga & Palkia-GX';
  public fullName = 'Arceus & Dialga & Palkia GX CEC';
  public setNumber: string = '156';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useUltimateRay(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if player has used altered creation
      BLOCK_IF_GX_ATTACK_USED(player);

      player.usedGX = true;
      player.alteredCreationDamage = true;

      const payment = getAttackPayment(state, player);
      const checkEnergy = new CheckProvidedEnergyEffect(player, payment?.source ?? effect.source);
      state = store.reduceEffect(state, checkEnergy);
      player.usedAlteredCreation = canPayAttackCostWithExtraEnergy(
        checkEnergy.energyMap, payment?.cost ?? effect.attack.cost, CardType.WATER
      );
    }

    return state;
  }
}
