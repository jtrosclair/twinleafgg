'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ClientSimulator } = require('../ptcg-server/browser/client');
const { AttackAction, UseAbilityAction, UseStadiumAction, RetreatAction, PassTurnAction } = require('../ptcg-server/browser/game/store/actions/game-actions');
const { PlayCardAction, PlayerType, SlotType } = require('../ptcg-server/browser/game/store/actions/play-card-action');

const own = (slot = SlotType.ACTIVE, index = 0) => ({ player: PlayerType.BOTTOM_PLAYER, slot, index });
const opponent = (slot = SlotType.ACTIVE, index = 0) => ({ player: PlayerType.TOP_PLAYER, slot, index });

function snapshotFrom(value) {
  if (typeof value === 'string' && fs.existsSync(value)) value = JSON.parse(fs.readFileSync(value, 'utf8'));
  const puzzle = value.puzzle || value;
  const stateData = value.stateData || puzzle.stateData
    || decodeURIComponent(new URL(puzzle.newWebviewUrl || puzzle.webviewUrl).hash.slice(1));
  return { puzzle, stateData, sourceUrl: value.sourceUrl
    || (puzzle.id ? 'https://www.prizemap.app/api/puzzles/details/' + encodeURIComponent(puzzle.id) : undefined) };
}

function createSession(value) {
  const initial = snapshotFrom(value);
  const sim = new ClientSimulator();
  sim.loadSnapshot({ stateData: initial.stateData, winConditions: initial.puzzle.winConditions });
  const trace = [];
  const findCard = (cards, selector) => {
    const card = cards.find(card => typeof selector === 'number' ? card.id === selector : card.fullName === selector);
    if (!card) throw new Error('Card not found: ' + selector);
    return card;
  };
  const pending = type => {
    const prompts = sim.state.prompts.filter(prompt => prompt.result === undefined && prompt.playerId === sim.humanPlayerId);
    if (type === undefined) return prompts;
    const prompt = prompts.find(prompt => prompt.type === type || prompt.constructor.name === type);
    if (!prompt) throw new Error('Missing prompt ' + type + '; pending: ' + prompts.map(prompt => prompt.type).join(', '));
    return prompt;
  };
  const record = (step, run) => {
    run();
    trace.push({ ...step, after: { turn: sim.state.turn, phase: sim.state.phase, activePlayer: sim.state.activePlayer,
      prizes: sim.state.players.map(player => player.getPrizeLeft()), complete: sim.complete } });
    return session;
  };
  const session = {
    sim, initial, trace, own, opponent, SlotType,
    get state() { return sim.state; },
    pending,
    play(selector, target = own(SlotType.BOARD)) {
      const card = findCard(sim.state.players[0].hand.cards, selector);
      const handIndex = sim.state.players[0].hand.cards.indexOf(card);
      return record({ kind: 'play', cardId: card.id, card: card.fullName, handIndex, target },
        () => sim.dispatch(new PlayCardAction(sim.humanPlayerId, handIndex, target)));
    },
    ability(name, target = own()) {
      return record({ kind: 'ability', name, target }, () => sim.dispatch(new UseAbilityAction(sim.humanPlayerId, name, target)));
    },
    attack(name) { return record({ kind: 'attack', name }, () => sim.dispatch(new AttackAction(sim.humanPlayerId, name))); },
    stadium() { return record({ kind: 'stadium' }, () => sim.dispatch(new UseStadiumAction(sim.humanPlayerId))); },
    retreat(index) { return record({ kind: 'retreat', index }, () => sim.dispatch(new RetreatAction(sim.humanPlayerId, index))); },
    pass() { return record({ kind: 'pass' }, () => sim.dispatch(new PassTurnAction(sim.humanPlayerId))); },
    resolve(result, prompt = pending()[0]) {
      if (!prompt) throw new Error('No unresolved human prompt');
      const selection = {};
      if (prompt.type === 'Choose cards' && Array.isArray(result)) {
        selection.selectedCardIds = result.map(index => prompt.cards.cards[index].id);
        selection.selectedCards = result.map(index => prompt.cards.cards[index].fullName);
      } else if (prompt.type === 'Choose energy' && Array.isArray(result)) {
        selection.selectedEnergyIds = result.map(index => prompt.energy[index].card.id);
      } else if (prompt.type === 'Attach energy' && Array.isArray(result)) {
        selection.energyAssignments = result.map(item => ({ cardId: prompt.cardList.cards[item.index].id, to: item.to }));
      } else if (prompt.type === 'Choose attack' && result !== null) {
        selection.attackSourceCardId = prompt.cards[result.index].id;
      }
      return record({ kind: 'resolve', promptId: prompt.id, promptType: prompt.type, result, ...selection }, () => sim.resolvePrompt(prompt.id, result));
    },
    chooseCards(selectors) {
      const prompt = pending('Choose cards');
      const available = prompt.cards.cards.map((card, index) => ({ card, index }));
      const indexes = selectors.map(selector => {
        const index = available.findIndex(({ card }) => typeof selector === 'number' ? card.id === selector : card.fullName === selector);
        if (index === -1) throw new Error('Card missing from choice: ' + selector);
        return available.splice(index, 1)[0].index;
      });
      return session.resolve(indexes, prompt);
    },
    choosePokemon(targets) { return session.resolve(targets, pending('Choose pokemon')); },
    attach(selector, to) {
      const prompt = pending('Attach energy');
      const card = findCard(prompt.cardList.cards, selector);
      return session.resolve([{ index: prompt.cardList.cards.indexOf(card), to }], prompt);
    },
    chooseAttack(selector, attack) {
      const prompt = pending('Choose attack');
      const card = findCard(prompt.cards, selector);
      return session.resolve({ index: prompt.cards.indexOf(card), attack }, prompt);
    },
    summary() {
      return { title: initial.puzzle.name, turn: sim.state.turn, phase: sim.state.phase, winner: sim.state.winner,
        complete: sim.complete, players: sim.state.players.map(player => ({ id: player.id,
          active: player.active.getPokemonCard()?.fullName, hand: player.hand.cards.map(card => [card.id, card.fullName]),
          deck: player.deck.cards.length, prizes: player.getPrizeLeft(),
          bench: player.bench.map((list, index) => ({ index, name: list.getPokemonCard()?.fullName,
            energy: list.cards.filter(card => card.superType === 3).map(card => card.fullName), damage: list.damage })) })),
        pending: pending().map(prompt => ({ id: prompt.id, type: prompt.type, message: prompt.message,
          cards: Array.isArray(prompt.cards) ? prompt.cards.map(card => [card.id, card.fullName]) : prompt.cards?.cards?.map(card => [card.id, card.fullName]) })) };
    },
    save(file) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify({ name: initial.puzzle.name, sourceUrl: initial.sourceUrl, stateData: initial.stateData,
        trace, terminal: session.summary() }, null, 2));
    }
  };
  return session;
}

function replay(value, steps) {
  const session = createSession(value);
  for (const step of steps) {
    if (step.kind === 'play') session.play(step.cardId, step.target);
    else if (step.kind === 'ability') session.ability(step.name, step.target);
    else if (step.kind === 'attack') session.attack(step.name);
    else if (step.kind === 'stadium') session.stadium();
    else if (step.kind === 'retreat') session.retreat(step.index);
    else if (step.kind === 'pass') session.pass();
    else if (step.kind === 'resolve') {
      const prompt = session.pending().find(prompt => prompt.id === step.promptId && prompt.type === step.promptType);
      if (!prompt) throw new Error('Recorded prompt is not pending: ' + step.promptType + ' #' + step.promptId);
      const indexFor = (cards, id) => {
        const index = cards.findIndex(card => card.id === id);
        if (index === -1) throw new Error('Recorded card is not in the current prompt: ' + id);
        return index;
      };
      let result = step.result;
      // A legitimate shuffle can reorder alternate printings with the same name.
      // Preserve the chosen physical cards, rather than depending on old row indexes.
      if (step.selectedCardIds) result = step.selectedCardIds.map(id => indexFor(prompt.cards.cards, id));
      else if (step.selectedEnergyIds) result = step.selectedEnergyIds.map(id => indexFor(prompt.energy.map(item => item.card), id));
      else if (step.energyAssignments) result = step.energyAssignments.map(item => ({ index: indexFor(prompt.cardList.cards, item.cardId), to: item.to }));
      else if (step.attackSourceCardId !== undefined) result = { ...step.result, index: indexFor(prompt.cards, step.attackSourceCardId) };
      session.resolve(result, prompt);
    }
    else throw new Error('Unknown step ' + step.kind);
  }
  return session;
}

module.exports = { createSession, snapshotFrom, replay, own, opponent, SlotType };
