"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaEelektrossex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class MegaEelektrossex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 350;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Split Bomb',
                cost: [L, L],
                damage: 0,
                text: 'This attack does 60 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Disaster Shock',
                cost: [L, L, L],
                damage: 190,
                text: 'You may discard 2 [L] Energy from this Pokémon and make your opponent\'s Active Pokemon Paralyzed.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Eelektross ex';
        this.fullName = 'Mega Eelektross ex M2a';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // Split Bomb: 60 damage to 2 opponent's Pokemon
            // Don't apply Weakness and Resistance for Benched Pokemon
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(60, effect, store, state, 2, 2, false, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Disaster Shock: 190 damage, optionally discard 2 [L] Energy to Paralyze
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, L);
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        return state;
    }
}
exports.MegaEelektrossex = MegaEelektrossex;
