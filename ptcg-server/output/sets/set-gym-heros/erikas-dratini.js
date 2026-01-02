"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasDratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ErikasDratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                name: 'Strange Barrier',
                text: 'Whenever an attack by a Basic Pokémon (including your own) does 20 or more damage to Erika\'s Dratini (after applying Weakness and Resistance), reduce that damage to 10. (Any other effects of attacks still happen.) This power stops working while Erika\'s Dratini is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Tail Strike',
                cost: [C, C],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Erika\'s Dratini';
        this.fullName = 'Erika\'s Dratini G1';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            // Check if this is Erika's Dratini being targeted
            const targetPokemon = effect.target.getPokemonCard();
            if (targetPokemon === this) {
                // Check if the source is a Basic Pokémon
                const sourcePokemon = effect.source.getPokemonCard();
                if (sourcePokemon && sourcePokemon.stage === card_types_1.Stage.BASIC) {
                    // Check if Erika's Dratini has no special conditions that would disable the ability
                    const hasDisablingCondition = effect.target.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                        effect.target.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                        effect.target.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED);
                    if (!hasDisablingCondition && effect.damage >= 20) {
                        // Reduce damage to 10
                        effect.damage = 10;
                    }
                }
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const damage = effect.damage;
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                if (result) {
                    // Heads: 10 + 20 = 30 damage
                    effect.damage = damage + 20;
                }
                else {
                    // Tails: 10 damage
                    effect.damage = damage;
                }
            });
            store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.ErikasDratini = ErikasDratini;
