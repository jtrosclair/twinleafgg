import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

class EnergyAnticsProtectionCheck extends EffectOfAttackEffect {
  readonly type = 'ENERGY_ANTICS_PROTECTION_CHECK';
  constructor(attack: AttackEffect, target: PokemonCardList) {
    super(attack);
    this.target = target;
    const attacker = attack.source.getPokemonCard();
    if (attacker) this.markerSource = attacker;
  }
  applyEffect(): void {}
}

function preventsEnergyAntics(store: StoreLike, state: State, attack: AttackEffect, target: PokemonCardList): boolean {
  const check = new EnergyAnticsProtectionCheck(attack, target);
  store.reduceEffect(state, check);
  return check.preventDefault;
}

export class Smoochum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType = P;
  public weakness = [];
  public retreat = [];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Smoochum is Asleep, prevent all damage done to Smoochum by attacks.'
  }];

  public attacks = [{
    name: 'Energy Antics',
    cost: [],
    damage: 0,
    text: 'Move an Energy card attached to 1 of your opponent\'s Pokémon to another of your opponent\'s Pokémon. Smoochum is now Asleep.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Smoochum';
  public fullName: string = 'Smoochum HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sweet Sleeping Face
    if (effect instanceof PutDamageEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && effect.target.specialConditions.includes(SpecialCondition.ASLEEP)) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        effect.preventDefault = true;
      }
    }

    // Energy Antics
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (currentStore, currentState) => {
        const { player, opponent } = effect;
        let pokemonCount = 0;
        let eligibleSources = 0;
        const blockedFrom: CardTarget[] = [];
        const blockedTo = opponent.bench.flatMap((slot, index) => slot.getPokemonCard() ? []
          : [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index }]);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, _card, target) => {
          pokemonCount++;
          const hasEnergy = MoveEnergyPrompt.sourceCards(slot).some(card => MoveEnergyPrompt.isAttachedEnergy(slot, card));
          if (hasEnergy && !preventsEnergyAntics(currentStore, currentState, effect, slot)) {
            eligibleSources++;
          } else {
            blockedFrom.push(target);
          }
        });
        if (pokemonCount < 2 || eligibleSources === 0) return currentState;

        return currentStore.prompt(currentState, new MoveEnergyPrompt(
          player.id, GameMessage.MOVE_ENERGY_CARDS, PlayerType.TOP_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], {},
          { allowCancel: false, min: 1, max: 1, blockedFrom, blockedTo, validateTransfers: true }
        ), transfers => {
          if (transfers?.length !== 1) return;
          const [{ from, to, card }] = transfers;
          const source = StateUtils.getTarget(currentState, player, from);
          const target = StateUtils.getTarget(currentState, player, to);
          if (preventsEnergyAntics(currentStore, currentState, effect, source)) return;

          // A protected destination refuses the Energy once it has left its source.
          const destination = preventsEnergyAntics(currentStore, currentState, effect, target) ? opponent.discard : target;
          MOVE_CARDS(currentStore, currentState, source, destination,
            { cards: [card], sourceCard: effect.source.getPokemonCard(), sourceEffect: effect });
        });
      });
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, effect);
    }

    return state;
  }
}
