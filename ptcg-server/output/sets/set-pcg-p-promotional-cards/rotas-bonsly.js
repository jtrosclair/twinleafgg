"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotasBonsly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RotasBonsly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Feint Attack',
                cost: [F, C],
                damage: 0,
                text: 'Does 20 damage to 1 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on that Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'Rota\'s Bonsly';
        this.fullName = 'Rota\'s Bonsly PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                target.damage += 20;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 20);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.RotasBonsly = RotasBonsly;
