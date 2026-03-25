"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaAudinoex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaAudinoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Kaleidowaltz',
                cost: [C],
                damage: 0,
                text: 'Flip 3 coins. For each heads, search your deck for up to 2 Basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Ear Force',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 80 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
        this.name = 'Mega Audino ex';
        this.fullName = 'Mega Audino ex MC';
    }
    reduceEffect(store, state, effect) {
        // Kaleidowaltz attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const coinFlips = [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN)
            ];
            return store.prompt(state, coinFlips, results => {
                const headsCount = Array.isArray(results) ? results.filter(r => r === true).length : (results === true ? 1 : 0);
                const energyToAttach = headsCount * 2;
                if (energyToAttach > 0) {
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: energyToAttach }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length > 0) {
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                player.deck.moveCardTo(transfer.card, target);
                            }
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
                else {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        // Ear Force attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 80;
        }
        return state;
    }
}
exports.MegaAudinoex = MegaAudinoex;
