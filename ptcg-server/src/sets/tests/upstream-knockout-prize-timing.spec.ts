import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { GameWinner } from '../../game/store/state/state';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const mew = 'Mew ex MEW';
const rookidee = 'Rookidee SSH';
const arceus = 'Arceus V BRS';
const staraptor = 'Staraptor CIN';
const sandile = 'Sandile UNB 114';
const golisopod = 'Golisopod M4';
const briar = 'Briar SCR';
const anthea = 'Anthea & Concordia M2a';
const summit = ['Legendary Summit (Left) M6', 'Legendary Summit (Right) M6'];
const heracross = 'Heracross BUS';
const charizard = 'Charizard ex OBF';
const zekrom = "N's Zekrom M2a";
const zoroark = "N's Zoroark ex JTG";
const nsBench = ["N's Darmanitan JTG", zoroark, "N's Vanilluxe M2a", "N's Klinklang JTG", "N's Reshiram JTG"];
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { ...ownBench, slot: SlotType.ACTIVE };
const board = { ...ownBench, slot: SlotType.BOARD };

function battle(left: PlayerConfig, right: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: mew }], deck: padDeck(16), ...left },
    player2: { bench: [{ card: arceus }], deck: padDeck(16), ...right }
  });
}

describe('Attacks that follow up on lethal damage', () => {
  it('Critical Cut does not protect Golisopod when Guts leaves Heracross in play', () => {
    const { store, player1, player2 } = battle({ active: { card: golisopod, energy: [water] }, bench: [] },
      { active: { card: heracross, damage: 80, energy: [grass, grass] } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Critical Cut'));
    expect(player2.active.damage).toBe(100);
    store.dispatch(new AttackAction(player2.id, 'Pitch'));
    expect(player1.active.damage).toBe(50);
  });

  it('Critical Cut protects against attack effects for the opposing turn after a Knock Out', () => {
    const { store, player1, player2, overridePrompt } = battle({ active: { card: golisopod, energy: [water] } },
      { active: { card: rookidee, damage: 30 }, bench: [{ card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] }] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Critical Cut'));
    expect(player1.active.preventDamageNextTurn).toBe(true);
    expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(true);
    store.dispatch(new AttackAction(player2.id, 'Frenzied Gouging'));
    expect(player1.active.getPokemonCard()?.fullName).toBe(golisopod);
    expect(player2.getPrizeLeft()).toBe(6);
    expect(player1.active.preventEffectsOfAttacksNextTurn).toBe(false);
  });

  for (const copied of [false, true]) {
    it(`Sky Hunting switches ${copied ? 'its copycat' : 'Staraptor'} before the opponent promotes`, () => {
      const attacker = copied ? mew : staraptor;
      const defender = copied ? { card: staraptor, damage: 20 } : { card: rookidee };
      const { store, player1, player2, overridePrompt } = battle({
        active: { card: attacker, energy: [grass, grass, grass, grass] }, bench: [{ card: arceus }]
      }, { active: defender, bench: [{ card: arceus }, { card: mew }] });
      const promptOwners: number[] = [];
      const showPrompt = store.prompt.bind(store);
      spyOn(store, 'prompt').and.callFake((...args: Parameters<typeof store.prompt>) => {
        const [, prompts] = args;
        for (const prompt of Array.isArray(prompts) ? prompts : [prompts]) {
          if (prompt instanceof ChoosePokemonPrompt) promptOwners.push(prompt.playerId);
        }
        return showPrompt(...args);
      });
      if (copied) overridePrompt('Choose attack', () => ({ index: 0, attack: 'Sky Hunting' }));
      store.dispatch(new AttackAction(player1.id, copied ? 'Genome Hacking' : 'Sky Hunting'));
      expect(promptOwners).toEqual([player1.id, player2.id]);
      expect(player1.active.getPokemonCard()?.fullName).toBe(arceus);
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(attacker);
    });
  }

  it('Sky Hunting still requires a switch when the Knock Out yields no Prize', () => {
    const { store, player1, overridePrompt } = battle({
      active: { card: staraptor, energy: [grass, grass, grass, grass] }
    }, { active: { card: 'Robo Substitute PHF' } });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Sky Hunting'));
    expect(player1.active.getPokemonCard()?.fullName).toBe(mew);
    expect(player1.getPrizeLeft()).toBe(6);
  });

  it('Sky Hunting keeps Staraptor Active when Guts prevents the Knock Out', () => {
    const { store, player1, player2 } = battle({ active: { card: staraptor, energy: [grass, grass, grass, grass] } },
      { active: { card: heracross } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Sky Hunting'));
    expect(player2.active.damage).toBe(100);
    expect(player1.active.getPokemonCard()?.fullName).toBe(staraptor);
  });

  for (const behavior of ['attack', 'pass', 'switch']) {
    it(`Grandiose Fangs applies the next-turn bonus correctly after ${behavior}`, () => {
      const { store, player1, player2, overridePrompt } = battle(
        { active: { card: sandile, energy: [grass, grass, grass] }, hand: ['Switch SVI', 'Switch SVI'] },
        { active: { card: rookidee, damage: 30 } });
      overridePrompt('Choose pokemon', () => [ownBench]);
      store.dispatch(new AttackAction(player1.id, 'Grandiose Fangs'));
      store.dispatch(new PassTurnAction(player2.id));
      if (behavior === 'pass') {
        store.dispatch(new PassTurnAction(player1.id));
        store.dispatch(new PassTurnAction(player2.id));
      }
      if (behavior === 'switch') {
        store.dispatch(new PlayCardAction(player1.id, 0, board));
        store.dispatch(new PlayCardAction(player1.id, 0, board));
      }
      store.dispatch(new AttackAction(player1.id, 'Grandiose Fangs'));
      expect(player2.active.damage).toBe(behavior === 'attack' ? 150 : 30);
    });
  }

  it('keeps a copied Grandiose Fangs bonus on the Pokémon that actually attacked', () => {
    const { store, player1, player2, overridePrompt } = battle(
      { active: { card: mew, energy: [grass, grass, grass] } }, { active: { card: sandile, damage: 60 } });
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Choose attack', () => ({ index: 0, attack: 'Grandiose Fangs' }));
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    store.dispatch(new PassTurnAction(player2.id));
    overridePrompt('Choose attack', () => ({ index: 0, attack: 'Power Edge' }));
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    expect(player2.discard.cards.some(card => card.fullName === arceus)).toBe(true);
    expect(player1.getPrizeLeft()).toBe(3);
  });
});

describe('Attack-damage Prize eligibility', () => {
  const nsPlayer = { active: { card: zekrom, energy: [dark, dark, dark] }, bench: nsBench.map(card => ({ card })) };
  const tera = { card: charizard, energy: [fire, fire] };

  it('Briar awards a Tera attack an extra Prize when played that turn', () => {
    const { store, player1 } = battle({ active: tera, hand: [briar], prizeCount: 2 },
      { active: { card: rookidee }, prizeCount: 2 });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player1.discard.cards.some(card => card.fullName === briar)).toBe(true);
    store.dispatch(new AttackAction(player1.id, 'Burning Darkness'));
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    expect(player1.getPrizeLeft()).toBe(0);
  });

  it('Briar expires if its turn ends without a Knock Out', () => {
    const { store, player1, player2 } = battle({ active: tera, hand: [briar] },
      { active: { card: charizard }, prizeCount: 2 });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, 'Burning Darkness'));
    expect(player1.getPrizeLeft()).toBe(6);
    store.dispatch(new PassTurnAction(player2.id));
    store.dispatch(new AttackAction(player1.id, 'Burning Darkness'));
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('Anthea & Concordia check the attacker and award three extra Prizes for N’s Shred', () => {
    const { store, player1 } = battle({ ...nsPlayer, hand: [anthea], prizeCount: 4 },
      { active: { card: rookidee } });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, 'Shred'));
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    expect(player1.getPrizeLeft()).toBe(0);
  });

  for (const supporter of [briar, anthea]) {
    it(`${supporter} leaves the base Prize count on an attack effect Knock Out`, () => {
      const left = supporter === briar ? { active: tera } : nsPlayer;
      const tool = 'Technical Machine: Devolution PAR';
      const { store, player1, player2 } = battle({ ...left, hand: [supporter, tool] },
        { active: { card: 'Pidgeotto OBF', damage: 60 }, prizeCount: 2 });
      const basic = getCardByName('Pidgey OBF');
      basic.id = 20000;
      player2.active.cards.unshift(basic);
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
      store.dispatch(new AttackAction(player1.id, 'Devolution'));
      expect(player2.discard.cards).toContain(basic);
      expect(player1.getPrizeLeft()).toBe(5);
    });
  }

  for (const half of [0, 1]) {
    it(`applies Legendary Summit once to the combined Glutton-GX Prizes with half ${half + 1} played`, () => {
      const { store, player1 } = battle(
        { active: { card: 'Guzzlord-GX CIN', energy: [dark, dark, dark, dark, dark] }, hand: summit, prizeCount: 2 },
        { active: { card: rookidee } });
      store.dispatch(new PlayCardAction(player1.id, half, board));
      expect(player1.stadium.cards.length).toBe(2);
      store.dispatch(new AttackAction(player1.id, 'Glutton-GX'));
      expect(player1.getPrizeLeft()).toBe(0);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  it('Legendary Summit can reduce a normal Colorless Knock Out to zero Prizes', () => {
    const { store, player1 } = battle(
      { active: tera, hand: summit }, { active: { card: rookidee } });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, 'Burning Darkness'));
    expect(player1.getPrizeLeft()).toBe(6);
  });

  it('Legendary Summit leaves the Prize for a direct Knock Out', () => {
    const { store, player1 } = battle(
      { active: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] }, hand: summit },
      { active: { card: rookidee } });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(player1.getPrizeLeft()).toBe(5);
  });
});
