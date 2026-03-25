"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegielekiVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RegielekiVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Regieleki V';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.powers = [{
                name: 'Transistor',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic [L] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Max Thunder and Lightning',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Regieleki VMAX';
        this.fullName = 'Regieleki VMAX SIT';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Max Thunder and Lightning
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const hasZapdosInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfRegielekiVMAXInPlay = 0;
            if (hasZapdosInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfRegielekiVMAXInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.LIGHTNING) && effect.target === opponent.active) {
                if (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                    effect.damage += 30 * numberOfRegielekiVMAXInPlay;
                }
            }
        }
        return state;
    }
}
exports.RegielekiVMAX = RegielekiVMAX;
