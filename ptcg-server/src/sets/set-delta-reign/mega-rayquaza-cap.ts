import { AttachEnergyPrompt, CardTarget, PlayerType, SlotType, State, SuperType, TrainerCard, TrainerType, Attack, CardType, StoreLike, GameError, GameMessage, EnergyType } from "../../game";
import { ColorlessCostReducer } from "../../game/store/card/pokemon-interface";
import { CheckAttackCostEffect, CheckPokemonAttacksEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { ATTACH_ENERGY_TRANSFERS, IS_TOOL_BLOCKED, SHUFFLE_DECK } from "../../game/store/prefabs/prefabs";

export class MegaRayquazaCap extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Rayquaza Cap';
  public fullName: string = 'Mega Rayquaza Cap M6';
    public text: string = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.)';

  public attacks: Attack[] = [{
      name: 'Delta Gift',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'For each of your Pokémon that has a Mega Rayquaza Cap attached, search your deck for a Basic Energy card and attach it to that Pokémon. Then, shuffle your deck.',
    }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paradox-rift/technical-machine-blindside.ts (tool attack grant)
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const pokemonCard = effect.source.getPokemonCard();
      if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
        const reduction = (pokemonCard as ColorlessCostReducer).getColorlessReduction(state);
        for (let i = 0; i < reduction && effect.cost.includes(CardType.COLORLESS); i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (
      effect instanceof CheckPokemonAttacksEffect &&
      effect.player.active.tools.includes(this) &&
      !effect.attacks.includes(this.attacks[0])
    ) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (IS_TOOL_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const blockedTo: CardTarget[] = [];
      let capHolders = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        if (slot.tools.some(tool => tool.name === this.name)) capHolders++;
        else blockedTo.push(target);
      });
      if (capHolders === 0) return state;
      if (player.deck.cards.length === 0) return SHUFFLE_DECK(store, state, player);
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: capHolders, blockedTo, differentTargets: true },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'deck', {
          sourceCard: this,
          onAttached: () => SHUFFLE_DECK(store, state, player),
        });
      });
    }

    return state;
  }
}
