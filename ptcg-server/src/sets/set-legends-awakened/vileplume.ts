import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { getAttachedEnergyTypes, isHandAttachmentBeforeAttack, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public hp: number = 120;
  public cardType: CardType = G;
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Energy Reaction',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you attach a Grass or Psychic Energy card from your hand to Vileplume (excluding effects of attacks or Poké-Powers), you may use this power. If you attach a Grass Energy card, the Defending Pokémon is now Asleep. If you attach a Psychic Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Vileplume is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Disturbing Pollen',
    cost: [P, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, your opponent can\'t play any Trainer, Supporter, or Stadium cards from his or her hand during your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume LA';

  public readonly ENERGY_REACTION_MARKER = 'ENERGY_REACTION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.recipientAtAttachment === this
      && isHandAttachmentBeforeAttack(state, effect)) {
      const types = getAttachedEnergyTypes(store, state, effect);
      const conditions: SpecialCondition[] = [];
      if (types.includes(CardType.GRASS) || types.includes(CardType.ANY)) conditions.push(SpecialCondition.ASLEEP);
      if (types.includes(CardType.PSYCHIC) || types.includes(CardType.ANY)) conditions.push(SpecialCondition.POISONED);

      const { player, target } = effect;
      const canUse = () => target.getPokemonCard() === this && target.specialConditions.length === 0
        && !HAS_MARKER(this.ENERGY_REACTION_MARKER, player, this) && conditions.length > 0;
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        CONFIRMATION_PROMPT(store, state, player, accepted => {
          if (!accepted || !canUse()) return;
          ADD_MARKER(this.ENERGY_REACTION_MARKER, player, this);
          ABILITY_USED(player, this);
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(store, state, player, this.powers[0], this, opponent.active, conditions);
        });
      }, canUse);
    }

    // Disturbing Pollen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, supporter: true, stadium: true, tool: true });
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENERGY_REACTION_MARKER, this);
    return state;
  }
}
