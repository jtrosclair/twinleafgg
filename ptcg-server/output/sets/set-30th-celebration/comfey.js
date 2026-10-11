"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comfey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Comfey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Comforting Aroma',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 80 damage from 1 of your Benched Pokémon.'
            },
            {
                name: 'Magical Shot',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Comfey';
        this.fullName = 'Comfey 30C';
    }
    reduceEffect(store, state, effect) {
        // Comforting Aroma
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, targets[0], 80);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Comfey = Comfey;
