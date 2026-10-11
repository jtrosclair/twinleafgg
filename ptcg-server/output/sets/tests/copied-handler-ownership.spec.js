"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const energy_card_1 = require("../../game/store/card/energy-card");
const card_types_1 = require("../../game/store/card/card-types");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const store_1 = require("../../game/store/store");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const onix_1 = require("../set-evolutions/onix");
const unown_1 = require("../set-30th-celebration/unown");
const castform_snowy_form_1 = require("../set-chilling-reign/castform-snowy-form");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const mew_ex_1 = require("../set-30th-celebration/mew-ex");
const drednaw_1 = require("../set-stellar-crown/drednaw");
const copy_attack_delegation_1 = require("../../game/store/prefabs/copy-attack-delegation");
class OwnershipEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.name = 'Ownership Energy';
        this.fullName = 'Ownership Energy';
        this.set = 'TEST';
    }
}
class OwnershipDefender extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Ownership Defender';
        this.fullName = 'Ownership Defender';
        this.set = 'TEST';
        this.hp = 400;
    }
}
// Adversarial legacy fixtures: both branches share one handler and the same event.
// They model the absent ownership boundary; they are not replacement card implementations.
class MixedOwnershipSource extends onix_1.Onix {
    constructor() {
        super(...arguments);
        this.powers = [{ name: 'Fixture Shell', powerType: pokemon_types_1.PowerType.ABILITY, text: 'Prevent incoming damage of 200 or more.' }];
    }
    reduceEffect(store, state, effect) {
        state = super.reduceEffect(store, state, effect);
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this) && effect.damage >= 200) {
            effect.damage = 0;
        }
        return state;
    }
}
class InitialOwnershipSource extends OwnershipDefender {
    constructor() {
        super(...arguments);
        this.powers = [{ name: 'Fixture Boost', powerType: pokemon_types_1.PowerType.ABILITY, text: 'This Pokémon attacks do 40 more damage.' }];
        this.attacks = [{ name: 'Fixture Attack', cost: [], damage: 40, text: 'This attack does 10 more damage.' }];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += 10; // Attack-owned branch.
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += 40; // Ability-owned branch, intentionally no PowerEffect hook.
        }
        return state;
    }
}
function battle() {
    const state = new state_1.State();
    const player = new player_1.Player();
    const opponent = new player_1.Player();
    player.id = 1;
    opponent.id = 2;
    state.players = [player, opponent];
    state.turn = 2;
    state.phase = state_1.GamePhase.ATTACK;
    const mew = new mew_ex_1.Mewex();
    player.active.cards = [mew];
    opponent.active.cards = [new OwnershipDefender()];
    for (let i = 0; i < 3; i++) {
        const energy = new OwnershipEnergy();
        energy.provides = [card_types_1.CardType.PSYCHIC];
        player.active.cards.push(energy);
    }
    const store = new store_1.Store({ onStateChange: () => undefined });
    store.state = state;
    return { state, player, opponent, store, mew };
}
function resolve(b, result) {
    const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
    if (!prompt)
        throw new Error('Expected pending prompt');
    b.store.reducePrompt(b.state, new resolve_prompt_action_1.ResolvePromptAction(prompt.id, result));
}
function copy(b, source, index = 0) {
    const slot = new pokemon_card_list_1.PokemonCardList();
    slot.cards = [source];
    b.player.bench.push(slot);
    b.store.reduceEffect(b.state, new game_effects_1.PowerEffect(b.player, b.mew.powers[0], b.mew));
    resolve(b, source.attacks[index]);
    // Run the actual animation callback, excluding unrelated legacy next-turn initialization.
    b.state.phase = state_1.GamePhase.FINISHED;
    resolve(b, null);
    b.state.activePlayer = 1;
    b.state.phase = state_1.GamePhase.ATTACK;
}
function hit(b, damage) {
    const attack = new game_effects_1.AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage, text: '' });
    b.store.reduceEffect(b.state, new attack_effects_1.DealDamageEffect(attack, damage));
}
describe('copied handler ownership architectural acceptance', () => {
    beforeEach(() => (0, copy_attack_delegation_1.clearCopyAttackSessionsForTests)());
    it('copies Hard Crunch without inheriting unguarded Impervious Shell on incoming 200 damage', () => {
        const b = battle();
        const source = new drednaw_1.Drednaw();
        copy(b, source);
        expect(b.opponent.active.damage).toBe(80);
        hit(b, 200);
        expect(b.player.active.damage).toBe(200);
    });
    it('does not allow an unrelated passive merely because Harden armed a copied marker', () => {
        const b = battle();
        const source = new MixedOwnershipSource();
        b.player.active.cards[1].provides = [card_types_1.CardType.FIGHTING];
        copy(b, source);
        expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, b.mew)).toBe(true);
        hit(b, 200);
        expect(b.player.active.damage).toBe(200);
    });
    it('does not inherit an unguarded Ability branch on the initial AttackEffect', () => {
        const b = battle();
        copy(b, new InitialOwnershipSource());
        expect(b.opponent.active.damage).toBe(50);
    });
    it('keeps actual Drednaw Impervious Shell effective on its own incoming damage', () => {
        const b = battle();
        b.player.active.cards = [new drednaw_1.Drednaw()];
        hit(b, 200);
        expect(b.player.active.damage).toBe(0);
    });
    it('copies the legitimate conditional Hard Crunch bonus', () => {
        const b = battle();
        b.opponent.active.damage = 10;
        copy(b, new drednaw_1.Drednaw());
        expect(b.opponent.active.damage).toBe(170);
    });
    it('does not prevent below-threshold incoming damage after copying Drednaw', () => {
        const b = battle();
        copy(b, new drednaw_1.Drednaw());
        hit(b, 190);
        expect(b.player.active.damage).toBe(190);
    });
    it('retains the legitimate copied Harden defense on a source with no passive Ability', () => {
        const b = battle();
        const source = new onix_1.Onix();
        b.player.active.cards[1].provides = [card_types_1.CardType.FIGHTING];
        copy(b, source);
        hit(b, 40);
        expect(b.player.active.damage).toBe(0);
    });
    it('cleans copied Harden markers when the opponent turn ends', () => {
        const b = battle();
        const source = new onix_1.Onix();
        b.player.active.cards[1].provides = [card_types_1.CardType.FIGHTING];
        copy(b, source);
        b.state.phase = state_1.GamePhase.FINISHED;
        b.store.reduceEffect(b.state, new game_phase_effects_1.EndTurnEffect(b.opponent));
        expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, b.mew)).toBe(false);
        b.state.phase = state_1.GamePhase.ATTACK;
        hit(b, 40);
        expect(b.player.active.damage).toBe(40);
    });
    it('keeps attack-induced defense despite an unrelated passive on the same source', () => {
        const b = battle();
        const source = new MixedOwnershipSource();
        b.player.active.cards[1].provides = [card_types_1.CardType.FIGHTING];
        copy(b, source);
        hit(b, 40);
        expect(b.player.active.damage).toBe(0);
    });
    it('retains copied Mysterious Signal extra prizes without requiring an attack marker', () => {
        const b = battle();
        b.opponent.active.getPokemonCard().hp = 40;
        copy(b, new unown_1.Unown());
        b.state.activePlayer = 0;
        const ko = new game_effects_1.KnockOutEffect(b.opponent, b.opponent.active);
        b.store.reduceEffect(b.state, ko);
        expect(ko.prizeCount).toBe(2);
    });
    it('retains copied cannot-attack-next-turn effects', () => {
        const b = battle();
        b.player.active.cards[1].provides = [card_types_1.CardType.WATER];
        b.player.active.cards[2].provides = [card_types_1.CardType.WATER];
        copy(b, new castform_snowy_form_1.CastformSnowyForm());
        expect(b.player.active.cannotUseAttacksNextTurn.concat(b.player.active.cannotUseAttacksNextTurnPending))
            .toContain('Frosty Typhoon');
        expect(b.opponent.active.damage).toBe(120);
    });
    it('preserves copycat and source attack references and all printed identities', () => {
        const b = battle();
        const source = new drednaw_1.Drednaw();
        const attacks = b.mew.attacks;
        const sourceAttacks = source.attacks;
        copy(b, source);
        expect(b.mew.attacks).toBe(attacks);
        expect(source.attacks).toBe(sourceAttacks);
        expect(b.mew.fullName).toBe('Mew ex 30C');
        expect(b.mew.setNumber).toBe('57');
        expect(b.mew.usSetNumber).toBe('30C 66');
        expect(source.fullName).toBe('Drednaw SCR');
        expect(source.setNumber).toBe('44');
    });
});
