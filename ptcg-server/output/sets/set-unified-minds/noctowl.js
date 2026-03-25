"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noctowl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Noctowl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoothoot';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Blindside',
                cost: [C, C],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Slashing Claw',
                cost: [C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '166';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Noctowl';
        this.fullName = 'Noctowl UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Blindside
        // Ref: set-paradox-rift/technical-machine-blindside.ts (Blindside)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            let hasDamagedPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    hasDamagedPokemon = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasDamagedPokemon) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 60, targets);
            });
        }
        return state;
    }
}
exports.Noctowl = Noctowl;
