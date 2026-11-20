import { GameMessage } from '../../game/game-message';
import { AttackAction, RetreatAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, EvolveEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, AttachPokemonToolEffect } from '../../game/store/effects/play-card-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { GamePhase } from '../../game/store/state/state';
import { PokemonSlotConfig, setupGame } from './test-helpers';

const { ASLEEP, BURNED, CONFUSED, PARALYZED, POISONED } = SpecialCondition;
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const normal = 'Mew ex MEW';
const protectedBasic = 'Shuppet M5';
const protectedEvolution = 'Banette M5';
const hood = 'Stealthy Hood UNB';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const grass = 'Grass Energy SVE';
const fire = 'Fire Energy SVE';

const activated = [
  { card: 'Brute Bonnet PAR', ability: 'Toxic Powder', tools: ['Ancient Booster Energy Capsule PAR'], conditions: [POISONED] },
  { card: 'Ariados AOR', ability: 'Poisonous Nest', conditions: [POISONED] },
  { card: 'Hypno BKP', ability: 'Goodnight, Babies', conditions: [ASLEEP] },
  { card: 'Munna BCR', ability: 'Long-Distance Hypnosis', conditions: [ASLEEP] },
  { card: 'Mareep LOT', ability: 'Fluffy Pillow', conditions: [ASLEEP] },
  { card: 'Delphox FLI', ability: 'Mystical Torch', conditions: [BURNED] },
  { card: 'Garbodor RCL', ability: 'Poisonous Puddle', stadium: 'Artazon PAL', conditions: [POISONED] },
  { card: 'Galarian Slowbro V DAA', ability: 'Rapid-Fire Poison', conditions: [POISONED] },
  { card: 'Vanilluxe DAA', ability: 'Bitter Cold', conditions: [PARALYZED] },
  { card: 'Hisuian Typhlosion ASR 52', ability: 'Supernatural Orb', hand: [psychic], conditions: [BURNED, CONFUSED] },
  { card: 'Volcarona SV11B', ability: 'Heat Wave Scales', hand: [fire], conditions: [BURNED] },
  { card: 'Ampharos LOT', ability: 'Unseen Flash', hand: [lightning, lightning], conditions: [PARALYZED] },
  { card: 'Drapion VSTAR LOR', ability: 'Hazard Star', conditions: [POISONED, PARALYZED] },
];

describe('activated Abilities that apply Special Conditions', () => {
  beforeEach(() => spyOn(Math, 'random').and.returnValue(0.25));

  for (const row of activated) {
    for (const enemy of [normal, protectedBasic]) {
      it(`${row.ability} from ${row.card} checks protection on ${enemy}`, () => {
        const { store, player1 } = setupGame({
          turn: 5,
          player1: { active: { card: row.card, tools: row.tools }, hand: [...(row.hand ?? []), ...(row.stadium ? [row.stadium] : [])] },
          player2: { active: { card: enemy } }
        });
        if (row.stadium) {
          const stadiumIndex = player1.hand.cards.findIndex(card => card.fullName === row.stadium);
          store.dispatch(new PlayCardAction(player1.id, stadiumIndex, { ...active, slot: SlotType.BOARD }));
        }
        store.dispatch(new UseAbilityAction(player1.id, row.ability, active));
        const conditions = row.conditions.filter(condition =>
          store.state.players[1].active.specialConditions.includes(condition));
        expect(conditions).toEqual(enemy === normal ? row.conditions : []);
      });
    }
  }

  for (const defender of [
    { card: protectedEvolution },
    { card: normal, tools: [hood] },
    { card: 'Mew V FST', energy: ['Fusion Strike Energy FST'] },
    { card: 'Mega Clefable ex M3' },
  ] as PokemonSlotConfig[]) {
    it(`Toxic Powder preserves own-side Poison and respects ${defender.card} protection`, () => {
      const { store, player1 } = setupGame({
        turn: 5,
        player1: { active: { card: protectedBasic }, bench: [{ card: 'Brute Bonnet PAR', tools: ['Ancient Booster Energy Capsule PAR'] }] },
        player2: { active: defender }
      });
      store.dispatch(new UseAbilityAction(player1.id, 'Toxic Powder', bench));
      expect(store.state.players[0].active.specialConditions).toContain(POISONED);
      expect(store.state.players[1].active.specialConditions).not.toContain(POISONED);
    });
  }

  it('applying Sleep preserves the existing poison damage and applies normal sleep', () => {
    const { store, player1, player2 } = setupGame({
      turn: 5, player1: { active: { card: 'Hypno BKP' } }, player2: { active: { card: normal } }
    });
    player2.active.addSpecialCondition(POISONED);
    player2.active.poisonDamage = 30;
    store.dispatch(new UseAbilityAction(player1.id, 'Goodnight, Babies', active));
    expect(store.state.players[1].active.specialConditions).toEqual([POISONED, ASLEEP]);
    expect(store.state.players[1].active.poisonDamage).toBe(30);
    expect(store.state.players[1].active.sleepFlips).toBe(1);
  });

  it('Hazard Star puts exactly three counters on the poisoned Pokémon during Checkup', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Drapion VSTAR LOR' } }, player2: { active: { card: normal } }
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Hazard Star', active));
    const target = store.state.players[1];
    expect(target.active.poisonDamage).toBe(30);
    store.reduceEffect(store.state, new BetweenTurnsEffect(target));
    expect(target.active.damage).toBe(30);
    expect(store.state.players[0].usedVSTAR).toBe(true);
  });

  it('Wafting Scent waits for the chosen Grass Energy and accepts Special Energy providing Grass', () => {
    const { store, player1, overridePrompt } = setupGame({
      turn: 5, player1: { active: { card: 'Victreebel FFI', energy: [grass, 'Luminous Energy PAL'] } },
      player2: { active: { card: normal } }
    });
    let prompted = false;
    overridePrompt(ChooseCardsPromptType, (prompt, state) => {
      prompted = true;
      expect(state.players[1].active.specialConditions).toEqual([]);
      return [state.players[0].active.cards.findIndex(card => card.fullName === 'Luminous Energy PAL')];
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Wafting Scent', active));
    expect(prompted).toBe(true);
    expect(store.state.players[0].discard.cards[0].fullName).toBe('Luminous Energy PAL');
    expect(store.state.players[1].active.specialConditions).toEqual([CONFUSED, POISONED]);
  });
});

const evolutions: [string, string, SpecialCondition[]][] = [
  ['Salandit GRI', 'Salazzle GRI', [BURNED, POISONED]],
  ['Cascoon LOT', 'Dustox LOT', [PARALYZED, POISONED]],
  ['Snivy FCO', 'Servine FCO', [PARALYZED]],
  ['Pikachu BUS', 'Raichu BUS', [PARALYZED]],
  ['Foongus NXD', 'Amoonguss NXD', [CONFUSED, POISONED]],
  ['Paras LOR 4', 'Parasect LOR 5', [ASLEEP, POISONED]],
  ['Metapod FST 2', 'Butterfree FST', [BURNED, CONFUSED, POISONED]],
  ['Tynamo LOR', 'Eelektrik LOR 60', [PARALYZED]],
  ['Gastly BKT', 'Haunter BKT', [CONFUSED]],
];

describe('Special Conditions from accepted plays and evolutions', () => {
  beforeEach(() => spyOn(Math, 'random').and.returnValue(0.25));

  for (const [base, evolved, expected] of evolutions) {
    for (const enemy of [normal, protectedBasic]) {
      it(`${evolved} resolves its hand-evolution Ability against ${enemy}`, () => {
        const { store, player1 } = setupGame({
          turn: 5,
          player1: { active: { card: normal }, bench: [{ card: base }], hand: [evolved] },
          player2: { active: { card: enemy } }
        });
        store.dispatch(new PlayCardAction(player1.id, 0, bench));
        expect(store.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(evolved);
        expect(store.state.players[1].active.specialConditions).toEqual(enemy === normal ? expected : []);
      });
    }
  }

  it('Hot Poison does not trigger from the deck', () => {
    const { store, state, player1, player2 } = setupGame({
      turn: 5,
      player1: { active: { card: normal }, bench: [{ card: 'Salandit GRI' }], deck: ['Salazzle GRI'] },
      player2: { active: { card: normal } }
    });
    const evolved = player1.deck.cards[0] as PokemonCard;
    store.reduceEffect(state, new EvolveEffect(player1, player1.bench[0], evolved, player1.deck, false));
    expect(store.hasPrompts()).toBe(false);
    expect(player2.active.specialConditions).toEqual([]);
  });

  it('Volt Tackle still deals the printed self-damage', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Raichu BUS', energy: [lightning, lightning, psychic] } },
      player2: { active: { card: normal } }
    });
    store.dispatch(new AttackAction(player1.id, 'Volt Tackle'));
    expect(store.state.players[0].active.damage).toBe(30);
    expect(store.state.players[1].active.damage).toBe(130);
  });

  it('Subjugating Chains poisons its own new Active even through Stealthy Hood', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Pecharunt ex SFA' }, bench: [{ card: 'Roaring Moon ex PAR', tools: [hood] }] },
      player2: { active: { card: normal } }
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Subjugating Chains', active));
    expect(store.state.players[0].active.getPokemonCard()?.fullName).toBe('Roaring Moon ex PAR');
    expect(store.state.players[0].active.specialConditions).toEqual([POISONED]);
    expect(store.state.players[1].active.specialConditions).toEqual([]);
  });

  it('Bursting Spores works from the Bench and stays inactive in hand', () => {
    for (const inPlay of [true, false]) {
      const { store, player1 } = setupGame({
        turn: 5,
        player1: { active: { card: normal }, bench: inPlay ? [{ card: 'Amoonguss UNM' }] : [],
          hand: inPlay ? ['Foongus UNM'] : ['Foongus UNM', 'Amoonguss UNM'] },
        player2: { active: { card: normal } }
      });
      store.dispatch(new PlayCardAction(player1.id, 0, { ...bench, index: inPlay ? 1 : 0 }));
      expect(store.state.players[1].active.specialConditions).toEqual(inPlay ? [ASLEEP, POISONED] : []);
    }
  });

  for (const card of ['Nihilego-GX CIN', 'Nihilego-GX HIF']) {
    it(`${card} applies Empty Light only to susceptible recipients`, () => {
      const { store, player1 } = setupGame({
        turn: 5, player1: { active: { card: protectedBasic }, hand: [card] },
        player2: { active: { card: protectedBasic } }
      });
      store.dispatch(new PlayCardAction(player1.id, 0, bench));
      expect(store.state.players[0].active.specialConditions).toEqual([CONFUSED, POISONED]);
      expect(store.state.players[1].active.specialConditions).toEqual([]);
    });
  }
});

describe('Special Conditions after Energy, Tools and attack damage', () => {
  it('lets the player decline Hyper Hypnosis after the Energy attaches', () => {
    const { store, player1, overridePrompt } = setupGame({
      turn: 5, player1: { active: { card: 'Malamar-EX PHF' }, hand: [psychic] },
      player2: { active: { card: normal } }
    });
    let chose = false;
    overridePrompt('Confirm', (prompt, state) => {
      chose = true;
      expect(state.players[0].active.energies.cards.length).toBe(1);
      return false;
    });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(chose).toBe(true);
    expect(store.state.players[1].active.specialConditions).toEqual([]);
  });

  it('rejects a blocked Energy attachment before offering Bug Transmission', () => {
    const { store, state, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Porygon-Z CRE' }, hand: [psychic] },
      player2: { active: { card: normal } }
    });
    player1.active.energyAttachBlockedFromHandNextTurn = true;
    expect(() => store.reduceEffect(state, new AttachEnergyEffect(
      player1, player1.hand.cards[0] as EnergyCard, player1.active
    ))).toThrow(jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_EFFECT }));
    expect(store.hasPrompts()).toBe(false);
  });

  it('recognizes Ghost Veil when Bug Transmission resolves', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Porygon-Z CRE' }, hand: [psychic] },
      player2: { active: { card: protectedBasic } }
    });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(store.state.players[0].active.energies.cards.length).toBe(1);
    expect(store.state.players[1].active.specialConditions).toEqual([]);
  });

  it('offers Charmed Charm after the Tool is attached and honors Ghost Veil', () => {
    const fairyCharm = 'Fairy Charm Grass LOT';
    const { store, player1, overridePrompt } = setupGame({
      turn: 5, player1: { active: { card: 'Tapu Lele LOT' }, hand: [fairyCharm] },
      player2: { active: { card: protectedBasic } }
    });
    overridePrompt('Confirm', (prompt, state) => {
      expect(state.players[0].active.tools[0]?.fullName).toBe(fairyCharm);
      return true;
    });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(store.state.players[1].active.specialConditions).toEqual([]);
  });

  it('does not offer Charmed Charm when a second Tool cannot attach', () => {
    const { store, state, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Tapu Lele LOT', tools: [hood] }, hand: ['Fairy Charm Grass LOT'] },
      player2: { active: { card: normal } }
    });
    expect(() => store.reduceEffect(state, new AttachPokemonToolEffect(
      player1, player1.hand.cards[0] as TrainerCard, player1.active
    ))).toThrow(jasmine.objectContaining({ message: GameMessage.POKEMON_TOOL_ALREADY_ATTACHED }));
    expect(store.hasPrompts()).toBe(false);
  });

  for (const [source, condition] of [['Heatran TWM', BURNED], ['Shiinotic LOT', ASLEEP]] as const) {
    for (const attacker of [normal, protectedBasic]) {
      it(`${source} reacts after a damaging hit from ${attacker}`, () => {
        const { store, state, player1, player2 } = setupGame({
          turn: 5, player1: { active: { card: attacker } }, player2: { active: { card: source } }
        });
        state.phase = GamePhase.ATTACK;
        const hit = new PutDamageEffect(new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]), 20);
        store.reduceEffect(state, hit);
        expect(player2.active.damage).toBeGreaterThan(0);
        expect(player1.active.specialConditions.includes(condition)).toBe(attacker === normal);
      });
    }
  }

  for (const [hitKind, attacker] of [['damage', normal], ['damage', protectedBasic], ['counters', normal]]) {
    it(`Spiteful Spirit checks ${hitKind} and Ability protection on ${attacker}`, () => {
      const { store, state, player1, player2 } = setupGame({
        turn: 5, player1: { active: { card: attacker } }, player2: { active: { card: 'Jellicent PLS', damage: 90 } }
      });
      state.phase = GamePhase.ATTACK;
      const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
      store.reduceEffect(state, hitKind === 'damage' ? new PutDamageEffect(attack, 10) : new PutCountersEffect(attack, 10));
      store.reduceEffect(state, new KnockOutEffect(player2, player2.active));
      expect(player1.active.specialConditions).toEqual(hitKind === 'damage' && attacker === normal ? [CONFUSED, POISONED] : []);
    });
  }

  it('checks ability suppression on Snorlax’s side before applying Block', () => {
    for (const card of [normal, 'Galarian Weezing SHF', protectedEvolution]) {
      const { store, player1 } = setupGame({
        turn: 5, player1: { active: { card, energy: [psychic, psychic, psychic] }, bench: [{ card: normal }] },
        player2: { active: { card: 'Snorlax PGO' } }
      });
      const retreat = () => store.dispatch(new RetreatAction(player1.id, 0));
      if (card === normal) {
        expect(retreat).toThrow(jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_EFFECT }));
      } else {
        retreat();
        expect(store.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(card);
      }
    }
  });
});
