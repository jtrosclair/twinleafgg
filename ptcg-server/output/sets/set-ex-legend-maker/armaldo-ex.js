"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armaldoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Armaldoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Anorith';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 160;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Dual Armor',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Armaldo ex has any React Energy cards attached to it, Armaldo ex is both [G] and [F] type.'
            }];
        this.attacks = [{
                name: 'Spiral Drain',
                cost: [F, C],
                damage: 40,
                text: 'Remove 2 damage counters from Armaldo ex.'
            },
            {
                name: 'Vortex Chop',
                cost: [F, C, C],
                damage: 70,
                text: 'If the Defending Pokémon has any Resistance, this attack\'s base damage is 100 instead of 70.'
            }];
        this.set = 'LM';
        this.name = 'Armaldo ex';
        this.fullName = 'Armaldo ex LM';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !prefabs_1.IS_POKEBODY_BLOCKED(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    const energies = new game_1.CardList();
                    energies.cards = cardList.cards.filter(card => card.name === 'React Energy');
                    if (energies.cards.length > 0) {
                        effect.cardTypes = [G, F];
                    }
                    return state;
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const target = effect.opponent.active.getPokemonCard();
            if ((target === null || target === void 0 ? void 0 : target.resistance) !== undefined && target.resistance.length > 0) {
                effect.damage = 100;
            }
        }
        return state;
    }
}
exports.Armaldoex = Armaldoex;
