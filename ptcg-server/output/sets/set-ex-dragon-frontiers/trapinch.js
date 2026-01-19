"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trapinch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Trapinch extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Quick Bind',
                cost: [P],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Trapinch';
        this.fullName = 'Trapinch DF 69';
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
                target.damage += 10;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 10);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.Trapinch = Trapinch;
