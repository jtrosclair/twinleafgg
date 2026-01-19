"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsSandaconda = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HopsSandaconda extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hop\'s Silicobra';
        this.tags = [card_types_1.CardTag.HOPS];
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rumble',
                cost: [F, C],
                damage: 30,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.',
            },
            {
                name: 'Break Ground',
                cost: [F, C, C],
                damage: 140,
                text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
            }];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Hop\'s Sandaconda';
        this.fullName = 'Hop\'s Sandaconda JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.HopsSandaconda = HopsSandaconda;
