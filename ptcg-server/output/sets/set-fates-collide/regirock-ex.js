"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegirockEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RegirockEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Regi Power',
                powerType: game_1.PowerType.ABILITY,
                text: 'The attacks of your [F] Pokémon (excluding Regirock-EX) do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Bedrock Press',
                cost: [F, F, F],
                damage: 100,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'FCO';
        this.name = 'Regirock-EX';
        this.fullName = 'Regirock EX FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.BEDROCK_PRESS_MARKER = 'BEDROCK_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Regi Power
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.FIGHTING) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (player !== owner) {
                return state;
            }
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 10;
            }
        }
        // Bedrock Press
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            this.marker.addMarker(this.BEDROCK_PRESS_MARKER, this);
            opponent.marker.addMarker(this.BEDROCK_PRESS_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.BEDROCK_PRESS_MARKER, this)) {
            effect.damage -= 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BEDROCK_PRESS_MARKER, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            effect.player.marker.removeMarker(this.BEDROCK_PRESS_MARKER, this);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    card.marker.removeMarker(this.BEDROCK_PRESS_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.RegirockEx = RegirockEx;
