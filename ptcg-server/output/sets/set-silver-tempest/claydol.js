"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claydol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Claydol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Baltoy';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Mystery Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You can use this Ability only if you have no Supporter cards in your discard pile. Once during your turn, you may attach a [F] Energy card from your discard pile to 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Spinning Attack',
                cost: [F, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Claydol';
        this.fullName = 'Claydol SIT';
        this.CHARGE_MARKER = 'CHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Checking if there are supporters in the discard
            const hasSupporter = player.discard.cards.some(c => {
                return c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (hasSupporter) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Checking if there's an Basic [F] Energy in the discard
            // Ideally we should check whether there's an Energy card providing [F], but in practice they're the same thing (as of Journey Together)
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.name === 'Fighting Energy';
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Cealgair: idk why this bit is here, I copied it from Naganadel LOT
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            // Putting the "Ability used" marker on 
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 1, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.marker.addMarker(this.CHARGE_MARKER, this);
                    player.discard.moveCardsTo(cards, cardList);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.CHARGE_MARKER, this);
        }
        return state;
    }
}
exports.Claydol = Claydol;
