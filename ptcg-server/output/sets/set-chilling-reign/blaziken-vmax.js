"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlazikenVMAX = void 0;
const game_1 = require("../../game");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BlazikenVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VMAX;
        this.tags = [game_1.CardTag.POKEMON_VMAX, game_1.CardTag.RAPID_STRIKE];
        this.evolvesFrom = 'Blaziken V';
        this.cardType = R;
        this.hp = 320;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Clutch',
                cost: [R],
                damage: 60,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Max Blaze',
                cost: [C, C],
                damage: 130,
                text: 'Choose up to 2 of your Benched Rapid Strike Pokémon and attach an Energy card from your discard pile to each of them.'
            }];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Blaziken VMAX';
        this.fullName = 'Blaziken VMAX CRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            let rapidStrikePokemonOnBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(game_1.CardTag.RAPID_STRIKE)) {
                    rapidStrikePokemonOnBench = true;
                }
            });
            if (!rapidStrikePokemonOnBench) {
                return state;
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.RAPID_STRIKE)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 0, max: 2, blocked: blocked2 }), chosen => {
                chosen.forEach(target => {
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                });
            });
        }
        return state;
    }
}
exports.BlazikenVMAX = BlazikenVMAX;
