"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmontop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Hitmontop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rapid Spin',
                cost: [F],
                damage: 30,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            },
            {
                name: 'Triple Kick',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 40 damage for each heads.'
            }];
        this.set = 'LOT';
        this.name = 'Hitmontop';
        this.fullName = 'Hitmontop LOT';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (playerBench === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0)
                    return state;
                const target = selected[0];
                player.switchPokemon(target);
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Hitmontop = Hitmontop;
