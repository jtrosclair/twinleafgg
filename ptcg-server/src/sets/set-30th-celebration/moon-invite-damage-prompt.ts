import { MoveDamagePrompt, DamageTransfer } from '../../game/store/prompts/move-damage-prompt';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

// Card-local strengthening: the generic prompt validates sides/slots but not
// occupied targets, distinct source/destination, or available source counters.
export class MoonInviteDamagePrompt extends MoveDamagePrompt {
  public validate(result: DamageTransfer[] | null, state: State): boolean {
    if (!super.validate(result, state)) { return false; }
    if (result === null) { return true; }
    const player = state.players.find(p => p.id === this.playerId)!;
    const outgoing = new Map<PokemonCardList, number>();
    for (const transfer of result) {
      const from = StateUtils.getTarget(state, player, transfer.from);
      const to = StateUtils.getTarget(state, player, transfer.to);
      if (from === to || !from.getPokemonCard() || !to.getPokemonCard()) { return false; }
      outgoing.set(from, (outgoing.get(from) || 0) + 10);
    }
    return Array.from(outgoing).every(([from, damage]) => damage <= from.damage);
  }
}
