"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vespiquenex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vespiquenex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Combee';
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Healing Pheromone',
                cost: [G],
                damage: 0,
                text: 'Heal 60 damage from 1 of your Pokémon.'
            },
            {
                name: 'Phantom Queen',
                cost: [G, G, G],
                damage: 200,
                text: 'Put 3 damage counters on each of your opponent\'s Benched Pokémon that has any damage counters on it.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Vespiquen ex';
        this.fullName = 'Vespiquen ex OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.HealTargetEffect(effect, 60);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            if (opponent.active.damage > 0) {
                const activeDamageEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                activeDamageEffect.target = opponent.active;
                store.reduceEffect(state, activeDamageEffect);
            }
            opponent.bench.forEach((bench, index) => {
                if (bench.cards.length > 0 && bench.damage > 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 30);
                    damageEffect.target = bench;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Vespiquenex = Vespiquenex;
