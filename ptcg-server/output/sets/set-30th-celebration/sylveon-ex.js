"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sylveonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sylveonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Eevee';
        this.hp = 270;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Colorful Harmony',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each type of Basic Energy attached to all of your Pokémon.',
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Sylveon ex';
        this.fullName = 'Sylveon ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Colorful Harmony
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const uniqueTypes = new Set();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (pokemon) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach((em) => {
                    if (em.card.energyType === card_types_1.EnergyType.BASIC && em.provides.length > 0) {
                        if (em.provides.includes(card_types_1.CardType.ANY)) {
                            [
                                card_types_1.CardType.FIRE,
                                card_types_1.CardType.WATER,
                                card_types_1.CardType.GRASS,
                                card_types_1.CardType.LIGHTNING,
                                card_types_1.CardType.PSYCHIC,
                                card_types_1.CardType.FIGHTING,
                                card_types_1.CardType.DARK,
                                card_types_1.CardType.METAL,
                                card_types_1.CardType.FAIRY,
                            ].forEach((type) => uniqueTypes.add(type));
                        }
                        else {
                            em.provides.forEach((type) => uniqueTypes.add(type));
                        }
                    }
                });
            });
            effect.damage = 50 * uniqueTypes.size;
        }
        return state;
    }
}
exports.Sylveonex = Sylveonex;
