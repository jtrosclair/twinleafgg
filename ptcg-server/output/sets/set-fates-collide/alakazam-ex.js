"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlakazamEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AlakazamEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Kinesis',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play M Alakazam-EX from your hand to evolve this Pokémon, before it evolves, you may put 2 damage counters on your opponent\'s Active Pokémon and 3 damage counters on 1 of your opponent\'s Benched Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Suppression',
                cost: [P, C],
                damage: 0,
                text: 'Put 3 damage counters on each of your opponent\'s Pokémon that has any Energy attached to it.'
            }
        ];
        this.set = 'FCO';
        this.name = 'Alakazam-EX';
        this.fullName = 'Alakazam EX FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
    }
    reduceEffect(store, state, effect) {
        // Kinesis
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.target.getPokemonCard() === this) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (effect.pokemonCard.name === 'M Alakazam-EX') {
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                    return state;
                }
                prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                    if (result) {
                        opponent.active.damage += 20;
                        const hasBenched = opponent.bench.some(b => b.cards.length > 0);
                        if (!hasBenched) {
                            return state;
                        }
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                            if (!targets || targets.length === 0) {
                                return;
                            }
                            targets[0].damage += 30;
                        });
                    }
                });
            }
        }
        // Suppression
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const goodEnergy = card.cards.filter(card => card instanceof game_1.EnergyCard);
                if (goodEnergy.length > 0) {
                    const damage = new attack_effects_1.PutCountersEffect(effect, 30);
                    damage.target = card;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.AlakazamEx = AlakazamEx;
