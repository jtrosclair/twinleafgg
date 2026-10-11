"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishPalkiaLvXCC12 = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed English text: https://limitlesstcg.com/cards/30C/CC12 (GE 106).
// Uses the existing LV.X previous-level inheritance architecture, not Palkia G text.
class EnglishPalkiaLvXCC12 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.LV_X;
        this.tags = [game_1.CardTag.POKEMON_LV_X];
        this.evolvesFrom = 'Palkia';
        this.hp = 120;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.set = '30C';
        this.setNumber = 'CC12';
        this.usSetNumber = '30C CC12';
        this.name = 'Palkia';
        this.fullName = 'Palkia LV.X 30C CC12';
        this.cardImage = 'assets/cardback.png';
        this.RESTRUCTURE_MARKER = 'PALKIA_30C_RESTRUCTURE';
        this.powers = [{
                name: 'LV.X Rule', powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Palkia. Palkia LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            }, {
                name: 'Restructure', powerType: game_1.PowerType.POKEPOWER, useWhenInPlay: true,
                text: "Once during your turn (before your attack), you may have your opponent switch 1 of your Active Pokémon with 1 of your Benched Pokémon. Then, you switch 1 of the Defending Pokémon with 1 of your opponent's Benched Pokémon. This power can't be used if Palkia is affected by a Special Condition."
            }];
        this.attacks = [{
                name: 'Hydro Reflect', cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.WATER], damage: 60,
                text: "You may move all Energy cards attached to Palkia to your Benched Pokémon in any way you like. (Ignore this effect if you don't have any Benched Pokémon.)"
            }];
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.RESTRUCTURE_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && effect.target !== effect.player.active) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (player.marker.hasMarker(this.RESTRUCTURE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (!player.bench.some(b => b.cards.length > 0) || !opponent.bench.some(b => b.cards.length > 0)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.RESTRUCTURE_MARKER, this);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return;
                }
                player.switchPokemon(selected[0], store, state);
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        opponent.switchPokemon(targets[0], store, state);
                    }
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const source = player.active;
            const energies = source.cards.filter(c => c.superType === game_1.SuperType.ENERGY);
            if (energies.length === 0 || !player.bench.some(b => b.cards.length > 0)) {
                return state;
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, {
                min: energies.length, max: energies.length, allowCancel: true,
                blockedFrom: player.bench.map((b, index) => ({ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index })),
                blockedTo: [{ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }]
            }), transfers => {
                if (transfers === null) {
                    return;
                }
                if (transfers.length !== energies.length || new Set(transfers.map(t => t.card)).size !== energies.length
                    || transfers.some(t => !energies.includes(t.card) || game_1.StateUtils.getTarget(state, player, t.from) !== source
                        || !player.bench.includes(game_1.StateUtils.getTarget(state, player, t.to)))) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_PROMPT_RESULT);
                }
                for (const transfer of transfers) {
                    source.moveCardTo(transfer.card, game_1.StateUtils.getTarget(state, player, transfer.to));
                }
            });
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect || effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const owner = effect.player;
            const lists = [owner.active, ...owner.bench];
            const list = lists.find(l => l.getPokemonCard() === this);
            if (!list) {
                return state;
            }
            for (const previous of list.cards) {
                if (previous instanceof game_1.PokemonCard && previous !== this && previous.name === this.evolvesFrom) {
                    if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
                        effect.attacks.push(...previous.attacks);
                    }
                    else {
                        effect.powers.push(...previous.powers);
                    }
                }
            }
        }
        return state;
    }
}
exports.EnglishPalkiaLvXCC12 = EnglishPalkiaLvXCC12;
