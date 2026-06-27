"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raboot = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raboot extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scorbunny';
        this.hp = 100;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Jumping Kick',
                cost: [C],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Raboot';
        this.fullName = 'Raboot M1L';
    }
    reduceEffect(store, state, effect) {
        // Jumping Kick
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 40, targets);
            });
        }
        return state;
    }
}
exports.Raboot = Raboot;
