"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
class Scizor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scyther';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Punishing Scissors',
                cost: [M],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.'
            },
            {
                name: 'Cut',
                cost: [M, M],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Scizor';
        this.fullName = 'Scizor OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonWithUsableAbilities = 0;
            // Check active Pokemon
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.powers.length > 0) {
                // Check if the ability is actually usable
                if (this.hasActuallyUsableAbility(store, state, opponent, opponentActive)) {
                    pokemonWithUsableAbilities++;
                }
            }
            // Check bench Pokemon
            opponent.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const benchPokemon = benchSlot.getPokemonCard();
                    if (benchPokemon && benchPokemon.powers.length > 0) {
                        // Check if the ability is actually usable
                        if (this.hasActuallyUsableAbility(store, state, opponent, benchPokemon)) {
                            pokemonWithUsableAbilities++;
                        }
                    }
                }
            });
            effect.damage += pokemonWithUsableAbilities * 50;
            return state;
        }
        return state;
    }
    hasActuallyUsableAbility(store, state, player, pokemon) {
        for (const power of pokemon.powers) {
            if (power.powerType === pokemon_types_1.PowerType.ABILITY) {
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, pokemon) || power.exemptFromAbilityLock || power.exemptFromInitialize || power.abilityLock) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.Scizor = Scizor;
