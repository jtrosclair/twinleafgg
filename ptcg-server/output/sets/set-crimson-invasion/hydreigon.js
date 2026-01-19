"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hydreigon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = D;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Weed Out',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may choose 3 of your Benched Pokémon. Then, discard your other Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Dark Destruction',
                cost: [D, D, C],
                damage: 120,
                text: 'You may discard an Energy from this Pokémon. If you do, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon CIN';
        this.WEED_OUT_MARKER = 'WEED_OUT_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.WEED_OUT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.WEED_OUT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const playerBench = player.bench.filter(c => c.cards.length > 0);
            if (playerBench.length <= 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.WEED_OUT_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            if (playerBench.length > 3) {
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: Math.min(playerBench.length, 3), max: 3 }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                        if (card !== player.active && !targets.includes(card)) {
                            card.clearEffects();
                            (0, prefabs_1.MOVE_CARDS)(store, state, card, player.discard);
                        }
                    });
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activeCardList = opponent.active;
            const activePokemonCard = activeCardList.getPokemonCard();
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK), wantToUse => {
                if (wantToUse) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
                    let hasPokemonWithEnergy = false;
                    if (activePokemonCard && activeCardList.cards.some(c => c.superType === game_1.SuperType.ENERGY)) {
                        hasPokemonWithEnergy = true;
                    }
                    if (!hasPokemonWithEnergy) {
                        return state;
                    }
                    let cards = [];
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        return store.reduceEffect(state, discardEnergy);
                    });
                }
            });
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
