"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaVenusaurEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_2 = require("../../game");
const game_effects_2 = require("../../game/store/effects/game-effects");
function* moveEnergy(next, store, state, effect) {
    const player = effect.player;
    let pokemonWithEnergy = 0;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.cards.some(c => c instanceof game_2.EnergyCard)) {
            pokemonWithEnergy++;
        }
    });
    if (!pokemonWithEnergy) {
        throw new game_2.GameError(game_2.GameMessage.CANNOT_USE_POWER);
    }
    let transfers = [];
    yield store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_2.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { min: 0, allowCancel: false }), result => {
        transfers = result || [];
        next();
    });
    if (transfers.length === 0) {
        return state;
    }
    for (const transfer of transfers) {
        const source = game_2.StateUtils.getTarget(state, player, transfer.from);
        const target = game_2.StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target);
    }
    return state;
}
class MegaVenusaurEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_SV_MEGA];
        this.cardType = G;
        this.hp = 380;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Solar Trans',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'As many times as you like during your turn, you may move a Basic [G] Energy from one of your Pokémon to another one of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Jungle Dump',
                cost: [G, G, G, G],
                damage: 240,
                text: 'Heal 30 damage from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Venusaur ex';
        this.fullName = 'Mega Venusaur ex M1L';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = moveEnergy(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healEffect = new game_effects_2.HealEffect(player, player.active, 30);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.MegaVenusaurEx = MegaVenusaurEx;
