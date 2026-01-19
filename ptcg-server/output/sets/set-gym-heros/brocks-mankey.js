"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrocksMankey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BrocksMankey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BROCKS];
        this.cardType = F;
        this.hp = 40;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.attacks = [{
                name: 'Taunt',
                cost: [C],
                damage: 0,
                text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with the Defending Pokémon.'
            },
            {
                name: 'Light Kick',
                cost: [F],
                damage: 10,
                text: ''
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Brock\'s Mankey';
        this.fullName = 'Brock\'s Mankey G1';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            else {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                    return state;
                });
            }
        }
        return state;
    }
}
exports.BrocksMankey = BrocksMankey;
