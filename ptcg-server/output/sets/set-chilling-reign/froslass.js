"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useLeParfum(next, store, state, self, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        const stub = new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: game_1.PowerType.ABILITY,
            text: ''
        }, self);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return state;
    }
    yield state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
            return;
        }
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
        }
    });
}
class Froslass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Frost Over',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may attach a [W] Energy card from your discard pile to 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Crystal Breath',
                cost: [W, C],
                damage: 90,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Froslass';
        this.fullName = 'Froslass CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useLeParfum(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        // Crystal Breath
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Froslass = Froslass;
