"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmbreonStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class UmbreonStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dark Ray',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Umbreon Star from your hand onto your Bench, you may choose 1 card from your opponent\'s hand without looking and discard it.'
            }];
        // THE SHRED ISN'T SHREDDING
        this.attacks = [
            {
                name: 'Feint Attack',
                cost: [D, D],
                damage: 0,
                shredAttack: true,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
            }
        ];
        this.set = 'P5';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon Star';
        this.fullName = 'Umbreon Star P5';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    if (opponent.hand.cards.length > 0) {
                        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                        const randomCard = opponent.hand.cards[randomIndex];
                        (0, prefabs_1.MOVE_CARD_TO)(state, randomCard, opponent.discard);
                    }
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
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
exports.UmbreonStar = UmbreonStar;
