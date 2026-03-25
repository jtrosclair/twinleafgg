"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aerodactyl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Aerodactyl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.evolvesFrom = 'Old Amber Aerodactyl';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ancient Scream',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Pokémon\'s attacks do 10 more damage to the Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'DEX';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aerodactyl';
        this.fullName = 'Aerodactyl DEX';
    }
    reduceEffect(store, state, effect) {
        // Ancient Scream - boost damage to Active Pokémon
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Only works during attack phase
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Check if this Aerodactyl is in play
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Check if ability is blocked
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Only boost damage to opponent's Active Pokémon
            if (effect.target !== opponent.active) {
                return state;
            }
            // Only boost if attack actually does damage
            if (effect.damage > 0) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.Aerodactyl = Aerodactyl;
