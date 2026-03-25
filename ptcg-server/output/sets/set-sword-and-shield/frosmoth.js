"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frosmoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Frosmoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snom';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ice Dance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may attach a [W] Energy card from your hand to 1 of your Benched [W] Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Aurora Beam',
                cost: [W, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SSH';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Frosmoth';
        this.fullName = 'Frosmoth SSH';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let hasWaterPokemonOnBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                    hasWaterPokemonOnBench = true;
                }
            });
            if (!hasWaterPokemonOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const checkTransferTypeEffect = new check_effects_1.CheckPokemonTypeEffect(target);
                    store.reduceEffect(state, checkTransferTypeEffect);
                    if (!checkTransferTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                        throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                    }
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        return state;
    }
}
exports.Frosmoth = Frosmoth;
