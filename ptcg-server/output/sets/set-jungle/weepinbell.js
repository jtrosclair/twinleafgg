"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weepinbell = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weepinbell extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Bellsprout';
        this.attacks = [{
                name: 'Poisonpowder',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Razor Leaf',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Weepinbell';
        this.fullName = 'Weepinbell JU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Weepinbell = Weepinbell;
