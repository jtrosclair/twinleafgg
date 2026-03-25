"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydreigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = D;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Tractorbeam',
                cost: [D, C, C],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. This attack does 40 damage to the new Defending Pokémon.'
            },
            {
                name: 'Obsidian Fang',
                cost: [D, C, C, C],
                damage: 80,
                text: 'Before doing damage, discard all Pokémon Tool cards attached to the Defending Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '78';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Tractorbeam
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                // Just do 40 to active if no bench
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 40);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Switch the selected benched Pokemon with opponent's active
                opponent.switchPokemon(targets[0]);
                // Do 40 damage to the new active
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 40);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
            });
        }
        // Attack 2: Obsidian Fang - discard all tools before doing damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard all Pokemon Tool cards from defending Pokemon
            const toolCards = opponent.active.cards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_2.TrainerType.TOOL);
            toolCards.forEach(tool => {
                opponent.active.moveCardTo(tool, opponent.discard);
            });
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
