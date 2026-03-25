"use strict";
// Card replacements for normalizing card names from external sources.
// Mirrored from ptcg-play/src/app/deck/deck-edit/card-replacements.ts
// with numeric last words stripped (set numbers not used in server-side lookups).
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripNumericSuffix = exports.cardReplacementMap = void 0;
function stripNumericSuffix(s) {
    const words = s.split(' ');
    if (words.length > 1 && /^\d+$/.test(words[words.length - 1])) {
        words.pop();
    }
    return words.join(' ').trim();
}
exports.stripNumericSuffix = stripNumericSuffix;
const rawCardReplacements = [
    // Diamond symbol to Prism Star conversion
    { from: '♢', to: 'Prism Star' },
    //Energy
    { from: 'Beast Energy ♢ FLI', to: 'Beast Energy FLI' },
    { from: 'Beast Energy ◇ FLI', to: 'Beast Energy FLI' },
    { from: 'Grass Energy 1', to: 'Grass Energy SVE 1' },
    { from: 'Basic Grass Energy 1', to: 'Grass Energy SVE 1' },
    { from: 'Basic Grass Energy SVE 1', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVE 1', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVE 1 PH', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVE 9', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVE 9 PH', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVALT 112', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy SVALT 131', to: 'Grass Energy SVE 1' },
    { from: 'Basic {G} Energy EVO 91', to: 'Grass Energy BS 99' },
    { from: 'Basic {G} Energy HS 115', to: 'Grass Energy HS 115' },
    { from: 'Basic {G} Energy SVI 257', to: 'Grass Energy PAL 278' },
    { from: 'Grass Energy2 SVE 9', to: 'Grass Energy SVE 9' },
    { from: 'Fire Energy 2', to: 'Fire Energy SVE 2' },
    { from: 'Basic Fire Energy 2', to: 'Fire Energy SVE 2' },
    { from: 'Basic Fire Energy SVE 2', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVE 2', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVE 2 PH', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVE 10', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVE 10 PH', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVALT 113', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy SVALT 132', to: 'Fire Energy SVE 2' },
    { from: 'Basic {R} Energy EVO 92', to: 'Fire Energy BS 98' },
    { from: 'Basic {R} Energy HS 116', to: 'Fire Energy HS 116' },
    { from: 'Basic {R} Energy OBF 230', to: 'Fire Energy OBF 230' },
    { from: 'Fire Energy2 SVE 10', to: 'Fire Energy SVE 10' },
    { from: 'Water Energy 3', to: 'Water Energy SVE 3' },
    { from: 'Basic Water Energy 3', to: 'Water Energy SVE 3' },
    { from: 'Basic Water Energy SVE 3', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVE 3', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVE 3 PH', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVE 11', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVE 11 PH', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVALT 114', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy SVALT 133', to: 'Water Energy SVE 3' },
    { from: 'Basic {W} Energy EVO 93', to: 'Water Energy BS 102' },
    { from: 'Basic {W} Energy HS 117', to: 'Water Energy HS 117' },
    { from: 'Basic {W} Energy PAL 279', to: 'Water Energy PAL 279' },
    { from: 'Water Energy2 SVE 11', to: 'Water Energy SVE 11' },
    { from: 'Lightning Energy 4', to: 'Lightning Energy SVE 4' },
    { from: 'Basic Lightning Energy 4', to: 'Lightning Energy SVE 4' },
    { from: 'Basic Lightning Energy SVE 4', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVE 4', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVE 4 PH', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVE 12', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVE 12 PH', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVALT 115', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy SVALT 134', to: 'Lightning Energy SVE 4' },
    { from: 'Basic {L} Energy EVO 94', to: 'Lightning Energy BS 100' },
    { from: 'Basic {L} Energy HS 118', to: 'Lightning Energy HS 118' },
    { from: 'Basic {L} Energy SVI 257', to: 'Lightning Energy SVI 257' },
    { from: 'Lightning Energy2 SVE 12', to: 'Lightning Energy SVE 12' },
    { from: 'Psychic Energy 5', to: 'Psychic Energy SVE 5' },
    { from: 'Basic Psychic Energy 5', to: 'Psychic Energy SVE 5' },
    { from: 'Basic Psychic Energy SVE 5', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVE 5', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVE 5 PH', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVE 13', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVE 13 PH', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVALT 116', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy SVALT 135', to: 'Psychic Energy SVE 5' },
    { from: 'Basic {P} Energy EVO 95', to: 'Psychic Energy BS 101' },
    { from: 'Basic {P} Energy HS 119', to: 'Psychic Energy HS 119' },
    { from: 'Basic {P} Energy MEW 207', to: 'Psychic Energy MEW 207' },
    { from: 'Psychic Energy2 SVE 13', to: 'Psychic Energy SVE 13' },
    { from: 'Fighting Energy 6', to: 'Fighting Energy SVE 6' },
    { from: 'Basic Fighting Energy 6', to: 'Fighting Energy SVE 6' },
    { from: 'Basic Fighting Energy SVE 6', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVE 6', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVE 6 PH', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVE 14', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVE 14 PH', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVALT 115', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy SVALT 136', to: 'Fighting Energy SVE 6' },
    { from: 'Basic {F} Energy EVO 96', to: 'Fighting Energy BS 97' },
    { from: 'Basic {F} Energy HS 120', to: 'Fighting Energy HS 120' },
    { from: 'Basic {F} Energy SVI 258', to: 'Fighting Energy SVI 258' },
    { from: 'Fighting Energy2 SVE 14', to: 'Fighting Energy SVE 14' },
    { from: 'Darkness Energy 7', to: 'Darkness Energy SVE 7' },
    { from: 'Basic Darkness Energy 7', to: 'Darkness Energy SVE 7' },
    { from: 'Basic Darkness Energy SVE 7', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVE 7', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVE 7 PH', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVE 15', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVE 15 PH', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVALT 118', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy SVALT 137', to: 'Darkness Energy SVE 7' },
    { from: 'Basic {D} Energy EVO 97', to: 'Darkness Energy EVO 97' },
    { from: 'Basic {D} Energy HS 121', to: 'Darkness Energy HS 121' },
    { from: 'Basic {D} Energy SFA 98', to: 'Darkness Energy SFA 98' },
    { from: 'Darkness Energy2 SVE 15', to: 'Darkness Energy SVE 15' },
    { from: 'Metal Energy 8', to: 'Metal Energy SVE 8' },
    { from: 'Basic Metal Energy 8', to: 'Metal Energy SVE 8' },
    { from: 'Basic Metal Energy SVE 8', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVE 8', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVE 8 PH', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVE 16', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVE 16 PH', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVALT 119', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy SVALT 138', to: 'Metal Energy SVE 8' },
    { from: 'Basic {M} Energy EVO 98', to: 'Metal Energy EVO 98' },
    { from: 'Basic {M} Energy HS 122', to: 'Metal Energy HS 122' },
    { from: 'Basic {M} Energy SFA 99', to: 'Metal Energy SFA 99' },
    { from: 'Metal Energy2 SVE 16', to: 'Metal Energy SVE 16' },
    //BS
    { from: 'Pokemon Breeder BS 76', to: 'Pokémon Breeder BS 76' },
    { from: 'Pokemon Trader BS 77', to: 'Pokémon Trader BS 77' },
    //RS
    { from: 'Skitty RS 44', to: 'Skitty RS2 44' },
    //DX
    { from: 'Ludicolo DX 19', to: 'Ludicolo DX2 19' },
    //GRI
    { from: 'Oricorio GRI 55', to: 'Oricorio GRI2 55' },
    //SUM
    { from: 'Rotom Dex SUM 159', to: 'Rotom DexSR SM 159' },
    //SHF
    { from: 'Snom SHF SV33', to: 'Snom SHFSV SV33' },
    //TEU
    { from: 'Charmander TEU 12', to: 'Charmander TEU2 12' },
    //STS
    { from: 'Pokémon Ranger STS 104', to: 'Pokemon Ranger STS 104' },
    //VIV
    { from: 'Talonflame V VIV 168', to: 'Talonflame VFA VIV 168' },
    //PGO
    { from: 'PokéStop PGO 68', to: 'PokeStop PGO 68' },
    //BRS
    { from: 'Ultra Ball BRS 186', to: 'Ultra BallHR BRS 186' },
    //ASR
    { from: 'Hisuian Qwilfish ASR 89', to: 'Hisuian Qwilfish2 ASR 89' },
    //SVI
    { from: 'Pokégear 3.0 SVI 186', to: 'Pokegear SVI 186' },
    { from: 'Pokémon Catcher SVI 187', to: 'Pokemon Catcher SVI 187' },
    { from: 'Riolu SVI 113', to: 'Riolu2 SVI 113' },
    //SVP
    { from: 'Charmander SVP 44', to: 'CharmanderIR SVP 44' },
    { from: 'Iron Bundle SVP 66', to: 'Iron Bundle SVP 66' },
    { from: 'Charizard ex SVP 74', to: 'Charizard ex2 SVP 74' },
    { from: 'Meowscarada ex SVP 78', to: 'Meowscarada exFA SVP 78' },
    { from: 'Skeledirge ex SVP 81', to: 'Skeledirge exFA SVP 81' },
    { from: 'Quaquaval ex SVP 84', to: 'Quaquaval exFA SVP 84' },
    { from: 'Pecharunt SVP 129', to: 'PecharuntIR SVP 129' },
    { from: 'Miraidon ex SVP 142', to: 'Miraidon ex2 SVP 142' },
    { from: 'Charizard ex SVP 161', to: 'Charizard ex3 SVP 161' },
    //PAL
    { from: 'Frigibax PAL 57', to: 'Frigibax PAL1 57' },
    { from: 'Frigibax PAL 58', to: 'Frigibax PAL2 58' },
    //PAR
    { from: 'Toedscool PAL 57 ', to: 'Toedscool PAL2 57' },
    { from: 'Gimmighoul PAR 88', to: 'Gimmighoul2 PAR 88' },
    //TEF
    { from: 'Great Tusk TEF 96', to: 'Great Tusk TEF2 96' },
    //TWM
    { from: 'Applin TWM 17', to: 'Applin TWM1 17' },
    { from: 'Applin TWM 126', to: 'Applin TWM2 126' },
    { from: 'Dipplin TWM 18', to: 'Dipplin TWM1 18' },
    { from: 'Dipplin TWM 127', to: 'Dipplin TWM2 127' },
    //SFA
    { from: 'Janine\'s Secret Art SFA 59', to: 'Janine\'s Secret Technique SFA 59' },
    { from: 'Poké Vital A SFA 62', to: 'PokéVital A SFA 62' },
    //SSP
    { from: 'Charcadet SSP 33', to: 'Charcadet 2 SSP 33' },
];
// Build a Map with numeric suffixes stripped from both keys and values.
// Uses first match when multiple entries strip to the same key.
const cardReplacementMap = new Map();
exports.cardReplacementMap = cardReplacementMap;
for (const { from, to } of rawCardReplacements) {
    const key = stripNumericSuffix(from);
    if (!cardReplacementMap.has(key)) {
        cardReplacementMap.set(key, stripNumericSuffix(to));
    }
}
