"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeonex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vaporeonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolutionary Swirl',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Vaporeon ex from your hand to evolve 1 of your Pokémon, you may have your opponent shuffle his or her hand into his or her deck. Then, your opponent draws up to 4 cards.'
            }];
        this.attacks = [{
                name: 'Fastwave',
                cost: [W, C],
                damage: 40,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            },
            {
                name: 'Hydro Splash',
                cost: [W, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'DS';
        this.setNumber = '110';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vaporeon ex';
        this.fullName = 'Vaporeon ex DS';
        this.FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    // Shuffle hand into deck
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { sourceCard: this, sourceEffect: this.powers[0] });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                    // Draw up to 4 cards
                    (0, prefabs_1.DRAW_UP_TO_X_CARDS)(store, state, opponent, 4);
                }
            });
        }
        // Fastwave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 40);
        }
        return state;
    }
}
exports.Vaporeonex = Vaporeonex;
