"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psy Alert',
                cost: [C],
                damage: 20,
                text: 'Draw cards until you have 6 cards in your hand.'
            },
            {
                name: 'Shadow Ball',
                cost: [P],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Espeon';
        this.fullName = 'Espeon PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Psy Alert
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 6);
        }
        // Attack 2: Shadow Ball - 40 damage to any of opponent's Pokemon, applying W/R even for bench
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Use DealDamageEffect for all targets (applies W/R even for bench)
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 40);
                dealDamage.target = targets[0];
                store.reduceEffect(state, dealDamage);
            });
        }
        return state;
    }
}
exports.Espeon = Espeon;
