"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwo = void 0;
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Mewtwo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.additionalCardTypes = [M];
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Delta Switch',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Mewtwo from your hand onto your Bench, you may move any number of basic Energy cards attached to your Pokémon to your other Pokémon (excluding Mewtwo) in any way you like.'
            }];
        this.attacks = [{
                name: 'Energy Burst',
                cost: [R, M],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the total amount of Energy attached to Mewtwo and the Defending Pokémon.'
            }];
        this.set = 'DS';
        this.name = 'Mewtwo';
        this.fullName = 'Mewtwo DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.name === this.name) {
                    blockedTo.push(target);
                }
            });
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (em.provides.length === 0) {
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
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { allowCancel: false, blockedMap, blockedTo }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const playerCardList = player.active;
            const playerCheckProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, playerCardList);
            store.reduceEffect(state, playerCheckProvidedEnergyEffect);
            const opponent = effect.opponent;
            const opponentCardList = opponent.active;
            const opponentCheckProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponentCardList);
            store.reduceEffect(state, opponentCheckProvidedEnergyEffect);
            let energies = 0;
            playerCheckProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            opponentCheckProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            effect.damage = 10 * energies;
        }
        return state;
    }
}
exports.Mewtwo = Mewtwo;
