import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { Player } from '../../game/store/state/player';
import { GamePhase, State } from '../../game/store/state/state';
import { Base64 } from '../../utils/base64';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { CardManager } from '../../game/cards/card-manager';
import { ClientSimulator } from '../../client/simulator';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { ensureClientCards } from '../../client/cards';
import { CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';

const printed = [{"name":"Electrike AR 62","number":"62","set":"AR","hp":60,"type":"LIGHTNING","weakness":[{"type":"FIGHTING","value":10}],"resistance":[{"type":"METAL","value":-20}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Zap Kick","cost":["LIGHTNING"],"damage":10,"text":""},{"name":"Thunder Jolt","cost":["LIGHTNING","COLORLESS"],"damage":30,"text":"Flip a coin. If tails, Electrike does 10 damage to itself."}]},{"name":"Geodude AR","number":"65","set":"AR","hp":60,"type":"FIGHTING","weakness":[{"type":"GRASS","value":10}],"resistance":[{"type":"LIGHTNING","value":-20}],"retreat":["COLORLESS","COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Stone Barrage","cost":["FIGHTING"],"damage":10,"text":"Flip a coin until you get tails. This attack does 10 damage times the number of heads."}]},{"name":"Ponyta AR2","number":"72","set":"AR","hp":60,"type":"FIRE","weakness":[{"type":"WATER","value":10}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Tackle","cost":["COLORLESS"],"damage":10,"text":""},{"name":"Stomp","cost":["FIRE","COLORLESS"],"damage":10,"text":"Flip a coin. If heads, this attack does 10 damage plus 20 more damage."}]},{"name":"Rattata AR","number":"73","set":"AR","hp":30,"type":"COLORLESS","weakness":[{"type":"FIGHTING","value":10}],"resistance":[],"retreat":[],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Lunge","cost":["COLORLESS"],"damage":30,"text":"Flip a coin. If tails, this attack does nothing."}]},{"name":"Snorunt AR","number":"75","set":"AR","hp":50,"type":"WATER","weakness":[{"type":"METAL","value":10}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Ice Breath","cost":["COLORLESS"],"damage":0,"text":"Flip a coin. If heads, the Defending Pokémon is now Paralyzed."},{"name":"Double Headbutt","cost":["WATER","COLORLESS"],"damage":20,"text":"Flip 2 coins. This attack does 20 damage times the number of heads."}]},{"name":"Tangela AR 76","number":"76","set":"AR","hp":70,"type":"GRASS","weakness":[{"type":"FIRE","value":10}],"resistance":[{"type":"WATER","value":-20}],"retreat":["COLORLESS","COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Absorb","cost":["COLORLESS"],"damage":10,"text":"Remove 1 damage counter from Tangela."},{"name":"Sleep Powder","cost":["GRASS","COLORLESS"],"damage":20,"text":"The Defending Pokémon is now Asleep."}]},{"name":"Treecko AR 78","number":"78","set":"AR","hp":60,"type":"GRASS","weakness":[{"type":"FIRE","value":10}],"resistance":[{"type":"WATER","value":-20}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Tail Crush","cost":["COLORLESS","COLORLESS"],"damage":20,"text":"Flip a coin. If heads, this attack does 20 damage plus 10 more damage."}]},{"name":"Aron RR","number":"57","set":"RR","hp":50,"type":"METAL","weakness":[{"type":"FIRE","value":10}],"resistance":[{"type":"PSYCHIC","value":-20}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Iron Head","cost":["METAL"],"damage":10,"text":"Flip a coin until you get tails. This attack does 10 damage times the number of heads."},{"name":"Ram","cost":["COLORLESS","COLORLESS"],"damage":20,"text":""}]},{"name":"Rhydon SV","number":"80","set":"SV","hp":90,"type":"FIGHTING","weakness":[{"type":"WATER","value":20}],"resistance":[{"type":"LIGHTNING","value":-20}],"retreat":["COLORLESS","COLORLESS","COLORLESS"],"stage":"Stage 1","from":"Rhyhorn","delta":false,"attacks":[{"name":"Fury Attack","cost":["FIGHTING"],"damage":20,"text":"Flip 3 coins. This attack does 20 damage times the number of heads."},{"name":"Rock Tumble","cost":["FIGHTING","FIGHTING","COLORLESS"],"damage":60,"text":"This attack's damage isn't affected by Resistance."}]},{"name":"Plusle HSP","number":"16","set":"HSP","hp":60,"type":"LIGHTNING","weakness":[{"type":"FIGHTING"}],"resistance":[{"type":"METAL","value":-20}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Collect","cost":["COLORLESS"],"damage":0,"text":"Draw 2 cards."},{"name":"Thunder Jolt","cost":["LIGHTNING"],"damage":20,"text":"Flip a coin. If tails, Plusle does 10 damage to itself."}]},{"name":"Exeggcute HS","number":"63","set":"HS","hp":50,"type":"PSYCHIC","weakness":[{"type":"PSYCHIC"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Continuous Eggsplosion","cost":["COLORLESS"],"damage":10,"text":"Flip a coin until you get tails. This attack does 10 damage times the number of heads."}]},{"name":"Phanpy P2","number":"15","set":"P2","hp":50,"type":"FIGHTING","weakness":[{"type":"GRASS"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Double Spin","cost":["FIGHTING"],"damage":10,"text":"Flip 2 coins. This attack does 10 damage times the number of heads."},{"name":"Body Slam","cost":["COLORLESS","COLORLESS"],"damage":10,"text":"Flip a coin. If heads, the Defending Pokémon is now Paralyzed."}]},{"name":"Pikachu P2","number":"16","set":"P2","hp":40,"type":"LIGHTNING","weakness":[{"type":"FIGHTING"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Gnaw","cost":["COLORLESS"],"damage":10,"text":""},{"name":"Thunder Jolt","cost":["LIGHTNING","COLORLESS"],"damage":30,"text":"Flip a coin. If tails, Pikachu does 10 damage to itself."}]},{"name":"Ivysaur P3","number":"14","set":"P3","hp":70,"type":"GRASS","weakness":[{"type":"PSYCHIC"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Stage 1","from":"Bulbasaur","delta":false,"attacks":[{"name":"Gouge","cost":["COLORLESS"],"damage":10,"text":"Flip a coin. If heads, this attack does 10 damage plus 10 more damage."},{"name":"Poisonpowder","cost":["GRASS","COLORLESS","COLORLESS"],"damage":40,"text":"The Defending Pokémon is now Poisoned."}]},{"name":"Jolteon P3","number":"3","set":"P3","hp":70,"type":"LIGHTNING","weakness":[{"type":"FIGHTING"}],"resistance":[{"type":"METAL","value":-30}],"retreat":[],"stage":"Stage 1","from":"Eevee","delta":false,"attacks":[{"name":"Thundershock","cost":["LIGHTNING","COLORLESS"],"damage":20,"text":"Flip a coin. If heads, the Defending Pokémon is now Paralyzed."},{"name":"Pin Missile","cost":["LIGHTNING","COLORLESS","COLORLESS"],"damage":20,"text":"Flip 4 coins. This attack does 20 damage times the number of heads."}]},{"name":"Grovyle P4","number":"7","set":"P4","hp":70,"type":"GRASS","weakness":[{"type":"FIRE"}],"resistance":[{"type":"WATER","value":-30}],"retreat":["COLORLESS"],"stage":"Stage 1","from":"Treecko","delta":false,"attacks":[{"name":"Quick Attack","cost":["COLORLESS"],"damage":10,"text":"Flip a coin. If heads, this attack does 10 damage plus 10 more damage."},{"name":"Blot","cost":["GRASS","COLORLESS"],"damage":20,"text":"Remove 2 damage counters from Grovyle."}]},{"name":"Mudkip P4","number":"11","set":"P4","hp":50,"type":"WATER","weakness":[{"type":"GRASS"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Super Hypno Wave","cost":["WATER","COLORLESS"],"damage":20,"text":"The Defending Pokémon is now Asleep."}]},{"name":"Pidgey P4","number":"12","set":"P4","hp":40,"type":"COLORLESS","weakness":[{"type":"LIGHTNING"}],"resistance":[{"type":"FIGHTING","value":-30}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Quick Attack","cost":["COLORLESS","COLORLESS"],"damage":20,"text":"Flip a coin. If heads, this attack does 20 damage plus 10 more damage."}]},{"name":"Treecko δ P4","number":"15","set":"P4","hp":40,"type":"PSYCHIC","weakness":[{"type":"FIRE"}],"resistance":[{"type":"WATER","value":-30}],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":true,"attacks":[{"name":"Pound","cost":["COLORLESS"],"damage":10,"text":""},{"name":"Shining Claws","cost":["PSYCHIC"],"damage":10,"text":"Flip a coin. If heads, the Defending Pokémon is now Confused."}]},{"name":"Charmeleon δ P5","number":"5","set":"P5","hp":70,"type":"LIGHTNING","weakness":[{"type":"WATER"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Stage 1","from":"Charmander","delta":true,"attacks":[{"name":"Slash","cost":["COLORLESS","COLORLESS"],"damage":20,"text":""},{"name":"Thunder Jolt","cost":["LIGHTNING","COLORLESS","COLORLESS"],"damage":50,"text":"Flip a coin. If tails, Charmeleon does 10 damage to itself."}]},{"name":"Manectric AR2","number":"44","set":"AR","hp":90,"type":"LIGHTNING","weakness":[{"type":"FIGHTING","value":20}],"resistance":[{"type":"METAL","value":-20}],"retreat":[],"stage":"Stage 1","from":"Electrike","delta":false,"attacks":[{"name":"Tackle","cost":["COLORLESS"],"damage":20,"text":""},{"name":"Head Bolt","cost":["LIGHTNING","COLORLESS","COLORLESS"],"damage":60,"text":""}]},{"name":"Bulbasaur P2","number":"12","set":"P2","hp":40,"type":"GRASS","weakness":[{"type":"PSYCHIC"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Bite","cost":["COLORLESS"],"damage":10,"text":""},{"name":"Razor Leaf","cost":["GRASS","COLORLESS"],"damage":20,"text":""}]},{"name":"Hitmonlee HSP","number":"25","set":"HSP","hp":80,"type":"FIGHTING","weakness":[{"type":"PSYCHIC"}],"resistance":[],"retreat":["COLORLESS","COLORLESS"],"stage":"Basic","from":"","delta":false,"attacks":[{"name":"Kick","cost":["FIGHTING"],"damage":20,"text":""},{"name":"High Jump Kick","cost":["FIGHTING","FIGHTING","COLORLESS"],"damage":60,"text":""}]},{"name":"Charmander δ P5","number":"10","set":"P5","hp":50,"type":"LIGHTNING","weakness":[{"type":"WATER"}],"resistance":[],"retreat":["COLORLESS"],"stage":"Basic","from":"","delta":true,"attacks":[{"name":"Scratch","cost":["COLORLESS"],"damage":10,"text":""},{"name":"Bite","cost":["LIGHTNING","COLORLESS"],"damage":20,"text":""}]}] as Array<any>;
const reprints = [{"name":"Ivysaur P2","set":"P2","number":"7","base":"Ivysaur RG"},{"name":"Multi Technical Machine 01 P2","set":"P2","number":"9","base":"Multi Technical Machine 01 EX"},{"name":"TV Reporter P2","set":"P2","number":"11","base":"TV Reporter DR"},{"name":"Heal Energy P4","set":"P4","number":"8","base":"Heal Energy DX"},{"name":"Scramble Energy P4","set":"P4","number":"10","base":"Scramble Energy DX"},{"name":"Bill's Maintenance P5","set":"P5","number":"6","base":"Bill's Maintenance RG"},{"name":"Rare Candy P5","set":"P5","number":"7","base":"Rare Candy HP"},{"name":"δ Rainbow Energy P5","set":"P5","number":"9","base":"Delta Rainbow Energy HP"},{"name":"Cherrim P8","set":"P8","number":"6","base":"Cherrim DP"},{"name":"Rare Candy P8","set":"P8","number":"10","base":"Rare Candy HP"},{"name":"Roseanne's Research P8","set":"P8","number":"11","base":"Roseanne's Research SW"},{"name":"Chimchar P8","set":"P8","number":"12","base":"Chimchar DP"},{"name":"Turtwig P8","set":"P8","number":"17","base":"Turtwig DP"}] as Array<any>;
const energies: { [key: string]: string } = {
  GRASS: 'Grass Energy SVE', FIRE: 'Fire Energy SVE', WATER: 'Water Energy SVE', LIGHTNING: 'Lightning Energy SVE',
  PSYCHIC: 'Psychic Energy SVE', FIGHTING: 'Fighting Energy SVE', DARK: 'Darkness Energy SVE', METAL: 'Metal Energy SVE',
  COLORLESS: 'Water Energy SVE'
};
function setup(name: string, cost: string[], copied: boolean) {
  const energy = cost.map(type => energies[type]);
  const g = setupGame({ turn: 2, player1: { active: { card: copied ? 'Mew ex 30C' : name, energy },
    bench: copied ? [{ card: name }] : [], deck: padDeck(15) },
    player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(15) } });
  const target = g.player2.active.getPokemonCard()!; target.weakness = []; target.resistance = []; target.hp = 1000;
  return g;
}
function attack(g: ReturnType<typeof setup>, name: string, copied: boolean) {
  if (copied) { g.overridePrompt('Choose attack', () => ({ index: 0, attack: name })); useAbility(g.store, g.state, 0, 'Memory Helix'); }
  else useAttack(g.store, g.state, 0, name);
}
function expectedDamage(a: any, heads: boolean): number {
  let match: RegExpMatchArray | null;
  if (/If tails, this attack does nothing/i.test(a.text)) return heads ? a.damage : 0;
  if ((match = a.text.match(/If heads, this attack does (?:\d+ damage plus )?(\d+) more damage/i))) return a.damage + (heads ? Number(match[1]) : 0);
  if ((match = a.text.match(/Flip ([234]) coins\. This attack does (\d+) damage times/i))) return heads ? Number(match[1]) * Number(match[2]) : 0;
  if ((match = a.text.match(/Flip a coin until you get tails\. This attack does (\d+) damage times/i))) return heads ? 2 * Number(match[1]) : 0;
  return a.damage;
}
describe('Upstream round 27 identities and engine effects', () => {
  beforeAll(() => ensureClientCards());
  for (const row of printed) {
    it('registers printed data for ' + row.name, () => {
      const c = getCardByName(row.name) as PokemonCard;
      expect(c.fullName).toBe(row.name); expect(c.set).toBe(row.set); expect(c.setNumber).toBe(row.number);
      expect(c.hp).toBe(row.hp); expect(c.cardType).toBe((CardType as any)[row.type]);
      expect(c.evolvesFrom).toBe(row.from);
      expect(c.weakness).toEqual(row.weakness.map((x: any) => ({ ...x, type: (CardType as any)[x.type] })));
      expect(c.resistance).toEqual(row.resistance.map((x: any) => ({ ...x, type: (CardType as any)[x.type] })));
      expect(c.retreat).toEqual(row.retreat.map((x: string) => (CardType as any)[x]));
      if (row.delta) expect(c.tags).toContain(CardTag.DELTA_SPECIES);
      expect(c.attacks.length).toBe(row.attacks.length);
      row.attacks.forEach((a: any, i: number) => { expect(c.attacks[i].name).toBe(a.name);
        expect(c.attacks[i].cost).toEqual(a.cost.map((x: string) => (CardType as any)[x]));
        expect(c.attacks[i].damage).toBe(a.damage); expect(c.attacks[i].text).toBe(a.text); });
    });
    for (const a of row.attacks) for (const copied of [false, true]) {
      const coin = /Flip (a coin|[234] coins)/i.test(a.text);
      for (const heads of coin ? [false, true] : [true]) {
        it((copied ? 'copied ' : 'direct ') + row.name + ' / ' + a.name + ' / heads=' + heads, () => {
          const g = setup(row.name, a.cost, copied), seen: SpecialCondition[] = [], directDamage: number[] = [];
          const original = g.store.reduceEffect.bind(g.store);
          spyOn(g.store, 'reduceEffect').and.callFake((s: State, e: Effect) => {
            const before = e instanceof DealDamageEffect && e.target === g.player2.active ? e.target.damage : undefined;
            const out = original(s, e);
            if (before !== undefined && e instanceof DealDamageEffect) directDamage.push(e.target.damage - before);
            if (e instanceof AddSpecialConditionsEffect && !e.preventDefault) seen.push(...e.specialConditions);
            return out;
          });
          const random = spyOn(Math, 'random');
          if (/until you get tails/i.test(a.text) && heads) {
            const results = [0.1, 0.1, 0.9]; let index = 0;
            random.and.callFake(() => results[index++] ?? 0.9);
          }
          else random.and.returnValue(heads ? 0.1 : 0.9);
          if (/Remove \d+ damage counter/i.test(a.text)) g.player1.active.damage = 40;
          if (/isn.t affected by Resistance/i.test(a.text)) g.player2.active.getPokemonCard()!.resistance = [{ type: (CardType as any)[row.type], value: -30 }];
          attack(g, a.name, copied);
          expect(directDamage.reduce((sum, value) => sum + value, 0)).toBe(expectedDamage(a, heads));
          const status = a.text.match(/(?:Defending Pokémon is now )?(Asleep|Paralyzed|Poisoned|Burned|Confused)\./i);
          if (status) {
            const condition = (SpecialCondition as any)[status[1].toUpperCase()];
            expect(seen.includes(condition)).toBe(/If heads/i.test(a.text) ? heads : true);
          }
          if (/damage to itself/i.test(a.text)) expect(g.player1.active.damage).toBe(heads ? 0 : 10);
          const heal = a.text.match(/Remove (\d+) damage counters?/i);
          if (heal) expect(g.player1.active.damage).toBe(40 - Number(heal[1]) * 10);
          if (/Draw 2 cards\./i.test(a.text)) expect(g.player1.hand.cards.length).toBe(2);
        });
      }
    }
  }
  for (const row of reprints) it('inherits the reviewed prior print for ' + row.name, () => {
    const copy: any = getCardByName(row.name), base: any = getCardByName(row.base);
    expect([copy.name, copy.set, copy.setNumber, copy.fullName]).toEqual([base.name, row.set, row.number, row.name]);
    expect(copy.reduceEffect).toBe(base.reduceEffect);
    for (const key of ['superType', 'trainerType', 'energyType', 'stage', 'hp', 'cardType', 'weakness', 'resistance', 'retreat', 'powers', 'attacks', 'text', 'tags'])
      expect({ name: row.name, key, value: copy[key] }).toEqual({ name: row.name, key, value: base[key] });
  });
  for (const row of printed) for (const a of row.attacks) {
    const multi = a.text.match(/^Flip ([234]) coins\. This attack does (\d+) damage times/i);
    if (!multi) continue;
    for (const copied of [false, true]) it((copied ? 'copied ' : 'direct ') + row.name + ' counts one heads among several flips', () => {
      const g = setup(row.name, a.cost, copied), values = [0.1, ...Array(Number(multi[1]) - 1).fill(0.9)];
      let cursor = 0; spyOn(Math, 'random').and.callFake(() => values[cursor++] ?? 0.9);
      attack(g, a.name, copied); expect(g.player2.active.damage).toBe(Number(multi[2]));
    });
  }
  it('round-trips every added identity through ClientSimulator state', () => {
    const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 2; state.players = [new Player(), new Player()];
    const add = (list: CardList, name: string) => { const card = CardManager.getInstance().getCardByName(name)!;
      expect(card).toBeDefined(); card.id = state.cardNames.length; state.cardNames.push(card.fullName); list.cards.push(card); };
    state.players.forEach((player, i) => { player.id = i + 1; player.name = i ? 'Opponent' : 'Player';
      player.bench = Array.from({length: 5}, () => new PokemonCardList()); player.prizes = Array.from({length: 6}, () => new CardList());
      player.prizes.forEach(prize => add(prize, 'Fire Energy SVE')); for (let j = 0; j < 9; j++) add(player.deck, 'Fire Energy SVE');
      add(player.active, i ? 'Mew ex MEW' : printed[0].name); });
    [...printed.slice(1), ...reprints].forEach(row => add(state.players[0].deck, row.name));
    const sim = new ClientSimulator(); sim.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
    const restored = new ClientSimulator(); restored.loadSnapshot({ stateData: sim.getStateData() });
    for (const row of [...printed, ...reprints]) expect(restored.state.cardNames).toContain(row.name);
    sim.cleanup(); restored.cleanup();
  });
  for (const reverse of [false, true]) it('resolves the exact numbered Arceus prints independent of order ' + reverse, () => {
    const cards = ensureClientCards().slice();
    try {
      StateSerializer.setKnownCards(reverse ? cards.slice().reverse() : cards);
      for (const [name, number, expected] of [['Electrike','62','Electrike AR 62'],['Electrike','63','Electrike AR2'],
        ['Tangela','76','Tangela AR 76'],['Tangela','77','Tangela AR2'],['Treecko','78','Treecko AR 78'],
        ['Treecko','79','Treecko AR2'],['Manectric','44','Manectric AR2'],['Ponyta','72','Ponyta AR2']]) {
        expect(StateSerializer.normalizeCardName(name + ' AR ' + number)).toBe(expected);
        expect(StateSerializer.normalizeCardName(name + ' AR 0' + number)).toBe(expected);
      }
    } finally { StateSerializer.setKnownCards(cards); }
  });
  for (const [name, number] of [['Electrike','62'],['Electrike','63'],['Tangela','76'],['Tangela','77'],
    ['Treecko','78'],['Treecko','79'],['Manectric','44'],['Ponyta','72']]) it('does not substitute missing ' + name + ' AR ' + number, () => {
    const cards = ensureClientCards().slice();
    try {
      StateSerializer.setKnownCards(cards.filter(c => !(c.name === name && c.set === 'AR' && c.setNumber === number)));
      expect(StateSerializer.normalizeCardName(name + ' AR ' + number)).toBe('');
      expect(StateSerializer.normalizeCardName(name + ' AR 0' + number)).toBe('');
    } finally { StateSerializer.setKnownCards(cards); }
  });
});
