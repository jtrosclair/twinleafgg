"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggutor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Exeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Delta Circle',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each Pokémon you have in play that has delta on its card.'
            },
            {
                name: 'Split Bomb',
                cost: [F, C, C],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Exeggutor';
        this.fullName = 'Exeggutor HP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // Count Delta Pokemon in play
            const player = effect.player;
            let deltaCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    deltaCount++;
                }
            });
            // Modify damage based on count
            effect.damage += 10 * deltaCount;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const max = Math.min(2);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Exeggutor = Exeggutor;
