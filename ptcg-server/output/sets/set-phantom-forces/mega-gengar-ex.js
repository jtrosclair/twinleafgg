"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MGengarEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* usePhantomGate(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const benched = opponent.bench.filter(b => { var _a; return b.cards.length > 0 && ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'M Gengar-EX' && opponent.active !== b; });
    benched.push(opponent.active);
    // Return early if no valid targets
    if (benched.length === 0) {
        return state;
    }
    const allYourPokemon = [...benched.map(b => b.getPokemonCard())];
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, allYourPokemon.filter((card) => card !== undefined), { allowCancel: false }), result => {
        selected = result;
        next();
    });
    // Validate selected attack
    if (!selected || selected.copycatAttack) {
        return state; // Exit if no valid attack is selected
    }
    store.log(state, game_message_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: selected.name
    });
    // Perform attack
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, selected);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class MGengarEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Gengar-EX';
        this.cardType = P;
        this.hp = 220;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            }];
        this.attacks = [
            {
                name: 'Phantom Gate',
                cost: [P, C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack.'
            }
        ];
        this.set = 'PHF';
        this.name = 'M Gengar-EX';
        this.fullName = 'M Gengar-EX PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
    }
    reduceEffect(store, state, effect) {
        // love me some funny evolution crap
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Gengar Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Phantom Gate
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = usePhantomGate(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MGengarEx = MGengarEx;
