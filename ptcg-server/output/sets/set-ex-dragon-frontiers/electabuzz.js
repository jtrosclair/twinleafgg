"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electabuzz = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Electabuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Power of Evolution',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Electabuzz is an Evolved Pokémon, you may draw a card from the bottom of your deck. This power can\'t be used if Electabuzz is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Swift',
                cost: [F, C],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Electabuzz';
        this.fullName = 'Electabuzz DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            const cardList = game_1.StateUtils.findCardList(state, effect.card);
            if (cardList.getPokemons().length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const bottomCards = player.deck.cards.slice(-1);
            player.deck.moveCardsTo(bottomCards, player.hand);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Electabuzz = Electabuzz;
