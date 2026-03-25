"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koraidonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Koraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 230;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Dino Cry',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach up to 2 Basic [F] Energy cards from your discard pile to your Basic [F] Pokémon in any way you like. If you use this Ability, your turn ends.'
            }];
        this.attacks = [{
                name: 'Wild Impact',
                cost: [F, F, C],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Koraidon ex';
        this.fullName = 'Koraidon ex SVI';
    }
    reduceEffect(store, state, effect) {
        // Wild Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.FIGHTING);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // let fightingPokemonOnBench = false;
            // player.bench.forEach(benchSpot => {
            //   const card = benchSpot.getPokemonCard();
            //   if (card && card.cardType === CardType.FIGHTING && card.stage === Stage.BASIC) {
            //     fightingPokemonOnBench = true;
            //   }
            // });
            // if (!fightingPokemonOnBench) {
            //   throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            // }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.FIGHTING) {
                    blocked2.push(target);
                }
                if (card.stage !== card_types_1.Stage.BASIC) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: false, min: 1, max: 2, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                transfers.forEach(transfer => {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                });
            });
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        return state;
    }
}
exports.Koraidonex = Koraidonex;
