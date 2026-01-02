"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesprit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mesprit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Upper Material',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If you have Uxie and Azelf in play, the Retreat Cost for each Uxie, Mesprit, and Azelf (both yours and your opponent\'s) is 0.'
            }];
        this.attacks = [{
                name: 'Teleportation Burst',
                cost: [P, C],
                damage: 30,
                text: 'You may switch Mesprit with 1 of your Benched Pokémon.'
            }];
        this.set = 'MT';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mesprit';
        this.fullName = 'Mesprit MT';
    }
    reduceEffect(store, state, effect) {
        // Upper Material
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isMespritInPlay = false;
            let isUxieInPlay = false;
            let isAzelfInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isMespritInPlay = true;
                }
                else if (card.name === 'Uxie') {
                    isUxieInPlay = true;
                }
                else if (card.name === 'Azelf') {
                    isAzelfInPlay = true;
                }
            });
            let isTrioInPlay = isMespritInPlay && isUxieInPlay && isAzelfInPlay;
            if (!isTrioInPlay) {
                return state;
            }
            if (!prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this) && (active.name === 'Uxie' || active.name === 'Mesprit' || active.name === 'Azelf')) {
                effect.cost = [];
            }
            return state;
        }
        // Teleportation Burst
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            if (player.bench.length > 0) {
                store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToSwitch => {
                    if (wantToSwitch) {
                        prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                    }
                });
            }
        }
        return state;
    }
}
exports.Mesprit = Mesprit;
