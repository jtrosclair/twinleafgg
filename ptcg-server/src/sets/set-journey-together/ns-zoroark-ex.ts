import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError, ChooseCardsPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../game/store/prefabs/copy-attack-prefabs';
import { ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class NsZoroarkex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.NS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'N\'s Zorua';
  public cardType: CardType = D;
  public hp: number = 280;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Trade',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a card from your hand in order to use this Ability. Once during your turn, you may draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Night Joker',
      cost: [D, D],
      copycatAttack: true,
      damage: 0,
      text: 'Choose 1 of your Benched N\'s Pokémon\'s attacks and use it as this attack.'
    }
  ];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '98';
  public name: string = 'N\'s Zoroark ex';
  public fullName: string = 'N\'s Zoroark ex JTG';

  public readonly TRADE_MARKER = 'TRADE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TRADE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TRADE_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.TRADE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        ABILITY_USED(player, this);
        player.marker.addMarker(this.TRADE_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const candidates = effect.player.bench.flatMap(slot => {
        const pokemon = slot.getPokemonCard();
        return pokemon?.tags.includes(CardTag.NS) && pokemon.name !== this.name ? [pokemon] : [];
      });
      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, candidates, {
        allowCancel: false, disallowCopycatAttack: true, preserveInPlaySource: true,
      });
    }

    return state;
  }
}