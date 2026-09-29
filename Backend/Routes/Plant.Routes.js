// ============================================================
// 🌱 PLANT ROUTES — JARDISCAN
// ============================================================

// ============================================================
// 📦 IMPORTS
// ============================================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const {
    createPlant,
    getAllPlants,
    getPlantById,
    identifyPlant
} = require('../Controller/Plant.Controller');

// ============================================================
// 🚏 ROUTER
// ============================================================

const router = express.Router();


// ============================================================
// 📁 DOSSIER UPLOADS PLANTES
// ============================================================

const uploadDirectory = path.join(
    process.cwd(),
    'uploads',
    'plants'
);

console.log(
    '📁 Dossier upload plantes :',
    uploadDirectory
);

// ============================================================
// 📁 CRÉATION DU DOSSIER
// ============================================================

try {

    if (!fs.existsSync(uploadDirectory)) {

        fs.mkdirSync(
            uploadDirectory,
            {
                recursive: true
            }
        );

       
    } else {

        

    }

} catch (error) {

    console.error(
        '❌ Impossible de créer uploads/plants'
    );

    console.error(
        error
    );

}

// ============================================================
// 📸 CONFIGURATION MULTER
// ============================================================

const storage = multer.diskStorage({

    // ----------------------------------------------------------
    // DESTINATION
    // ----------------------------------------------------------

    destination: (req, file, cb) => {

        console.log(
            '📂 Destination upload :',
            uploadDirectory
        );

        cb(
            null,
            uploadDirectory
        );

    },

    // ----------------------------------------------------------
    // NOM DU FICHIER
    // ----------------------------------------------------------

    filename: (req, file, cb) => {

        const extension = path
            .extname(file.originalname || '')
            .toLowerCase();

        const uniqueName =
            `plant-${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        console.log(
            '📝 Nom fichier généré :',
            uniqueName
        );

        cb(
            null,
            uniqueName
        );

    }

});

// ============================================================
// 🛡️ FILTRE DES IMAGES
// ============================================================

const fileFilter = (req, file, cb) => {

    
    // ----------------------------------------------------------
    // Vérification MIME
    // ----------------------------------------------------------

    if (
        !file.mimetype ||
        !file.mimetype.startsWith('image/')
    ) {

        console.error(
            '❌ Type MIME non autorisé :',
            file.mimetype
        );

        return cb(
            new Error(
                'Seules les images sont autorisées.'
            )
        );

    }

    // ----------------------------------------------------------
    // Extensions autorisées
    // ----------------------------------------------------------

    const allowedExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.gif'
    ];

    const extension = path
        .extname(file.originalname || '')
        .toLowerCase();

    if (
        !allowedExtensions.includes(extension)
    ) {

        console.error(
            '❌ Extension non autorisée :',
            extension
        );

        return cb(
            new Error(
                'Format d’image non autorisé.'
            )
        );

    }

    console.log(
        '✅ Image acceptée'
    );

    cb(
        null,
        true
    );

};

// ============================================================
// 📸 INSTANCE MULTER
// ============================================================

const upload = multer({

    storage,

    limits: {

        // 10 Mo maximum par image
        fileSize: 10 * 1024 * 1024,

        // Maximum 10 fichiers
        files: 10

    },

    fileFilter

});

// ============================================================
// 🔎 LOG GLOBAL DES ROUTES PLANTES
// ============================================================

router.use(
    (req, res, next) => {

        

        next();

    }
);

// ============================================================
// 🔎 POST /api/plant/identify
// 🔎 POST /api/plants/identify
// ============================================================
//
// Le même router est monté dans server.js sur :
//
// app.use('/api/plant', plantRoutes);
// app.use('/api/plants', plantRoutes);
//
// La route finale fonctionne donc avec :
//
// POST /api/plant/identify
// POST /api/plants/identify
//
// ------------------------------------------------------------
// 📸 Champs acceptés
// ------------------------------------------------------------
//
// 1. image
//    → une image
//
// 2. images
//    → plusieurs images
//
// Le controller existant peut continuer à utiliser :
//
// req.file
//
// tandis que les fichiers complets sont disponibles dans :
//
// req.files
//
// ============================================================

router.post(
    '/identify',

    upload.fields([
        {
            name: 'image',
            maxCount: 1
        },
        {
            name: 'images',
            maxCount: 10
        }
    ]),

    async (req, res, next) => {

        

        // ======================================================
        // 📸 RÉCUPÉRATION DES FICHIERS
        // ======================================================

        const fichiersImage =
            req.files?.image || [];

        const fichiersImages =
            req.files?.images || [];

        const fichiersRecus = [
            ...fichiersImage,
            ...fichiersImages
        ];

        // ======================================================
        // ❌ AUCUNE IMAGE
        // ======================================================

        if (
            fichiersRecus.length === 0
        ) {

            console.error(
                '❌ Aucune image reçue'
            );

            console.error(
                '📦 req.files :',
                req.files
            );

            console.error(
                '📦 req.body :',
                req.body
            );

            return res.status(400).json({

                success: false,

                message:
                    'Aucune image n’a été envoyée.',

                expectedFields: [
                    'image',
                    'images'
                ]

            });

        }

        // ======================================================
        // 📸 NORMALISATION POUR LE CONTROLLER
        // ======================================================
        //
        // Ton ancien controller utilise probablement :
        //
        // req.file
        //
        // On conserve donc req.file avec la première image.
        //
        // Les autres restent disponibles dans req.files.
        //
        // ======================================================

        req.file =
            fichiersRecus[0];

        // ======================================================
        // 📸 INFORMATIONS DES IMAGES
        // ======================================================

        
        fichiersRecus.forEach(
            (file, index) => {

               

            }
        );

        
        
        // ======================================================
        // 🧠 CONTROLLER IDENTIFICATION
        // ======================================================

        try {

            await identifyPlant(
                req,
                res,
                next
            );

        } catch (error) {

            console.error('');
            console.error(
                '❌ ERREUR IDENTIFICATION PLANTE'
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

            next(error);

        }

    }
);

// ============================================================
// 🌱 GET /api/plant
// ============================================================

router.get(
    '/',
    async (req, res, next) => {

        

        // ------------------------------------------------------
        // Vérification MongoDB
        // ------------------------------------------------------

        const mongoState =
            mongoose.connection.readyState;

        

        if (
            mongoState !== 1
        ) {

            console.error(
                '❌ MongoDB n’est pas connecté'
            );

            return res.status(503).json({

                success: false,

                message:
                    'La base de données MongoDB n’est pas disponible.'

            });

        }

        // ------------------------------------------------------
        // Controller
        // ------------------------------------------------------

        try {

            

            await getAllPlants(
                req,
                res,
                next
            );

            

        } catch (error) {

            console.error('');
            console.error(
                '=========================================='
            );

            console.error(
                '❌ ERREUR GET /api/plant'
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

            console.error(
                '=========================================='
            );

            next(error);

        }

    }
);

// ============================================================
// 🧪 GET /api/plant/debug/uploads
// ============================================================

router.get(
    '/debug/uploads',
    (req, res) => {

        

        try {

            const exists =
                fs.existsSync(
                    uploadDirectory
                );

            const files =
                exists
                    ? fs.readdirSync(
                        uploadDirectory
                    )
                    : [];

            

            

            return res.status(200).json({

                success: true,

                directory:
                    uploadDirectory,

                exists,

                count:
                    files.length,

                files

            });

        } catch (error) {

            console.error(
                '❌ Erreur debug uploads :',
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    'Impossible de lire le dossier uploads.',

                error:
                    error.message

            });

        }

    }
);

// ============================================================
// 🌱 GET /api/plant/:id
// ============================================================

router.get(
    '/:id',
    async (req, res, next) => {

       

        try {

            await getPlantById(
                req,
                res,
                next
            );

        } catch (error) {

            console.error('');
            console.error(
                '❌ ERREUR GET PLANTE PAR ID'
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

            next(error);

        }

    }
);

// ============================================================
// 🌱 POST /api/plant
// ============================================================
//
// Création d'une plante.
//
// Angular doit envoyer un FormData.
//
// Champ image :
// images
//
// ============================================================

router.post(
    '/',
    upload.array(
        'images',
        10
    ),
    async (req, res, next) => {

        

        // ------------------------------------------------------
        // DÉTAILS DES IMAGES
        // ------------------------------------------------------

        if (
            req.files &&
            req.files.length > 0
        ) {

            req.files.forEach(
                (file, index) => {

                    console.log('');

                    console.log(
                        `📸 IMAGE ${index + 1}`
                    );

                    console.log(
                        '   Nom original :',
                        file.originalname
                    );

                    console.log(
                        '   Nom serveur :',
                        file.filename
                    );

                    console.log(
                        '   MIME :',
                        file.mimetype
                    );

                    console.log(
                        '   Taille :',
                        file.size
                    );

                    console.log(
                        '   Path :',
                        file.path
                    );

                    console.log(
                        '   URL :',
                        `/uploads/plants/${file.filename}`
                    );

                }
            );

        } else {

            console.log(
                'ℹ️ Aucune image reçue'
            );

        }

        // ------------------------------------------------------
        // VALIDATION MINIMALE
        // ------------------------------------------------------

        if (
            !req.body ||
            !req.body.nomCommun ||
            !String(
                req.body.nomCommun
            ).trim()
        ) {

            console.error(
                '❌ nomCommun manquant'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Le nom commun de la plante est obligatoire.',

                field:
                    'nomCommun'

            });

        }

        // ------------------------------------------------------
        // Controller
        // ------------------------------------------------------

        try {

            await createPlant(
                req,
                res,
                next
            );

        } catch (error) {

            console.error('');
            console.error(
                '=========================================='
            );

            console.error(
                '❌ ERREUR CREATE PLANT'
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
                'Détails :',
                error.errors || null
            );

            console.error(
                'Stack :',
                error.stack
            );

            console.error(
                '=========================================='
            );

            next(error);

        }

    }
);

// ============================================================
// ❌ GESTIONNAIRE ERREURS PLANT ROUTES
// ============================================================

router.use(
    (err, req, res, next) => {

        console.error('');
        console.error(
            '=========================================='
        );

        console.error(
            '❌ ERREUR PLANT ROUTES'
        );

        console.error(
            '=========================================='
        );

        console.error(
            '📡 Méthode :',
            req.method
        );

        console.error(
            '📍 URL :',
            req.originalUrl
        );

        console.error(
            '🔴 Message :',
            err.message
        );

        console.error(
            '🔴 Nom :',
            err.name
        );

        console.error(
            '🔴 Code :',
            err.code || 'N/A'
        );

        console.error(
            '🔴 Stack :',
            err.stack
        );

        // ======================================================
        // MULTER
        // ======================================================

        if (
            err instanceof multer.MulterError
        ) {

            console.error(
                '❌ Erreur Multer :',
                err.code
            );

            let message =
                'Erreur lors de l’upload.';

            switch (err.code) {

                case 'LIMIT_FILE_SIZE':

                    message =
                        'Une image dépasse la taille maximale de 10 Mo.';

                    break;

                case 'LIMIT_FILE_COUNT':

                    message =
                        'Le nombre maximum de fichiers est de 10.';

                    break;

                case 'LIMIT_UNEXPECTED_FILE':

                    message =
                        'Champ fichier inattendu. Utilisez "image" ou "images".';

                    break;

                case 'LIMIT_PART_COUNT':

                    message =
                        'Trop de parties dans la requête.';

                    break;

                case 'LIMIT_FIELD_COUNT':

                    message =
                        'Trop de champs dans la requête.';

                    break;

                case 'LIMIT_FIELD_KEY':

                    message =
                        'Nom de champ trop long.';

                    break;

                case 'LIMIT_FIELD_VALUE':

                    message =
                        'Valeur de champ trop longue.';

                    break;

                default:

                    message =
                        err.message ||
                        message;

            }

            return res.status(400).json({

                success: false,

                message,

                error:
                    err.code

            });

        }

        // ======================================================
        // FILE FILTER
        // ======================================================

        if (
            err.message ===
                'Seules les images sont autorisées.'
            ||
            err.message ===
                'Format d’image non autorisé.'
        ) {

            return res.status(400).json({

                success: false,

                message:
                    err.message

            });

        }

        // ======================================================
        // VALIDATION MONGOOSE
        // ======================================================

        if (
            err.name ===
            'ValidationError'
        ) {

            const details = {};

            if (
                err.errors
            ) {

                Object.entries(
                    err.errors
                ).forEach(
                    ([field, value]) => {

                        details[field] =
                            value.message;

                    }
                );

            }

            return res.status(400).json({

                success: false,

                message:
                    'Les données de la plante sont invalides.',

                error:
                    err.message,

                details

            });

        }

        // ======================================================
        // CAST ERROR
        // ======================================================

        if (
            err.name ===
            'CastError'
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Identifiant de plante invalide.',

                error:
                    err.message

            });

        }

        // ======================================================
        // DUPLICATE KEY
        // ======================================================

        if (
            err.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    'Une plante avec cette valeur existe déjà.',

                error:
                    err.message,

                details:
                    err.keyValue || null

            });

        }

        // ======================================================
        // MISSING SCHEMA
        // ======================================================

        if (
            err.name ===
            'MissingSchemaError'
        ) {

            console.error('');
            console.error(
                '🚨 MISSING SCHEMA MONGOOSE'
            );

            console.error(
                'Le controller utilise probablement un modèle qui n’est pas enregistré.'
            );

            return res.status(500).json({

                success: false,

                message:
                    'Erreur de configuration des modèles MongoDB.',

                error:
                    err.message

            });

        }

        // ======================================================
        // MONGODB
        // ======================================================

        if (
            err.name ===
                'MongoServerError'
            ||
            err.name ===
                'MongoError'
        ) {

            return res.status(500).json({

                success: false,

                message:
                    'Erreur MongoDB.',

                error:
                    err.message

            });

        }

        // ======================================================
        // ERREUR GÉNÉRALE
        // ======================================================

        return res.status(
            err.status ||
            err.statusCode ||
            500
        ).json({

            success: false,

            message:
                err.message ||
                'Une erreur serveur est survenue.'

        });

    }
);



module.exports = router;