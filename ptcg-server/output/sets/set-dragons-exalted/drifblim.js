"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifblim = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Drifblim extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drifloon';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shadow Steal',
                cost: [C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Does 50 damage times the number of Special Energy cards in your opponent\'s discard pile.'
            },
            {
                name: 'Plentiful Placement',
                cost: [P, C],
                damage: 0,
                text: 'Put 4 damage counters on 1 of your opponent\'s Pokémon.',
            },
        ];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Drifblim';
        this.fullName = 'Drifblim DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            effect.damage = 50 * opponent.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === game_1.EnergyType.SPECIAL).length;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 40);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Drifblim = Drifblim;
