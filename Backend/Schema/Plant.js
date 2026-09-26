const mongoose = require('mongoose');

// ============================================================
// 🌿 SCHÉMA PLANTE — JARDISCAN
// ============================================================

const planteSchema = new mongoose.Schema(
    {

        // ========================================================
        // 🌱 IDENTITÉ DE LA PLANTE
        // ========================================================

        nomCommun: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        nomScientifique: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        famille: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        origine: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        // ========================================================
        // 🖼️ IMAGES
        // ========================================================

        images: [
            {
                url: {
                    type: String,
                    required: true,
                    trim: true
                },

                vue: {
                    type: String,
                    enum: [
                        'front',
                        'side',
                        'top',
                        'close-up',
                        'far'
                    ],
                    default: 'front'
                }
            }
        ],

        // ========================================================
        // 🎨 CARACTÉRISTIQUES
        // ========================================================

        couleur: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        nombre: {

            type: Number,

            required: true,

            min: 1,

            default: 1

        },
        
        periodeFloraison: {
            type: String,
            required: false,
            trim: true,
            maxlength: 100
        },

        periodeRecolte: {
            type: String,
            required: false,
            trim: true,
            maxlength: 100
        },

        cycle: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        // ========================================================
        // ☀️ CONDITIONS DE CULTURE
        // ========================================================

        exposition: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        arrosage: {
            type: String,
            required: true,
            trim: true
        },

        sol: {
            type: String,
            required: true,
            trim: true
        },

        temperatureMin: {
            type: Number,
            required: true
        },

        temperatureMax: {
            type: Number,
            required: true
        },

        humidite: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        // ========================================================
        // ⚠️ SÉCURITÉ
        // ========================================================

        partiesDangereuses: {
            type: String,
            required: true,
            trim: true
        },

        // ========================================================
        // 🍽️ UTILISATION CULINAIRE
        // ========================================================

        usageCulinaire: {
            type: String,
            required: true,
            trim: true
        },

        // ========================================================
        // 🔁 RETOUR / INFORMATIONS COMPLÉMENTAIRES
        // FACULTATIF
        // ========================================================

        retoure: {
            type: String,
            required: false,
            trim: true,
            default: null
        }

    },

    // ============================================================
    // ⚙️ OPTIONS MONGOOSE
    // ============================================================

    {
        timestamps: true
    }
);


// ============================================================
// 📦 EXPORT
// ============================================================

module.exports = mongoose.model('Plante', planteSchema);