"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaFloetteex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaFloetteex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 250;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gentle Light',
                cost: [P],
                damage: 0,
                text: 'Heal 30 damage from each Pokemon (both yours and your opponent\'s).'
            },
            {
                name: 'Eternity Bloom',
                cost: [P, P, P],
                damage: 200,
                text: 'Search your deck for up to 4 Basic [P] Energy cards and attach them to your Benched Pokemon in any way you like. Then, shuffle your deck.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Mega Floette ex';
        this.fullName = 'Mega Floette ex M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            if (targets.length > 0) {
                targets.forEach(target => {
                    const healEffect = new game_effects_1.HealEffect(player, target, 30);
                    store.reduceEffect(state, healEffect);
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: false, min: 0, max: 4 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                return (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.MegaFloetteex = MegaFloetteex;
