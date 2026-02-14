import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, PowerType, GameError, ChooseCardsPrompt, ShuffleDeckPrompt, ChoosePokemonPrompt, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PersianGX extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Meowth';
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 200;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cat Walk',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if 1 of your Pokémon-GX or Pokémon-EX was Knocked Out during your opponent\'s last turn, you may search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck. You can\'t use more than 1 Cat Walk Ability each turn.'
  }];

  public attacks = [
    {
      name: 'Vengeance',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Pokémon in your discard pile. You can\'t add more than 180 damage in this way.'
    },
    {
      name: 'Slash Back-GX',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name = 'Persian-GX';
  public fullName = 'Persian-GX UNB';

  public readonly CAT_WALK_MARKER = 'CAT_WALK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Remove Cat Walk marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CAT_WALK_MARKER)) {
      effect.player.marker.removeMarker(this.CAT_WALK_MARKER, this);
    }

    // Cat Walk ability
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.CAT_WALK_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if a GX or EX was knocked out during opponent's last turn
      // This requires checking the game state for knocked out Pokemon from the previous turn
      // For now, we'll implement the basic search functionality
      // TODO: Add check for knocked out GX/EX during opponent's last turn

      player.marker.addMarker(this.CAT_WALK_MARKER, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 2, allowCancel: false }
      ), cards => {
        cards = cards || [];
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    // Vengeance attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard) {
          pokemonCount += 1;
        }
      });

      const additionalDamage = Math.min(pokemonCount * 20, 180);
      effect.damage += additionalDamage;
    }

    // Slash Back-GX attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          const target = targets[0] as PokemonCardList;
          player.switchPokemon(target);
        }
      });
    }

    return state;
  }
}
