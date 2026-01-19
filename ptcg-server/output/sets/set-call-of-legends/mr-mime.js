"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Trick Reveal',
                powerType: game_2.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may have both you and your opponent reveal your hands. This power can\'t be used if Mr.Mime is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Juggling',
                cost: [P, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
            }];
        this.set = 'CL';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime CL';
        this.TRICK_REVEAL_MARKER = 'TRICK_REVEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.TRICK_REVEAL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.TRICK_REVEAL_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponent.hand.cards);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, player.hand.cards);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.TRICK_REVEAL_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.MrMime = MrMime;
