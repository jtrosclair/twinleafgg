"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Omanyte = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Omanyte extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ancient Tentacles',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Damage done to your opponent\'s Pokémon by your Omanyte, Omastar, Kabuto, Kabutops, or Kabutops ex isn\'t affected by Resistance.',
            }];
        this.attacks = [{
                name: 'Rising Lunge',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Omanyte';
        this.fullName = 'Omanyte LM';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d, _e;
        if (effect instanceof game_effects_1.AttackEffect && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            let isOmanyteInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isOmanyteInPlay = true;
                }
            });
            if (!isOmanyteInPlay) {
                return state;
            }
            if (((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Omanyte' ||
                ((_b = effect.source.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Omastar' ||
                ((_c = effect.source.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.name) === 'Kabuto' ||
                ((_d = effect.source.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.name) === 'Kabutops' ||
                ((_e = effect.source.getPokemonCard()) === null || _e === void 0 ? void 0 : _e.name) === 'Kabutops ex') {
                effect.ignoreResistance = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Omanyte = Omanyte;
