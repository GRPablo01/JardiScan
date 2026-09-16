const bcrypt = require('bcrypt');
const User = require('../Schema/User');
const nodemailer = require('nodemailer');


// =====================================================
// 📧 CONFIGURATION MAIL
// =====================================================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }

});


// =====================================================
// 🔑 GÉNÉRATION ALÉATOIRE DE SUFFIXE
// =====================================================

function randomSuffix(length = 5) {

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let result = '';

    for (let i = 0; i < length; i++) {

        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    return result;

}


// =====================================================
// 🔐 GÉNÉRATION CLÉ RESET PASSWORD
// =====================================================

function generateResetKey() {

    // Toujours 5 chiffres
    const numberPart = Math.floor(
        10000 + Math.random() * 90000
    );

    // Toujours 5 lettres
    const suffix = randomSuffix(5);

    return `${numberPart}${suffix}`;

}


// =====================================================
// 🌿 TEMPLATE EMAIL JARDISCAN
// =====================================================

function generateResetEmailHTML(user, isDark = false) {

    // =================================================
    // 🎨 PALETTE JARDISCAN
    // =================================================

    const colors = {

        // ---------------------------------------------
        // BACKGROUNDS
        // ---------------------------------------------

        bgPrincipal: isDark
            ? '#0B2425'
            : '#F3F1E8',

        bgCard: isDark
            ? '#163536'
            : '#FFFFFF',

        bgFooter: isDark
            ? '#102829'
            : '#E9E8DF',


        // ---------------------------------------------
        // TEXTES
        // ---------------------------------------------

        textPrincipal: isDark
            ? '#F3F1E8'
            : '#202827',

        textSecondaire: isDark
            ? '#C8D8C7'
            : '#53615B',

        textMuted: isDark
            ? '#9FAFAA'
            : '#7A837E',


        // ---------------------------------------------
        // 🌲 JARDISCAN
        // ---------------------------------------------

        forest: '#133A3C',

        deepGreen: '#1F5A4D',

        leaf: '#4F8061',

        sage: '#8FAF91',

        olive: '#7C8760',

        sand: '#C8B99A',

        earth: '#9A7653',

        cream: '#F3F1E8',

        charcoal: '#202827',


        // ---------------------------------------------
        // SOFT BACKGROUNDS
        // ---------------------------------------------

        greenSoft: isDark
            ? '#173F3D'
            : '#E2ECE4',

        sageSoft: isDark
            ? '#24433D'
            : '#EAF0E8',

        sandSoft: isDark
            ? '#403A2F'
            : '#F3EDE1',


        // ---------------------------------------------
        // BORDURE
        // ---------------------------------------------

        border: isDark
            ? '#315451'
            : '#D7DDD5'

    };


    // =================================================
    // 👤 INFORMATIONS UTILISATEUR
    // =================================================

    const prenom = user.prenom || '';

    const nom = user.nom || '';

    const initiales =
        `${prenom.charAt(0)}${nom.charAt(0)}`
            .toUpperCase();


    const displayName =
        `${prenom} ${nom}`.trim() || 'Utilisateur';


    // =================================================
    // 🔑 CLÉ
    // =================================================

    const resetKey =
        user.resetPasswordKey || '';


    // =================================================
    // 📧 HTML
    // =================================================

    return `

<!DOCTYPE html>

<html lang="fr">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    JardiScan - Réinitialisation du mot de passe
</title>

</head>


<body
style="
    margin:0;
    padding:0;
    background:${colors.bgPrincipal};
    font-family:
        Arial,
        Helvetica,
        sans-serif;
"
>


<!-- =====================================================
     CONTAINER PRINCIPAL
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        padding:40px 20px;
    "
>

<tr>

<td align="center">


<!-- =====================================================
     CARD
===================================================== -->

<table
    width="700"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:700px;
        width:100%;
        background:${colors.bgCard};
        border-radius:28px;
        overflow:hidden;
        border:1px solid ${colors.border};
        box-shadow:
            0 20px 50px rgba(19,58,60,0.16);
    "
>


<!-- =====================================================
     🌿 HEADER
===================================================== -->

<tr>

<td
    style="
        background:
            linear-gradient(
                135deg,
                ${colors.forest} 0%,
                ${colors.deepGreen} 55%,
                ${colors.leaf} 100%
            );
        padding:42px 30px;
        text-align:center;
    "
>


<!-- LOGO -->

<div
    style="
        width:72px;
        height:72px;
        margin:0 auto 18px auto;
        border-radius:22px;
        background:rgba(255,255,255,0.12);
        border:1px solid rgba(255,255,255,0.22);
        line-height:72px;
        font-size:34px;
    "
>
    🌿
</div>


<!-- NOM -->

<h1
    style="
        margin:0;
        color:#FFFFFF;
        font-size:32px;
        font-weight:700;
        letter-spacing:2px;
    "
>
    JardiScan
</h1>


<p
    style="
        margin:12px 0 0 0;
        color:rgba(255,255,255,0.75);
        font-size:14px;
        letter-spacing:0.5px;
    "
>
    Votre jardin numérique
</p>


</td>

</tr>


<!-- =====================================================
     CONTENT
===================================================== -->

<tr>

<td
    style="
        padding:38px;
    "
>


<!-- =====================================================
     👤 USER CARD
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:${colors.greenSoft};
        border-radius:22px;
        border:1px solid ${colors.border};
    "
>

<tr>

<td
    align="center"
    style="
        padding:28px 20px;
    "
>


<!-- AVATAR -->

<div
    style="
        width:82px;
        height:82px;
        line-height:82px;
        margin:auto;
        border-radius:50%;
        background:
            linear-gradient(
                135deg,
                ${colors.leaf},
                ${colors.deepGreen}
            );
        color:#FFFFFF;
        font-size:27px;
        font-weight:700;
        letter-spacing:1px;
        text-align:center;
    "
>
    ${initiales || 'JS'}
</div>


<!-- BONJOUR -->

<h2
    style="
        margin:20px 0 6px 0;
        color:${colors.textPrincipal};
        font-size:22px;
        font-weight:700;
    "
>
    Bonjour ${displayName}
</h2>


<p
    style="
        margin:0;
        color:${colors.textSecondaire};
        font-size:14px;
    "
>
    L'équipe JardiScan 🌿
</p>


</td>

</tr>

</table>


<!-- =====================================================
     TITRE
===================================================== -->

<h3
    style="
        margin:35px 0 15px 0;
        color:${colors.deepGreen};
        font-size:22px;
        font-weight:700;
    "
>
    🔐 Réinitialisation du mot de passe
</h3>


<!-- =====================================================
     TEXTE
===================================================== -->

<p
    style="
        margin:0 0 15px 0;
        color:${colors.textSecondaire};
        line-height:1.8;
        font-size:15px;
    "
>
    Une demande de réinitialisation du mot de passe
    a été effectuée pour votre compte JardiScan.
</p>


<p
    style="
        margin:0;
        color:${colors.textSecondaire};
        line-height:1.8;
        font-size:15px;
    "
>
    Pour continuer, utilisez la clé de sécurité
    ci-dessous afin de créer un nouveau mot de passe.
</p>


<!-- =====================================================
     🔑 RESET KEY CARD
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin-top:32px;
        background:${colors.sageSoft};
        border-radius:22px;
        border:2px dashed ${colors.sage};
    "
>

<tr>

<td
    align="center"
    style="
        padding:28px 20px;
    "
>


<p
    style="
        margin:0 0 15px 0;
        color:${colors.textSecondaire};
        font-size:13px;
        font-weight:600;
        text-transform:uppercase;
        letter-spacing:1.5px;
    "
>
    Votre clé de sécurité
</p>


<!-- CLÉ -->

<div
    style="
        display:inline-block;
        padding:17px 30px;
        background:${colors.forest};
        color:#FFFFFF;
        border-radius:15px;
        font-size:25px;
        font-weight:700;
        letter-spacing:5px;
        box-shadow:
            0 8px 20px rgba(19,58,60,0.20);
    "
>
    ${resetKey}
</div>


<p
    style="
        margin:16px 0 0 0;
        color:${colors.textMuted};
        font-size:12px;
    "
>
    Copiez cette clé dans JardiScan
</p>


</td>

</tr>

</table>


<!-- =====================================================
     ⏱️ EXPIRATION
===================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin-top:25px;
        background:${colors.sandSoft};
        border-radius:16px;
    "
>

<tr>

<td
    style="
        padding:16px 18px;
        text-align:center;
    "
>

<p
    style="
        margin:0;
        color:${colors.textSecondaire};
        font-size:13px;
        line-height:1.6;
    "
>
    ⏱️ Cette clé est valable pendant
    <strong style="color:${colors.forest};">
        15 minutes
    </strong>.
</p>

</td>

</tr>

</table>


<!-- =====================================================
     ⚠️ SÉCURITÉ
===================================================== -->

<p
    style="
        margin:25px 0 0 0;
        color:${colors.textMuted};
        font-size:13px;
        line-height:1.7;
        text-align:center;
    "
>
    🛡️ Si vous n'êtes pas à l'origine de cette demande,
    vous pouvez simplement ignorer cet email.
</p>


</td>

</tr>


<!-- =====================================================
     🌿 FOOTER
===================================================== -->

<tr>

<td
    style="
        padding:28px 25px;
        text-align:center;
        background:${colors.bgFooter};
        border-top:1px solid ${colors.border};
    "
>


<p
    style="
        margin:0;
        color:${colors.forest};
        font-size:20px;
        font-weight:700;
        letter-spacing:1px;
    "
>
    🌿 JardiScan
</p>


<p
    style="
        margin:8px 0 0 0;
        color:${colors.textMuted};
        font-size:12px;
    "
>
    Votre jardin numérique
</p>


<p
    style="
        margin:15px 0 0 0;
        color:${colors.textMuted};
        font-size:11px;
    "
>
    Message automatique — Merci de ne pas répondre à cet email.
</p>


<p
    style="
        margin:6px 0 0 0;
        color:${colors.textMuted};
        font-size:11px;
    "
>
    © ${new Date().getFullYear()} JardiScan
</p>


</td>

</tr>


</table>


</td>

</tr>

</table>


</body>

</html>

`;

}


// ======================================================
// 🔐 ENVOYER CLÉ RESET PASSWORD
// POST /api/users/send-reset
// ======================================================

exports.sendResetPassword = async (req, res) => {

    try {

        // =================================================
        // 📩 EMAIL REÇU
        // =================================================

        const { email } = req.body;

        console.log('');
        console.log('=================================');
        console.log('📩 DEMANDE RESET PASSWORD JARDISCAN');
        console.log('📧 Email reçu :', email);
        console.log('=================================');


        // =================================================
        // ❌ VALIDATION EMAIL
        // =================================================

        if (
            typeof email !== 'string' ||
            !email.trim()
        ) {

            console.log('❌ Email manquant');

            return res.status(400).json({

                success: false,

                message:
                    'Email obligatoire'

            });

        }


        // =================================================
        // 🧹 NETTOYAGE
        // =================================================

        const emailClean =
            email
                .trim()
                .toLowerCase();


        console.log(
            '🧹 Email nettoyé :',
            emailClean
        );


        // =================================================
        // 🔎 RECHERCHE UTILISATEUR
        // =================================================

        console.log('');
        console.log('🔎 Recherche utilisateur...');


        const user =
            await User.findOne({

                email: emailClean

            });


        if (!user) {

            console.log(
                '❌ Utilisateur introuvable'
            );

            return res.status(404).json({

                success: false,

                message:
                    'Utilisateur introuvable'

            });

        }


        console.log(
            '✅ Utilisateur trouvé :',
            user._id
        );


        // =================================================
        // 🔑 GÉNÉRATION CLÉ
        // =================================================

        const resetKey =
            generateResetKey();


        // =================================================
        // ⏱️ EXPIRATION 15 MINUTES
        // =================================================

        const resetPasswordExpire =
            Date.now() + (15 * 60 * 1000);


        console.log('');
        console.log(
            '🔑 Nouvelle clé :',
            resetKey
        );

        console.log(
            '⏱️ Expiration :',
            new Date(resetPasswordExpire)
        );


        // =================================================
        // 💾 SAUVEGARDE
        // =================================================

        user.resetPasswordKey =
            resetKey;

        user.resetPasswordExpire =
            resetPasswordExpire;


        console.log('');
        console.log(
            '💾 Sauvegarde des données reset...'
        );


        await user.save();


        // =================================================
        // 🔎 VÉRIFICATION APRÈS SAVE
        // =================================================

        const userCheck =
            await User.findById(user._id);


        console.log('');
        console.log(
            '🔎 VÉRIFICATION MONGODB APRÈS SAVE'
        );

        console.log({

            resetPasswordKey:
                userCheck.resetPasswordKey,

            resetPasswordExpire:
                userCheck.resetPasswordExpire,

            expirationDate:
                userCheck.resetPasswordExpire
                    ? new Date(
                        Number(
                            userCheck.resetPasswordExpire
                        )
                    )
                    : null

        });


        // =================================================
        // 📧 VÉRIFICATION MAIL
        // =================================================

        if (
            !process.env.MAIL_USER ||
            !process.env.MAIL_PASS
        ) {

            console.error(
                '❌ Configuration MAIL_USER / MAIL_PASS manquante'
            );

            return res.status(500).json({

                success: false,

                message:
                    'Configuration email du serveur incorrecte'

            });

        }


        // =================================================
        // 📧 EMAIL
        // =================================================

        const mailOptions = {

            from:
                `"JardiScan 🌿" <${process.env.MAIL_USER}>`,

            to:
                user.email,

            subject:
                '🔐 JardiScan — Réinitialisation du mot de passe',

            html:
                generateResetEmailHTML(user)

        };


        console.log('');
        console.log('📨 Envoi du mail...');


        const info =
            await transporter.sendMail(
                mailOptions
            );


        // =================================================
        // ✅ SUCCÈS
        // =================================================

        console.log('');
        console.log('=================================');
        console.log('✅ MAIL JARDISCAN ENVOYÉ');
        console.log('📧 Destinataire :', user.email);
        console.log('🔑 Clé :', user.resetPasswordKey);
        console.log(
            '⏱️ Expire le :',
            new Date(
                Number(
                    user.resetPasswordExpire
                )
            )
        );
        console.log(
            '🆔 Message ID :',
            info.messageId
        );
        console.log('=================================');


        return res.status(200).json({

            success: true,

            message:
                'Mail de réinitialisation envoyé'

        });


    } catch (error) {

        console.error('');
        console.error('=================================');
        console.error(
            '❌ ERREUR ENVOI RESET PASSWORD'
        );
        console.error('=================================');

        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                'Erreur serveur'

        });

    }

};


// ======================================================
// 🔐 VÉRIFIER CLÉ RESET PASSWORD
// POST /api/users/verify-reset
// ======================================================

exports.verifyResetKey = async (req, res) => {

    try {

        // =================================================
        // 📩 DONNÉES
        // =================================================

        const {
            email,
            resetPasswordKey
        } = req.body;


        console.log('');
        console.log('=================================');
        console.log(
            '🔑 VÉRIFICATION CLÉ RESET JARDISCAN'
        );
        console.log('📧 Email reçu :', email);
        console.log(
            '🔐 Clé reçue :',
            resetPasswordKey
        );
        console.log('=================================');


        // =================================================
        // ❌ VALIDATION EMAIL
        // =================================================

        if (
            typeof email !== 'string' ||
            !email.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Email obligatoire'

            });

        }


        // =================================================
        // ❌ VALIDATION CLÉ
        // =================================================

        if (
            typeof resetPasswordKey !== 'string' ||
            !resetPasswordKey.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Clé de réinitialisation obligatoire'

            });

        }


        // =================================================
        // 🧹 NETTOYAGE
        // =================================================

        const emailClean =
            email
                .trim()
                .toLowerCase();


        const resetKeyClean =
            resetPasswordKey
                .trim()
                .toUpperCase();


        console.log(
            '🧹 Email nettoyé :',
            emailClean
        );

        console.log(
            '🧹 Clé nettoyée :',
            resetKeyClean
        );


        // =================================================
        // 🔎 RECHERCHE UTILISATEUR
        // =================================================

        console.log('');
        console.log(
            '🔎 Recherche utilisateur...'
        );


        const user =
            await User.findOne({

                email: emailClean

            });


        if (!user) {

            console.log(
                '❌ Utilisateur introuvable'
            );

            return res.status(404).json({

                success: false,

                message:
                    'Utilisateur introuvable'

            });

        }


        // =================================================
        // 🔍 COMPARAISON CLÉS
        // =================================================

        console.log('');
        console.log(
            '🔍 Comparaison des clés...'
        );

        console.log({

            cleRecue:
                resetKeyClean,

            cleStockee:
                user.resetPasswordKey ||
                'Aucune'

        });


        if (
            !user.resetPasswordKey ||
            user.resetPasswordKey !== resetKeyClean
        ) {

            console.log(
                '❌ Clé incorrecte'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Clé de réinitialisation incorrecte'

            });

        }


        console.log(
            '✅ Clé correcte'
        );


        // =================================================
        // ⏱️ EXPIRATION
        // =================================================

        console.log('');
        console.log(
            '================================='
        );
        console.log(
            '⏱️ VÉRIFICATION EXPIRATION'
        );
        console.log(
            '================================='
        );


        if (
            user.resetPasswordExpire === null ||
            user.resetPasswordExpire === undefined ||
            user.resetPasswordExpire === ''
        ) {

            console.log(
                '❌ Aucune expiration enregistrée'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Aucune expiration associée à cette clé'

            });

        }


        const expiration =
            Number(
                user.resetPasswordExpire
            );


        if (
            !Number.isFinite(expiration)
        ) {

            console.log(
                '❌ Date d’expiration invalide'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Date d’expiration invalide'

            });

        }


        console.log(
            '⏱️ Expiration :',
            new Date(expiration)
        );

        console.log(
            '🕐 Maintenant :',
            new Date()
        );


        // =================================================
        // ❌ CLÉ EXPIRÉE
        // =================================================

        if (
            Date.now() >= expiration
        ) {

            console.log(
                '❌ Clé expirée'
            );


            user.resetPasswordKey =
                null;

            user.resetPasswordExpire =
                null;


            await user.save();


            return res.status(400).json({

                success: false,

                message:
                    'La clé de réinitialisation a expiré'

            });

        }


        // =================================================
        // ✅ CLÉ VALIDE
        // =================================================

        console.log('');
        console.log('=================================');
        console.log('✅ CLÉ RESET VALIDE');
        console.log(
            '👤 Utilisateur :',
            user._id
        );
        console.log(
            '📧 Email :',
            user.email
        );
        console.log(
            '⏱️ Expire le :',
            new Date(expiration)
        );
        console.log('=================================');


        return res.status(200).json({

            success: true,

            message:
                'Clé de réinitialisation valide'

        });


    } catch (error) {

        console.error('');
        console.error('=================================');
        console.error(
            '❌ ERREUR VÉRIFICATION CLÉ RESET'
        );
        console.error('=================================');

        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                'Erreur serveur'

        });

    }

};


// ======================================================
// 🔒 RÉINITIALISER LE MOT DE PASSE
// PATCH /api/users/reset-password
// ======================================================

exports.resetPassword = async (req, res) => {

    try {

        // =================================================
        // 📩 DONNÉES REÇUES
        // =================================================

        const {
            email,
            resetPasswordKey,
            newPassword
        } = req.body;


        console.log('');
        console.log('=================================');
        console.log(
            '🔒 RESET PASSWORD JARDISCAN'
        );
        console.log('=================================');
        console.log(
            '📧 Email reçu :',
            email
        );
        console.log(
            '🔐 Clé reçue :',
            resetPasswordKey
        );
        console.log(
            '🔑 Nouveau mot de passe reçu :',
            !!newPassword
        );


        // =================================================
        // ❌ VALIDATION EMAIL
        // =================================================

        if (
            typeof email !== 'string' ||
            !email.trim()
        ) {

            console.log(
                '❌ Email manquant'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Email obligatoire'

            });

        }


        // =================================================
        // ❌ VALIDATION CLÉ
        // =================================================

        if (
            typeof resetPasswordKey !== 'string' ||
            !resetPasswordKey.trim()
        ) {

            console.log(
                '❌ Clé manquante'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Clé de réinitialisation obligatoire'

            });

        }


        // =================================================
        // ❌ VALIDATION MOT DE PASSE
        // =================================================

        if (
            typeof newPassword !== 'string' ||
            !newPassword
        ) {

            console.log(
                '❌ Nouveau mot de passe manquant'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Nouveau mot de passe obligatoire'

            });

        }


        // =================================================
        // 🔐 LONGUEUR MOT DE PASSE
        // =================================================

        if (
            newPassword.length < 6
        ) {

            console.log(
                '❌ Mot de passe trop court'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Le mot de passe doit contenir au moins 6 caractères'

            });

        }


        // =================================================
        // 🧹 NETTOYAGE
        // =================================================

        const emailClean =
            email
                .trim()
                .toLowerCase();


        const resetKeyClean =
            resetPasswordKey
                .trim()
                .toUpperCase();


        console.log('');
        console.log(
            '🧹 Données nettoyées'
        );
        console.log(
            '📧 Email :',
            emailClean
        );
        console.log(
            '🔐 Clé :',
            resetKeyClean
        );


        // =================================================
        // 🔎 RECHERCHE UTILISATEUR
        // =================================================

        console.log('');
        console.log(
            '🔎 Recherche utilisateur...'
        );


        const user =
            await User.findOne({

                email: emailClean

            }).select('+motDePasse');


        // =================================================
        // ❌ UTILISATEUR INTROUVABLE
        // =================================================

        if (!user) {

            console.log(
                '❌ Utilisateur introuvable'
            );

            return res.status(404).json({

                success: false,

                message:
                    'Utilisateur introuvable'

            });

        }


        console.log(
            '✅ Utilisateur trouvé :',
            user._id
        );


        // =================================================
        // 🔍 VÉRIFICATION CLÉ
        // =================================================

        console.log('');
        console.log(
            '🔍 Vérification de la clé...'
        );


        if (
            !user.resetPasswordKey ||
            user.resetPasswordKey !== resetKeyClean
        ) {

            console.log(
                '❌ Clé incorrecte'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Clé de réinitialisation incorrecte'

            });

        }


        console.log(
            '✅ Clé correcte'
        );


        // =================================================
        // ⏱️ VÉRIFICATION EXPIRATION
        // =================================================

        console.log('');
        console.log(
            '⏱️ Vérification expiration...'
        );


        if (
            user.resetPasswordExpire === null ||
            user.resetPasswordExpire === undefined ||
            user.resetPasswordExpire === ''
        ) {

            console.log(
                '❌ Aucune expiration enregistrée'
            );

            return res.status(400).json({

                success: false,

                message:
                    'La clé de réinitialisation ne possède pas de date d’expiration'

            });

        }


        const expiration =
            Number(
                user.resetPasswordExpire
            );


        if (
            !Number.isFinite(expiration)
        ) {

            console.log(
                '❌ Expiration invalide'
            );

            return res.status(400).json({

                success: false,

                message:
                    'Date d’expiration invalide'

            });

        }


        console.log(
            '⏱️ Expiration :',
            new Date(expiration)
        );

        console.log(
            '🕐 Maintenant :',
            new Date()
        );


        // =================================================
        // ❌ CLÉ EXPIRÉE
        // =================================================

        if (
            Date.now() >= expiration
        ) {

            console.log(
                '❌ Clé expirée'
            );


            // =================================================
            // 🧹 SUPPRESSION CLÉ
            // =================================================

            user.resetPasswordKey =
                null;

            user.resetPasswordExpire =
                null;


            await user.save();


            return res.status(400).json({

                success: false,

                message:
                    'La clé de réinitialisation a expiré'

            });

        }


        // =================================================
        // 🔐 HASH NOUVEAU MOT DE PASSE
        // =================================================

        console.log('');
        console.log(
            '🔐 Hashage du nouveau mot de passe...'
        );


        // bcrypt est maintenant correctement importé
        const motDePasseHash =
            await bcrypt.hash(
                newPassword,
                10
            );


        console.log(
            '✅ Nouveau mot de passe hashé'
        );


        // =================================================
        // 💾 NOUVEAU MOT DE PASSE
        // =================================================

        user.motDePasse =
            motDePasseHash;


        // =================================================
        // 🧹 INVALIDATION CLÉ RESET
        // =================================================

        user.resetPasswordKey =
            null;

        user.resetPasswordExpire =
            null;


        // =================================================
        // 💾 SAUVEGARDE
        // =================================================

        console.log('');
        console.log(
            '💾 Sauvegarde du nouveau mot de passe...'
        );


        await user.save();


        // =================================================
        // ✅ SUCCÈS
        // =================================================

        console.log('');
        console.log('=================================');
        console.log(
            '✅ MOT DE PASSE MODIFIÉ'
        );
        console.log('=================================');
        console.log(
            '👤 Utilisateur :',
            user._id
        );
        console.log(
            '📧 Email :',
            user.email
        );
        console.log(
            '🔐 Ancienne clé invalidée'
        );
        console.log(
            '⏱️ Expiration supprimée'
        );
        console.log('=================================');


        return res.status(200).json({

            success: true,

            message:
                'Mot de passe réinitialisé avec succès'

        });


    } catch (error) {

        // =================================================
        // ❌ ERREUR
        // =================================================

        console.error('');
        console.error('=================================');
        console.error(
            '❌ ERREUR RESET PASSWORD'
        );
        console.error('=================================');

        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                'Erreur serveur lors de la réinitialisation du mot de passe'

        });

    }

};