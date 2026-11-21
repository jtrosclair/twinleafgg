import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { PowerType, GameMessage, PlayerType, SlotType, AttachEnergyPrompt, StateUtils, State, StoreLike, GameError, CardTarget } from '../../game';

import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { hasUsedPokemonAbility } from '../../game/store/prefabs/in-play-ability-use';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ATTACH_ENERGY_TRANSFERS, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Toxtricity extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toxel';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sinister Surge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a Basic [D] Energy card and attach it to 1 of your Benched [D] Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Thwap',
    cost: [D, D, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Toxtricity';
  public fullName: string = 'Toxtricity M2';

  public readonly BAD_BOOST_MARKER = 'BAD_BOOST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BAD_BOOST_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BAD_BOOST_MARKER, this);

    // Ref: set-stellar-crown/lapras-ex.ts (resolve the deck attachment before its follow-up).
    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      const blockedTo: CardTarget[] = [];
      let hasRecipient = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        if (target.slot !== SlotType.BENCH) return;
        const type = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.DARK)) hasRecipient = true;
        else blockedTo.push(target);
      });
      if (!hasRecipient || player.deck.cards.length === 0) throw new GameError(GameMessage.CANNOT_USE_POWER);

      if (hasUsedPokemonAbility(player, this.BAD_BOOST_MARKER, this, power.name)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
        { allowCancel: true, min: 0, max: 1, blockedTo },
      ), transfers => {
        USE_ABILITY_ONCE_PER_TURN(player, this.BAD_BOOST_MARKER, this, power.name);
        ABILITY_USED(player, this);
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'deck', {
          sourceCard: this,
          onAttached: ([attachment]) => {
            store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
              if (!attachment) return;
              const target = StateUtils.getTarget(state, player, attachment.to);
              if (target.cards.includes(attachment.card)) {
                return store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 20, this, power));
              }
            });
          },
        });
      });
    }

    return state;
  }

  /** Its printed attack has no additional effects; its Ability is not copied. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, _effect: Effect, _attackIndex: number): State {
    return state;
  }

}
