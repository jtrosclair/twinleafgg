"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vikavolt = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useStrongCharge(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const blocked = player.deck.cards
        .filter(c => c.name !== 'Grass Energy' && c.name !== 'Lightning Energy')
        .map(c => player.deck.cards.indexOf(c));
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2, blocked }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            if (transfers.length > 1) {
                if (transfers[0].card.name === transfers[1].card.name) {
                    throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                }
            }
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Vikavolt extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charjabug';
        this.cardType = L;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Strong Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a [G] Energy card and a [L] Energy card and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Electro Cannon',
                cost: [L, C, C, C],
                damage: 150,
                text: 'Discard 3 Energy from this Pokémon.'
            }];
        this.set = 'SUM';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vikavolt';
        this.fullName = 'Vikavolt SUM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const generator = useStrongCharge(() => generator.next(), store, state, effect);
            prefabs_1.ABILITY_USED(effect.player, this);
            return generator.next().value;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
        }
        return state;
    }
}
exports.Vikavolt = Vikavolt;
