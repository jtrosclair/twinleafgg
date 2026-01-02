"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arcanineex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_2 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Arcanineex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Growlithe';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Fire Remedy',
                powerType: game_2.PowerType.POKEBODY,
                text: 'Whenever you attach a [R] Energy from your hand to Arcanine ex, remove 1 damage counter and all Special Conditions from Arcanine ex.'
            }];
        this.attacks = [{
                name: 'Overrun',
                cost: [R, C],
                damage: 30,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Flame Swirl',
                cost: [R, R, C],
                damage: 100,
                text: 'Discard 2 [R] Energy or 1 React Energy card attached to Arcanine ex.'
            }];
        this.set = 'LM';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Arcanine ex';
        this.fullName = 'Arcanine ex LM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemonCard() === this) {
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (effect.energyCard.energyType === card_types_1.EnergyType.BASIC && effect.energyCard.provides.includes(card_types_1.CardType.FIRE)) {
                // heal
                const healEffect = new game_effects_1.HealEffect(effect.player, effect.target, 10);
                store.reduceEffect(state, healEffect);
                //remove special conditions
                const conditions = effect.target.specialConditions.slice();
                conditions.forEach(condition => {
                    effect.target.removeSpecialCondition(condition);
                });
            }
            // Check special energies that provide [W]
            if (effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                // Temporarily push the energy card to the list of cards to check if it provides [W]
                effect.target.cards.push(effect.energyCard);
                const checkFireEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.target);
                store.reduceEffect(state, checkFireEnergy);
                effect.target.cards.pop();
                const energyMap = checkFireEnergy.energyMap.find(element => element.card === effect.energyCard);
                const providedEnergy = energyMap === null || energyMap === void 0 ? void 0 : energyMap.provides;
                if ((providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.FIRE))
                    || (providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.ANY))) {
                    //heal
                    const healEffect = new game_effects_1.HealEffect(effect.player, effect.target, 10);
                    store.reduceEffect(state, healEffect);
                    //remove special conditions
                    const conditions = effect.target.specialConditions.slice();
                    conditions.forEach(condition => {
                        effect.target.removeSpecialCondition(condition);
                    });
                }
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            // See if there is holon energy attached
            const hasReactEnergy = player.active.energies.cards.some(card => card.name === 'React Energy');
            const options = [];
            if (hasReactEnergy) {
                options.push({
                    message: game_2.GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
                    action: () => {
                        const player = effect.player;
                        // Prompt the player to choose one 'React Energy' to discard (in case there are multiple)
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { name: 'React Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                const discardEffect = new attack_effects_2.DiscardCardsEffect(effect, cards);
                                discardEffect.target = player.active;
                                return store.reduceEffect(state, discardEffect);
                            }
                            return state;
                        });
                    }
                });
            }
            options.push({
                message: game_2.GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
                action: () => {
                    costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, card_types_1.CardType.FIRE);
                }
            });
            if (options.length === 1) {
                options[0].action();
            }
            else {
                return store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_2.GameMessage.CHOOSE_OPTION, [
                    'Discard 1 React Energy attached to Arcanine ex',
                    'Discard 2 Fire Energy attached to Arcanine ex'
                ], {
                    allowCancel: false,
                }), choice => {
                    const option = options[choice];
                    option.action();
                });
            }
        }
        return state;
    }
}
exports.Arcanineex = Arcanineex;
