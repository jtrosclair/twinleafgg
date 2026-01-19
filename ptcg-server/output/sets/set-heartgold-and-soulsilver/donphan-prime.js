"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donphan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Donphan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.tags = [card_types_1.CardTag.PRIME];
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Donphan by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Earthquake',
                cost: [F],
                damage: 60,
                text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Heavy Impact',
                cost: [F, F, F],
                damage: 90,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Donphan';
        this.fullName = 'Donphan HS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.damage -= 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                const damage = new attack_effects_1.PutDamageEffect(effect, 10);
                damage.target = cardList;
                store.reduceEffect(state, damage);
            });
        }
        return state;
    }
}
exports.Donphan = Donphan;
