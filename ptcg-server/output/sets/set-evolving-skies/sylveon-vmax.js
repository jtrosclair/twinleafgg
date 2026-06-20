"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SylveonVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SylveonVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Sylveon V';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Precious Touch',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Attach an Energy card from your hand to 1 of your Benched Pokémon. If you do, heal 120 damage from that Pokémon.'
            },
            {
                name: 'Max Harmony',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Sylveon VMAX';
        this.fullName = 'Sylveon VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    const healEffect = new game_effects_1.HealEffect(player, target, 120);
                    store.reduceEffect(state, healEffect);
                }
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const playerBench = player.bench;
            const uniqueTypes = new Set();
            playerBench.forEach(c => {
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    const checkEffect = new check_effects_1.CheckPokemonTypeEffect(c);
                    store.reduceEffect(state, checkEffect);
                    checkEffect.cardTypes.forEach(type => uniqueTypes.add(type));
                }
            });
            // Set the damage based on the count of unique Pokémon types
            effect.damage += 30 * uniqueTypes.size;
            return state;
        }
        return state;
    }
}
exports.SylveonVMAX = SylveonVMAX;
