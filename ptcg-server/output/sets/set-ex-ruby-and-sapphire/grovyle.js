"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grovyle = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Grovyle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Treecko';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Natural Cure',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever you attach a [G] Energy card from your hand to Grovyle, remove all Special Conditions from Grovyle.'
            }];
        this.attacks = [{
                name: 'Slash',
                cost: [W, C],
                damage: 20,
                text: ''
            }];
        this.set = 'RS';
        this.name = 'Grovyle';
        this.fullName = 'Grovyle RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target.specialConditions.length === 0) {
                return state;
            }
            if (!effect.energyCard.provides.includes(card_types_1.CardType.GRASS)) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach(condition => {
                effect.target.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.Grovyle = Grovyle;
