import { CardManager } from '../game/cards/card-manager';
import { StateSerializer } from '../game/serializer/state-serializer';
import { AttackAction, UseAbilityAction } from '../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../game/store/actions/play-card-action';
import { Card } from '../game/store/card/card';
import { SpecialCondition, SuperType } from '../game/store/card/card-types';
import { ChooseCardsPrompt } from '../game/store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../game/store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../game/store/prompts/choose-pokemon-prompt';
import { AttachEnergyPrompt } from '../game/store/prompts/attach-energy-prompt';
import { Prompt } from '../game/store/prompts/prompt';
import { CardList } from '../game/store/state/card-list';
import { Player } from '../game/store/state/player';
import { PokemonCardList } from '../game/store/state/pokemon-card-list';
import { GamePhase, GameWinner, State } from '../game/store/state/state';
import { Base64 } from '../utils/base64';
import { ensureClientCards } from './cards';
import { ClientSimulator } from './simulator';

describe('ClientSimulator real card regressions', () => {
  const own = (slot = SlotType.ACTIVE, index = 0): CardTarget => ({ player: PlayerType.BOTTOM_PLAYER, slot, index });
  const opposing = (slot = SlotType.ACTIVE, index = 0): CardTarget => ({ player: PlayerType.TOP_PLAYER, slot, index });

  function fixture(attacker = 'Charmander BS', defender = 'Wailord V CPA') {
    ensureClientCards();
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 4;
    state.rules.attackFirstTurn = true;
    state.players = [new Player(), new Player()];
    const add = (zone: CardList, name: string): Card => {
      const card = CardManager.getInstance().getCardByName(name);
      if (!card) { throw new Error('Unknown test card: ' + name); }
      card.id = state.cardNames.length;
      state.cardNames.push(card.fullName);
      zone.cards.push(card);
      return card;
    };
    const attach = (zone: PokemonCardList, name: string): Card => {
      const card = add(zone, name);
      zone.energies.cards.push(card);
      return card;
    };
    state.players.forEach((player, i) => {
      player.id = i === 0 ? 17 : 29;
      player.name = i === 0 ? 'Player' : 'Dummy';
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.prizes = Array.from({ length: 6 }, () => new CardList());
      player.prizes.forEach(prize => add(prize, 'Water Energy SVE'));
      for (let n = 0; n < 10; n++) { add(player.deck, 'Fire Energy SVE'); }
      add(player.active, i === 0 ? attacker : defender);
      player.active.pokemonPlayedTurn = 1;
    });
    const load = () => {
      const simulator = new ClientSimulator();
      simulator.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
      return simulator;
    };
    return { state, player: state.players[0], opponent: state.players[1], add, attach, load };
  }

  function pending<T extends Prompt<any>>(simulator: ClientSimulator, Type: new (...args: any[]) => T): T {
    const prompt = simulator.state.prompts.find(p => p instanceof Type && p.result === undefined && p.playerId === simulator.humanPlayerId);
    if (!prompt) { throw new Error('Missing ' + Type.name + '; pending: ' + simulator.state.prompts.map(p => p.type).join(', ')); }
    return prompt as T;
  }

  function chooseCards(simulator: ClientSimulator, names: string[]): void {
    const prompt = pending(simulator, ChooseCardsPrompt);
    const available = prompt.cards.cards.map((card, index) => ({ card, index }));
    const result = names.map(name => {
      const index = available.findIndex(item => item.card.fullName === name);
      if (index === -1) { throw new Error('Card missing from prompt: ' + name); }
      return available.splice(index, 1)[0].index;
    });
    simulator.resolvePrompt(prompt.id, result);
  }

  function choosePokemon(simulator: ClientSimulator, targets: CardTarget[]): void {
    simulator.resolvePrompt(pending(simulator, ChoosePokemonPrompt).id, targets);
  }

  function play(simulator: ClientSimulator, name: string, target = own(SlotType.BOARD)): void {
    const index = simulator.state.players[0].hand.cards.findIndex(card => card.fullName === name);
    if (index === -1) { throw new Error('Card missing from hand: ' + name); }
    simulator.dispatch(new PlayCardAction(simulator.humanPlayerId, index, target));
  }

  function ability(simulator: ClientSimulator, name: string, target = own()): void {
    simulator.dispatch(new UseAbilityAction(simulator.humanPlayerId, name, target));
  }

  function attack(simulator: ClientSimulator, name: string): void {
    simulator.dispatch(new AttackAction(simulator.humanPlayerId, name));
  }

  it('plays Bill and draws two real cards without ending the turn', () => {
    const f = fixture();
    f.add(f.player.hand, 'Bill BS');
    const simulator = f.load();
    play(simulator, 'Bill BS');
    expect(simulator.state.players[0].hand.cards.length).toBe(2);
    expect(simulator.state.players[0].deck.cards.length).toBe(8);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toContain('Bill BS');
    expect(simulator.complete).toBe(false);
  });

  it('Professor Oak discards the other hand cards and draws seven', () => {
    const f = fixture();
    ['Professor Oak BS', 'Water Energy SVE', 'Potion BS'].forEach(name => f.add(f.player.hand, name));
    const simulator = f.load();
    play(simulator, 'Professor Oak BS');
    expect(simulator.state.players[0].hand.cards.length).toBe(7);
    expect(simulator.state.players[0].deck.cards.length).toBe(3);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName).sort()).toEqual(['Potion BS', 'Professor Oak BS', 'Water Energy SVE'].sort());
  });

  it('Computer Search pays a two-card discard before searching and shuffling', () => {
    const f = fixture();
    ['Computer Search BS', 'Water Energy SVE', 'Potion BS'].forEach(name => f.add(f.player.hand, name));
    f.add(f.player.deck, 'Charmeleon BS');
    const simulator = f.load();
    play(simulator, 'Computer Search BS');
    chooseCards(simulator, ['Water Energy SVE', 'Potion BS']);
    chooseCards(simulator, ['Charmeleon BS']);
    expect(simulator.state.players[0].hand.cards.map(card => card.fullName)).toEqual(['Charmeleon BS']);
    expect(simulator.state.players[0].discard.cards.length).toBe(3);
    expect(simulator.state.prompts.length).toBe(0);
  });

  it('rejects Computer Search without its discard cost and keeps the hand intact', () => {
    const f = fixture();
    ['Computer Search BS', 'Water Energy SVE'].forEach(name => f.add(f.player.hand, name));
    const simulator = f.load();
    expect(() => play(simulator, 'Computer Search BS')).toThrow();
    expect(simulator.state.players[0].hand.cards.length).toBe(2);
    expect(simulator.state.players[0].discard.cards.length).toBe(0);
    expect(simulator.state.prompts.length).toBe(0);
  });

  it('Energy Search only accepts a basic Energy and handles the dummy reveal locally', () => {
    const f = fixture();
    f.add(f.player.hand, 'Energy Search SVI');
    f.add(f.player.deck, 'Double Colorless Energy BS');
    f.add(f.player.deck, 'Water Energy SVE');
    const simulator = f.load();
    play(simulator, 'Energy Search SVI');
    const prompt = pending(simulator, ChooseCardsPrompt);
    const specialIndex = prompt.cards.cards.findIndex(card => card.fullName === 'Double Colorless Energy BS');
    expect(() => simulator.resolvePrompt(prompt.id, [specialIndex])).toThrow();
    chooseCards(simulator, ['Water Energy SVE']);
    expect(simulator.state.players[0].hand.cards.map(card => card.fullName)).toEqual(['Water Energy SVE']);
    expect(simulator.state.prompts.length).toBe(0);
  });

  it('modern Energy Retrieval recovers two basic Energy and leaves special Energy discarded', () => {
    const f = fixture();
    f.add(f.player.hand, 'Energy Retrieval SVI');
    ['Fire Energy SVE', 'Water Energy SVE', 'Double Colorless Energy BS'].forEach(name => f.add(f.player.discard, name));
    const simulator = f.load();
    play(simulator, 'Energy Retrieval SVI');
    chooseCards(simulator, ['Fire Energy SVE', 'Water Energy SVE']);
    expect(simulator.state.players[0].hand.cards.map(card => card.fullName).sort()).toEqual(['Fire Energy SVE', 'Water Energy SVE']);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toContain('Double Colorless Energy BS');
    expect(simulator.state.prompts.length).toBe(0);
  });

  for (const example of [{ card: 'Potion BS', amount: 20 }, { card: 'Potion SVI', amount: 30 }]) {
    it(example.card + ' retains its printing-specific healing amount', () => {
      const f = fixture('Wailord V CPA');
      f.player.active.damage = 70;
      f.add(f.player.hand, example.card);
      const simulator = f.load();
      play(simulator, example.card);
      choosePokemon(simulator, [own()]);
      expect(simulator.state.players[0].active.damage).toBe(70 - example.amount);
      expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toContain(example.card);
    });
  }

  it('Super Potion discards an attached Energy before healing forty damage', () => {
    const f = fixture('Wailord V CPA');
    f.player.active.damage = 70;
    f.attach(f.player.active, 'Water Energy SVE');
    f.add(f.player.hand, 'Super Potion BS');
    const simulator = f.load();
    play(simulator, 'Super Potion BS');
    choosePokemon(simulator, [own()]);
    chooseCards(simulator, ['Water Energy SVE']);
    expect(simulator.state.players[0].active.damage).toBe(30);
    expect(simulator.state.players[0].active.cards.filter(card => card.superType === SuperType.ENERGY).length).toBe(0);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toContain('Water Energy SVE');
  });

  it('Switch promotes the selected bench Pokemon and clears the former active status', () => {
    const f = fixture();
    f.player.active.damage = 20;
    f.player.active.specialConditions = [SpecialCondition.POISONED];
    f.add(f.player.bench[0], 'Squirtle BS');
    f.add(f.player.hand, 'Switch BS');
    const simulator = f.load();
    play(simulator, 'Switch BS');
    choosePokemon(simulator, [own(SlotType.BENCH)]);
    expect(simulator.state.players[0].active.getPokemonCard()!.name).toBe('Squirtle');
    expect(simulator.state.players[0].bench[0].damage).toBe(20);
    expect(simulator.state.players[0].bench[0].specialConditions.length).toBe(0);
  });

  it('Gust of Wind forces the selected opponent Pokemon active', () => {
    const f = fixture();
    f.add(f.opponent.bench[0], 'Squirtle BS');
    f.add(f.player.hand, 'Gust of Wind BS');
    const simulator = f.load();
    play(simulator, 'Gust of Wind BS');
    choosePokemon(simulator, [opposing(SlotType.BENCH)]);
    expect(simulator.state.players[1].active.getPokemonCard()!.name).toBe('Squirtle');
    expect(simulator.state.players[1].bench[0].getPokemonCard()!.name).toBe('Wailord V');
  });

  it('allows one manual Energy attachment and rolls back a second attachment', () => {
    const f = fixture();
    ['Fire Energy SVE', 'Water Energy SVE'].forEach(name => f.add(f.player.hand, name));
    const simulator = f.load();
    play(simulator, 'Fire Energy SVE', own());
    expect(simulator.state.players[0].active.energies.cards.length).toBe(1);
    expect(() => play(simulator, 'Water Energy SVE', own())).toThrow();
    expect(simulator.state.players[0].hand.cards.map(card => card.fullName)).toEqual(['Water Energy SVE']);
    expect(simulator.state.players[0].active.energies.cards.length).toBe(1);
  });

  it('rejects attacks when the required Energy is missing', () => {
    const simulator = fixture().load();
    expect(() => attack(simulator, 'Scratch')).toThrow();
    expect(simulator.complete).toBe(false);
    expect(simulator.state.players[1].active.damage).toBe(0);
  });

  it('Double Colorless supplies two colorless costs for Charmeleon Slash', () => {
    const f = fixture('Charmeleon BS');
    f.attach(f.player.active, 'Double Colorless Energy BS');
    f.attach(f.player.active, 'Fire Energy SVE');
    const simulator = f.load();
    attack(simulator, 'Slash');
    expect(simulator.state.players[1].active.damage).toBe(30);
    expect(simulator.complete).toBe(true);
  });

  it('Double Turbo supplies two Energy and reduces attack damage by twenty', () => {
    const f = fixture('Charmeleon BS');
    f.attach(f.player.active, 'Double Turbo Energy BRS');
    f.attach(f.player.active, 'Fire Energy SVE');
    const simulator = f.load();
    attack(simulator, 'Slash');
    expect(simulator.state.players[1].active.damage).toBe(10);
  });

  it('colorless special Energy cannot pay the colored part of an attack cost', () => {
    const f = fixture();
    f.attach(f.player.active, 'Double Colorless Energy BS');
    const simulator = f.load();
    expect(() => attack(simulator, 'Ember')).toThrow();
    expect(simulator.state.players[1].active.damage).toBe(0);
  });

  it('applies Water weakness to Bubble before ending the attack', () => {
    const f = fixture('Squirtle BS', 'Charmander BS');
    f.attach(f.player.active, 'Water Energy SVE');
    spyOn(Math, 'random').and.returnValue(0.9);
    const simulator = f.load();
    attack(simulator, 'Bubble');
    expect(simulator.state.players[1].active.damage).toBe(20);
  });

  it('applies Farfetchd Fighting resistance and clamps damage to zero', () => {
    const f = fixture('Hitmonchan BS', "Farfetch'd BS");
    f.attach(f.player.active, 'Fighting Energy SVE');
    const simulator = f.load();
    attack(simulator, 'Jab');
    expect(simulator.state.players[1].active.damage).toBe(0);
  });

  it('takes two prizes for knocking out a Pokemon V', () => {
    const f = fixture();
    f.attach(f.player.active, 'Fire Energy SVE');
    f.opponent.active.damage = 270;
    const simulator = f.load();
    attack(simulator, 'Scratch');
    expect(simulator.state.players[0].getPrizeLeft()).toBe(4);
    expect(simulator.state.phase).toBe(GamePhase.FINISHED);
    expect(simulator.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('Concealed Cards pays an Energy discard, draws two, and enforces once per turn', () => {
    const f = fixture('Radiant Greninja ASR');
    f.add(f.player.hand, 'Water Energy SVE');
    const simulator = f.load();
    ability(simulator, 'Concealed Cards');
    chooseCards(simulator, ['Water Energy SVE']);
    expect(simulator.state.players[0].hand.cards.length).toBe(2);
    expect(simulator.state.players[0].deck.cards.length).toBe(8);
    expect(simulator.state.players[0].discard.cards.map(card => card.fullName)).toContain('Water Energy SVE');
    expect(() => ability(simulator, 'Concealed Cards')).toThrow();
  });

  it('Concealed Cards cannot draw without an Energy in hand', () => {
    const simulator = fixture('Radiant Greninja ASR').load();
    expect(() => ability(simulator, 'Concealed Cards')).toThrow();
    expect(simulator.state.players[0].deck.cards.length).toBe(10);
  });

  it('Path to the Peak blocks a Radiant ability from a loaded stadium', () => {
    const f = fixture('Radiant Greninja ASR');
    f.add(f.player.hand, 'Water Energy SVE');
    f.add(f.opponent.stadium, 'Path to the Peak CRE');
    const simulator = f.load();
    expect(() => ability(simulator, 'Concealed Cards')).toThrow();
    expect(simulator.state.players[0].hand.cards.length).toBe(1);
    expect(simulator.state.players[0].deck.cards.length).toBe(10);
  });

  it('Bibarel draws up to five and prevents a second use of Industrious Incisors', () => {
    const f = fixture('Bibarel BRS');
    f.add(f.player.hand, 'Water Energy SVE');
    const simulator = f.load();
    ability(simulator, 'Industrious Incisors');
    expect(simulator.state.players[0].hand.cards.length).toBe(5);
    expect(simulator.state.players[0].deck.cards.length).toBe(6);
    expect(() => ability(simulator, 'Industrious Incisors')).toThrow();
  });

  it('Shivery Chill searches two Water Energy and resolves opponent reveals locally', () => {
    const f = fixture('Chien-Pao ex PAL');
    f.add(f.player.deck, 'Water Energy SVE');
    f.add(f.player.deck, 'Water Energy SVE');
    const simulator = f.load();
    ability(simulator, 'Shivery Chill');
    chooseCards(simulator, ['Water Energy SVE', 'Water Energy SVE']);
    expect(simulator.state.players[0].hand.cards.map(card => card.fullName)).toEqual(['Water Energy SVE', 'Water Energy SVE']);
    expect(simulator.state.prompts.length).toBe(0);
    expect(() => ability(simulator, 'Shivery Chill')).toThrow();
  });

  it('Shivery Chill is unavailable while Chien-Pao is on the bench', () => {
    const f = fixture();
    f.add(f.player.bench[0], 'Chien-Pao ex PAL');
    f.add(f.player.deck, 'Water Energy SVE');
    const simulator = f.load();
    expect(() => ability(simulator, 'Shivery Chill', own(SlotType.BENCH))).toThrow();
  });

  it('Super Cold attaches repeatedly without consuming the manual attachment allowance', () => {
    const f = fixture('Baxcalibur PAL');
    f.player.energyPlayedTurn = f.state.turn;
    f.add(f.player.hand, 'Water Energy SVE');
    f.add(f.player.hand, 'Water Energy SVE');
    const simulator = f.load();
    for (let n = 0; n < 2; n++) {
      ability(simulator, 'Super Cold');
      simulator.resolvePrompt(pending(simulator, AttachEnergyPrompt).id, [{ index: 0, to: own() }]);
    }
    expect(simulator.state.players[0].active.energies.cards.length).toBe(2);
    expect(simulator.state.players[0].hand.cards.length).toBe(0);
    expect(simulator.state.players[0].energyPlayedTurn).toBe(f.state.turn);
  });

  it('Elegant Heal heals active and bench Pokemon without producing negative damage', () => {
    const f = fixture('Radiant Tsareena SIT');
    f.add(f.player.bench[0], 'Wailord V CPA');
    f.add(f.player.bench[1], 'Squirtle BS');
    f.player.active.damage = 30;
    f.player.bench[0].damage = 10;
    f.player.bench[1].damage = 20;
    const simulator = f.load();
    ability(simulator, 'Elegant Heal');
    expect([simulator.state.players[0].active.damage, ...simulator.state.players[0].bench.slice(0, 2).map(p => p.damage)]).toEqual([10, 0, 0]);
    expect(() => ability(simulator, 'Elegant Heal')).toThrow();
  });

  it('evolution keeps damage and Energy, changes the card class, and clears Poison', () => {
    const f = fixture();
    f.attach(f.player.active, 'Fire Energy SVE');
    f.player.active.damage = 20;
    f.player.active.specialConditions = [SpecialCondition.POISONED];
    f.add(f.player.hand, 'Charmeleon BS');
    const simulator = f.load();
    play(simulator, 'Charmeleon BS', own());
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Charmeleon BS');
    expect(simulator.state.players[0].active.getPokemonCard()!.reduceEffect).toEqual(jasmine.any(Function));
    expect(simulator.state.players[0].active.damage).toBe(20);
    expect(simulator.state.players[0].active.energies.cards.length).toBe(1);
    expect(simulator.state.players[0].active.specialConditions.length).toBe(0);
  });

  it('rejects evolving a Pokemon placed in play this turn', () => {
    const f = fixture();
    f.player.active.pokemonPlayedTurn = f.state.turn;
    f.add(f.player.hand, 'Charmeleon BS');
    const simulator = f.load();
    expect(() => play(simulator, 'Charmeleon BS', own())).toThrow();
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Charmander BS');
  });

  it('Rare Candy finds an executable Stage 1 chain and evolves directly to Charizard', () => {
    const f = fixture();
    f.add(f.player.hand, 'Rare Candy SVI');
    f.add(f.player.hand, 'Charizard BS');
    const simulator = f.load();
    play(simulator, 'Rare Candy SVI');
    choosePokemon(simulator, [own()]);
    chooseCards(simulator, ['Charizard BS']);
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Charizard BS');
    expect(simulator.state.players[0].hand.cards.length).toBe(0);
  });

  for (const protectedBench of [false, true]) {
    it('Moonlight Shuriken ' + (protectedBench ? 'respects Manaphy Wave Veil on the bench' : 'discards Energy and damages both chosen Pokemon'), () => {
      const f = fixture('Radiant Greninja ASR');
      for (let n = 0; n < 3; n++) { f.attach(f.player.active, 'Water Energy SVE'); }
      f.add(f.opponent.bench[0], 'Wailord V CPA');
      if (protectedBench) { f.add(f.opponent.bench[4], 'Manaphy BRS'); }
      const simulator = f.load();
      attack(simulator, 'Moonlight Shuriken');
      simulator.resolvePrompt(pending(simulator, ChooseEnergyPrompt).id, [0, 1]);
      choosePokemon(simulator, [opposing(), opposing(SlotType.BENCH)]);
      expect(simulator.state.players[1].active.damage).toBe(90);
      expect(simulator.state.players[1].bench[0].damage).toBe(protectedBench ? 0 : 90);
      expect(simulator.state.players[0].active.cards.filter(card => card.superType === SuperType.ENERGY).length).toBe(1);
      expect(simulator.state.players[0].discard.cards.filter(card => card.superType === SuperType.ENERGY).length).toBe(2);
      expect(simulator.complete).toBe(true);
    });
  }

  for (const heads of [false, true]) {
    it('Poison Sting ' + (heads ? 'applies Poison and checkup damage on heads' : 'does not apply Poison on tails'), () => {
      const f = fixture('Weedle BS');
      f.attach(f.player.active, 'Grass Energy SVE');
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      const simulator = f.load();
      attack(simulator, 'Poison Sting');
      expect(simulator.state.players[1].active.damage).toBe(heads ? 20 : 10);
      expect(simulator.state.players[1].active.specialConditions.includes(SpecialCondition.POISONED)).toBe(heads);
      expect(simulator.state.prompts.length).toBe(0);
    });
  }

  it('Ocean Waves counts three locally resolved flips and applies damage per heads', () => {
    const f = fixture('Wailord V CPA');
    for (let n = 0; n < 4; n++) { f.attach(f.player.active, 'Water Energy SVE'); }
    spyOn(Math, 'random').and.returnValues(0.1, 0.9, 0.1, 0.3);
    const simulator = f.load();
    attack(simulator, 'Ocean Waves');
    expect(simulator.state.players[1].active.damage).toBe(240);
    expect(simulator.state.prompts.length).toBe(0);
  });

  it('Farfetchd Leek Slap marker survives snapshot reload and blocks a second use', () => {
    const f = fixture("Farfetch'd BS");
    f.attach(f.player.active, 'Fire Energy SVE');
    spyOn(Math, 'random').and.returnValue(0.1);
    const simulator = f.load();
    attack(simulator, 'Leek Slap');
    expect(simulator.state.players[1].active.damage).toBe(30);
    simulator.pushState(simulator.getStateData());
    expect(simulator.complete).toBe(false);
    expect(() => attack(simulator, 'Leek Slap')).toThrow();
    expect(simulator.state.players[1].active.damage).toBe(30);
  });
});
