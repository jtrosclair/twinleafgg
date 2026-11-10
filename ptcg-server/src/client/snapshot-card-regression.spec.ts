import { Arbiter } from '../game/core/arbiter';
import { CardManager } from '../game/cards/card-manager';
import { StateSerializer } from '../game/serializer/state-serializer';
import { AttackAction, UseAbilityAction } from '../game/store/actions/game-actions';
import { ResolvePromptAction } from '../game/store/actions/resolve-prompt-action';
import { WaitPrompt } from '../game/store/prompts/wait-prompt';
import { PlayerType, SlotType } from '../game/store/actions/play-card-action';
import { Card } from '../game/store/card/card';
import { CardType, SpecialCondition, SuperType } from '../game/store/card/card-types';
import { PokemonCard } from '../game/store/card/pokemon-card';
import { CardList } from '../game/store/state/card-list';
import { Player } from '../game/store/state/player';
import { PokemonCardList } from '../game/store/state/pokemon-card-list';
import { GamePhase, State } from '../game/store/state/state';
import { Store } from '../game/store/store';
import { Base64 } from '../utils/base64';
import { applyClientCardMetadata, ensureClientCards } from './cards';
import { ClientSimulator } from './simulator';
import { CARD_LIBRARY_SCHEMA_VERSION } from './card-metadata';

/** Cards whose mechanics depend on executable classes and shared snapshot identity. */
describe('snapshot card identity and copied effects', () => {
  function fixture(humanName = 'Charmander BS', opponentName = 'Snorlax V SSH') {
    ensureClientCards();
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 7;
    state.players = [new Player(), new Player()];
    state.players[0].id = 43;
    state.players[1].id = 42;
    const register = (name: string): Card => {
      const card = CardManager.getInstance().getCardByName(name);
      if (!card) { throw new Error('Missing regression fixture card: ' + name); }
      card.id = state.cardNames.length;
      state.cardNames.push(card.fullName);
      return card;
    };
    const add = (list: CardList, name: string): Card => {
      const card = register(name);
      list.cards.push(card);
      if (list instanceof PokemonCardList && card.superType === SuperType.ENERGY) {
        list.energies.cards.push(card);
      }
      return card;
    };
    for (const [index, player] of state.players.entries()) {
      player.name = index === 0 ? 'Human' : 'Dummy';
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.prizes = Array.from({ length: 6 }, () => new CardList());
      player.prizes.forEach(prize => add(prize, 'Fire Energy SVE'));
      for (let i = 0; i < 8; i++) { add(player.deck, 'Fire Energy SVE'); }
      add(player.active, index === 0 ? humanName : opponentName);
    }
    const simulator = new ClientSimulator();
    return {
      state, add, register, simulator,
      encode: () => new Base64().encode(new StateSerializer().serialize(state)),
      load: () => simulator.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) })
    };
  }

  function settleLive(live: Store): void {
    const arbiter = new Arbiter();
    for (let i = 0; i < 20; i++) {
      const pending = live.state.prompts.find(prompt => prompt.result === undefined);
      if (!pending) { return; }
      const action = pending instanceof WaitPrompt ? new ResolvePromptAction(pending.id, null)
        : arbiter.resolvePrompt(live.state, pending);
      if (!action) { throw new Error('Unexpected live Store prompt: ' + pending.type); }
      live.state = live.dispatch(action, 4);
    }
    throw new Error('Live Store did not settle');
  }

  it('retains single shared Energy and Tool instances plus marker ownership through load and undo', () => {
    const f = fixture();
    const human = f.state.players[0];
    f.add(human.active, 'Fire Energy SVE');
    const tool = f.register('Muscle Band XY');
    human.active.tools.push(tool);
    human.marker.addMarker('snapshot tool owner', tool, 'trainer', 'player');
    human.active.marker.addMarker('snapshot energy owner', human.active.energies.cards[0], 'energy', 'pokemon');
    f.load();
    const assertIdentity = () => {
      const player = f.simulator.state.players[0];
      const energy = player.active.energies.cards[0];
      expect(player.active.cards.filter(card => card.id === energy.id).length).toBe(1);
      expect(player.active.cards.find(card => card.id === energy.id)).toBe(energy);
      expect(player.active.tools.length).toBe(1);
      expect(player.marker.markers.find(marker => marker.name === 'snapshot tool owner')!.source).toBe(player.active.tools[0]);
      expect(player.active.marker.markers.find(marker => marker.name === 'snapshot energy owner')!.source).toBe(energy);
    };
    assertIdentity();
    f.simulator.dispatch(new AttackAction(43, 'Scratch'));
    expect(f.simulator.state.players[1].active.damage).toBe(30);
    expect(f.simulator.undo()).toBe(true);
    assertIdentity();
    expect(f.simulator.state.players[1].active.damage).toBe(0);
    f.simulator.dispatch(new AttackAction(43, 'Scratch'));
    expect(f.simulator.state.players[1].active.damage).toBe(30);
  });

  it('recomputes attached Bravery Charm HP without accumulating its bonus across snapshots', () => {
    const f = fixture();
    f.add(f.state.players[0].active, 'Fire Energy SVE');
    f.state.players[0].active.tools.push(f.register('Bravery Charm PAL'));
    f.load();
    expect(f.simulator.state.players[0].active.hpBonus).toBe(50);
    f.simulator.pushState(f.simulator.getStateData());
    expect(f.simulator.state.players[0].active.hpBonus).toBe(50);
    f.simulator.dispatch(new AttackAction(43, 'Scratch'));
    f.simulator.undo();
    expect(f.simulator.state.players[0].active.hpBonus).toBe(50);
  });

  it('publishes printed dual types and current ability-added types, recalculating on reload', () => {
    const dual = fixture('Volcanion EX STS');
    dual.load();
    expect(dual.simulator.state.players[0].active.cardTypes).toEqual([CardType.FIRE, CardType.WATER]);
    const restored = new StateSerializer().deserialize(new Base64().decode(dual.simulator.getStateData()));
    expect(restored.players[0].active.cardTypes).toEqual([CardType.FIRE, CardType.WATER]);

    const f = fixture('Charmeleon BS');
    f.add(f.state.players[0].bench[0], 'Jolteon AOR');
    f.load();
    expect(f.simulator.state.players[0].active.cardTypes).toEqual([CardType.FIRE, CardType.LIGHTNING]);
    const state = f.simulator.state;
    state.players[0].bench[0].moveTo(state.players[0].discard);
    f.simulator.pushState(f.simulator.getStateData());
    expect(f.simulator.state.players[0].active.cardTypes).toEqual([CardType.FIRE]);
    expect(f.simulator.state.players[0].bench[0].cardTypes).toBeUndefined();
  });

  it('refreshes HP reduced by a stadium on both sides without subtracting damage', () => {
    const f = fixture('Charizard ex OBF', 'Charizard ex OBF');
    f.add(f.state.players[0].stadium, 'Gravity Mountain SSP');
    f.state.players[0].active.damage = 50;
    f.load();
    for (const player of f.simulator.state.players) {
      expect(player.active.hpBonus).toBe(-30);
      expect(player.active.getPokemonCard()!.hp + player.active.hpBonus).toBe(300);
    }
    f.simulator.pushState(f.simulator.getStateData());
    expect(f.simulator.state.players[0].active.hpBonus).toBe(-30);
    expect(f.simulator.state.players[0].active.damage).toBe(50);
  });

  it('preserves last-attack source identity used by Arbok damage and a Stadium cost reduction', () => {
    const f = fixture('Arbok UNB');
    const human = f.state.players[0];
    f.add(human.active, 'Psychic Energy SVE');
    f.add(human.stadium, 'Dimension Valley PHF');
    const arbok = human.active.getPokemonCard()!;
    f.state.playerLastAttack[human.id] = { attack: arbok.attacks[0], sourceCard: arbok };
    f.load();
    expect(f.simulator.state.playerLastAttack[43].sourceCard).toBe(f.simulator.state.players[0].active.getPokemonCard()!);
    f.simulator.dispatch(new AttackAction(43, 'Heavy Choke'));
    expect(f.simulator.state.players[1].active.damage).toBe(170);
    expect(f.simulator.complete).toBe(true);
    f.simulator.undo();
    expect(f.simulator.state.playerLastAttack[43].sourceCard).toBe(f.simulator.state.players[0].active.getPokemonCard()!);
    f.simulator.dispatch(new AttackAction(43, 'Heavy Choke'));
    expect(f.simulator.state.players[1].active.damage).toBe(170);
  });

  it('preserves a used Restart marker so loading does not grant an extra ability use', () => {
    const f = fixture('Mew ex MEW');
    const human = f.state.players[0];
    human.marker.addMarker('RESTART_MARKER', human.active.getPokemonCard()!, 'ability', 'pokemon');
    f.load();
    expect(() => f.simulator.dispatch(new UseAbilityAction(43, 'Restart', {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0
    }))).toThrow();
    expect(f.simulator.state.players[0].hand.cards.length).toBe(0);
  });

  it('retains executable copy-ability attacks from the discard pile after reloading', () => {
    const f = fixture('Ditto PGO', 'Squirtle BS');
    f.add(f.state.players[0].active, 'Water Energy SVE');
    f.add(f.state.players[0].discard, 'Squirtle BS');
    spyOn(Math, 'random').and.returnValue(0.1);
    const useCopiedBubble = () => {
      f.simulator.dispatch(new UseAbilityAction(43, 'Sudden Transormation', {
        player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0
      }));
      const prompt = f.simulator.state.prompts.find(item => item.type === 'Choose attack' && item.result === undefined)!;
      expect(prompt).toBeDefined();
      f.simulator.resolvePrompt(prompt.id, { index: 0, attack: 'Bubble' });
      expect(f.simulator.state.players[1].active.damage).toBe(10);
      expect(f.simulator.state.players[1].active.specialConditions).toContain(SpecialCondition.PARALYZED);
      expect(f.simulator.complete).toBe(true);
    };
    f.load();
    useCopiedBubble();
    f.simulator.undo();
    useCopiedBubble();
  });

  it('matches live Genome Hacking copied damage and after-effects after hydration', () => {
    const f = fixture('Mew ex MEW', 'Squirtle BS');
    for (let i = 0; i < 3; i++) { f.add(f.state.players[0].active, 'Fire Energy SVE'); }
    const snapshot = f.encode();
    spyOn(Math, 'random').and.returnValue(0.1);
    const live = new Store({ onStateChange() {} });
    live.restoreState(f.state);
    live.state = live.dispatch(new AttackAction(43, 'Genome Hacking'), 4);
    const livePrompt = live.state.prompts.find(item => item.type === 'Choose attack' && item.result === undefined)!;
    live.state = live.dispatch(new ResolvePromptAction(livePrompt.id,
      livePrompt.decode({ index: 0, attack: 'Bubble' }, live.state)), 4);
    settleLive(live);
    f.simulator.loadSnapshot({ stateData: snapshot });
    f.simulator.dispatch(new AttackAction(43, 'Genome Hacking'));
    const prompt = f.simulator.state.prompts.find(item => item.type === 'Choose attack' && item.result === undefined)!;
    f.simulator.resolvePrompt(prompt.id, { index: 0, attack: 'Bubble' });
    expect(f.simulator.state.players[1].active.damage).toBe(10);
    expect(f.simulator.state.players[1].active.specialConditions).toEqual(live.state.players[1].active.specialConditions);
    expect(f.simulator.complete).toBe(true);
  });

  it('retains card logic when display metadata is applied', () => {
    ensureClientCards();
    const card = CardManager.getInstance().getAllCards().find(item => item.fullName === 'Muscle Band XY')!;
    const reduce = card.reduceEffect;
    const previousImage = card.cardImage;
    try {
      const cards = ensureClientCards();
      const expected = { hash: 'a'.repeat(64), catalogueHash: 'b'.repeat(64), cardsTotal: cards.length };
      applyClientCardMetadata({ schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
        hash: expected.hash, catalogueHash: expected.catalogueHash,
        images: cards.map(item => item === card ? 'data:image/png;base64,AA==' : item.cardImage),
        reduceEffect: () => { throw new Error('Metadata cannot replace rules'); } } as any, expected);
      expect(card.reduceEffect).toBe(reduce);
      expect(card.cardImage).toBe('data:image/png;base64,AA==');
      expect(CardManager.getInstance().getCardByName(card.fullName)!.reduceEffect).toBe(reduce);
    } finally { card.cardImage = previousImage; }
  });

  it('matches legacy snapshot-loaded Copycat, including its known after-effect identity limitation', () => {
    const f = fixture('Mimikyu GRI', 'Squirtle BS');
    f.add(f.state.players[0].active, 'Psychic Energy SVE');
    f.add(f.state.players[0].active, 'Fire Energy SVE');
    const source = f.state.players[1].active.getPokemonCard()!;
    f.state.playerLastAttack[42] = { attack: source.attacks[0], sourceCard: source };
    const snapshot = f.encode();
    spyOn(Math, 'random').and.returnValue(0.1);
    const live = new Store({ onStateChange() {} });
    live.restoreState(f.state);
    live.state = live.dispatch(new AttackAction(43, 'Copycat'), 4);
    settleLive(live);
    const legacyLoaded = new Store({ onStateChange() {} });
    legacyLoaded.restoreState(new StateSerializer().deserialize(new Base64().decode(snapshot)));
    legacyLoaded.state = legacyLoaded.dispatch(new AttackAction(43, 'Copycat'), 4);
    settleLive(legacyLoaded);
    f.simulator.loadSnapshot({ stateData: snapshot });
    f.simulator.dispatch(new AttackAction(43, 'Copycat'));
    expect(live.state.players[1].active.specialConditions).toContain(SpecialCondition.PARALYZED);
    expect(legacyLoaded.state.players[1].active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    expect(f.simulator.state.players[1].active.damage).toBe(10);
    expect(f.simulator.state.players[1].active.damage).toBe(legacyLoaded.state.players[1].active.damage);
    // Compare the actual old snapshot-loading boundary. A raw in-memory attack
    // preserves additional attack-object identity that the existing serializer
    // does not encode; that pre-existing limitation is unchanged by this port.
    expect(f.simulator.state.players[1].active.specialConditions).toEqual(legacyLoaded.state.players[1].active.specialConditions);
  });
});
