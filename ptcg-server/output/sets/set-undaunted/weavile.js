"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Claw Snag',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Weavile from your hand to evolve 1 of your Pokémon, you may look at your opponent\'s hand. Choose a card from your opponent\'s hand and discard it.'
            }];
        this.attacks = [{
                name: 'Feint Attack',
                cost: [D, C],
                damage: 0,
                shredAttack: true,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
            }];
        this.set = 'UD';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weavile';
        this.fullName = 'Weavile UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this) && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    if (opponent.hand.cards.length === 0) {
                        return state;
                    }
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.discard, { cards, sourceEffect: this.powers[0] });
                        return state;
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                target.damage += 30;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 30);
                state = store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.Weavile = Weavile;
