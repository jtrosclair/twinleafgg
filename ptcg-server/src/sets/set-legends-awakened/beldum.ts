import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { attachedEnergyProvides, isHandAttachmentBeforeAttack, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { ABILITY_USED, ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = M;
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Metal Chain',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you attach a Metal Energy card from your hand to Beldum (excluding effects of attacks or Poké-Powers), you may search your deck for Beldum and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Beldum is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Take Down',
    cost: [M, C],
    damage: 30,
    text: 'Beldum does 10 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Chain
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.recipientAtAttachment === this
      && isHandAttachmentBeforeAttack(state, effect) && attachedEnergyProvides(store, state, effect, CardType.METAL)) {
      const { player, target } = effect;
      const canUse = () => target.getPokemonCard() === this && target.specialConditions.length === 0
        && !HAS_MARKER(this.ABILITY_USED_MARKER, player, this) && player.deck.cards.length > 0
        && player.bench.some(slot => slot.cards.length === 0);
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        CONFIRMATION_PROMPT(store, state, player, accepted => {
          if (!accepted || !canUse()) return;
          ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
          ABILITY_USED(player, this);
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player,
            { name: 'Beldum', stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
        });
      }, canUse);
    }

    // Take Down
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
