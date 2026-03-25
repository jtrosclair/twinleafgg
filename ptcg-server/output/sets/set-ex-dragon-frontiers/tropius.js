"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Tropius extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Tropical Heal',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Tropius from your hand onto your Bench, you may remove all Special Conditions, Imprison markers, and Shock-wave markers from your Pokémon.'
            }];
        this.attacks = [{
                name: 'Grind',
                cost: [M],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to Tropius.'
            }];
        this.set = 'DF';
        this.name = 'Tropius';
        this.fullName = 'Tropius DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                        cardList.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                        cardList.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                        cardList.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
                        cardList.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
                        cardList.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                        cardList.marker.removeMarker('IMPRISON_MARKER');
                        cardList.marker.removeMarker('SHOCK_WAVE_MARKER');
                    });
                    (0, prefabs_1.ABILITY_USED)(player, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            effect.damage = 10 * checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
        }
        return state;
    }
}
exports.Tropius = Tropius;
