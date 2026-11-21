import { State, Player, Prompt, Action, ChoosePrizePrompt, ResolvePromptAction } from '../../game';
import { PromptResolver } from './prompt-resolver';

export class ChoosePrizePromptResolver extends PromptResolver {

  public resolvePrompt(state: State, _player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChoosePrizePrompt) {
      const result = prompt.availablePrizes(state).filter((_, index) => !prompt.options.blocked.includes(index))
        .slice(0, prompt.options.count);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

}