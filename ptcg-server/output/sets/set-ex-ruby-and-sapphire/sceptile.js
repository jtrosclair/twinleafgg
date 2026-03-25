"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sceptile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Sceptile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grovyle';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Energy Trans',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), move a [G] Energy card attached to 1 of your Pokémon to another of your Pokémon. This power can\'t be used if Sceptile is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Tail Rap',
                cost: [G, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Sceptile';
        this.fullName = 'Sceptile RS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.GRASS) && !em.provides.includes(card_types_1.CardType.ANY)) {
                        blockedCards.push(em.card);
                    }
                });
                const blocked = [];
                blockedCards.forEach(bc => {
                    const index = cardList.cards.indexOf(bc);
                    if (index !== -1 && !blocked.includes(index)) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Sceptile = Sceptile;
