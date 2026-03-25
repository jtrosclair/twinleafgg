"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyranitarex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tyranitarex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pupitar';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = L;
        this.hp = 340;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Mountain Hurl',
                cost: [F],
                damage: 120,
                text: 'Discard the top 2 cards of your deck.'
            },
            {
                name: 'Lightning Rampage',
                cost: [F, F],
                damage: 150,
                damageCalculation: '+',
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 100 more damage.'
            },
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Tyranitar ex';
        this.fullName = 'Tyranitar ex OBF';
    }
    reduceEffect(store, state, effect) {
        // Mountain Hurl
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 2);
        }
        // Lightning Rampage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // checking if this pokemon is in play
            let isThereDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage > 0) {
                    isThereDamage = true;
                }
            });
            if (isThereDamage) {
                effect.damage += 100;
            }
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
exports.Tyranitarex = Tyranitarex;
