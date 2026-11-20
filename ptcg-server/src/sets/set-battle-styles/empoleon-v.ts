import { PokemonCard, pokemonHasRuleBox } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType, GameError, PowerType, Player, PokemonCardList } from '../../game';
import { Power } from '../../game/store/card/pokemon-types';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';

const checkingSuppression = new WeakSet<PokemonCardList>();

function isSubjectToEmperorsEyes(power: Power): boolean {
  return power.powerType === PowerType.ABILITY
    && !power.exemptFromAbilityLock && !power.useFromDiscard && !power.useFromHand;
}

export class EmpoleonV extends PokemonCard {

  public tags = [CardTag.POKEMON_V, CardTag.RAPID_STRIKE];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 210;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Emperor\'s Eyes',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Basic Pokémon in play have no Abilities, except for Pokémon with a Rule Box(Pokémon V, Pokémon- GX, etc.have Rule Boxes).'
  }];

  public attacks = [
    {
      name: 'Swirling Slice',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 130,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    },
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Empoleon V';

  public fullName: string = 'Empoleon V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    // Ref: upstream 3348ebdc8 (apply the Ability lock to each eligible Pokémon).
    if (effect instanceof CheckPokemonPowersEffect && effect.powers.some(isSubjectToEmperorsEyes)
      && this.suppresses(store, state, effect.player, effect.target)) {
      effect.powers = effect.powers.filter(power => !isSubjectToEmperorsEyes(power));
    }

    if (effect instanceof PowerEffect && isSubjectToEmperorsEyes(effect.power)
      && this.suppresses(store, state, effect.player, effect.card)) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }
    return state;
  }

  private suppresses(store: StoreLike, state: State, recipient: Player, pokemon: PokemonCard): boolean {
    const owner = StateUtils.getOpponent(state, recipient);
    if (owner.active.getPokemonCard() !== this || pokemon.stage !== Stage.BASIC || pokemonHasRuleBox(pokemon)) {
      return false;
    }

    const target = recipient.getPokemonInPlay().find(slot => slot.getPokemonCard() === pokemon);
    if (!target || checkingSuppression.has(target)) {
      return false;
    }

    // Protection Abilities can query their own availability during the target probe.
    checkingSuppression.add(target);
    try {
      const power = this.powers[0];
      const source = new PowerEffect(owner, power, this, owner.active);
      store.reduceEffect(state, source);
      return !source.preventDefault && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, power, this, target);
    } catch (error) {
      if (error instanceof GameError) {
        return false;
      }
      throw error;
    } finally {
      checkingSuppression.delete(target);
    }
  }
}

