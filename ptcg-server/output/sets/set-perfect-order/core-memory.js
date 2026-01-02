"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreMemory = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useAttack(next, store, state, effect) {
    var _a;
    const player = effect.player;
    if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Mega Zygarde ex') {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
    }
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const cards = checkProvidedEnergy.energyMap.map(e => e.card);
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    discardEnergy.target = player.active;
    store.reduceEffect(state, discardEnergy);
    return state;
}
class CoreMemory extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Core Memory';
        this.fullName = 'Core Memory M3';
        this.attacks = [{
                name: 'Geobuster',
                cost: [F, F, F, F],
                damage: 350,
                text: 'Discard all Energy attached to this Pokémon.'
            }];
        this.text = 'The Mega Zygarde ex this card is attached to can use the attacks on this card.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.name) !== 'Mega Zygarde ex') {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const colorlessReudction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < colorlessReudction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            /*if (pokemonCard && 'getDarkReduction' in pokemonCard) {
              const darkReduction = (pokemonCard as DarkCostReducer).getDarkReduction(state);
              for (let i = 0; i < darkReduction && effect.cost.includes(CardType.DARK); i++) {
                const index = effect.cost.indexOf(CardType.DARK);
                if (index !== -1) {
                  effect.cost.splice(index, 1);
                }
              }
            }
            if (pokemonCard && 'getWaterReduction' in pokemonCard) {
              const waterReduction = (pokemonCard as WaterCostReducer).getWaterReduction(state);
              for (let i = 0; i < waterReduction && effect.cost.includes(CardType.WATER); i++) {
                const index = effect.cost.indexOf(CardType.WATER);
                if (index !== -1) {
                  effect.cost.splice(index, 1);
                }
              }
            }*/
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAttack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CoreMemory = CoreMemory;
