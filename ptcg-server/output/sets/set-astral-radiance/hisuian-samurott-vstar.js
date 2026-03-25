"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianSamurottVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_effects_2 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianSamurottVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 270;
        this.evolvesFrom = 'Hisuian Samurott V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Moon Cleave Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may put 4 damage counters on 1 of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.attacks = [
            {
                name: 'Merciless Blade',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 110,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 110 more damage.'
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Hisuian Samurott VSTAR';
        this.fullName = 'Hisuian Samurott VSTAR ASR';
    }
    reduceEffect(store, state, effect) {
        // Moon Cleave Star: VSTAR power - put 4 damage counters on 1 of opponent's Pokemon
        // Ref: set-brilliant-stars/arceus-vstar.ts (VSTAR power pattern)
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length === 0) {
                    return;
                }
                // Use PutDamageCountersEffect so damage prevention abilities can intercept
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this, targets[0]);
                const putDamage = new game_effects_2.PutDamageCountersEffect(powerEffect, 40);
                store.reduceEffect(state, putDamage);
            });
        }
        // Merciless Blade: 110 + 110 if opponent's active already has damage counters
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 110;
            }
        }
        return state;
    }
}
exports.HisuianSamurottVSTAR = HisuianSamurottVSTAR;
