import { GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { GamePhase, GameWinner, State } from '../../game/store/state/state';
import { PokemonSlotConfig, SetupGameResult, padDeck, setupGame } from './test-helpers';

const dark = 'Darkness Energy SVE';
const fire = 'Fire Energy SVE';
const lightning = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const miraidon = { card: 'Miraidon ex SVI', energy: [lightning, lightning, dark] };
const moon = { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
const spiritomb = 'Spiritomb LOR 117';
const weezing = 'Weezing PLS';
const arbok = 'Arbok HIF';
const trevenant = 'Trevenant LOR 17';
const gengar = 'Gengar M3';
const pecharunt = 'Pecharunt ex SFA';
const bolt = 'Photon Blaster';
const gouge = 'Frenzied Gouging';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingActive = { ...ownBench, player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE };
const opposingBench = { ...ownBench, player: PlayerType.TOP_PLAYER };

function game(defender: PokemonSlotConfig, {
  attacker = miraidon as PokemonSlotConfig, attackerBench = [{ card: 'Mew ex MEW' }] as PokemonSlotConfig[],
  defenderBench = [{ card: 'Radiant Greninja ASR' }] as PokemonSlotConfig[], attackerDeck = padDeck(12),
  defenderDeck = padDeck(12), attackerHand = [] as string[], defenderHand = [] as string[],
  prizeCount = 5, stadium = '', defenderOwnsStadium = false
} = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: attacker, bench: attackerBench, hand: [...attackerHand, ...(stadium && !defenderOwnsStadium ? [stadium] : [])],
      deck: attackerDeck, prizeCount },
    player2: { active: defender, bench: defenderBench, deck: defenderDeck,
      hand: [...defenderHand, ...(stadium && defenderOwnsStadium ? [stadium] : [])] }
  });
  if (stadium) {
    const owner = defenderOwnsStadium ? game.player2 : game.player1;
    owner.hand.moveCardTo(owner.hand.cards.find(card => card.fullName === stadium)!, owner.stadium);
  }
  return game;
}

function watchPrizes(game: SetupGameResult, check: () => void) {
  const reduce = game.store.reduceEffect.bind(game.store);
  const observer = jasmine.createSpy('take Prizes').and.callFake(check);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CheckPrizesDestinationEffect) observer();
    return reduce(state, effect);
  });
  return observer;
}

describe('Conditions on Knock Out Abilities and Black Market Prism Star', () => {
  it('does not search with Cursed Message after Frenzied Gouging', () => {
    const { store, player1, player2, overridePrompt } = game({ card: spiritomb }, { attacker: moon, prizeCount: 1 });
    const search = jasmine.createSpy('search').and.returnValue([0]);
    overridePrompt('Choose cards', search);
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(search).not.toHaveBeenCalled();
    expect(player2.hand.cards).toEqual([]);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  for (const select of [false, true]) {
    it(`may ${select ? 'select one card' : 'fail Cursed Message'} before taking the final Prize`, () => {
      const battle = game({ card: spiritomb }, { prizeCount: 1 });
      const { store, player1, player2, overridePrompt } = battle;
      const selected = player2.deck.cards[1];
      const choose = jasmine.createSpy('search').and.callFake((prompt: ChooseCardsPrompt) => {
        expect(prompt.playerId).toBe(player2.id);
        expect(prompt.message).toBe(GameMessage.CHOOSE_CARD_TO_HAND);
        expect(prompt.options.min).toBe(0);
        expect(prompt.options.max).toBe(1);
        expect(player2.active.getPokemonCard()?.fullName).toBe(spiritomb);
        return select ? [1] : [];
      });
      const shuffled = jasmine.createSpy('shuffle').and.callFake(() =>
        player2.deck.cards.map((_, index) => player2.deck.cards.length - 1 - index));
      const takePrizes = watchPrizes(battle, () => {
        expect(player2.hand.cards).toEqual(select ? [selected] : []);
        expect(shuffled).toHaveBeenCalledTimes(1);
      });
      overridePrompt('Choose cards', choose);
      overridePrompt('Shuffle deck', shuffled);
      store.dispatch(new AttackAction(player1.id, bolt));
      expect(choose).toHaveBeenCalledTimes(1);
      expect(takePrizes).toHaveBeenCalledTimes(1);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  it('does not discard from the attacker’s deck with Aftermath after Frenzied Gouging', () => {
    const { store, player1 } = game({ card: weezing }, { attacker: moon, prizeCount: 1 });
    const deck = [...player1.deck.cards];
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(player1.deck.cards).toEqual(deck);
    expect(player1.discard.cards).toEqual([]);
  });

  for (const deckSize of [0, 2, 6]) {
    it(`Aftermath discards up to three cards from the top of a ${deckSize}-card deck before Prizes`, () => {
      const battle = game({ card: weezing }, { attackerDeck: padDeck(deckSize), prizeCount: 1 });
      const { store, player1 } = battle;
      const discard = player1.deck.cards.slice(0, 3);
      const takePrizes = watchPrizes(battle, () => expect(player1.discard.cards).toEqual(discard));
      store.dispatch(new AttackAction(player1.id, bolt));
      expect(takePrizes).toHaveBeenCalledTimes(1);
      expect(player1.deck.cards.length).toBe(deckSize - discard.length);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  it('does not lose to Aftermath deck-out until the next mandatory draw', () => {
    const { store, player1, player2 } = game({ card: weezing }, { attackerDeck: padDeck(2) });
    store.dispatch(new AttackAction(player1.id, bolt));
    expect(player1.deck.cards.length).toBe(0);
    expect(store.state.winner).toBe(GameWinner.NONE);
    expect(store.state.players[store.state.activePlayer]).toBe(player2);
  });

  it('does not discard from the attacker’s hand with Last Pattern after Frenzied Gouging', () => {
    const { store, player1 } = game({ card: arbok }, { attacker: moon, attackerHand: [fire, water], prizeCount: 1 });
    const hand = [...player1.hand.cards];
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(player1.hand.cards).toEqual(jasmine.arrayContaining(hand));
    expect(player1.discard.cards).toEqual([]);
  });

  for (const handSize of [0, 1, 3]) {
    it(`Last Pattern randomly discards distinct cards from a ${handSize}-card hand before Prizes`, () => {
      const battle = game({ card: arbok }, { attackerHand: [fire, water, lightning].slice(0, handSize), prizeCount: 1 });
      const { store, player1 } = battle;
      const hand = [...player1.hand.cards];
      spyOn(Math, 'random').and.returnValue(0.99);
      const discard = hand.slice(-2).reverse();
      const takePrizes = watchPrizes(battle, () => {
        expect(player1.discard.cards).toEqual(discard);
        expect(player1.hand.cards).toEqual(hand.slice(0, Math.max(0, hand.length - 2)));
      });
      store.dispatch(new AttackAction(player1.id, bolt));
      expect(takePrizes).toHaveBeenCalledTimes(1);
    });
  }

  for (const first of ['Last Pattern', 'Aftermath']) {
    it(`orders simultaneous Knock Out effects on Active and Benched Pokémon with ${first} first`, () => {
      const battle = game({ card: weezing, damage: 70 },
        { attacker: { ...miraidon, card: 'Electivire ex DRI' }, defenderBench: [{ card: arbok, damage: 90 }],
          attackerHand: [fire, water], prizeCount: 2 });
      const { store, player1, overridePrompt } = battle;
      const chosen = jasmine.createSpy('choose order').and.callFake((prompt: SelectPrompt) => {
        expect(prompt.playerId).toBe(player1.id);
        expect(prompt.values.length).toBe(2);
        return prompt.values.findIndex(label => label.startsWith(first));
      });
      const before = watchPrizes(battle, () => {
        expect(player1.hand.cards.length).toBe(0);
        expect(player1.deck.cards.length).toBe(9);
      });
      overridePrompt('Choose pokemon', () => [opposingActive, opposingBench]);
      overridePrompt('Select', chosen);
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(chosen).toHaveBeenCalledTimes(1);
      expect(before).toHaveBeenCalledTimes(1);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  for (const { attacker, replacement, attack, damage, prizesLeft } of [
    { attacker: { card: 'Arceus VSTAR BRS', energy: [dark, dark, dark] },
      replacement: undefined, attack: 'Trinity Nova', damage: 0, prizesLeft: 5 },
    { attacker: { card: 'Greedent VMAX FST', energy: [dark, water] },
      replacement: undefined, attack: 'Turn a Profit', damage: 100, prizesLeft: 5 },
    { attacker: { card: 'Regieleki V SIT', energy: [lightning] },
      replacement: 'Mew ex MEW', attack: 'Switching Bolt', damage: 100, prizesLeft: 5 },
    { attacker: { card: 'Mantine FST 61', energy: [water] },
      replacement: 'Arceus V BRS', attack: 'Bounce', damage: 100, prizesLeft: 4 },
    { attacker: miraidon, replacement: undefined, attack: bolt, damage: 0, prizesLeft: 4 }
  ]) {
    it(`counts actual Prizes after Elder Tree Barrier against ${attacker.card}`, () => {
      const { store, player1, player2, overridePrompt } = game({ card: trevenant, damage },
        { attacker, attackerBench: replacement ? [{ card: replacement }] : [] });
      if (replacement) overridePrompt('Choose pokemon', () => [ownBench]);
      store.dispatch(new AttackAction(player1.id, attack));
      expect(player2.discard.cards.map(card => card.fullName)).toContain(trevenant);
      expect(player1.active.getPokemonCard()?.fullName).toBe(replacement ?? attacker.card);
      expect(player1.getPrizeLeft()).toBe(prizesLeft);
    });
  }

  for (const stadium of ['Black Market Prism Star TEU', 'Black Market ◇ TEU']) {
    it(`${stadium} leaves two Prizes after the direct Knock Out from Frenzied Gouging`, () => {
      const { store, player1 } = game({ card: pecharunt, energy: [dark] }, { attacker: moon, stadium });
      store.dispatch(new AttackAction(player1.id, gouge));
      expect(player1.getPrizeLeft()).toBe(3);
    });

    it(`${stadium} leaves one Prize on damage to a Darkness Pokémon with effective Darkness Energy`, () => {
      const { store, player1 } = game({ card: pecharunt, energy: ['Luminous Energy PAL'] },
        { stadium, defenderOwnsStadium: true });
      store.dispatch(new AttackAction(player1.id, bolt));
      expect(player1.getPrizeLeft()).toBe(4);
    });

    it(`${stadium} still reduces Prizes if Exp. Share moves the Darkness Energy`, () => {
      const { store, player1, player2, overridePrompt } = game({ card: pecharunt, energy: [dark] }, {
        stadium, defenderBench: [{ card: 'Radiant Greninja ASR', tools: ['Exp. Share SVI'] }]
      });
      const energy = player2.active.energies.cards[0];
      overridePrompt('Attach energy', () => [{ index: 0, to: ownBench }]);
      store.dispatch(new AttackAction(player1.id, bolt));
      expect(player2.active.energies.cards).toContain(energy);
      expect(player1.getPrizeLeft()).toBe(4);
    });
  }

  it('Black Market and Glutton-GX each modify the Prize count for the same Knock Out', () => {
    const { store, player1 } = game({ card: spiritomb, energy: [dark] }, {
      attacker: { card: 'Guzzlord-GX CIN', energy: [dark, dark, dark, dark, dark] }, stadium: 'Black Market Prism Star TEU'
    });
    store.dispatch(new AttackAction(player1.id, 'Glutton-GX'));
    expect(player1.getPrizeLeft()).toBe(3);
  });

  it('Draconic Disaster removes Black Market before a qualifying Knock Out and sends the Stadium to the Lost Zone', () => {
    const stadium = 'Black Market Prism Star TEU';
    const { store, player1, player2 } = game({ card: pecharunt, energy: [dark] }, {
      attacker: { card: 'Gyarados-GX CIN', energy: [water, dark, dark, dark, dark] },
      stadium, defenderOwnsStadium: true
    });
    const card = player2.stadium.cards[0];
    store.dispatch(new AttackAction(player1.id, 'Draconic Disaster'));
    expect(player2.stadium.cards).toEqual([]);
    expect(player2.lostzone.cards).toContain(card);
    expect(player2.discard.cards).not.toContain(card);
    expect(player1.getPrizeLeft()).toBe(3);
  });

  it('Infinite Shadow returns all three evolution cards and discards attachments before the last Prize', () => {
    const battle = game({ card: gengar, energy: [dark], tools: ['Gravity Gemstone SCR'] }, {
      prizeCount: 1, defenderHand: ['Gastly CRE', 'Haunter CRE']
    });
    const { store, player1, player2 } = battle;
    const stage2 = player2.active.getPokemonCard()!;
    const lowerStages = player2.hand.cards.splice(0);
    player2.active.cards.unshift(...lowerStages);
    const attachments = [...player2.active.energies.cards, ...player2.active.tools];
    const takePrizes = watchPrizes(battle, () => {
      expect(player2.hand.cards).toEqual([...lowerStages, stage2]);
      expect(player2.discard.cards).toEqual(jasmine.arrayContaining(attachments));
    });
    store.dispatch(new AttackAction(player1.id, bolt));
    expect(takePrizes).toHaveBeenCalledTimes(1);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('does not rescue Gengar after Frenzied Gouging even with an old attacker damage marker', () => {
    const { store, player1, player2 } = game({ card: gengar }, { attacker: moon, prizeCount: 1 });
    const victim = player2.active.getPokemonCard()!;
    player1.marker.addMarker(player1.DAMAGE_DEALT_MARKER, player1.active.getPokemonCard()!);
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(player2.hand.cards).not.toContain(victim);
    expect(player2.discard.cards).toContain(victim);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('rescues a Benched Gengar after lethal attack damage', () => {
    const { store, player1, player2, overridePrompt } = game({ card: 'Mew ex MEW' }, {
      attacker: { ...miraidon, card: 'Electivire ex DRI' }, defenderBench: [{ card: gengar, damage: 90 }]
    });
    const victim = player2.bench[0].getPokemonCard()!;
    overridePrompt('Choose pokemon', () => [opposingActive, opposingBench]);
    store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
    expect(player2.hand.cards).toContain(victim);
    expect(player1.getPrizeLeft()).toBe(4);
  });

  it('can draw with Lucky Egg before Infinite Shadow returns Gengar', () => {
    const { store, player1, player2, overridePrompt } = game({ card: gengar, tools: ['Lucky Egg SSH'] }, { prizeCount: 1 });
    const victim = player2.active.getPokemonCard()!;
    const choose = jasmine.createSpy('choose Lucky Egg first').and.callFake((prompt: SelectPrompt) =>
      prompt.values.indexOf('Lucky Egg'));
    overridePrompt('Select', choose);
    store.dispatch(new AttackAction(player1.id, bolt));
    expect(choose).toHaveBeenCalledTimes(1);
    expect(player2.hand.cards.length).toBe(8);
    expect(player2.hand.cards).toContain(victim);
    expect(store.state.phase).toBe(GamePhase.FINISHED);
  });
});
