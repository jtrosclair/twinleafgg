"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalinksV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class FalinksV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 160;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Iron Defense Formation',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'All of your Pokémon that have "Falinks" in their name take 20 less damage from your opponent\'s attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Giga Impact',
                cost: [F, F, C],
                damage: 210,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'D';
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Falinks V';
        this.fullName = 'Falinks V RCL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            let falinksVCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
                if (card.name && card.name.indexOf('Falinks V') !== -1) {
                    falinksVCount++;
                }
            });
            if (falinksVCount === 0) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const targetPokemon = effect.target.getPokemonCard();
            if (targetPokemon && game_1.StateUtils.findOwner(state, effect.target) === player && targetPokemon.name && targetPokemon.name.indexOf('Falinks') !== -1) {
                effect.reduceDamage(20 * falinksVCount, this.powers[0].name);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.FalinksV = FalinksV;
