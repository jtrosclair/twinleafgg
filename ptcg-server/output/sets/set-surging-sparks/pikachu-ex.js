"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachuex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pikachuex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tenacious Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP and would be Knocked Out by an attack, it isn\'t Knocked Out and its remaining HP becomes 10 instead.'
            }];
        this.attacks = [
            {
                name: 'Topaz Bolt',
                cost: [game_1.CardType.GRASS, game_1.CardType.LIGHTNING, game_1.CardType.METAL],
                damage: 300,
                text: 'Discard 3 Energy from this Pokémon.'
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pikachu ex';
        this.fullName = 'Pikachu ex SSP';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this) && (0, prefabs_1.DAMAGED_FROM_FULL_HP)(store, state, effect, player, effect.target)) {
                effect.surviveOnTenHPReason = this.powers[0].name;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
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
exports.Pikachuex = Pikachuex;
