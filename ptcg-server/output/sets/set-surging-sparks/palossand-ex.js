"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palossandex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palossandex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sandygast';
        this.cardType = P;
        this.hp = 280;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Sand Tomb',
                cost: [C, C, C],
                damage: 160,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Barite Jail',
                cost: [W, P, F],
                damage: 0,
                text: 'Put damage counters on each of your opponent\'s Benched Pokémon until its remaining HP is 100.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '91';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Palossand ex';
        this.fullName = 'Palossand ex SSP';
    }
    reduceEffect(store, state, effect) {
        // Sand Tomb
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Barite Jail
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_2.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList === opponent.active) {
                    return state;
                }
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                let resultingDamage = (checkHpEffect.hp - cardList.damage) - 100;
                if (resultingDamage <= 0) {
                    resultingDamage = 0;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, resultingDamage);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Palossandex = Palossandex;
