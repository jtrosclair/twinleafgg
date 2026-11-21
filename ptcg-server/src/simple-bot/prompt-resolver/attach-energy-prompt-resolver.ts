import { AttachEnergyPrompt, CardAssign } from '../../game/store/prompts/attach-energy-prompt';
import { Player, State, Action, ResolvePromptAction, Prompt,
  PokemonCardList, PlayerType, CardList, Card, CardTarget } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { deepClone } from '../../utils/utils';

interface ResultItem {
  value: CardAssign[] | null;
  score: number;
}

export class AttachEnergyPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof AttachEnergyPrompt) {
      const result = this.getPromptResult(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getPromptResult(state: State, prompt: AttachEnergyPrompt): CardAssign[] | null {
    const copy = deepClone(state, [ Card ]);

    const results: ResultItem[] = [];
    const baseScore = this.getStateScore(state, prompt.playerId);

    if (prompt.options.allowCancel) {
      results.push({ value: null, score: baseScore });
    }

    if (prompt.options.min === 0) {
      results.push({ value: [], score: baseScore });
    }

    const cardList = new CardList();
    cardList.cards = prompt.cardList.cards.filter((card, index) => prompt.isEligibleCard(card, index));
    const cards = cardList.cards.slice();
    let value: CardAssign[] = [];

    for (const card of cards) {
      if (value.length >= prompt.options.max) break;
      const result = this.assignToBestTarget(copy, prompt, cardList, card, value);
      if (result === undefined || result.value === null) {
        continue;
      }
      value =  [ ...value, result.value[0] ];
      if (prompt.validate(value)) results.push({ value, score: result.score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.length > 0 ? results[0].value : null;
  }

  private assignToBestTarget(
    state: State, prompt: AttachEnergyPrompt, cardList: CardList, card: Card, assigned: CardAssign[]
  ): ResultItem | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return;
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);

    let results: {target: CardTarget, cardList: PokemonCardList, score: number}[] = [];
    if (hasOpponent) {
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (prompt.slots.includes(target.slot)) {
          results.push({ target, cardList, score: 0 });
        }
      });
    }
    if (hasPlayer) {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (prompt.slots.includes(target.slot)) {
          results.push({ target, cardList, score: 0 });
        }
      });
    }

    results = results.filter(item => prompt.validateAssignments([...assigned, { to: item.target, card }]));

    if (results.length === 0) {
      return;
    }

    // evaluate results
    for (const result of results) {
      cardList.moveCardTo(card, result.cardList);
      result.score = this.getStateScore(state, player.id);
      result.cardList.moveCardTo(card, cardList);
    }

    results.sort((a, b) => b.score - a.score);

    const result = results[0];
    cardList.moveCardTo(card, result.cardList);

    return { value: [{ to: result.target, card }], score: result.score };
  }

}
