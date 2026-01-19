"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jynx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Stages of Evolution',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Jynx is an Evolved Pokémon, you pay [C] less to retreat your [R] and [P] Pokémon.'
            }];
        this.attacks = [{
                name: 'Fire Punch',
                cost: [R, C],
                damage: 30,
                text: ''
            }];
        this.set = 'DF';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jynx';
        this.fullName = 'Jynx DF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isJynxInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.getPokemons().length > 1) {
                    isJynxInPlay = true;
                }
            });
            if (!isJynxInPlay) {
                return state;
            }
            let cardTypes = [active.cardType];
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonType);
            cardTypes = checkPokemonType.cardTypes;
            if (!(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this) && (cardTypes.includes(card_types_1.CardType.PSYCHIC) || cardTypes.includes(card_types_1.CardType.FIRE))) {
                const colorlessIndex = effect.cost.lastIndexOf(card_types_1.CardType.COLORLESS);
                if (colorlessIndex !== -1) {
                    effect.cost.splice(colorlessIndex, 1);
                }
            }
        }
        return state;
    }
}
exports.Jynx = Jynx;
