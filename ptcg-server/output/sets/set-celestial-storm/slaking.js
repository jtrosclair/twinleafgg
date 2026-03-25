"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slaking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slaking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vigoroth';
        this.cardType = C;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Lazy',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon in play have no Abilities, except for Lazy.'
            }];
        this.attacks = [{
                name: 'Critical Move',
                cost: [C, C, C],
                damage: 160,
                text: 'Discard an Energy from this Pokémon. It can\'t attack during your next turn.'
            }];
        this.set = 'CES';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slaking';
        this.fullName = 'Slaking CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            // Slaking is not active Pokemon
            if (owner.active.getPokemonCard() !== this) {
                return state;
            }
            // Only filter opponent's Pokemon abilities
            const targetCardList = game_1.StateUtils.findCardList(state, effect.target);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            const targetOwner = game_1.StateUtils.findOwner(state, targetCardList);
            if (targetOwner === owner) {
                return state;
            }
            // Filter out all abilities except Lazy
            effect.powers = effect.powers.filter(power => power.powerType !== pokemon_types_1.PowerType.ABILITY || power.name === 'Lazy');
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            // Slaking is not active Pokemon
            if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if (owner === player) {
                return state;
            }
            //Try reducing ability for each player  
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                if (!effect.power.exemptFromAbilityLock) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
                }
                return state;
            }
        }
        // Critical Move
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Slaking = Slaking;
