import { AttachEnergyPrompt, CardTag, CardType, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

const shadowyConcealmentApplied = new WeakSet<KnockOutEffect>();

export class MegaGengarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 350;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Shadowy Concealment',
    powerType: PowerType.ABILITY,
    text: 'If 1 of your [D] Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon ex, that player takes 1 fewer Prize card. The effect of Shadowy Concealment doesn\'t stack.'
  }];

  public attacks = [{
    name: 'Void Gale',
    cost: [D, D],
    damage: 230,
    text: 'Move an Energy from this Pokemon to 1 of your Benched Pokemon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Gengar ex';
  public fullName: string = 'Mega Gengar ex MBG';

  private readonly VOID_GALE_MARKER = 'VOID_GALE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect)) {
      if (shadowyConcealmentApplied.has(effect)
        || !effect.target.attackDamageKnockOut?.sourceCard?.tags.includes(CardTag.POKEMON_ex)) {
        return state;
      }
      const player = effect.player;

      const inPlay = effect.pokemonInPlayBeforeKnockOut
        ? effect.pokemonInPlayBeforeKnockOut.includes(this)
        : [player.active, ...player.bench].some(slot => slot.getPokemonCard() === this);
      if (!inPlay || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Target must be a Darkness Pokémon
      const checkType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.DARK)) {
        return state;
      }

      shadowyConcealmentApplied.add(effect);
      effect.prizeCount -= 1;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.VOID_GALE_MARKER, effect.player, this);
      return state;
    }

    if (effect instanceof AfterAttackEffect && HAS_MARKER(this.VOID_GALE_MARKER, effect.player, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      // Then prompt for energy movement
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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.VOID_GALE_MARKER, this);

    return state;
  }
}
