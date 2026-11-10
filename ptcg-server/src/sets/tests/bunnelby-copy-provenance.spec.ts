import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Bunnelby } from '../set-primal-clash/bunnelby';
import { Parasect } from '../set-neo-revelation/parasect';
import { PokemonTower } from '../set-wotc-promos/pokemon-tower';
class Basic extends PokemonCard { public name = 'Fixture'; public fullName = 'Fixture TST'; public set = 'TST'; public hp = 300; public stage = Stage.BASIC; }
class PsychicEnergy extends EnergyCard { public name = 'Psychic'; public fullName = 'Psychic TST'; public set = 'TST'; public provides = [CardType.PSYCHIC]; }
function setup(copied: boolean, parasect: boolean, tower = false) {
  clearCopyAttackSessionsForTests();
  const state = new State(), player = new Player(), opponent = new Player(), source = new Bunnelby(), mew = new Mewex();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2; state.phase = GamePhase.ATTACK;
  player.active.cards = copied ? [mew, new PsychicEnergy()] : [source];
  if (copied) { const slot = new PokemonCardList(); slot.cards = [source]; player.bench = [slot]; }
  opponent.active.cards = [new Basic()];
  if (parasect) { const slot = new PokemonCardList(); slot.cards = [new Parasect()]; opponent.bench.push(slot); }
  if (tower) opponent.stadium.cards = [new PokemonTower()];
  const discarded = new PsychicEnergy(); discarded.id = 1; player.discard.cards = [discarded]; player.deck.cards = [new Basic()];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const moves: MoveCardsEffect[] = [], reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((s: State, e: any) => { if (e instanceof MoveCardsEffect) moves.push(e); return reduce(s, e); });
  if (copied) {
    store.reduceEffect(state, new PowerEffect(player, mew.powers[0], mew));
    let prompt = state.prompts.filter(p => p.result === undefined).pop()!;
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, source.attacks[1]));
    prompt = state.prompts.filter(p => p.result === undefined).pop()!;
    if (!(prompt instanceof ChooseCardsPrompt)) {
      state.phase = GamePhase.FINISHED; (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, null));
      state.activePlayer = 0; state.phase = GamePhase.ATTACK;
    }
  } else store.reduceEffect(state, new AttackEffect(player, opponent, source.attacks[1]));
  const search = state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  if (!search) throw new Error('Missing Rototiller search');
  (store as any).reducePrompt(state, new ResolvePromptAction(search.id, [discarded]));
  return { state, player, opponent, source, mew, store, discarded, moves };
}
describe('Bunnelby Rototiller provenance', () => {
  it('moves a chosen card from discard into the deck directly', () => {
    const x = setup(false, false); expect(x.player.discard.cards).not.toContain(x.discarded); expect(x.player.deck.cards).toContain(x.discarded);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt && p.result === undefined)).toBe(true);
  });
  it('is blocked by Parasect as a direct attack', () => {
    const x = setup(false, true); expect(x.player.discard.cards).toContain(x.discarded); expect(x.player.deck.cards).not.toContain(x.discarded);
  });
  it('moves a chosen card when Mew copies it without Parasect', () => {
    const x = setup(true, false); expect(x.player.discard.cards).not.toContain(x.discarded); expect(x.player.deck.cards).toContain(x.discarded);
    const move = x.moves.find(m => m.source === x.player.discard && m.destination === x.player.deck)!;
    expect(move.sourceCard).toBe(x.mew); expect(move.sourceEffect instanceof AttackEffect).toBe(true);
    expect(move.sourceEffect.attack.name).toBe('Rototiller');
  });
  it('is blocked by Parasect when Mew copies the second attack', () => {
    const x = setup(true, true); expect(x.player.discard.cards).toContain(x.discarded); expect(x.player.deck.cards).not.toContain(x.discarded);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt && p.result === undefined)).toBe(true);
  });
  it('is not blocked by Pokémon Tower because the destination is the deck', () => {
    const x = setup(true, false, true); expect(x.player.discard.cards).not.toContain(x.discarded); expect(x.player.deck.cards).toContain(x.discarded);
  });
});
