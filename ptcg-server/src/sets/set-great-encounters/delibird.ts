import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class Delibird extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp = 70;
  public weakness = [{ type: M, value: 20 }];
  public retreat = [C];
  public attacks = [{
    name: "Present", cost: [], damage: 0,
    text: "Flip a coin. If heads, search your deck for any 1 card and put it into your hand. Shuffle your deck afterward."
  }, {
    name: "Ice Ball", cost: [W], damage: 20,
    text: ""
  } ];
  public set = "GE";
  public setNumber = "36";
  public cardImage = 'assets/cardback.png';
  public name = "Delibird";
  public fullName = "Delibird GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (post-damage coin callback),
    // set-secret-wonders/stantler.ts (search completion and shuffle).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attacker = effect.source.getPokemonCard() || this;
      afterAttackDamage(state, effect, (postStore, next) =>
      COIN_FLIP_PROMPT(postStore, next, effect.player, heads => {
        const player = effect.player;
        if (!heads || player.deck.cards.length === 0) return;
        postStore.prompt(next, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {},
          { min: 1, max: 1, allowCancel: false }), selected => {
          if (!selected || selected.length !== 1 || !player.deck.cards.includes(selected[0])) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          MOVE_CARDS(postStore, next, player.deck, player.hand, { cards: selected, sourceCard: attacker, sourceEffect: effect });
          SHUFFLE_DECK(postStore, next, player);
        });
      }));
    }
    return state;
  }
}
