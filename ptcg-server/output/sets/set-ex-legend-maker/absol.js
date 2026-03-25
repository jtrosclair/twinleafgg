"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Absol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Shining Horn',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Absol is the only Pokémon you have in play, your opponent\'s Basic Pokémon can\'t attack.'
            }];
        this.attacks = [{
                name: 'Extra Call',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Pokémon-ex, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Feint Attack',
                cost: [D, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon.This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
            }];
        this.set = 'LM';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Absol';
        this.fullName = 'Absol LM';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect &&
            !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this) &&
            ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            let hasBenchPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList === opponent.active) {
                    return;
                }
                if (cardList.cards.length > 0) {
                    hasBenchPokemon = true;
                }
            });
            if (opponent.active.getPokemonCard() === this && !hasBenchPokemon) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 0, max: 1, allowCancel: false, blocked });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                target.damage += 20;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 20);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.Absol = Absol;
