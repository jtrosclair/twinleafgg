"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victiniex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victiniex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 190;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Strafe',
                cost: [R],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Victory Flame',
                cost: [R, R, C],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Victini ex';
        this.fullName = 'Victini ex OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                }
            });
        }
        // Victory Flame
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Victiniex = Victiniex;
