"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greninjaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Greninjaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Frogadier';
        this.hp = 300;
        this.cardType = card_types_1.CardType.WATER;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stealthy Slash',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: "This attack does 30 damage to 1 of your opponent's Pokémon for each damage counter on that Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
            },
            {
                name: 'Aqua Edge',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 160,
                text: '',
            },
        ];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Greninja ex';
        this.fullName = 'Greninja ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-stellar-crown/raging-bolt.ts (choose active or bench), set-vivid-voltage/barraskewda.ts (damage per counter on target)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), (selected) => {
                const targets = selected || [];
                targets.forEach((target) => {
                    const damageAmount = 3 * target.damage;
                    if (damageAmount > 0) {
                        (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, damageAmount, [target]);
                    }
                });
            });
        }
        return state;
    }
}
exports.Greninjaex = Greninjaex;
