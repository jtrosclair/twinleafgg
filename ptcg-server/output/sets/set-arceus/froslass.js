"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Froslass extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Snow Gift',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: false,
                text: 'Once during your turn, when you play Froslass from your hand to evolve 1 of your Pokémon, you may search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Ground Frost',
                cost: [W, C],
                damage: 50,
                text: 'If there is any Stadium Card in play, this attack does nothing.'
            },
        ];
        this.set = 'AR';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Froslass';
        this.fullName = 'Froslass AR';
    }
    reduceEffect(store, state, effect) {
        // Snow Gift
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            if ((0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 1, max: 1 }, this.powers[0]);
                }
            }))
                return state;
        }
        // Ground Frost
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Froslass = Froslass;
