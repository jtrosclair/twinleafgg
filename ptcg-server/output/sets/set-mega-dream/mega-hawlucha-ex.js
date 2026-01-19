"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaHawluchaex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaHawluchaex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 250;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [{
                name: 'Resilient Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon would be Knocked Out by damage from an attack, flip a coin. If heads, this Pokémon is not Knocked Out, and its remaining HP becomes 10.'
            }];
        this.attacks = [{
                name: 'Somersault Dive',
                cost: [F, F, C],
                damage: 120,
                text: 'If there is a Stadium in play, this attack does 140 more damage. Then, discard that Stadium.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.setNumber = '94';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Hawlucha ex';
        this.fullName = 'Mega Hawlucha ex M2a';
    }
    reduceEffect(store, state, effect) {
        // Resilient Body ability
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Check if damage would cause knockout
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= checkHpEffect.hp) {
                // Flip a coin to see if we survive
                return store.prompt(state, new game_2.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP), result => {
                    if (result === true) {
                        // If heads, prevent knockout and set HP to 10
                        effect.surviveOnTenHPReason = this.powers[0].name;
                    }
                    return state;
                });
            }
        }
        // Somersault Dive attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                // Add 140 damage if Stadium is in play
                effect.damage += 140;
                // Discard the Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(stadiumOwner.discard);
            }
        }
        return state;
    }
}
exports.MegaHawluchaex = MegaHawluchaex;
