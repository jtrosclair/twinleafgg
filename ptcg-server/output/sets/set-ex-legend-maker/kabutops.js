"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabutops = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kabutops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kabuto';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ancient Shell',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as you have Omanyte or Omastar in play, damage done to Kabutops by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Energy Stream',
                cost: [F],
                damage: 30,
                text: 'Search your discard pile for a basic Energy card and attach it to Kabutops.'
            },
            {
                name: 'Extra Claws',
                cost: [F, C, C],
                damage: 50,
                text: 'If the Defending Pokémon is Pokémon-ex, this attack does 50 damage plus 30 more damage.'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Kabutops';
        this.fullName = 'Kabutops LM';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            let isOmaInPlay = false;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Omanyte' || card.name === 'Omastar') {
                    isOmaInPlay = true;
                }
            });
            if (!isOmaInPlay) {
                return state;
            }
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.damage -= 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON)(store, state, player, 1, undefined, {
                destinationSlots: [game_1.SlotType.ACTIVE],
                energyFilter: { energyType: card_types_1.EnergyType.BASIC },
                min: 0
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active;
            if ((_a = defendingPokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Kabutops = Kabutops;
