"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Flash Impact',
                cost: [L],
                damage: 60,
                text: 'Does 20 damage to 1 of your Benched Pokémon.'
            },
            {
                name: 'Crunch',
                cost: [L, L, C],
                damage: 80,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Luxray';
        this.fullName = 'Luxray NXD';
    }
    reduceEffect(store, state, effect) {
        // Flash Impact - 60 damage to active, 20 to own benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const myBenched = player.bench.filter(b => b.cards.length > 0);
            if (myBenched.length > 0) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), (selected) => {
                    if (selected && selected.length > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                        damageEffect.target = selected[0];
                        store.reduceEffect(state, damageEffect);
                    }
                });
            }
        }
        // Crunch - flip for energy discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponentActive = opponent.active;
                    const energyCards = opponentActive.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, energyCards.slice(0, 1));
                        discardEffect.target = opponentActive;
                        store.reduceEffect(state, discardEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Luxray = Luxray;
