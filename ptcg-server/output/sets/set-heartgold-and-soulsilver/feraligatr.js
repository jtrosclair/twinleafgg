"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feraligatr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feraligatr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Croconaw';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Torrential Heart',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), you may attach a [W] Energy card from your hand to 1 of your [W] Pokémon. This power can\'t be used if Feraligatr is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Hydro Crunch',
                cost: [W, W, W, W],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 60 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            }];
        this.set = 'HS';
        this.setNumber = '108';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Feraligatr';
        this.fullName = 'Feraligatr HS';
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
            let hasWaterPokemon = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                    hasWaterPokemon = true;
                }
            });
            if (!hasWaterPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(effect.player, this);
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true }), transfers => {
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
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += opponent.active.damage;
        }
        return state;
    }
}
exports.Feraligatr = Feraligatr;
