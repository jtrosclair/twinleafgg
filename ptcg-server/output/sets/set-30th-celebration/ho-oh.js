"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoOh = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HoOh extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.FIRE;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sacred Breath',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard all Energy from this Pokémon. Heal all damage from 1 of your Benched Pokémon.'
            },
            {
                name: 'Fire Wing',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Ho-Oh';
        this.fullName = 'Ho-Oh 30C';
    }
    reduceEffect(store, state, effect) {
        // Sacred Breath
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            const hasDamagedBench = player.bench.some(b => b.cards.length > 0 && b.damage > 0);
            if (!hasDamagedBench) {
                return state;
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList === player.active || cardList.damage === 0) {
                    blocked.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                if (!selected || selected.length === 0) {
                    return;
                }
                const target = selected[0];
                const healEffect = new attack_effects_1.HealTargetEffect(effect, target.damage);
                healEffect.target = target;
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.HoOh = HoOh;
