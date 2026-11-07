import { Card, EnergyCard, EnergyType, GamePhase, Player, PlayerType, PokemonCard,
  SlotType, State, TrainerCard, TrainerType } from 'ptcg-server';
import { buildHandStacks, handCardKey } from './hand-layout';
import { HandComponent } from './hand.component';

class TestPokemon extends PokemonCard {
  name = 'Pikachu'; fullName = 'Pikachu TEST'; set = 'TEST'; hp = 60;
}
class TestTrainer extends TrainerCard {
  name = 'Trainer'; fullName = 'Trainer TEST'; set = 'TEST';
}
class TestEnergy extends EnergyCard {
  name = 'Energy'; fullName = 'Energy TEST'; set = 'TEST';
}
function items(cards: Card[]) {
  return cards.map((card, index) => { card.id = index + 10; return { card, index, scanUrl: '' }; });
}

describe('stacked hand', () => {
  it('renders playable Trainer stacks from the serialized Phantom Maze engine state', () => {
    const fs = require('node:fs'), zlib = require('node:zlib'), path = require('node:path');
    const { ClientSimulator } = require('ptcg-server/client');
    const { Base64, StateSerializer } = require('ptcg-server');
    const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.resolve(__dirname,
      '../../../../../tools/fixtures/phantom-maze.snapshot.json.gz'))).toString('utf8'));
    const simulator = new ClientSimulator();
    simulator.loadSnapshot(snapshot);
    const state = new StateSerializer().deserialize(new Base64().decode(simulator.getStateData()));
    const hand = new HandComponent({ getScanUrl: () => '' } as any, {} as any);
    hand.player = state.players[0]; hand.clientId = hand.player.id;
    hand.gameState = { state, gameId: 1, deleted: false, promptMinimized: false, turnComplete: false } as any;
    hand.ngOnChanges();
    const trainers = hand.stacks.filter(stack => stack.card instanceof TrainerCard);
    expect(trainers.map(stack => stack.card.name)).toEqual(['Cyrano', "N's PP Up", 'Secret Box', 'Transformation Tome']);
    expect(trainers.map(stack => stack.copies.length)).toEqual([1, 2, 1, 2]);
    expect(trainers.every(stack => stack.playable)).toBe(true);
    expect(state.prompts.length).toBe(0);
    expect(simulator.canUndo()).toBe(false);
    simulator.cleanup();
  });

  it('groups actual alternate-art Pokemon, Trainer reprints, and basic energy prints', () => {
    const source = (name: string) => require('../../../../../ptcg-server/browser/sets/' + name);
    const { Ralts } = source('set-scarlet-and-violet/ralts');
    const { NestBall } = source('set-scarlet-and-violet/nest-ball');
    const { RaltsIR, NestBallHR } = source('set-scarlet-and-violet/full-art');
    const BaseFire = source('set-base-set-energy/fire-energy').FireEnergy;
    const ModernFire = source('set-scarlet-and-violet-energy/fire-energy').FireEnergy;
    const hand = items([new ModernFire(), new NestBall(), new RaltsIR(),
      new BaseFire(), new Ralts(), new NestBallHR()]);
    const before = hand.map(item => item.card);
    const stacks = buildHandStacks(hand, [], false);
    expect(stacks.map(stack => stack.card.name)).toEqual(['Ralts', 'Nest Ball', 'Fire Energy']);
    expect(stacks.map(stack => stack.copies.length)).toEqual([2, 2, 2]);
    expect(hand.map(item => item.card)).toEqual(before);
    expect(stacks.map(stack => stack.index)).toEqual([2, 1, 0]);
  });

  it('keeps same-name Pokemon with different attacks, HP, or implemented effects separate', () => {
    const differentHP = new TestPokemon(); differentHP.hp = 70;
    const differentAttack = new TestPokemon();
    differentAttack.attacks = [{ name: 'Zap', damage: 20, cost: [], text: '' }];
    class OtherEffect extends TestPokemon {
      reduceEffect(store: any, state: State): State { return state; }
    }
    expect(buildHandStacks(items([new TestPokemon(), differentHP, differentAttack, new OtherEffect()]), [], false).length).toBe(4);
    const foil = new TestPokemon(); foil.tags = ['Holo'];
    expect(handCardKey(foil)).toBe(handCardKey(new TestPokemon()));
  });

  it('sorts Supporters, Items, Tools, Stadiums, then basic and special Energy', () => {
    const trainer = (type: TrainerType, name: string) => Object.assign(new TestTrainer(), { trainerType: type, name });
    const special = Object.assign(new TestEnergy(), { name: 'A special energy', energyType: EnergyType.SPECIAL });
    const hand = items([special, trainer(TrainerType.STADIUM, 'A stadium'),
      trainer(TrainerType.TOOL, 'A tool'), trainer(TrainerType.ITEM, 'Z item'),
      new TestEnergy(), trainer(TrainerType.SUPPORTER, 'Z supporter'),
      trainer(TrainerType.ITEM, 'A item'), new TestPokemon()]);
    expect(buildHandStacks(hand, [], false).map(stack => stack.card.name)).toEqual([
      'Pikachu', 'Z supporter', 'A item', 'Z item', 'A tool', 'A stadium', 'Energy', 'A special energy'
    ]);
  });

  it('uses a playable physical copy as the front and retains every original hand index', () => {
    const hand = items(Array.from({ length: 12 }, () => new TestPokemon()));
    const stack = buildHandStacks(hand, [hand[7].card.id], false)[0];
    expect(stack.playable).toBe(true);
    expect(stack.card).toBe(hand[7].card);
    expect(stack.index).toBe(7);
    expect(stack.copies.length).toBe(12);
    expect(stack.backingCards.length).toBe(2);
    expect(stack.copies.map(copy => copy.index)).toEqual(Array.from({ length: 12 }, (_, i) => i));
    expect(buildHandStacks(hand, [], false)[0].playable).toBe(false);
  });

  it('does not disclose grouping, order, or playability in a hidden hand', () => {
    const hand = items([new TestEnergy(), new TestPokemon(), new TestPokemon()]);
    const stacks = buildHandStacks(hand, hand.map(item => item.card.id), true);
    expect(stacks.map(stack => stack.index)).toEqual([0, 1, 2]);
    expect(stacks.every(stack => !stack.playable && stack.copies.length === 1)).toBe(true);
    expect(buildHandStacks([], [], false)).toEqual([]);
  });
});

describe('hand interactions', () => {
  let hand: HandComponent;
  let cards: any;
  let game: any;
  beforeEach(() => {
    cards = { getScanUrl: () => '', showCardInfo: jasmine.createSpy().and.returnValue(Promise.resolve(undefined)) };
    game = jasmine.createSpyObj('game', ['ability', 'reorderHandAction']);
    hand = new HandComponent(cards, game);
    hand.player = new Player(); hand.player.id = 43; hand.clientId = 43;
    hand.player.hand.cards = items([new TestEnergy(), new TestPokemon()]).map(item => item.card);
    const state = new State(); state.players = [hand.player, new Player()];
    state.activePlayer = 0; state.phase = GamePhase.PLAYER_TURN;
    hand.player.playableCardIds = hand.player.hand.cards.map(card => card.id);
    hand.gameState = { gameId: 99, state } as any;
    hand.ngOnChanges();
  });

  it('opens the displayed card with its artwork context and physical hand index for abilities', async () => {
    cards.showCardInfo.and.returnValue(Promise.resolve({ ability: 'Hand power' }));
    const front = hand.stacks[0];
    expect(front.index).toBe(1);
    hand.onCardClick(front.card, front.index);
    await Promise.resolve();
    expect(cards.showCardInfo.calls.mostRecent().args[0].cardList).toBe(hand.player.hand);
    expect(game.ability).toHaveBeenCalledWith(99, 'Hand power', {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 1
    });
    hand.handSpec.drop({} as any, {} as any);
    expect(game.reorderHandAction).not.toHaveBeenCalled();
  });

  it('clears playable hints during prompts, after completion, and on the other player turn', () => {
    expect(hand.stacks.every(stack => stack.playable)).toBe(true);
    hand.gameState.promptMinimized = true; hand.ngOnChanges();
    expect(hand.stacks.some(stack => stack.playable)).toBe(false);
    expect(hand.handSpec.canDrag(undefined, undefined, undefined)).toBe(false);
    hand.gameState.promptMinimized = false;
    hand.gameState.state.prompts = [{ result: undefined }] as any; hand.ngOnChanges();
    expect(hand.stacks.some(stack => stack.playable)).toBe(false);
    hand.gameState.state.prompts = []; hand.gameState.state.activePlayer = 1; hand.ngOnChanges();
    expect(hand.stacks.some(stack => stack.playable)).toBe(false);
    hand.gameState.state.activePlayer = 0; hand.gameState.turnComplete = true; hand.ngOnChanges();
    expect(hand.stacks.some(stack => stack.playable)).toBe(false);
    expect(hand.handSpec.canDrag(undefined, undefined, undefined)).toBe(false);
  });

  it('targets the physical card selected in the inspector, including another copy or artwork', async () => {
    const selected = hand.player.hand.cards[0];
    cards.showCardInfo.and.returnValue(Promise.resolve({ card: selected, ability: 'Selected power' }));
    hand.onCardClick(hand.stacks[0].card, hand.stacks[0].index);
    await Promise.resolve();
    expect(game.ability).toHaveBeenCalledWith(99, 'Selected power', {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0
    });
  });

  function touch(x: number, y: number): any {
    return { touches: [{ clientX: x, clientY: y }], stopPropagation: jasmine.createSpy() };
  }
  it('reserves horizontal swipes for scrolling and prevents accidental inspection after a swipe', () => {
    hand.onTouchStart(touch(100, 100));
    const swipe = touch(50, 101); hand.onTouchMove(swipe);
    expect(swipe.stopPropagation).toHaveBeenCalled();
    const diagonal = touch(45, 20); hand.onTouchMove(diagonal);
    expect(diagonal.stopPropagation).toHaveBeenCalled();
    hand.onTouchEnd();
    hand.onCardClick(hand.stacks[0].card, hand.stacks[0].index);
    expect(cards.showCardInfo).not.toHaveBeenCalled();
  });

  it('waits through touch jitter, then lets vertical drags reach the board backend', () => {
    hand.onTouchStart(touch(100, 200));
    const jitter = touch(102, 199); hand.onTouchMove(jitter);
    expect(jitter.stopPropagation).toHaveBeenCalled();
    const drag = touch(101, 160); hand.onTouchMove(drag);
    expect(drag.stopPropagation).not.toHaveBeenCalled();
    hand.onTouchEnd();
  });
});
