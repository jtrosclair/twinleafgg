import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PlayerType, SlotType, CardTarget } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { FireEnergy } from '../set-scarlet-and-violet-energy/fire-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { RosasEncouragement } from '../set-perfect-order/rosas-encouragement';
import { CardList } from '../../game/store/state/card-list';

class StageTwo extends PokemonCard {
  public name = 'Stage Two'; public fullName = 'Stage Two TEST'; public set = 'TEST';
  public hp = 180; public stage = Stage.STAGE_2; public cardType = CardType.FIRE;
}
class Basic extends PokemonCard {
  public name = 'Basic'; public fullName = 'Basic TEST'; public set = 'TEST';
  public hp = 100; public stage = Stage.BASIC; public cardType = CardType.FIRE;
}

function battle() {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent];
  state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.activePlayer = 0;
  player.active.cards = [new StageTwo()]; opponent.active.cards = [new Basic()];
  const bench = new PokemonCardList(); bench.cards = [new Basic()]; player.bench = [bench];
  player.prizes = Array.from({ length: 3 }, () => { const p = new CardList(); p.cards = [new FireEnergy()]; return p; });
  opponent.prizes = Array.from({ length: 2 }, () => { const p = new CardList(); p.cards = [new FireEnergy()]; return p; });
  const fire = new FireEnergy(), water = new WaterEnergy(), rosa = new RosasEncouragement();
  player.discard.cards = [fire, water]; player.hand.cards = [rosa];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  store.reduceEffect(state, new PlaySupporterEffect(player, rosa));
  const prompt = state.prompts.find(p => p instanceof AttachEnergyPrompt && p.result === undefined) as AttachEnergyPrompt;
  const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
  const benched: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
  return { state, player, opponent, store, prompt, active, benched, fire, water, rosa };
}

describe('Rosa’s Encouragement attachment eligibility', () => {
  it('allows choosing no Energy while using the Supporter', () => {
    const b = battle();
    expect(b.prompt.validate([])).toBe(true);
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(b.prompt.id, []));
    expect(b.player.discard.cards).toContain(b.fire);
    expect(b.player.discard.cards).toContain(b.water);
    expect(b.player.discard.cards).toContain(b.rosa);
    expect(b.player.supporterTurn).toBe(1);
  });

  it('blocks attachment to a Basic Pokémon while allowing the Stage 2', () => {
    const b = battle();
    expect(b.prompt.validate([{ card: b.fire, to: b.active }])).toBe(true);
    expect(b.prompt.validate([{ card: b.fire, to: b.benched }])).toBe(false);
    b.prompt.options.validCardTypes = [CardType.FIRE];
    expect(b.prompt.validate([{ card: b.fire, to: b.benched }])).toBe(false);
    const decoded = b.prompt.decode([{ index: 0, to: b.benched }], b.state);
    expect(b.prompt.validate(decoded)).toBe(false);
  });

  it('attaches both selected Energy to the same Stage 2 and consumes the Supporter', () => {
    const b = battle(); const transfers = [{ card: b.fire, to: b.active }, { card: b.water, to: b.active }];
    expect(b.prompt.validate(transfers)).toBe(true);
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(b.prompt.id, transfers));
    expect(b.player.active.cards).toContain(b.fire);
    expect(b.player.active.cards).toContain(b.water);
    expect(b.player.discard.cards).toContain(b.rosa);
    expect(b.player.supporterTurn).toBe(1);
  });
});
