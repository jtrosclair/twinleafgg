#!/usr/bin/env node
'use strict';

// Node DOM simulation, not a native WKWebView/browser gesture test. Exercise the
// installed TouchBackend with the real Angular card template and its original
// touched IMG as the target for the entire gesture. No network or new packages.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test } = require('node:test');
const { JSDOM } = require('./node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const frontend = name => require(path.join(root, 'ptcg-play/node_modules', name));
const backendRoot = path.join(root, 'ptcg-play/node_modules/@ng-dnd/multi-backend/node_modules');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://sim.example/' });
for (const name of ['window', 'document', 'Node', 'HTMLElement', 'Element', 'MutationObserver']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
globalThis.removeEventListener = dom.window.removeEventListener.bind(dom.window);

// Use the same generated browser classes as the frontend service test runner.
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  if (request === 'ptcg-server') request = path.join(root, 'ptcg-server/browser/browser.js');
  if (request === 'ptcg-server/client') request = path.join(root, 'ptcg-server/browser/client/index.js');
  return resolveFilename.call(this, request, parent, ...args);
};
require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
  project: path.join(root, 'ptcg-play/tsconfig.json'), transpileOnly: true,
  compilerOptions: { module: 'commonjs', target: 'es2018', experimentalDecorators: true }
});
frontend('@angular/compiler');
const core = frontend('@angular/core');
const { NgIf, NgClass } = frontend('@angular/common');
const { ɵDomRendererFactory2 } = frontend('@angular/platform-browser');
const { of, Subject } = frontend('rxjs');
const { CardComponent } = require('../ptcg-play/src/app/shared/cards/card/card.component.ts');
const { CardsBaseService } = require('../ptcg-play/src/app/shared/cards/cards-base.service.ts');
const { SettingsService } = require('../ptcg-play/src/app/shared/services/settings.service.ts');
const { SimulatorAssetsService } = require('../ptcg-play/src/app/shared/services/simulator-assets.service.ts');
const { ImageCacheDirective } = require('../ptcg-play/src/app/shared/image-cache/image-cache.directive.ts');
const { GameService } = require('../ptcg-play/src/app/api/services/game.service.ts');
const { SessionService } = require('../ptcg-play/src/app/shared/session/session.service.ts');
const { BoardInteractionService } = require('../ptcg-play/src/app/shared/services/board-interaction.service.ts');
const { HandComponent } = require('../ptcg-play/src/app/table/hand/hand.component.ts');
const { own, SlotType } = require('./puzzle-playthrough-core.cjs');
const { createDragDropManager } = require(path.join(backendRoot, 'dnd-core'));
const { TouchBackend } = require(path.join(backendRoot, 'react-dnd-touch-backend'));
const scan = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';

// Select the Ivy DI implementations which ngcc selects in the browser build.
core.ElementRef.__NG_ELEMENT_ID__ = core.ɵSWITCH_ELEMENT_REF_FACTORY__POST_R3__;
core.TemplateRef.__NG_ELEMENT_ID__ = core.ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__;
core.ViewContainerRef.__NG_ELEMENT_ID__ = core.ɵSWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__;
core.Renderer2.__NG_ELEMENT_ID__ = core.ɵSWITCH_RENDERER2_FACTORY__POST_R3__;
// Common's Node UMD entry is View Engine; the application uses its ngcc Ivy
// entry. JIT the same installed directive classes without changing node_modules.
for (const directive of [NgIf, NgClass]) {
  if (!directive.ɵdir) core.ɵcompileDirective(directive, directive.decorators[0].args[0]);
}
// ts-node does not emit ngc's constructor metadata in this isolated runner.
CardComponent.ctorParameters = () => [CardsBaseService, SettingsService, SimulatorAssetsService].map(type => ({ type }));
ImageCacheDirective.ctorParameters = () => [{ type: SimulatorAssetsService }];
core.ɵcompileDirective(ImageCacheDirective, {
  selector: '[ptcgImageCache]', host: { loading: 'lazy', decoding: 'async' }
});
const cardTemplate = fs.readFileSync(path.join(root, 'ptcg-play/src/app/shared/cards/card/card.component.html'), 'utf8');

function renderCard({ legacyPlaceholderGate = false } = {}) {
  // Recompile only in memory so the negative control renders the previous real
  // Angular gate, rather than manually simulating the removal in a callback.
  const template = legacyPlaceholderGate
    ? cardTemplate.replace('*ngIf="!cardback"', '*ngIf="!cardback && !placeholder"')
    : cardTemplate;
  if (legacyPlaceholderGate) assert.notEqual(template, cardTemplate);
  core.ɵcompileComponent(CardComponent, { selector: 'ptcg-card', template, styles: [] });
  core.ɵɵsetComponentScope(CardComponent, [NgIf, NgClass, ImageCacheDirective], []);
  const host = document.createElement('ptcg-card');
  document.body.appendChild(host);
  const injector = core.Injector.create({ providers: [
    { provide: CardsBaseService, useValue: { getScanUrl: () => scan, overridesChanged$: new Subject() } },
    { provide: SettingsService, useValue: { holoEnabled$: of(false), showCardName$: of(false) } },
    { provide: SimulatorAssetsService, useValue: { resolve: value => value,
      imageSource: value => value, fallbackImage() {} } },
    { provide: core.IterableDiffers, useValue: core.ɵdefaultIterableDiffers },
    { provide: core.KeyValueDiffers, useValue: core.ɵdefaultKeyValueDiffers }
  ] });
  const rendererFactory = new ɵDomRendererFactory2({ addEventListener(element, name, listener) {
    element.addEventListener(name, listener);
    return () => element.removeEventListener(name, listener);
  } }, { addStyles() {} }, 'touch-test');
  const component = core.ɵrenderComponent(CardComponent, { host, injector, rendererFactory });
  component.card = { id: 73, name: 'Touch card', fullName: 'Touch card TEST', tags: [], set: 'TEST', setNumber: '1' };
  core.ɵdetectChanges(component);
  return { host, component, detect: () => core.ɵdetectChanges(component), destroy() {
    component.ngOnDestroy();
    host.remove();
  } };
}

function dispatchTouch(target, type, x, y) {
  const touch = { identifier: 1, target, clientX: x, clientY: y, pageX: x, pageY: y };
  const event = new window.Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    touches: { value: type === 'touchend' ? [] : [touch] },
    targetTouches: { value: type === 'touchend' ? [] : [touch] },
    changedTouches: { value: [touch] }
  });
  target.dispatchEvent(event);
}

function connectTouchDrag(view, options = {}) {
  const manager = createDragDropManager(TouchBackend, { window, document }, { enableMouseEvents: false });
  const backend = manager.getBackend();
  const registry = manager.getRegistry();
  const monitor = manager.getMonitor();
  const drops = [], ends = [];
  const target = document.createElement('div');
  const targetChild = document.createElement('span');
  target.appendChild(targetChild);
  document.body.appendChild(target);
  const sourceId = registry.addSource('HAND_CARD', {
    canDrag: () => options.canDrag ? options.canDrag() : true,
    beginDrag: () => ({ type: 'HAND_CARD', data: options.handItem ? options.handItem() : { card: view.component.data, index: 0 } }),
    isDragging: current => current.getSourceId() === sourceId,
    endDrag: current => {
      ends.push(current.didDrop());
      if (options.endDrag) options.endDrag(current.getItem());
    }
  });
  const targetId = registry.addTarget('HAND_CARD', {
    canDrop: () => true, hover() {},
    drop: current => {
      const item = current.getItem();
      drops.push(item.data.card.id);
      if (options.drop) options.drop(item);
      return {};
    }
  });
  const sourceDisconnect = backend.connectDragSource(sourceId, view.host);
  const targetDisconnect = backend.connectDropTarget(targetId, target);
  view.host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 88, height: 120 });
  document.elementFromPoint = (x, y) => x >= 100 && y >= 100 ? targetChild : view.host;
  document.elementsFromPoint = (x, y) => x >= 100 && y >= 100 ? [targetChild, target, document.body] : [view.host, document.body];
  let wasDragging = false;
  const unsubscribe = monitor.subscribeToStateChange(() => {
    const dragging = monitor.isDragging();
    if (dragging === wasDragging) return;
    wasDragging = dragging;
    view.component.placeholder = dragging;
    view.detect();
  });
  return { monitor, drops, ends, manager, destroy() {
    unsubscribe();
    if (monitor.isDragging()) manager.getActions().endDrag();
    sourceDisconnect(); targetDisconnect();
    registry.removeTarget(targetId); registry.removeSource(sourceId);
    backend.teardown(); target.remove();
  } };
}

test('real Angular card keeps touched images while dragging and still hides face-down artwork', () => {
  const view = renderCard();
  try {
    view.component.customArtworkUrl = scan;
    view.detect();
    const images = [...view.host.querySelectorAll('img')];
    const sources = images.map(image => image.getAttribute('src'));
    assert.equal(images.length, 2);
    for (const image of images) {
      assert.equal(image.getAttribute('loading'), 'lazy');
      assert.equal(image.getAttribute('decoding'), 'async');
    }
    view.component.placeholder = true;
    view.detect();
    assert.deepEqual([...view.host.querySelectorAll('img')], images);
    assert.ok(images.every(image => image.isConnected));
    assert.deepEqual(images.map(image => image.getAttribute('src')), sources);
    view.component.placeholder = false;
    view.detect();
    assert.deepEqual([...view.host.querySelectorAll('img')], images);
    view.component.cardback = true;
    view.detect();
    assert.equal(view.host.querySelectorAll('img').length, 0);
    assert.equal(view.host.querySelector('.holo-overlay'), null);
  } finally { view.destroy(); }
});

test('installed TouchBackend drops on the first gesture and accepts a second gesture from the same image', () => {
  const view = renderCard();
  const image = view.host.querySelector('img');
  const drag = connectTouchDrag(view);
  try {
    for (let gesture = 1; gesture <= 2; gesture++) {
      dispatchTouch(image, 'touchstart', 10, 10);
      dispatchTouch(image, 'touchmove', 150, 150);
      assert.equal(drag.monitor.isDragging(), true, 'first movement must begin the drag');
      assert.equal(view.host.querySelector('img'), image, 'placeholder must preserve the original touch target');
      assert.equal(image.isConnected, true);
      // All following touch events retain their original touchstart target.
      dispatchTouch(image, 'touchmove', 160, 160);
      dispatchTouch(image, 'touchend', 160, 160);
      assert.equal(drag.monitor.isDragging(), false, 'touchend must reach the document backend');
      assert.deepEqual(drag.drops, Array(gesture).fill(73));
      assert.deepEqual(drag.ends, Array(gesture).fill(true));
      assert.equal(view.component.placeholder, false);
    }
  } finally { drag.destroy(); view.destroy(); }
});

test('negative control: the previous Angular placeholder gate strands the installed touch backend', () => {
  const view = renderCard({ legacyPlaceholderGate: true });
  const image = view.host.querySelector('img');
  const drag = connectTouchDrag(view);
  try {
    dispatchTouch(image, 'touchstart', 10, 10);
    dispatchTouch(image, 'touchmove', 150, 150);
    assert.equal(image.isConnected, false);
    dispatchTouch(image, 'touchmove', 160, 160);
    dispatchTouch(image, 'touchend', 160, 160);
    assert.equal(drag.monitor.isDragging(), true);
    assert.deepEqual(drag.drops, []);
    assert.deepEqual(drag.ends, []);
  } finally { drag.destroy(); view.destroy(); }
});

test('hand horizontal swipes bypass TouchBackend, then the next vertical gesture still drops', () => {
  const view = renderCard();
  const hand = new HandComponent({}, {});
  const viewport = document.createElement('div');
  document.body.appendChild(viewport);
  viewport.appendChild(view.host);
  viewport.addEventListener('touchstart', event => hand.onTouchStart(event));
  viewport.addEventListener('touchmove', event => hand.onTouchMove(event));
  viewport.addEventListener('touchend', () => hand.onTouchEnd());
  const image = view.host.querySelector('img');
  const drag = connectTouchDrag(view);
  try {
    dispatchTouch(image, 'touchstart', 10, 10);
    dispatchTouch(image, 'touchmove', 80, 12);
    assert.equal(drag.monitor.isDragging(), false, 'horizontal movement must remain native scrolling');
    dispatchTouch(image, 'touchmove', 150, 150);
    assert.equal(drag.monitor.isDragging(), false, 'scroll gesture must stay scrolling after direction changes');
    dispatchTouch(image, 'touchend', 150, 150);
    assert.deepEqual(drag.drops, []);
    dispatchTouch(image, 'touchstart', 10, 10);
    dispatchTouch(image, 'touchmove', 12, 80);
    assert.equal(drag.monitor.isDragging(), true, 'next vertical gesture must start a drag');
    dispatchTouch(image, 'touchmove', 160, 160);
    dispatchTouch(image, 'touchend', 160, 160);
    assert.equal(drag.monitor.isDragging(), false);
    assert.deepEqual(drag.drops, [73]);
    assert.deepEqual(drag.ends, [true]);
    assert.equal(image.isConnected, true);
  } finally { drag.destroy(); view.destroy(); viewport.remove(); }
});

for (const [promotionIndex, promotedName] of [
  'Genesect ex SV11B', 'Gimmighoul SSP', 'Solrock M1L', 'Gimmighoul SSP', 'Gimmighoul SSP'
].entries()) {
test(`exact Dengo active Turo and promotion ${promotionIndex} (${promotedName}) unlock the hand for first-touch Nest Ball`, () => {
  const fixture = JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync(
    path.join(root, 'tools/fixtures/deck-out-with-dengo.snapshot.json.gz'))).toString('utf8'));
  const session = new SessionService(), errors = [], messages = [];
  const service = new GameService({ toast: message => errors.push(message) }, session,
    { currentLang: 'en', translations: { en: { GAME_MESSAGES: {} } }, instant: key => key },
    new BoardInteractionService(), { run: fn => fn() }, { postMessage: message => messages.push(message) }, { closeAll() {} });
  let gameId;
  service.createGameFromState(fixture.stateData).subscribe(game => { gameId = game.gameId; });
  const hand = new HandComponent({ getScanUrl: () => scan }, service);
  const view = renderCard();
  const current = () => session.session.gameStates[0];
  const pending = () => current().state.prompts.filter(prompt => prompt.result === undefined);
  const handIndex = id => current().state.players[0].hand.cards.findIndex(card => card.id === id);
  const subscription = session.get(value => value.gameStates[0]).subscribe(game => {
    if (!game) return;
    hand.gameState = game;
    hand.player = game.state.players[0];
    hand.clientId = session.session.clientId;
    hand.ngOnChanges();
    const nest = hand.player.hand.cards.find(card => card.id === 6);
    if (nest) { view.component.card = nest; view.detect(); }
  });
  let drag;
  try {
    assert.equal(current().state.players[0].active.getPokemonCard().fullName, 'Gholdengo ex PAR');
    assert.equal(hand.handSpec.canDrag(), true);
    service.playCardAction(gameId, handIndex(7), own(SlotType.BOARD));
    assert.equal(pending()[0].message, 'CHOOSE_POKEMON_TO_PICK_UP');
    // ChoosePokemon's board UI minimizes its overlay while selecting a target.
    service.setPromptMinimized(current().localId, true);
    assert.equal(hand.handSpec.canDrag(), false);
    service.resolvePrompt(gameId, pending()[0].id, [own(SlotType.ACTIVE)]);
    assert.equal(pending()[0].message, 'CHOOSE_NEW_ACTIVE_POKEMON');
    service.setPromptMinimized(current().localId, true);
    assert.equal(hand.handSpec.canDrag(), false);
    service.resolvePrompt(gameId, pending()[0].id, [own(SlotType.BENCH, promotionIndex)]);
    assert.equal(current().state.players[0].active.getPokemonCard().fullName, promotedName);
    assert.deepEqual(pending(), []);
    assert.equal(current().promptMinimized, false, 'completed board selection must clear its stale presentation flag');
    assert.equal(hand.handSpec.canDrag(), true, 'real HandComponent must allow the next card drag');
    assert.ok(hand.player.hand.cards.some(card => card.id === 53));
    assert.ok(hand.player.hand.cards.some(card => card.id === 54));
    const image = view.host.querySelector('img');
    const sourceUrl = image.getAttribute('src');
    drag = connectTouchDrag(view, {
      canDrag: () => hand.handSpec.canDrag(),
      handItem: () => hand.list.find(item => item.card.id === 6),
      drop: item => service.playCardAction(gameId, item.data.index, own(SlotType.BOARD)),
      endDrag: item => hand.handSpec.endDrag(item)
    });
    dispatchTouch(image, 'touchstart', 10, 10);
    dispatchTouch(image, 'touchmove', 150, 150);
    assert.equal(drag.monitor.isDragging(), true);
    assert.equal(image.isConnected, true);
    assert.equal(image.getAttribute('src'), sourceUrl);
    dispatchTouch(image, 'touchmove', 160, 160);
    dispatchTouch(image, 'touchend', 160, 160);
    assert.equal(drag.monitor.isDragging(), false);
    assert.deepEqual(drag.drops, [6]);
    assert.deepEqual(drag.ends, [true]);
    assert.deepEqual(errors, []);
    assert.equal(pending().length, 1);
    assert.equal(pending()[0].type, 'Choose cards');
    assert.equal(pending()[0].message, 'CHOOSE_CARD_TO_PUT_ONTO_BENCH');
    assert.equal(current().state.turn, 5);
    assert.equal(messages.some(message => message.type === 'TurnEnd' || message.type === 'GameOver'), false);
  } finally {
    if (drag) drag.destroy();
    subscription.unsubscribe();
    view.destroy();
  }
});
}
