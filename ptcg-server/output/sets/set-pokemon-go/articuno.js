"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ice Symbol',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic [W] Pokémon\'s attacks, except any Articuno, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Freezing Wind',
                cost: [W, W, C],
                damage: 110,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Articuno';
        this.fullName = 'Articuno PGO';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const hasArticunoInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfArticunoInPlay = 0;
            if (hasArticunoInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfArticunoInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(W) && effect.target === opponent.active) {
                if (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Articuno' && ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) === card_types_1.Stage.BASIC) {
                    effect.damage += 10 * numberOfArticunoInPlay;
                }
            }
        }
        return state;
    }
}
exports.Articuno = Articuno;
