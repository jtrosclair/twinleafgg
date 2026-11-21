import { benchPokemonFromZone } from '../../game/store/prefabs/bench-play-reactions';
import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State,
  GameMessage, ChooseCardsPrompt, SuperType, ShuffleDeckPrompt, GameLog, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterPlayBasicFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueBenchPlayAbility } from '../../game/store/prefabs/bench-play-reactions';

export class RadiantEternatus extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public stage = Stage.BASIC;

  public cardType = CardType.DRAGON;

  public hp = 170;

  public weakness = [];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Climactic Gate',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may search your deck for up to 2 Pokémon VMAX and put them onto your Bench. Then, shuffle your deck. If you use this Ability, your turn ends.'
  }];

  public attacks = [{
    name: 'Power Beam',
    cost: [CardType.FIRE, CardType.DARK, CardType.COLORLESS],
    damage: 200,
    text: '',
  }];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name: string = 'Radiant Eternatus';

  public fullName: string = 'Radiant Eternatus CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterPlayBasicFromHandEffect && effect.pokemonCard === this) {
      const { player } = effect;
      const eligible = () => player.deck.cards.length > 0 && player.bench.some(slot => slot.cards.length === 0);
      queueBenchPlayAbility(store, state, effect, () => {
        store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
          if (!wantToUse) return;
          const slots = player.bench.filter(slot => slot.cards.length === 0);
          const blocked = player.deck.cards.flatMap((card, index) => card.tags.includes(CardTag.POKEMON_VMAX) ? [] : [index]);
          store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: this.powers[0].name });
          store.prompt(state, new ChooseCardsPrompt(
            player, GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck,
            { superType: SuperType.POKEMON },
            { min: 0, max: Math.min(2, slots.length), allowCancel: false, blocked },
          ), selected => {
            benchPokemonFromZone(store, state, player, player.deck, (selected || []), slots);
            effect.endTurn = true;
            store.prompt(state, new ShuffleDeckPrompt(player.id), order => player.deck.applyOrder(order));
          });
        });
      }, eligible);
    }
    return state;
  }
}