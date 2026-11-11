import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { endTurn } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { setPitchBlack } from '../set-pitch-black';

const prints: Array<[string, string]> = [
  ['Wooper FLO', '17'], ['Quagsire FLO', '18'], ['Buizel FLO', '19'], ['Floatzel ex FLO', '20'],
  ['Oricorio FLO', '22'], ['Pawmi FLO', '23'], ['Pawmo FLO', '24'], ['Pawmot FLO', '25'],
  ['Meditite FLO', '28'], ['Medicham FLO', '29'], ['Mega Absol Z ex FLO', '30'], ['Sigilyph ex FLO', '31'],
  ['Meloetta FLO', '32'], ['Machop FLO', '37'], ['Machoke FLO', '38'], ['Machamp FLO', '39'],
  ['Hitmontop FLO', '40'], ['Trapinch FLO', '41'], ['Riolu FLO', '44'], ['Throh FLO', '45'],
  ['Hawlucha FLO', '46'], ['Kubfu FLO', '48'], ['Single Strike Urshifu FLO', '49'], ['Rapid Strike Urshifu FLO', '50'],
  ['Mawile FLO', '56'], ['Mega Lucario Z ex FLO', '57'], ['Varoom FLO', '60'], ['Revavroom FLO', '61'],
  ['Vibrava FLO', '63'], ['Flygon FLO', '64'], ['Gible FLO', '65'], ['Gabite FLO', '66'],
  ['Mega Garchomp Z ex FLO', '67'], ['Drampa FLO', '68'], ['Meowth FLO', '69'], ['Persian FLO', '70'],
  ["Korrina's Determination FLO", '75'], ["Crasher Wake's Passion FLO", '76'], ['Fight Arena FLO', '78'],
];

const pitchBlackPrints: Array<[string, string]> = [
  ['Annihilape M5', '41'], ['Antique Shield Fossil M5', '72'], ['Antique Skull Fossil M5', '73'],
  ['Armarouge M5', '12'], ['Retry Badge M5', '74'], ['Banette M5', '34'], ['Bastiodon M5', '62'],
  ['Bombirdier M5', '71'], ['Brionne M5', '19'], ['Bronzong M5', '64'], ['Bronzor M5', '63'],
  ['Centiskorch M5', '10'], ['Charcadet M5', '11'], ['Charjabug M5', '25'], ['Chi-Yu M5', '59'],
  ['Cranidos M5', '44'], ['Dark Bell M5', '75'], ['Fossil Excavation Site M5', '76'],
  ["Gladion's Decisive Battle M5", '77'], ['Jett MEP', '79'], ['Mandibuzz M5', '50'],
  ['Mega Delphox ex M-P', '8'], ['Mega Slowbro ex MEP', '31'], ["Misty's Cheerfulness M5", '80'],
  ['Shadow Darkness Energy M5', '83'],
  ['Bolty [L] Energy M5', '84'], ['Vullaby M5', '49'],
];

const megaEvolutionPromoPrints: Array<[string, string]> = [
  ['Mega Charizard X ex2 MEP', '29'], ['Mega Charizard Y ex MEP', '30'], ["N's Zekrom MEP", '31'],
  ['Mega Gardevoir ex MEP', '32'], ['Mega Lucario ex2 MEP', '33'], ['Mega Meganium ex MEP', '34'],
  ['Mega Emboar ex MEP', '35'], ['Mega Feraligatr ex MEP', '36'], ['Delphox MEP', '74'],
  ['Crobat MEP', '76'], ['Goodra MEP', '77'], ['Toxel MEP', '78'], ['Fennekin MEP', '80'],
  ['Pikachu ex2 MEP', '109'], ['Pikachu ex MEP', '107'], ['Slowpoke MEP', '86'],
];

const megaXAndMegaParadePrints: Array<[string, string]> = [
  ['Mega Greninja ex M7a', '208'], ['Mega Zygarde ex M7a', '214'],
  ['Mega Darkrai ex M7a', '217'], ['Mega Rayquaza ex M7a', '218'],
];

const perfectOrderPrints: Array<[string, string]> = [
  ['Crushing Hammer POR', '71'], ['Energy Search POR', '72'], ['Poke Ball POR', '80'],
  ['Pokemon Catcher POR', '82'], ['Potion POR', '83'],
];

const phantasmalFlamesPrints: Array<[string, string]> = [
  ['Aipom PFL', '78'], ['Ambipom M2', '79'], ['AmbipomIR PFL', '107'], ['Archaludon M2', '75'], ['Duraludon PFL', '74'],
  ['Flygon PFL', '53'], ['Gligar PFL', '49'], ['Gliscor PFL', '50'], ['FlygonIR PFL', '101'],
  ['Trapinch PFL', '51'],
];

describe('Upstream catalog batch 13: Aura Seeker identities and mechanics', () => {
  beforeAll(() => ensureClientCards());

  it('registers all 39 upstream Aura Seeker print identities exactly once', () => {
    const cards = CardManager.getInstance().getAllCards();
    expect(prints.length).toBe(39);
    for (const [fullName, setNumber] of prints) {
      const matches = cards.filter(card => card.fullName === fullName);
      expect(matches.length).toBe(1);
      expect(matches[0].set).toBe('M7');
      expect(matches[0].setNumber).toBe(setNumber);
    }
  });

  it('matches the upstream Pitch Black set codes and collector numbers without changing saved-state names', () => {
    const cards = CardManager.getInstance().getAllCards();
    for (const [fullName, setNumber] of pitchBlackPrints) {
      const card = cards.find(candidate => candidate.fullName === fullName);
      expect(card).toBeDefined();
      expect(card!.set).toBe('PBL');
      expect(card!.setNumber).toBe(setNumber);
    }
  });

  it('registers the additional Mega Evolution promo prints without changing their card rules', () => {
    const cards = CardManager.getInstance().getAllCards();
    for (const [fullName, setNumber] of megaEvolutionPromoPrints) {
      const matches = cards.filter(card => card.fullName === fullName);
      expect(matches.length).toBe(1);
      expect(matches[0].set).toBe('MEP');
      expect(matches[0].setNumber).toBe(setNumber);
    }
  });

  it('registers Mega X / Mega Parade and Perfect Order reprints under their exact print identities', () => {
    const cards = CardManager.getInstance().getAllCards();
    for (const [fullName, setNumber] of [...megaXAndMegaParadePrints, ...perfectOrderPrints]) {
      const matches = cards.filter(card => card.fullName === fullName);
      expect(matches.length).toBe(1);
      expect(matches[0].set).toBe(fullName.endsWith('M7a') ? 'M7a' : 'POR');
      expect(matches[0].setNumber).toBe(setNumber);
    }
  });

  it('registers the remaining Phantasmal Flames cards with upstream set numbers', () => {
    const cards = CardManager.getInstance().getAllCards();
    for (const [fullName, setNumber] of phantasmalFlamesPrints) {
      const matches = cards.filter(card => card.fullName === fullName);
      expect(matches.length).toBe(1);
      expect(matches[0].set).toBe('PFL');
      expect(matches[0].setNumber).toBe(setNumber);
    }
  });

  it('registers every imported Pitch Black art print with an exact PBL identity', () => {
    const artPrints = setPitchBlack.filter(card => /(?:IR|FA|SIR|HR) PBL$/.test(card.fullName));
    expect(artPrints.length).toBe(36);
    expect(new Set(artPrints.map(card => card.fullName)).size).toBe(36);
    for (const card of artPrints) {
      expect(card.set).toBe('PBL');
      expect(card.setNumber).not.toBe('');
    }
  });

  it('Mega Absol blocks only Stadium plays and Special Energy attachments for the opponent turn', () => {
    const game = setupGame({
      turn: 3,
      player1: {
        active: { card: 'Mega Absol Z ex FLO', energy: ['Psychic Energy SVE', 'Psychic Energy SVE', 'Double Colorless Energy BS'] },
        deck: padDeck(12),
      },
      player2: {
        active: { card: 'Mew ex MEW' },
        hand: ['Double Colorless Energy BS', 'Fight Arena FLO'],
        deck: padDeck(12),
      },
    });

    game.store.dispatch(new AttackAction(game.player1.id, 'Bloody Fear'));
    expect(game.player2.marker.hasMarker(game.player2.ATTACK_EFFECT_STADIUM_LOCK)).toBe(true);
    expect(game.player2.marker.hasMarker(game.player2.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK)).toBe(true);
    endTurn(game.store, game.state);

    const energyIndex = game.player2.hand.cards.findIndex(card => card.fullName === 'Double Colorless Energy BS');
    expect(() => game.store.dispatch(new PlayCardAction(game.player2.id, energyIndex, {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0,
    }))).toThrow();

    const stadiumIndex = game.player2.hand.cards.findIndex(card => card.fullName === 'Fight Arena FLO');
    expect(() => game.store.dispatch(new PlayCardAction(game.player2.id, stadiumIndex, {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0,
    }))).toThrow();
    expect((getCardByName('Mega Absol Z ex FLO') as any).cardTag).toContain('Mega ex');
  });

  it('Archaludon carries its Basic-attacker-only damage protection through the opponent turn', () => {
    const game = setupGame({
      turn: 3,
      player1: {
        active: { card: 'Archaludon M2', energy: ['Metal Energy SVE', 'Metal Energy SVE', 'Metal Energy SVE'] },
        deck: padDeck(12),
      },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(12) },
    });

    const attacker = game.player1.active.getPokemonCard()!;
    game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, attacker.attacks[0]));
    expect(game.player1.active.preventDamageNextTurnFilterPending).toEqual({ sourceStage: Stage.BASIC });
    endTurn(game.store, game.state);
    expect(game.player1.active.preventDamageNextTurnFilter).toEqual({ sourceStage: Stage.BASIC });
  });
});
