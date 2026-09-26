const Rappel = require('../Schema/Rappel');
const Utilisateur = require('../Schema/User');
const mongoose = require('mongoose');


/* ============================================================
   🌱 POPULATE PLANTE DE FAÇON SÉCURISÉE
   ============================================================ */

/*
   Ton Rappel utilise :

   ref: 'Plante'

   Si le modèle Plante est enregistré dans Mongoose,
   on effectue le populate normalement.

   Si le modèle n'est pas encore enregistré, on laisse
   simplement le rappel sans populate afin d'éviter :

   MissingSchemaError:
   Schema hasn't been registered for model "Plante"
*/

function populatePlante(query) {

    if (mongoose.models.Plante) {

        return query.populate(
            'plante',
            'nom espece image images'
        );

    }

    console.warn(
        '⚠️ Modèle "Plante" non enregistré. Populate ignoré.'
    );

    return query;
}


/* ============================================================
   🔐 RÉCUPÉRER L'ID UTILISATEUR
   ============================================================ */

function getUtilisateurId(req) {

    const utilisateurId =
        req.headers['x-user'] ||
        req.body?.utilisateur ||
        req.query?.utilisateur;

    if (!utilisateurId) {
        return null;
    }

    if (
        !mongoose.Types.ObjectId.isValid(
            utilisateurId
        )
    ) {
        return null;
    }

    return utilisateurId;
}


/* ============================================================
   👤 RÉCUPÉRER LES INFORMATIONS DE L'UTILISATEUR
   ============================================================ */

async function getUtilisateurInfos(utilisateurId) {

    try {

        const utilisateur =
            await Utilisateur.findById(
                utilisateurId
            ).select('prenom nom');

        if (!utilisateur) {
            return null;
        }

        return {

            prenom:
                utilisateur.prenom
                    ? utilisateur.prenom.trim()
                    : '',

            nom:
                utilisateur.nom
                    ? utilisateur.nom.trim()
                    : ''

        };

    } catch (error) {

        console.error(
            '❌ Erreur récupération informations utilisateur :',
            error
        );

        return null;
    }
}


/* ============================================================
   📋 RÉCUPÉRER TOUS LES RAPPELS
   ============================================================ */

exports.getRappels = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }

        let query =
            Rappel.find({
                utilisateur:
                    utilisateurId
            })
            .sort({
                termine: 1,
                date: 1
            });

        query =
            populatePlante(query);

        const rappels =
            await query;

        return res.status(200).json(
            rappels
        );

    } catch (error) {

        console.error(
            '❌ Erreur récupération rappels :',
            error
        );

        return res.status(500).json({
            message:
                'Erreur serveur lors de la récupération des rappels'
        });
    }
};


/* ============================================================
   📅 RÉCUPÉRER LES RAPPELS DU JOUR
   ============================================================ */

exports.getRappelsDuJour = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }

        const maintenant =
            new Date();

        const debut =
            new Date(
                maintenant.getFullYear(),
                maintenant.getMonth(),
                maintenant.getDate(),
                0,
                0,
                0,
                0
            );

        const fin =
            new Date(
                maintenant.getFullYear(),
                maintenant.getMonth(),
                maintenant.getDate(),
                23,
                59,
                59,
                999
            );


        /*
           ⚠️ IMPORTANT

           On ne filtre plus :

               termine: false

           afin de permettre au frontend de conserver
           temporairement les rappels terminés.

           Le frontend gère ensuite :
           - l'affichage grisé
           - le bouton rouvrir
           - la disparition après 10 minutes
        */

        let query =
            Rappel.find({

                utilisateur:
                    utilisateurId,

                actif:
                    true,

                date: {
                    $gte:
                        debut,

                    $lte:
                        fin
                }

            })
            .sort({
                termine: 1,
                date: 1
            });

        query =
            populatePlante(query);

        const rappels =
            await query;

        return res.status(200).json(
            rappels
        );

    } catch (error) {

        console.error(
            '❌ Erreur rappels du jour :',
            error
        );

        return res.status(500).json({
            message:
                'Erreur serveur lors de la récupération des rappels du jour'
        });
    }
};


/* ============================================================
   ➕ CRÉER UN RAPPEL
   ============================================================ */

exports.createRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        /* ----------------------------------------------------
           👤 RÉCUPÉRATION UTILISATEUR
           ---------------------------------------------------- */

        const utilisateurInfos =
            await getUtilisateurInfos(
                utilisateurId
            );

        if (!utilisateurInfos) {

            return res.status(404).json({
                message:
                    'Utilisateur introuvable'
            });

        }


        const {
            plante,
            titre,
            description,
            type,
            date,
            frequence
        } = req.body;


        /* ----------------------------------------------------
           Vérification du titre
           ---------------------------------------------------- */

        if (
            !titre ||
            !titre.trim()
        ) {

            return res.status(400).json({
                message:
                    'Le titre est obligatoire'
            });

        }


        /* ----------------------------------------------------
           Vérification de la date
           ---------------------------------------------------- */

        if (!date) {

            return res.status(400).json({
                message:
                    'La date est obligatoire'
            });

        }

        const dateRappel =
            new Date(date);

        if (
            Number.isNaN(
                dateRappel.getTime()
            )
        ) {

            return res.status(400).json({
                message:
                    'La date du rappel est invalide'
            });

        }


        /* ----------------------------------------------------
           Vérification de la plante
           ---------------------------------------------------- */

        let planteId = null;

        if (plante) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    plante
                )
            ) {

                return res.status(400).json({
                    message:
                        'ID de plante invalide'
                });

            }

            planteId =
                plante;
        }


        /* ----------------------------------------------------
           Création du rappel
           ---------------------------------------------------- */

        const nouveauRappel =
            new Rappel({

                utilisateur:
                    utilisateurId,

                // 👤 Informations utilisateur
                prenom:
                    utilisateurInfos.prenom,

                nom:
                    utilisateurInfos.nom,

                // 🌱 Plante
                plante:
                    planteId,

                // 📝 Rappel
                titre:
                    titre.trim(),

                description:
                    description
                        ? description.trim()
                        : '',

                type:
                    type || 'autre',

                date:
                    dateRappel,

                frequence:
                    frequence || 'unique',

                // 🔔 État initial
                termine:
                    false,

                actif:
                    true

            });


        const rappel =
            await nouveauRappel.save();


        /* ----------------------------------------------------
           Récupération du rappel créé
           ---------------------------------------------------- */

        let query =
            Rappel.findById(
                rappel._id
            );

        query =
            populatePlante(query);

        const rappelComplete =
            await query;


        /* ----------------------------------------------------
           Réponse
           ---------------------------------------------------- */

        return res.status(201).json({

            success:
                true,

            message:
                'Rappel créé avec succès',

            rappel:
                rappelComplete

        });

    } catch (error) {

        console.error(
            '❌ Erreur création rappel :',
            error
        );

        return res.status(500).json({

            success:
                false,

            message:
                'Erreur serveur lors de la création du rappel',

            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined

        });
    }
};


/* ============================================================
   ✏️ MODIFIER UN RAPPEL
   ============================================================ */

exports.updateRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                message:
                    'ID de rappel invalide'
            });

        }


        /* ----------------------------------------------------
           Préparer les données
           ---------------------------------------------------- */

        const donneesModification = {
            ...req.body
        };


        /* ----------------------------------------------------
           Sécurité utilisateur
           ---------------------------------------------------- */

        /*
           On ne permet pas de changer l'utilisateur
           propriétaire du rappel depuis le frontend.
        */

        delete donneesModification.utilisateur;


        /* ----------------------------------------------------
           👤 Maintenir les informations utilisateur à jour
           ---------------------------------------------------- */

        const utilisateurInfos =
            await getUtilisateurInfos(
                utilisateurId
            );

        if (!utilisateurInfos) {

            return res.status(404).json({
                message:
                    'Utilisateur introuvable'
            });

        }

        donneesModification.prenom =
            utilisateurInfos.prenom;

        donneesModification.nom =
            utilisateurInfos.nom;


        /* ----------------------------------------------------
           Nettoyage du titre
           ---------------------------------------------------- */

        if (
            donneesModification.titre !== undefined
        ) {

            if (
                !donneesModification.titre ||
                !donneesModification.titre.trim()
            ) {

                return res.status(400).json({
                    message:
                        'Le titre ne peut pas être vide'
                });

            }

            donneesModification.titre =
                donneesModification.titre.trim();
        }


        /* ----------------------------------------------------
           Vérification plante
           ---------------------------------------------------- */

        if (
            donneesModification.plante !== undefined
        ) {

            if (
                donneesModification.plante === null ||
                donneesModification.plante === ''
            ) {

                donneesModification.plante =
                    null;

            } else if (
                !mongoose.Types.ObjectId.isValid(
                    donneesModification.plante
                )
            ) {

                return res.status(400).json({
                    message:
                        'ID de plante invalide'
                });

            }
        }


        /* ----------------------------------------------------
           Vérification date
           ---------------------------------------------------- */

        if (
            donneesModification.date !== undefined
        ) {

            const nouvelleDate =
                new Date(
                    donneesModification.date
                );

            if (
                Number.isNaN(
                    nouvelleDate.getTime()
                )
            ) {

                return res.status(400).json({
                    message:
                        'Date invalide'
                });

            }

            donneesModification.date =
                nouvelleDate;
        }


        /* ----------------------------------------------------
           Modification
           ---------------------------------------------------- */

        let query =
            Rappel.findOneAndUpdate(

                {
                    _id:
                        id,

                    utilisateur:
                        utilisateurId
                },

                {
                    $set:
                        donneesModification
                },

                {
                    new:
                        true,

                    runValidators:
                        true
                }
            );


        query =
            populatePlante(query);


        const rappel =
            await query;


        if (!rappel) {

            return res.status(404).json({
                message:
                    'Rappel introuvable'
            });

        }


        return res.status(200).json({

            success:
                true,

            message:
                'Rappel modifié avec succès',

            rappel

        });

    } catch (error) {

        console.error(
            '❌ Erreur modification rappel :',
            error
        );

        return res.status(500).json({
            message:
                'Erreur serveur lors de la modification du rappel'
        });
    }
};


/* ============================================================
   ✅ TERMINER UN RAPPEL
   ============================================================ */

/*
   Endpoint :

   PATCH /api/rappels/:id/terminer

   Utilisé par :

   rappelService.terminerRappel(id)

   Le rappel reste en base.
   On passe simplement :

   termine = true

   Le frontend décide ensuite de :
   - griser le rappel
   - afficher le bouton de réouverture
   - le retirer après 10 minutes
*/

exports.terminerRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                success:
                    false,

                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                success:
                    false,

                message:
                    'ID de rappel invalide'
            });

        }


        let query =
            Rappel.findOneAndUpdate(

                {
                    _id:
                        id,

                    utilisateur:
                        utilisateurId
                },

                {
                    $set: {
                        termine:
                            true
                    }
                },

                {
                    new:
                        true,

                    runValidators:
                        true
                }

            );


        query =
            populatePlante(query);


        const rappel =
            await query;


        if (!rappel) {

            return res.status(404).json({
                success:
                    false,

                message:
                    'Rappel introuvable'
            });

        }


        return res.status(200).json({

            success:
                true,

            message:
                'Rappel terminé avec succès',

            rappel

        });

    } catch (error) {

        console.error(
            '❌ Erreur terminaison rappel :',
            error
        );

        return res.status(500).json({

            success:
                false,

            message:
                'Erreur serveur lors de la terminaison du rappel',

            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined

        });
    }
};


/* ============================================================
   🔄 ROUVRIR / ANNULER LA TERMINAISON D'UN RAPPEL
   ============================================================ */

/*
   Endpoint :

   PATCH /api/rappels/:id/annuler

   Utilisé par :

   rappelService.annulerTerminaisonRappel(id)

   Le rappel redevient immédiatement actif.
*/

exports.annulerTerminaisonRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                success:
                    false,

                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                success:
                    false,

                message:
                    'ID de rappel invalide'
            });

        }


        let query =
            Rappel.findOneAndUpdate(

                {
                    _id:
                        id,

                    utilisateur:
                        utilisateurId
                },

                {
                    $set: {
                        termine:
                            false
                    }
                },

                {
                    new:
                        true,

                    runValidators:
                        true
                }

            );


        query =
            populatePlante(query);


        const rappel =
            await query;


        if (!rappel) {

            return res.status(404).json({
                success:
                    false,

                message:
                    'Rappel introuvable'
            });

        }


        return res.status(200).json({

            success:
                true,

            message:
                'Rappel rouvert avec succès',

            rappel

        });

    } catch (error) {

        console.error(
            '❌ Erreur réouverture rappel :',
            error
        );

        return res.status(500).json({

            success:
                false,

            message:
                'Erreur serveur lors de la réouverture du rappel',

            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined

        });
    }
};


/* ============================================================
   🔄 TERMINER / RÉACTIVER UN RAPPEL
   ============================================================ */

/*
   Cette route est conservée pour ne rien casser
   dans les autres pages qui utilisent encore :

   PATCH /api/rappels/:id/toggle
*/

exports.toggleRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                message:
                    'ID de rappel invalide'
            });

        }


        const rappel =
            await Rappel.findOne({

                _id:
                    id,

                utilisateur:
                    utilisateurId

            });


        if (!rappel) {

            return res.status(404).json({
                message:
                    'Rappel introuvable'
            });

        }


        rappel.termine =
            !rappel.termine;


        await rappel.save();


        return res.status(200).json({

            success:
                true,

            message:
                rappel.termine
                    ? 'Rappel terminé'
                    : 'Rappel réactivé',

            rappel

        });

    } catch (error) {

        console.error(
            '❌ Erreur changement état rappel :',
            error
        );

        return res.status(500).json({
            message:
                'Erreur serveur'
        });
    }
};


/* ============================================================
   🗑️ SUPPRIMER UN RAPPEL
   ============================================================ */

exports.deleteRappel = async (req, res) => {

    try {

        const utilisateurId =
            getUtilisateurId(req);

        if (!utilisateurId) {

            return res.status(400).json({
                message:
                    'Utilisateur invalide ou manquant'
            });

        }


        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                message:
                    'ID de rappel invalide'
            });

        }


        const rappel =
            await Rappel.findOneAndDelete({

                _id:
                    id,

                utilisateur:
                    utilisateurId

            });


        if (!rappel) {

            return res.status(404).json({
                message:
                    'Rappel introuvable'
            });

        }


        return res.status(200).json({

            success:
                true,

            message:
                'Rappel supprimé avec succès'

        });

    } catch (error) {

        console.error(
            '❌ Erreur suppression rappel :',
            error
        );

        return res.status(500).json({
            message:
                'Erreur serveur'
        });
    }
};