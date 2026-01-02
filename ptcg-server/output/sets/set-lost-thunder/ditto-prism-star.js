"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DittoPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DittoPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.powers = [{
                name: 'Almighty Evolution',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put any Stage 1 card from your hand onto this Pokémon to evolve it. You can\'t use this Ability during your first turn or the turn this Pokémon was put into play.'
            }];
        this.cardImage = 'assets/cardback.png';
        this.set = 'LOT';
        this.name = 'Ditto Prism Star';
        this.fullName = 'Ditto Prism Star LOT';
        this.setNumber = '154';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            // Ensure this card is actually in play (active or bench)
            const slot = game_1.StateUtils.findPokemonSlot(state, this);
            if (!slot) {
                this.evolvesToStage = [];
                return state;
            }
            // Resolve the owning player to validate if ability is blocked
            let owner;
            try {
                owner = game_1.StateUtils.findOwner(state, slot);
            }
            catch (_a) {
                owner = undefined;
            }
            if (!owner) {
                this.evolvesToStage = [];
                return state;
            }
            // Try to reduce PowerEffect to check if something blocks our ability
            try {
                const stub = new game_effects_1.PowerEffect(owner, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
                this.evolvesToStage = [card_types_1.Stage.STAGE_1];
            }
            catch (_b) {
                this.evolvesToStage = [];
            }
        }
        return state;
    }
}
exports.DittoPrismStar = DittoPrismStar;
