"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifblim = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drifblim extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drifloon';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [];
        this.powers = [{
                name: 'Drifting Balloon',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost [C] less for each of your opponent\'s Team Plasma Pokémon in play.'
            }];
        this.attacks = [{
                name: 'Derail',
                cost: [C, C, C],
                damage: 70,
                text: 'Discard a Special Energy attached to the Defending Pokémon.'
            }];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Drifblim';
        this.fullName = 'Drifblim PLB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && (effect.attack === this.attacks[0]
            || this.tools.some(tool => tool.attacks && tool.attacks.includes(effect.attack)))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count Team Plasma Pokémon in play for the opponent
            const countSpecialPokemon = (player) => {
                const specialTags = [card_types_2.CardTag.TEAM_PLASMA];
                let count = 0;
                // Check active Pokémon
                const activePokemon = player.active.getPokemonCard();
                if (activePokemon && specialTags.some(tag => activePokemon.tags.includes(tag))) {
                    count++;
                }
                // Check bench Pokémon
                player.bench.forEach(slot => {
                    const benchPokemon = slot.getPokemonCard();
                    if (benchPokemon && specialTags.some(tag => benchPokemon.tags.includes(tag))) {
                        count++;
                    }
                });
                return count;
            };
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const specialPokemonCount = countSpecialPokemon(opponent);
            // Determine Colorless energy reduction based on special Pokémon count
            const colorlessToRemove = Math.min(specialPokemonCount, 3);
            // Remove Colorless energy from attack cost
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            let hasPokemonWithEnergy = false;
            if (activePokemonCard && activeCardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                hasPokemonWithEnergy = true;
            }
            if (!hasPokemonWithEnergy) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Drifblim = Drifblim;
