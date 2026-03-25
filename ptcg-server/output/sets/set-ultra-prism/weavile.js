"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Evil Admonition',
                cost: [card_types_1.CardType.DARK],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your opponent\'s Pokémon that has an Ability.'
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Weavile';
        this.fullName = 'Weavile UPR';
        this.evolvesFrom = 'Sneasel';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
            effect.damage = pokemonWithUsableAbilities * 50;
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const sleepEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, sleepEffect);
            return state;
        }
        return state;
    }
    hasActuallyUsableAbility(store, state, player, pokemon) {
        for (const power of pokemon.powers) {
            if (power.powerType === game_1.PowerType.ABILITY) {
                if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, pokemon) || power.exemptFromAbilityLock || power.exemptFromInitialize || power.abilityLock) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.Weavile = Weavile;
