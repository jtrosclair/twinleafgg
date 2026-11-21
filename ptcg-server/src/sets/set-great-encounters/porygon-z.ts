import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { setPokemonTypeForTurn } from '../../game/store/prefabs/temporary-pokemon-type';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class PorygonZ extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Porygon2';
  public hp: number = 110;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Conversion',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may discard a basic Energy card from your hand. Porygon-Z is the same type as that Energy Card until the end of your turn. This power can\'t be used if Porygon-Z is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Tri Attack',
    cost: [C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Porygon-Z';
  public fullName: string = 'Porygon-Z GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Conversion
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      const slot = StateUtils.findPokemonSlot(state, this);
      if (slot?.getPokemonCard() !== this) throw new GameError(GameMessage.CANNOT_USE_POWER);
      const hasBasic = player.hand.cards.some(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC
      );
      if (!hasBasic) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        const energy = cards[0] as EnergyCard;
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        if (player.discard.cards.includes(energy) && energy.provides[0] !== undefined && slot.getPokemonCard() === this) {
          setPokemonTypeForTurn(state, slot, energy.provides[0], false);
        }
      });
    }

    // Tri Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        effect.damage = 40 * heads;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
