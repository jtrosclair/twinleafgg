"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkElectrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
class DarkElectrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DARK];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = L;
        this.additionalCardTypes = [D];
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Darkness Navigation',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Dark Electrode has no Energy attached to it, you may search your deck for a [D] or Dark Metal Energy and attach it to Dark Electrode. Shuffle your deck afterward. This power can\'t be used if Dark Electrode is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Energy Bomb',
                cost: [L],
                damage: 30,
                text: 'You may move all Energy cards attached to Dark Electrode to your Benched Pokémon in any way you like.'
            }];
        this.set = 'TRR';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Electrode';
        this.fullName = 'Dark Electrode TRR';
        this.DARKNESS_NAVIGATION_MARKER = 'DARKNESS_NAVIGATION_MARKER';
        this.usedEnergyBomb = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.DARKNESS_NAVIGATION_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DARKNESS_NAVIGATION_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const thisElectrode = game_1.StateUtils.findCardList(state, effect.card);
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (player.marker.hasMarker(this.DARKNESS_NAVIGATION_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let thisCardList;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card === effect.card) {
                    thisCardList = cardList;
                }
            });
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, thisCardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length !== 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.EnergyCard && (card.name === 'Darkness Energy' || card.name === 'Dark Metal Energy')) {
                }
                else {
                    blocked.push(index);
                }
            });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGY_FROM_DECK, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, thisElectrode);
                }
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
            prefabs_1.ADD_MARKER(this.DARKNESS_NAVIGATION_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedEnergyBomb = true;
        }
        if (effect instanceof game_phase_effects_2.AfterAttackEffect && this.usedEnergyBomb === true) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    const blockedCards = [];
                    const blockedMap = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                        store.reduceEffect(state, checkProvidedEnergy);
                        checkProvidedEnergy.energyMap.forEach(em => {
                            if (em.provides.length === 0) {
                                blockedCards.push(em.card);
                            }
                        });
                        cardList.cards.forEach(em => {
                            if (cardList.getPokemons().includes(em)) {
                                blockedCards.push(em);
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
                    const attachedEnergies = player.active.cards.filter(card => !blockedCards.includes(card));
                    // Energy is coming from active to bench
                    const blockedFrom = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (cardList !== player.active) {
                            blockedFrom.push(target);
                            return;
                        }
                    });
                    store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length, blockedMap, blockedFrom }), transfers => {
                        transfers = transfers || [];
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.active.moveCardTo(transfer.card, target);
                        }
                    });
                }
            }, game_1.GameMessage.MOVE_ENERGY_TO_BENCH);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedEnergyBomb) {
            this.usedEnergyBomb = false;
        }
        return state;
    }
}
exports.DarkElectrode = DarkElectrode;
