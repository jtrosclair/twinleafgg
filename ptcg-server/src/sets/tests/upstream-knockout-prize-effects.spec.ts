import { GameMessage } from '../../game/game-message';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, PlayCardAction, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { GameWinner, State } from '../../game/store/state/state';
import { PokemonSlotConfig, SetupGameResult, padDeck, setupGame } from './test-helpers';

const dark = 'Darkness Energy SVE';
const fire = 'Fire Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const water = 'Water Energy SVE';
const mew = 'Mew ex MEW';
const komala = 'Komala LOR 149';
const jynx = 'Jynx SIT 62';
const lostCity = 'Lost City LOR';
const recycle = 'Recycle Energy UNM';
const photonBlaster = 'Photon Blaster';
const miraidon = { card: 'Miraidon ex SVI', energy: [lightning, lightning, dark] };
const moon = { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
const ironHands = { card: 'Iron Hands ex PAR', energy: [lightning, dark, fire, water] };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { ...ownBench, slot: SlotType.ACTIVE };

function battle(active: PokemonSlotConfig, {
  attacker = miraidon as PokemonSlotConfig, replacement = mew, prizeCount = 5,
  deck = padDeck(12, fire), hand = [] as string[], stadium = false,
  defenderBench = [{ card: 'Pecharunt ex SFA' }] as PokemonSlotConfig[]
} = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: attacker, bench: [{ card: replacement }], hand: stadium ? [lostCity] : [],
      deck: padDeck(12), prizeCount },
    player2: { active, bench: defenderBench, deck, hand }
  });
  if (stadium) game.player1.hand.moveTo(game.player1.stadium);
  return game;
}

function watchPrizes(game: SetupGameResult, verify: () => void) {
  const reduce = game.store.reduceEffect.bind(game.store);
  const observer = jasmine.createSpy('take Prizes').and.callFake(verify);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CheckPrizesDestinationEffect) observer();
    return reduce(state, effect);
  });
  return observer;
}

describe('Knock Out searches, Prize protection, and return-to-hand Abilities', () => {
  for (const { card, max } of [{ card: 'Gengar CRE', max: 2 }, { card: 'Manaphy PLS', max: 1 }]) {
    it(`${card} does not search after Frenzied Gouging`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card }, { attacker: moon });
      const search = jasmine.createSpy('search deck').and.returnValue([0]);
      overridePrompt('Confirm', () => true);
      overridePrompt('Choose cards', search);
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(search).not.toHaveBeenCalled();
      expect(player2.hand.cards.length).toBe(1);
      expect(player1.getPrizeLeft()).toBe(4);
    });

    for (const take of [0, max]) {
      it(`${card} may take ${take} cards and shuffles before the final Prize`, () => {
        const game = battle({ card }, { prizeCount: 1 });
        const { store, player1, player2, overridePrompt } = game;
        const picked = player2.deck.cards.slice(0, take);
        const remaining = player2.deck.cards.slice(take).reverse();
        const checked = watchPrizes(game, () => {
          expect(player2.hand.cards).toEqual(picked);
          expect(player2.deck.cards).toEqual(remaining);
        });
        overridePrompt('Choose cards', prompt => {
          const search = prompt as ChooseCardsPrompt;
          expect(search.playerId).toBe(player2.id);
          expect(search.message).toBe(GameMessage.CHOOSE_CARD_TO_HAND);
          expect(search.options.min).toBe(0);
          expect(search.options.max).toBe(max);
          expect(player2.active.getPokemonCard()?.fullName).toBe(card);
          return picked.map((_, index) => index);
        });
        overridePrompt('Shuffle deck', () => remaining.map((_, index) => remaining.length - index - 1));
        store.dispatch(new AttackAction(player1.id, photonBlaster));
        expect(checked).toHaveBeenCalledTimes(1);
        expect(store.state.winner).toBe(GameWinner.PLAYER_1);
      });
    }

    it(`${card} does not search if Flutter Mane blocks its Ability`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card, damage: 110 }, {
        attacker: { card: 'Flutter Mane TEF', energy: [dark, dark, dark] }, defenderBench: []
      });
      const search = jasmine.createSpy('search deck').and.returnValue([0]);
      overridePrompt('Choose cards', search);
      store.dispatch(new AttackAction(player1.id, 'Hex Hurl'));
      expect(search).not.toHaveBeenCalled();
      expect(player2.discard.cards.map(c => c.fullName)).toContain(card);
      expect(player1.getPrizeLeft()).toBe(4);
    });
  }

  it('takes a Prize for a sleeping Komala knocked out by Frenzied Gouging', () => {
    const { store, player1, player2 } = battle({ card: komala }, { attacker: moon });
    player2.active.specialConditions.push(SpecialCondition.ASLEEP);
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(player1.getPrizeLeft()).toBe(4);
  });

  for (const asleep of [true, false]) {
    it(`takes ${asleep ? 'zero' : 'two'} Prizes for Amp You Very Much when Komala is ${asleep ? 'asleep' : 'awake'}`, () => {
      const { store, player1, player2 } = battle({ card: komala }, { attacker: ironHands });
      if (asleep) player2.active.specialConditions.push(SpecialCondition.ASLEEP);
      store.dispatch(new AttackAction(player1.id, 'Amp You Very Much'));
      expect(player1.getPrizeLeft()).toBe(asleep ? 5 : 3);
      expect(player2.discard.cards.map(c => c.fullName)).toContain(komala);
    });
  }

  it('checks Komala after the attack puts it to sleep', () => {
    const { store, player1 } = battle({ card: komala, damage: 80 }, {
      attacker: { card: 'Galarian Darmanitan FST 72', energy: [water, dark] }
    });
    store.dispatch(new AttackAction(player1.id, 'Powder Snow'));
    expect(player1.getPrizeLeft()).toBe(5);
  });

  it('takes a Prize when Whirlwind switches sleeping Komala to the Bench', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: komala, damage: 90 }, {
      attacker: { card: 'Murkrow GRI', energy: [dark] }
    });
    player2.active.specialConditions.push(SpecialCondition.ASLEEP);
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Whirlwind'));
    expect(player1.getPrizeLeft()).toBe(4);
    expect(player2.discard.cards.map(c => c.fullName)).toContain(komala);
  });

  for (const { attacker, attack, replacement, prizesLeft, damage } of [
    { attacker: { card: 'Zacian V SSH', energy: [metal, metal, metal] },
      attack: 'Brave Blade', replacement: undefined, prizesLeft: 5, damage: 0 },
    { attacker: { card: 'Regieleki V SIT', energy: [lightning] },
      attack: 'Switching Bolt', replacement: mew, prizesLeft: 5, damage: 80 },
    { attacker: { card: 'Mantine FST 61', energy: [water] },
      attack: 'Bounce', replacement: 'Arceus V BRS', prizesLeft: 4, damage: 80 },
    { attacker: { card: 'Greedent VMAX FST', energy: [water, dark] },
      attack: 'Turn a Profit', replacement: undefined, prizesLeft: 5, damage: 80 }
  ]) {
    it(`checks Selfish Lips against ${attack} from ${attacker.card}`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: jynx, damage }, { attacker, replacement });
      if (replacement) overridePrompt('Choose pokemon', () => [ownBench]);
      store.dispatch(new AttackAction(player1.id, attack));
      expect(player1.active.getPokemonCard()?.fullName).toBe(replacement ?? attacker.card);
      expect(player2.discard.cards.map(c => c.fullName)).toContain(jynx);
      expect(player1.getPrizeLeft()).toBe(prizesLeft);
    });
  }

  for (const { card, ability, previousStages } of [
    { card: 'Reuniclus SIT 78', ability: 'Persistent Cells', previousStages: ['Solosis SIT 76', 'Duosion SIT 77'] },
    { card: 'Aegislash UNM', ability: 'Durable Blade', previousStages: ['Honedge UNM', 'Doublade UNM'] }
  ]) {
    it(`${ability} returns the whole evolution stack before the last Prize`, () => {
      const castform = "Holon's Castform HP";
      const game = battle({ card, energy: [fire, water], tools: ['Gravity Gemstone SCR'] },
        { prizeCount: 1, hand: [...previousStages, castform] });
      const { store, player1, player2, overridePrompt } = game;
      const stage2 = player2.active.getPokemonCard()!;
      const previous = player2.hand.cards.splice(0, previousStages.length);
      player2.active.cards.unshift(...previous);

      const castformCard = player2.hand.cards[0];
      store.state.activePlayer = 1;
      overridePrompt('Choose pokemon', () => [ownActive]);
      store.dispatch(new UseAbilityAction(player2.id, castformCard.powers[0].name,
        { ...ownActive, slot: SlotType.HAND }));
      store.state.activePlayer = 0;
      expect(player2.active.energies.cards).toContain(castformCard);

      const attachments = [...player2.active.energies.cards, ...player2.active.tools];
      const expectedHand = [...player2.hand.cards, ...previous, stage2];
      const checked = watchPrizes(game, () => {
        expect(player2.hand.cards).toEqual(expectedHand);
        expect(player2.discard.cards).toEqual(jasmine.arrayContaining(attachments));
      });
      store.dispatch(new AttackAction(player1.id, photonBlaster));
      expect(checked).toHaveBeenCalledTimes(1);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });

    it(`${ability} does not rescue the Pokémon after Frenzied Gouging`, () => {
      const { store, player1, player2 } = battle({ card }, { attacker: moon });
      const victim = player2.active.getPokemonCard()!;
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(player2.discard.cards).toContain(victim);
      expect(player2.hand.cards).not.toContain(victim);
      expect(player1.getPrizeLeft()).toBe(4);
    });

    for (const rescueFirst of [true, false]) {
      it(`orders ${ability} and Lost City with the rescue ${rescueFirst ? 'first' : 'second'}`, () => {
        const { store, player1, player2, overridePrompt } = battle({ card, energy: [fire] }, { stadium: true });
        const victim = player2.active.getPokemonCard()!;
        const energy = player2.active.energies.cards[0];
        const choose = jasmine.createSpy('choose Knock Out order').and.callFake((prompt: SelectPrompt) => {
          expect(prompt.playerId).toBe(player1.id);
          expect(prompt.values).toEqual(jasmine.arrayContaining([ability, 'Lost City']));
          return prompt.values.indexOf(rescueFirst ? ability : 'Lost City');
        });
        overridePrompt('Select', choose);
        store.dispatch(new AttackAction(player1.id, photonBlaster));
        expect(choose).toHaveBeenCalledTimes(1);
        expect(player2.hand.cards.includes(victim)).toBe(rescueFirst);
        expect(player2.lostzone.cards.includes(victim)).toBe(!rescueFirst);
        expect(player2.discard.cards).toContain(energy);
        expect(player1.getPrizeLeft()).toBe(4);
      });
    }
  }

  it('returns an attached Recycle Energy by its own effect when Durable Blade resolves', () => {
    const { store, player1, player2 } = battle({ card: 'Aegislash UNM' }, { hand: [recycle] });
    const energy = player2.hand.cards[0];
    const aegislash = player2.active.getPokemonCard()!;
    store.state.activePlayer = 1;
    store.dispatch(new PlayCardAction(player2.id, 0, ownActive));
    store.state.activePlayer = 0;
    expect(player2.active.cards).toContain(energy);
    store.dispatch(new AttackAction(player1.id, photonBlaster));
    expect(player2.hand.cards).toEqual(jasmine.arrayContaining([aegislash, energy]));
    expect(player2.discard.cards).not.toContain(energy);
  });
});
