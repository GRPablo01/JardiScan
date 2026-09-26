const express = require('express');

const router = express.Router();

const rappelController = require('../Controller/rappel.controller');


/* ============================================================
   📋 TOUS LES RAPPELS
   ============================================================ */

router.get(
    '/',
    rappelController.getRappels
);


/* ============================================================
   📅 RAPPELS DU JOUR
   ============================================================ */

router.get(
    '/today',
    rappelController.getRappelsDuJour
);


/* ============================================================
   ➕ CRÉER UN RAPPEL
   ============================================================ */

router.post(
    '/',
    rappelController.createRappel
);


/* ============================================================
   ✏️ MODIFIER UN RAPPEL
   ============================================================ */

router.put(
    '/:id',
    rappelController.updateRappel
);


/* ============================================================
   ✅ TERMINER UN RAPPEL
   ============================================================ */

/*
   PATCH /api/rappels/:id/terminer

   Utilisé lorsque l'utilisateur clique sur
   le bouton ✓ du rappel.

   Le rappel reste enregistré en base avec :

   termine = true
*/

router.patch(
    '/:id/terminer',
    rappelController.terminerRappel
);


/* ============================================================
   ↩️ ROUVRIR UN RAPPEL
   ============================================================ */

/*
   PATCH /api/rappels/:id/annuler

   Utilisé lorsque l'utilisateur clique sur
   le bouton ↩️.

   Le rappel redevient :

   termine = false
*/

router.patch(
    '/:id/annuler',
    rappelController.annulerTerminaisonRappel
);


/* ============================================================
   🔄 TERMINER / RÉACTIVER — COMPATIBILITÉ
   ============================================================ */

/*
   Cette route est conservée pour ne rien casser
   dans les éventuelles autres pages qui utilisent
   encore toggleRappel().
*/

router.patch(
    '/:id/toggle',
    rappelController.toggleRappel
);


/* ============================================================
   🗑️ SUPPRIMER UN RAPPEL
   ============================================================ */

router.delete(
    '/:id',
    rappelController.deleteRappel
);


/* ============================================================
   📤 EXPORT
   ============================================================ */

module.exports = router;