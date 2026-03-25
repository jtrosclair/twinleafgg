"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Simisear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansear';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flame Burst',
                cost: [R],
                damage: 20,
                text: 'Does 20 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Fury Swipes',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Simisear';
        this.fullName = 'Simisear BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchedTargets = opponent.bench.filter(b => b.cards.length > 0);
            if (benchedTargets.length === 0) {
                return state;
            }
            const maxTargets = Math.min(2, benchedTargets.length);
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: maxTargets, max: maxTargets, allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    targets.forEach(target => {
                        const putDamage = new attack_effects_1.PutDamageEffect(effect, 20);
                        putDamage.target = target;
                        store.reduceEffect(state, putDamage);
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Simisear = Simisear;
