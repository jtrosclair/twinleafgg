import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';

import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { hasUsedPokemonAbility, recordPokemonAbilityUse } from '../../game/store/prefabs/in-play-ability-use';
import { ABILITY_USED, IS_ABILITY_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Meowstic extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Espurr';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Beckoning Tail',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a Chill Teaser Toy card from your hand in order to use this Ability. Once during your turn, you may switch in 1 of your opponent\'s Benched Pokemon to the Active Spot.'
  }];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'SSP';

  public setNumber = '85';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Meowstic';

  public fullName: string = 'Meowstic SSP';

  public readonly BECKONING_TAIL_MARKER = 'BECKONING_TAIL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BECKONING_TAIL_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BECKONING_TAIL_MARKER, this);

    // Ref: set-mega-evolution/hariyama.ts (protection applies to the chosen Benched Pokémon).
    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      if (hasUsedPokemonAbility(player, this.BECKONING_TAIL_MARKER, this, power.name)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const opponent = StateUtils.getOpponent(state, player);
      if (!opponent.bench.some(slot => slot.getPokemonCard())
        || !player.hand.cards.some(card => card.name === 'Chill Teaser Toy')) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand,
        { name: 'Chill Teaser Toy', superType: SuperType.TRAINER },
        { allowCancel: false, min: 1, max: 1 },
      ), ([toy]) => {
        if (!toy || !player.hand.cards.includes(toy)) return;
        state = MOVE_CARDS(store, state, player.hand, player.discard, { cards: [toy], sourceCard: this });
        if (!player.discard.cards.includes(toy)) return;
        recordPokemonAbilityUse(player, this.BECKONING_TAIL_MARKER, this, power.name);
        ABILITY_USED(player, this);
        return GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(store, state, player, power, this);
      });
    }

    return state;
  }
}
