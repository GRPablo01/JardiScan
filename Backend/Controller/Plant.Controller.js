// ============================================================
// 🌿 CONTROLLER PLANTE — JARDISCAN
// ============================================================

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Plante = require('../Schema/Plant');

// ============================================================
// 🖼️ SHARP
// ============================================================

let sharp = null;

try {
    sharp = require('sharp');
} catch (error) {
    console.warn(
        '⚠️ Le module "sharp" n’est pas installé.'
    );

    console.warn(
        '➡️ Lance : npm install sharp'
    );
}

// ============================================================
// ⚙️ CONFIGURATION IDENTIFICATION
// ============================================================

const NOMBRE_RESULTATS_IDENTIFICATION = 4;

const TAILLE_SIGNATURE = 32;

const DOSSIER_UPLOADS_PLANTES = path.join(
    process.cwd(),
    'uploads',
    'plants'
);

// ============================================================
// 🧹 NORMALISER UNE VALEUR
// ============================================================

function valeurTexte(valeur) {

    if (
        valeur === undefined ||
        valeur === null
    ) {
        return '';
    }

    return String(valeur).trim();
}

// ============================================================
// 🖼️ RÉCUPÉRER LES FICHIERS D'IDENTIFICATION
// ============================================================

function recupererFichiersIdentification(req) {

    const fichiers = [];

    // --------------------------------------------------------
    // req.files provenant de upload.fields()
    // --------------------------------------------------------

    if (
        req.files &&
        !Array.isArray(req.files) &&
        typeof req.files === 'object'
    ) {

        if (Array.isArray(req.files.image)) {

            fichiers.push(
                ...req.files.image
            );
        }

        if (Array.isArray(req.files.images)) {

            fichiers.push(
                ...req.files.images
            );
        }
    }

    // --------------------------------------------------------
    // req.files provenant de upload.array()
    // --------------------------------------------------------

    if (Array.isArray(req.files)) {

        fichiers.push(
            ...req.files
        );
    }

    // --------------------------------------------------------
    // Compatibilité req.file
    // --------------------------------------------------------

    if (
        req.file &&
        !fichiers.some(
            fichier =>
                fichier.path === req.file.path
        )
    ) {

        fichiers.push(
            req.file
        );
    }

    // --------------------------------------------------------
    // Éviter les doublons
    // --------------------------------------------------------

    const uniques = [];

    const chemins = new Set();

    for (const fichier of fichiers) {

        if (!fichier) {
            continue;
        }

        const cle = fichier.path ||
            fichier.filename ||
            fichier.originalname;

        if (!cle) {
            continue;
        }

        if (chemins.has(cle)) {
            continue;
        }

        chemins.add(cle);

        uniques.push(fichier);
    }

    return uniques;
}

// ============================================================
// 🖼️ CRÉER UNE SIGNATURE D'IMAGE
// ============================================================

async function creerSignatureImage(cheminImage) {

    if (!sharp) {

        throw new Error(
            'Le module sharp est nécessaire pour l’identification des plantes.'
        );
    }

    if (!cheminImage) {

        throw new Error(
            'Chemin de fichier image manquant.'
        );
    }

    if (!fs.existsSync(cheminImage)) {

        throw new Error(
            `Image introuvable : ${cheminImage}`
        );
    }

    const buffer = await sharp(cheminImage)
        .resize(
            TAILLE_SIGNATURE,
            TAILLE_SIGNATURE,
            {
                fit: 'cover'
            }
        )
        .removeAlpha()
        .raw()
        .toBuffer();

    return buffer;
}

// ============================================================
// 📊 CALCULER LA DISTANCE ENTRE DEUX IMAGES
// ============================================================

function calculerDistanceImages(
    signatureA,
    signatureB
) {

    if (
        !signatureA ||
        !signatureB
    ) {
        return Number.MAX_SAFE_INTEGER;
    }

    const longueur = Math.min(
        signatureA.length,
        signatureB.length
    );

    if (longueur === 0) {

        return Number.MAX_SAFE_INTEGER;
    }

    let somme = 0;

    for (
        let index = 0;
        index < longueur;
        index++
    ) {

        const difference =
            signatureA[index] -
            signatureB[index];

        somme +=
            difference * difference;
    }

    return Math.sqrt(
        somme / longueur
    );
}

// ============================================================
// 📈 CONVERTIR DISTANCE EN SCORE
// ============================================================

function distanceVersScore(distance) {

    if (
        !Number.isFinite(distance)
    ) {
        return 0;
    }

    /*
     * Distance RGB moyenne.
     *
     * 0   = image identique
     * 255 = différence maximale
     */

    const score =
        100 -
        (distance / 255) * 100;

    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );
}

// ============================================================
// 🖼️ RÉCUPÉRER LE CHEMIN PHYSIQUE D'UNE IMAGE PLANTE
// ============================================================

function cheminPhysiqueImagePlante(image) {

    if (!image) {
        return null;
    }

    const url = valeurTexte(
        image.url
    );

    if (!url) {
        return null;
    }

    /*
     * Exemple :
     *
     * /uploads/plants/photo.png
     *
     * devient :
     *
     * /projet/uploads/plants/photo.png
     */

    const nomFichier = path.basename(
        url
    );

    if (!nomFichier) {
        return null;
    }

    return path.join(
        DOSSIER_UPLOADS_PLANTES,
        nomFichier
    );
}

// ============================================================
// 🧠 IDENTIFIER UNE PLANTE
//
// POST /api/plant/identify
// POST /api/plants/identify
//
// Multipart :
// image  OU images
//
// Body possible :
// jardiDex
// utilisateurId
// ============================================================

exports.identifyPlant = async (
    req,
    res
) => {

    try {

        console.log('');
        console.log(
            '=========================================='
        );
        console.log(
            '🔎 IDENTIFICATION PLANTE'
        );
        console.log(
            '=========================================='
        );

        // ====================================================
        // 📸 RÉCUPÉRATION DES IMAGES
        // ====================================================

        const fichiers =
            recupererFichiersIdentification(req);

        console.log(
            `📸 ${fichiers.length} image(s) reçue(s)`
        );

        // ====================================================
        // ❌ AUCUNE IMAGE
        // ====================================================

        if (fichiers.length === 0) {

            return res.status(400).json({

                message:
                    'Aucune image reçue pour l’identification.',

                expectedFields: [
                    'image',
                    'images'
                ]

            });
        }

        // ====================================================
        // 📋 INFORMATIONS DES IMAGES
        // ====================================================

        fichiers.forEach(
            (fichier, index) => {

                console.log('');
                console.log(
                    `📸 IMAGE ${index + 1}`
                );

                console.log(
                    '   Champ :',
                    fichier.fieldname
                );

                console.log(
                    '   Original :',
                    fichier.originalname
                );

                console.log(
                    '   Serveur :',
                    fichier.filename
                );

                console.log(
                    '   MIME :',
                    fichier.mimetype
                );

                console.log(
                    '   Taille :',
                    fichier.size
                );

                console.log(
                    '   Path :',
                    fichier.path
                );

                console.log(
                    '   URL :',
                    `/uploads/plants/${fichier.filename}`
                );

            }
        );

        // ====================================================
        // 📦 DONNÉES UTILISATEUR
        // ====================================================

        let jardiDex = [];

        if (
            req.body &&
            req.body.jardiDex
        ) {

            try {

                if (
                    Array.isArray(
                        req.body.jardiDex
                    )
                ) {

                    jardiDex =
                        req.body.jardiDex;

                } else {

                    jardiDex =
                        JSON.parse(
                            req.body.jardiDex
                        );

                }

            } catch (error) {

                jardiDex = [];
            }
        }

        const utilisateurId =
            valeurTexte(
                req.body?.utilisateurId
            );

        console.log('');
        console.log(
            '=========================================='
        );
        console.log(
            '🌱 DONNÉES IDENTIFICATION'
        );
        console.log(
            '=========================================='
        );

        console.log(
            '📦 utilisateurId :',
            utilisateurId || 'non fourni'
        );

        console.log(
            '🌿 JardiDex :',
            jardiDex
        );

        // ====================================================
        // 🧩 VÉRIFICATION SHARP
        // ====================================================

        if (!sharp) {

            return res.status(500).json({

                message:
                    'Le système d’identification nécessite le module sharp.',

                installation:
                    'npm install sharp'

            });
        }

        // ====================================================
        // 🌱 RÉCUPÉRER LES PLANTES
        // ====================================================

        const plantes =
            await Plante
                .find({})
                .sort({
                    nombre: 1
                })
                .lean();

        console.log(
            `🌱 ${plantes.length} plante(s) disponible(s) pour comparaison`
        );

        // ====================================================
        // ❌ AUCUNE PLANTE EN BASE
        // ====================================================

        if (plantes.length === 0) {

            return res.status(404).json({

                message:
                    'Aucune plante disponible dans la base pour effectuer une identification.',

                resultats: []

            });
        }

        // ====================================================
        // 🖼️ CRÉER LES SIGNATURES DES IMAGES SCANNÉES
        // ====================================================

        const signaturesScan = [];

        for (
            const fichier of fichiers
        ) {

            try {

                const signature =
                    await creerSignatureImage(
                        fichier.path
                    );

                signaturesScan.push(
                    signature
                );

            } catch (error) {

                console.error(
                    '⚠️ Impossible d’analyser l’image :',
                    fichier.originalname
                );

                console.error(
                    error.message
                );

            }
        }

        // ====================================================
        // ❌ AUCUNE IMAGE ANALYSABLE
        // ====================================================

        if (
            signaturesScan.length === 0
        ) {

            return res.status(400).json({

                message:
                    'Les images reçues ne peuvent pas être analysées.',

                resultats: []

            });
        }

        // ====================================================
        // 🌿 COMPARAISON AVEC LES PLANTES
        // ====================================================

        const resultats = [];

        for (
            const plante of plantes
        ) {

            // ------------------------------------------------
            // Vérifier les images de la plante
            // ------------------------------------------------

            if (
                !Array.isArray(
                    plante.images
                ) ||
                plante.images.length === 0
            ) {

                continue;
            }

            const distancesPlante = [];

            // ------------------------------------------------
            // Toutes les images de référence
            // ------------------------------------------------

            for (
                const imagePlante of plante.images
            ) {

                const cheminImage =
                    cheminPhysiqueImagePlante(
                        imagePlante
                    );

                if (!cheminImage) {
                    continue;
                }

                if (
                    !fs.existsSync(
                        cheminImage
                    )
                ) {

                    continue;
                }

                let signatureReference;

                try {

                    signatureReference =
                        await creerSignatureImage(
                            cheminImage
                        );

                } catch (error) {

                    continue;
                }

                // --------------------------------------------
                // Comparaison avec chaque image du scan
                // --------------------------------------------

                for (
                    const signatureScan
                    of signaturesScan
                ) {

                    const distance =
                        calculerDistanceImages(
                            signatureScan,
                            signatureReference
                        );

                    distancesPlante.push(
                        distance
                    );

                }
            }

            // ------------------------------------------------
            // Aucune image utilisable
            // ------------------------------------------------

            if (
                distancesPlante.length === 0
            ) {

                continue;
            }

            // ------------------------------------------------
            // Garder la meilleure correspondance
            // ------------------------------------------------

            const meilleureDistance =
                Math.min(
                    ...distancesPlante
                );

            const score =
                distanceVersScore(
                    meilleureDistance
                );

            resultats.push({

                plante,

                score: Number(
                    score.toFixed(2)
                ),

                distance:
                    Number(
                        meilleureDistance.toFixed(4)
                    )

            });
        }

        // ====================================================
        // 📊 TRI DES RÉSULTATS
        // ====================================================

        resultats.sort(
            (a, b) =>
                b.score - a.score
        );

        const meilleursResultats =
            resultats
                .slice(
                    0,
                    NOMBRE_RESULTATS_IDENTIFICATION
                );

        // ====================================================
        // 🧾 FORMAT FINAL
        // ====================================================

        const resultatsFormates =
            meilleursResultats.map(
                (resultat, index) => {

                    const plante =
                        resultat.plante;

                    return {

                        rang:
                            index + 1,

                        score:
                            resultat.score,

                        confiance:
                            `${resultat.score}%`,

                        distance:
                            resultat.distance,

                        plante: {

                            _id:
                                plante._id,

                            nombre:
                                plante.nombre,

                            nomCommun:
                                plante.nomCommun,

                            nomScientifique:
                                plante.nomScientifique,

                            famille:
                                plante.famille,

                            description:
                                plante.description,

                            origine:
                                plante.origine,

                            couleur:
                                plante.couleur,

                            periodeFloraison:
                                plante.periodeFloraison,

                            periodeRecolte:
                                plante.periodeRecolte,

                            cycle:
                                plante.cycle,

                            exposition:
                                plante.exposition,

                            arrosage:
                                plante.arrosage,

                            sol:
                                plante.sol,

                            temperatureMin:
                                plante.temperatureMin,

                            temperatureMax:
                                plante.temperatureMax,

                            humidite:
                                plante.humidite,

                            partiesDangereuses:
                                plante.partiesDangereuses,

                            usageCulinaire:
                                plante.usageCulinaire,

                            retoure:
                                plante.retoure,

                            images:
                                plante.images

                        }

                    };

                }
            );

        // ====================================================
        // 🏆 MEILLEUR RÉSULTAT
        // ====================================================

        const meilleur =
            resultatsFormates.length > 0
                ? resultatsFormates[0]
                : null;

        console.log('');
        console.log(
            '=========================================='
        );
        console.log(
            '🏆 RÉSULTAT IDENTIFICATION'
        );
        console.log(
            '=========================================='
        );

        if (meilleur) {

            console.log(
                '🌱 Plante :',
                meilleur.plante.nomCommun
            );

            console.log(
                '📊 Score :',
                `${meilleur.score}%`
            );

            console.log(
                '🔬 Nom scientifique :',
                meilleur.plante.nomScientifique
            );

        } else {

            console.log(
                '❌ Aucune correspondance trouvée'
            );

        }

        console.log(
            `📊 ${resultatsFormates.length} résultat(s)`
        );

        // ====================================================
        // 📤 RÉPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message:
                meilleur
                    ? 'Identification terminée avec succès.'
                    : 'Aucune correspondance suffisamment exploitable.',

            identification: meilleur,

            resultats:
                resultatsFormates,

            nombreResultats:
                resultatsFormates.length,

            nombreImagesAnalysees:
                signaturesScan.length,

            utilisateurId:
                utilisateurId || null,

            jardiDex

        });

    } catch (error) {

        console.error('');
        console.error(
            '=========================================='
        );
        console.error(
            '❌ ERREUR IDENTIFICATION PLANTE'
        );
        console.error(
            '=========================================='
        );

        console.error(
            'Message :',
            error.message
        );

        console.error(
            'Nom :',
            error.name
        );

        console.error(
            'Code :',
            error.code || 'N/A'
        );

        console.error(
            'Stack :',
            error.stack
        );

        return res.status(500).json({

            success: false,

            message:
                'Erreur lors de l’identification de la plante.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🟢 CRÉER UNE PLANTE
//
// POST /api/plant
// ============================================================

exports.createPlant = async (
    req,
    res
) => {

    try {

        const {

            nomCommun,
            nomScientifique,
            famille,
            description,
            origine,
            couleur,
            periodeFloraison,
            periodeRecolte,
            cycle,
            exposition,
            arrosage,
            sol,
            temperatureMin,
            temperatureMax,
            humidite,
            partiesDangereuses,
            usageCulinaire,
            retoure

        } = req.body;

        // ====================================================
        // 🔎 CHAMPS OBLIGATOIRES
        // ====================================================

        const champsManquants = [];

        if (!valeurTexte(nomCommun)) {
            champsManquants.push(
                'nomCommun'
            );
        }

        if (!valeurTexte(nomScientifique)) {
            champsManquants.push(
                'nomScientifique'
            );
        }

        if (!valeurTexte(famille)) {
            champsManquants.push(
                'famille'
            );
        }

        if (!valeurTexte(description)) {
            champsManquants.push(
                'description'
            );
        }

        if (!valeurTexte(origine)) {
            champsManquants.push(
                'origine'
            );
        }

        if (!valeurTexte(couleur)) {
            champsManquants.push(
                'couleur'
            );
        }

        if (!valeurTexte(cycle)) {
            champsManquants.push(
                'cycle'
            );
        }

        if (!valeurTexte(exposition)) {
            champsManquants.push(
                'exposition'
            );
        }

        if (!valeurTexte(arrosage)) {
            champsManquants.push(
                'arrosage'
            );
        }

        if (!valeurTexte(sol)) {
            champsManquants.push(
                'sol'
            );
        }

        if (
            temperatureMin === undefined ||
            temperatureMin === null ||
            temperatureMin === ''
        ) {

            champsManquants.push(
                'temperatureMin'
            );
        }

        if (
            temperatureMax === undefined ||
            temperatureMax === null ||
            temperatureMax === ''
        ) {

            champsManquants.push(
                'temperatureMax'
            );
        }

        if (!valeurTexte(humidite)) {
            champsManquants.push(
                'humidite'
            );
        }

        if (!valeurTexte(partiesDangereuses)) {
            champsManquants.push(
                'partiesDangereuses'
            );
        }

        if (!valeurTexte(usageCulinaire)) {
            champsManquants.push(
                'usageCulinaire'
            );
        }

        if (
            champsManquants.length > 0
        ) {

            return res.status(400).json({

                message:
                    'Certains champs obligatoires sont manquants.',

                champsManquants

            });
        }

        // ====================================================
        // 🌡️ TEMPÉRATURES
        // ====================================================

        const temperatureMinNombre =
            Number(
                temperatureMin
            );

        const temperatureMaxNombre =
            Number(
                temperatureMax
            );

        if (
            Number.isNaN(
                temperatureMinNombre
            ) ||
            Number.isNaN(
                temperatureMaxNombre
            )
        ) {

            return res.status(400).json({

                message:
                    'Les températures doivent être des nombres.'

            });
        }

        if (
            temperatureMinNombre >
            temperatureMaxNombre
        ) {

            return res.status(400).json({

                message:
                    'La température minimale ne peut pas être supérieure à la température maximale.'

            });
        }

        // ====================================================
        // 🔢 NUMÉRO AUTOMATIQUE
        // ====================================================

        const dernierePlante =
            await Plante
                .findOne()
                .sort({
                    nombre: -1
                })
                .select('nombre')
                .lean();

        const prochainNombre =
            dernierePlante &&
            typeof dernierePlante.nombre === 'number'
                ? dernierePlante.nombre + 1
                : 1;

        // ====================================================
        // 🖼️ IMAGES
        // ====================================================

        let imagesFinales = [];

        if (
            Array.isArray(req.files)
        ) {

            imagesFinales =
                req.files.map(
                    (file, index) => ({

                        url:
                            `/uploads/plants/${file.filename}`,

                        vue:
                            index === 0
                                ? 'front'
                                : 'side'

                    })
                );
        }

        // ====================================================
        // 🌱 PLANTE
        // ====================================================

        const nouvellePlante =
            new Plante({

                nomCommun:
                    valeurTexte(
                        nomCommun
                    ),

                nomScientifique:
                    valeurTexte(
                        nomScientifique
                    ),

                famille:
                    valeurTexte(
                        famille
                    ),

                description:
                    valeurTexte(
                        description
                    ),

                origine:
                    valeurTexte(
                        origine
                    ),

                nombre:
                    prochainNombre,

                images:
                    imagesFinales,

                couleur:
                    valeurTexte(
                        couleur
                    ),

                periodeFloraison:
                    valeurTexte(
                        periodeFloraison
                    ) || null,

                periodeRecolte:
                    valeurTexte(
                        periodeRecolte
                    ) || null,

                cycle:
                    valeurTexte(
                        cycle
                    ),

                exposition:
                    valeurTexte(
                        exposition
                    ),

                arrosage:
                    valeurTexte(
                        arrosage
                    ),

                sol:
                    valeurTexte(
                        sol
                    ),

                temperatureMin:
                    temperatureMinNombre,

                temperatureMax:
                    temperatureMaxNombre,

                humidite:
                    valeurTexte(
                        humidite
                    ),

                partiesDangereuses:
                    valeurTexte(
                        partiesDangereuses
                    ),

                usageCulinaire:
                    valeurTexte(
                        usageCulinaire
                    ),

                retoure:
                    valeurTexte(
                        retoure
                    ) || null

            });

        const planteSauvegardee =
            await nouvellePlante.save();

        return res.status(201).json({

            message:
                'Plante créée avec succès.',

            plante:
                planteSauvegardee

        });

    } catch (error) {

        console.error(
            '❌ Erreur création plante :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la création de la plante.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🟢 RÉCUPÉRER TOUTES LES PLANTES
//
// GET /api/plant
// ============================================================

exports.getAllPlants = async (
    req,
    res
) => {

    try {

        const plantes =
            await Plante
                .find({})
                .sort({
                    nombre: 1
                });

        return res.status(200).json(
            plantes
        );

    } catch (error) {

        console.error(
            '❌ Erreur GET ALL PLANTS :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la récupération des plantes.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🟢 RÉCUPÉRER UNE PLANTE
//
// GET /api/plant/:id
// ============================================================

exports.getPlanteById = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                message:
                    'Identifiant de plante invalide.'

            });
        }

        const plante =
            await Plante.findById(
                id
            );

        if (!plante) {

            return res.status(404).json({

                message:
                    'Plante introuvable.'

            });
        }

        return res.status(200).json({

            plante

        });

    } catch (error) {

        console.error(
            '❌ Erreur récupération plante :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la récupération de la plante.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🔄 ALIAS COMPATIBILITÉ
//
// Permet à Plant.Routes.js d'utiliser :
// getPlantById
// ============================================================

exports.getPlantById =
    exports.getPlanteById;

// ============================================================
// 🟠 MODIFIER UNE PLANTE
//
// PUT /api/plant/:id
// ============================================================

exports.updatePlante = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                message:
                    'Identifiant de plante invalide.'

            });
        }

        const donnees = {};

        const champsTexte = [

            'nomCommun',
            'nomScientifique',
            'famille',
            'description',
            'origine',
            'couleur',
            'periodeFloraison',
            'periodeRecolte',
            'cycle',
            'exposition',
            'arrosage',
            'sol',
            'humidite',
            'partiesDangereuses',
            'usageCulinaire',
            'retoure'

        ];

        champsTexte.forEach(
            champ => {

                if (
                    req.body[champ] !==
                    undefined
                ) {

                    donnees[champ] =
                        req.body[champ] ===
                        null

                            ? null

                            : String(
                                req.body[champ]
                            ).trim();

                }

            }
        );

        // ====================================================
        // 🌡️ TEMPÉRATURE MIN
        // ====================================================

        if (
            req.body.temperatureMin !==
            undefined &&
            req.body.temperatureMin !==
            ''
        ) {

            const valeur =
                Number(
                    req.body.temperatureMin
                );

            if (
                Number.isNaN(
                    valeur
                )
            ) {

                return res.status(400).json({

                    message:
                        'temperatureMin doit être un nombre.'

                });
            }

            donnees.temperatureMin =
                valeur;
        }

        // ====================================================
        // 🌡️ TEMPÉRATURE MAX
        // ====================================================

        if (
            req.body.temperatureMax !==
            undefined &&
            req.body.temperatureMax !==
            ''
        ) {

            const valeur =
                Number(
                    req.body.temperatureMax
                );

            if (
                Number.isNaN(
                    valeur
                )
            ) {

                return res.status(400).json({

                    message:
                        'temperatureMax doit être un nombre.'

                });
            }

            donnees.temperatureMax =
                valeur;
        }

        // ====================================================
        // 🖼️ IMAGES
        // ====================================================

        if (
            Array.isArray(
                req.files
            )
        ) {

            donnees.images =
                req.files.map(
                    (file, index) => ({

                        url:
                            `/uploads/plants/${file.filename}`,

                        vue:
                            index === 0
                                ? 'front'
                                : 'side'

                    })
                );
        }

        // ====================================================
        // 💾 MISE À JOUR
        // ====================================================

        const planteModifiee =
            await Plante.findByIdAndUpdate(

                id,

                donnees,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!planteModifiee) {

            return res.status(404).json({

                message:
                    'Plante introuvable.'

            });
        }

        return res.status(200).json({

            message:
                'Plante modifiée avec succès.',

            plante:
                planteModifiee

        });

    } catch (error) {

        console.error(
            '❌ Erreur modification plante :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la modification de la plante.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🔴 SUPPRIMER UNE PLANTE
//
// DELETE /api/plant/:id
// ============================================================

exports.deletePlante = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                message:
                    'Identifiant de plante invalide.'

            });
        }

        const planteSupprimee =
            await Plante.findByIdAndDelete(
                id
            );

        if (!planteSupprimee) {

            return res.status(404).json({

                message:
                    'Plante introuvable.'

            });
        }

        return res.status(200).json({

            message:
                'Plante supprimée avec succès.',

            plante:
                planteSupprimee

        });

    } catch (error) {

        console.error(
            '❌ Erreur suppression plante :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la suppression de la plante.',

            error:
                error.message

        });
    }
};

// ============================================================
// 🔎 RECHERCHER DES PLANTES
//
// GET /api/plants/search?q=tomate
// ============================================================

exports.searchPlantes = async (
    req,
    res
) => {

    try {

        const q =
            valeurTexte(
                req.query.q
            );

        if (!q) {

            return res.status(400).json({

                message:
                    'Le paramètre de recherche "q" est obligatoire.'

            });
        }

        const regex =
            new RegExp(

                q.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                ),

                'i'

            );

        const plantes =
            await Plante
                .find({

                    $or: [

                        {
                            nomCommun:
                                regex
                        },

                        {
                            nomScientifique:
                                regex
                        },

                        {
                            famille:
                                regex
                        },

                        {
                            origine:
                                regex
                        }

                    ]

                })
                .sort({

                    nombre: 1

                });

        return res.status(200).json({

            count:
                plantes.length,

            plantes

        });

    } catch (error) {

        console.error(
            '❌ Erreur recherche plantes :',
            error
        );

        return res.status(500).json({

            message:
                'Erreur lors de la recherche des plantes.',

            error:
                error.message

        });
    }
};