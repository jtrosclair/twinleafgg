import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, CardList, ChooseAttackPrompt, Attack, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { runDelegatedCopiedAttackGenerator } from '../../game/store/prefabs/copy-attack-delegation';
import { findPokemonCardForAttack } from '../../game/store/prefabs/copy-attack-prefabs';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useHaughtyOrders(next: () => void, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const { player, opponent, source } = effect;
  const attacker = source.getPokemonCard();
  if (!attacker) return state;

  while (opponent.deck.cards.length > 0) {
    const revealed = opponent.deck.cards.slice(0, 10);
    yield store.prompt(state, [
      new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, revealed, { allowCancel: false }),
      new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_EFFECT, revealed, { allowCancel: false }),
    ], () => next());

    const candidates = revealed.filter((card): card is PokemonCard => card instanceof PokemonCard && card.attacks.length > 0);
    let selected: Attack | null = null;
    if (candidates.length > 0) {
      yield store.prompt(state, new ChooseAttackPrompt(
        player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, candidates, { allowCancel: true },
      ), result => {
        selected = result;
        next();
      });
    }

    const attack = selected as Attack | null;
    const printedSource = attack && findPokemonCardForAttack(candidates, attack);
    const repeat = printedSource instanceof TeamRocketsPersianex && attack === printedSource.attacks[0];
    if (attack && printedSource && !repeat) {
      const setAside = new CardList();
      opponent.deck.moveCardsTo(revealed, setAside);
      try {
        state = yield* runDelegatedCopiedAttackGenerator(next, {
          store, state, player, opponent, copycatCard: attacker, sourceCard: printedSource,
          selectedAttack: attack, sourceSlot: source, retainDeclaredAttack: true,
        });
      } finally {
        setAside.moveTo(opponent.deck);
      }
    }

    state = SHUFFLE_DECK(store, state, opponent);
    if (store.hasPrompts()) yield store.waitPrompt(state, next);
    // The official Haughty Orders ruling permits choosing itself after shuffling.
    if (!repeat) return state;
  }
  return state;
}

export class TeamRocketsPersianex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Meowth';
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Haughty Orders',
      cost: [C, C],
      damage: 0,
      text: 'Your opponent reveals the top 10 cards of their deck. You may choose an attack from a Pokemon you find there and use it as this attack. Your opponent shuffles the revealed cards back into their deck.'
    },
    {
      name: 'Slash and Cash',
      cost: [C, C, C],
      damage: 140,
      text: 'Your opponent\'s Active Pokemon is now Confused.'
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Team Rocket\'s Persian ex';
  public fullName: string = 'Team Rocket\'s Persian ex DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Haughty Orders
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useHaughtyOrders(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Slash and Cash (thanks Pf987 for this name)
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    return state;
  }
}
