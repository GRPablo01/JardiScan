import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

/* ============================================================
 * TYPES
 * ============================================================ */

interface DiagnosticOption {
  id: string;
  label: string;
  icon: string;
  description?: string;

  /**
   * Question suivante.
   * Si absent, le moteur cherche automatiquement
   * la prochaine question disponible.
   */
  next?: string;

  /**
   * Tags utilisés pour construire le diagnostic.
   */
  tags?: string[];

  /**
   * Permet de terminer immédiatement le parcours.
   */
  finish?: boolean;
}

interface DiagnosticQuestion {
  id: string;
  section: string;
  title: string;
  description?: string;
  icon: string;

  type:
    | 'choice'
    | 'multi'
    | 'text'
    | 'number'
    | 'boolean';

  options?: DiagnosticOption[];

  placeholder?: string;

  /**
   * Question facultative.
   */
  optional?: boolean;

  /**
   * Condition d'affichage.
   */
  condition?: () => boolean;
}

interface DiagnosticAnswer {
  questionId: string;
  value: string | string[] | number | boolean;
  label?: string;
}

interface DiagnosticResult {
  titre: string;
  description: string;
  niveau: 'faible' | 'moyen' | 'important' | 'urgent';
  confiance: number;
  causes: string[];
  conseils: string[];
  actions: string[];
  surveillance: string[];
}

/* ============================================================
 * COMPOSANT
 * ============================================================ */

@Component({
  selector: 'app-widget-dianostique',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './widget-dianostique.html',
  styleUrl: './widget-dianostique.css'
})
export class WidgetDianostique {

  /* ==========================================================
   * ÉTAT GÉNÉRAL
   * ========================================================== */

  diagnosticDemarre = false;
  diagnosticTermine = false;
  chargement = false;

  questionActuelle = 'symptome-principal';

  historiqueQuestions: string[] = [];

  reponses: Record<
    string,
    string | string[] | number | boolean
  > = {};

  descriptionLibre = '';

  confiance = 0;


  constructor(
    public themeService: ThemeService,
  ) {}

  /* ==========================================================
   * QUESTIONS
   * ========================================================== */

  questions: DiagnosticQuestion[] = [


    /* ========================================================
     * SYMPTÔME PRINCIPAL
     * ======================================================== */

    {
      id: 'symptome-principal',
      section: 'Symptômes',
      title: 'Qu’est-ce qui t’inquiète le plus sur ta plante ?',
      description:
        'Choisis le symptôme qui correspond le mieux à ce que tu observes.',
      icon: 'fa-solid fa-stethoscope',
      type: 'choice',
      options: [

        {
          id: 'jaunissement',
          label: 'Feuilles jaunes',
          icon: 'fa-solid fa-leaf',
          tags: ['jaunissement'],
          next: 'jaunissement-localisation'
        },

        {
          id: 'chute',
          label: 'Feuilles qui tombent',
          icon: 'fa-solid fa-wind',
          tags: ['chute'],
          next: 'chute-rapidite'
        },

        {
          id: 'fletrissement',
          label: 'Feuilles molles ou flétries',
          icon: 'fa-solid fa-leaf',
          tags: ['fletrissement'],
          next: 'fletrissement-terreau'
        },

        {
          id: 'taches-brunes',
          label: 'Taches brunes',
          icon: 'fa-solid fa-circle',
          tags: ['taches-brunes'],
          next: 'taches-localisation'
        },

        {
          id: 'taches-jaunes',
          label: 'Taches jaunes',
          icon: 'fa-solid fa-circle',
          tags: ['taches-jaunes'],
          next: 'taches-localisation'
        },

        {
          id: 'taches-blanches',
          label: 'Taches ou poudre blanche',
          icon: 'fa-solid fa-snowflake',
          tags: ['blanc'],
          next: 'blanc-aspect'
        },

        {
          id: 'insectes',
          label: 'Insectes visibles',
          icon: 'fa-solid fa-bug',
          tags: ['parasites'],
          next: 'parasites-apparence'
        },

        {
          id: 'toiles',
          label: 'Toiles ou petits fils',
          icon: 'fa-solid fa-spider',
          tags: ['acariens'],
          next: 'toiles-localisation'
        },

        {
          id: 'croissance',
          label: 'Croissance très lente',
          icon: 'fa-solid fa-arrow-trend-down',
          tags: ['croissance'],
          next: 'croissance-duree'
        },

        {
          id: 'tiges',
          label: 'Problème sur les tiges',
          icon: 'fa-solid fa-seedling',
          tags: ['tiges'],
          next: 'tiges-aspect'
        },

        {
          id: 'racines',
          label: 'Problème de racines',
          icon: 'fa-solid fa-tree',
          tags: ['racines'],
          next: 'racines-observation'
        },

        {
          id: 'terreau',
          label: 'Problème avec le terreau',
          icon: 'fa-solid fa-mountain',
          tags: ['terreau'],
          next: 'terreau-aspect'
        },

        {
          id: 'aucun',
          label: 'Elle semble simplement moins belle',
          icon: 'fa-solid fa-circle-question',
          tags: ['general'],
          next: 'evolution-generale'
        }

      ]
    },

    /* ========================================================
     * JAUNISSEMENT
     * ======================================================== */

    {
      id: 'jaunissement-localisation',
      section: 'Symptômes',
      title: 'Où apparaissent principalement les feuilles jaunes ?',
      icon: 'fa-solid fa-leaf',
      type: 'choice',
      options: [

        {
          id: 'anciennes',
          label: 'Sur les anciennes feuilles',
          icon: 'fa-solid fa-leaf',
          tags: ['jaunissement-ancien'],
          next: 'jaunissement-vitesse'
        },

        {
          id: 'nouvelles',
          label: 'Sur les nouvelles feuilles',
          icon: 'fa-solid fa-seedling',
          tags: ['jaunissement-nouveau'],
          next: 'jaunissement-vitesse'
        },

        {
          id: 'toutes',
          label: 'Un peu partout',
          icon: 'fa-solid fa-leaf',
          tags: ['jaunissement-global'],
          next: 'jaunissement-vitesse'
        }

      ]
    },

    {
      id: 'jaunissement-vitesse',
      section: 'Symptômes',
      title: 'Le jaunissement évolue-t-il rapidement ?',
      icon: 'fa-solid fa-gauge-high',
      type: 'choice',
      options: [

        {
          id: 'rapide',
          label: 'Oui, en quelques jours',
          icon: 'fa-solid fa-bolt',
          tags: ['evolution-rapide'],
          next: 'terreau-humidite'
        },

        {
          id: 'progressif',
          label: 'Progressivement',
          icon: 'fa-solid fa-chart-line',
          tags: ['evolution-progressive'],
          next: 'terreau-humidite'
        },

        {
          id: 'stable',
          label: 'Cela ne change presque pas',
          icon: 'fa-solid fa-minus',
          tags: ['stable'],
          next: 'terreau-humidite'
        }

      ]
    },

    /* ========================================================
     * CHUTE
     * ======================================================== */

    {
      id: 'chute-rapidite',
      section: 'Symptômes',
      title: 'La chute des feuilles est-elle importante ?',
      icon: 'fa-solid fa-wind',
      type: 'choice',
      options: [

        {
          id: 'beaucoup',
          label: 'Beaucoup de feuilles tombent',
          icon: 'fa-solid fa-arrow-down',
          tags: ['chute-importante'],
          next: 'terreau-humidite'
        },

        {
          id: 'quelques',
          label: 'Seulement quelques feuilles',
          icon: 'fa-solid fa-leaf',
          tags: ['chute-legere'],
          next: 'terreau-humidite'
        },

        {
          id: 'seches',
          label: 'Elles tombent lorsqu’elles sont sèches',
          icon: 'fa-solid fa-sun',
          tags: ['chute-seche'],
          next: 'terreau-humidite'
        }

      ]
    },

    /* ========================================================
     * FLÉTRISSEMENT
     * ======================================================== */

    {
      id: 'fletrissement-terreau',
      section: 'Symptômes',
      title: 'Comment est le terreau actuellement ?',
      icon: 'fa-solid fa-droplet',
      type: 'choice',
      options: [

        {
          id: 'tres-sec',
          label: 'Très sec',
          icon: 'fa-solid fa-sun',
          tags: ['terreau-tres-sec'],
          next: 'arrosage-frequence'
        },

        {
          id: 'humide',
          label: 'Humide',
          icon: 'fa-solid fa-droplet',
          tags: ['terreau-humide'],
          next: 'arrosage-frequence'
        },

        {
          id: 'trempe',
          label: 'Très humide / détrempé',
          icon: 'fa-solid fa-water',
          tags: ['terreau-trempe'],
          next: 'drainage'
        },

        {
          id: 'normal',
          label: 'Normal',
          icon: 'fa-solid fa-check',
          tags: ['terreau-normal'],
          next: 'arrosage-frequence'
        }

      ]
    },

    /* ========================================================
     * TACHES
     * ======================================================== */

    {
      id: 'taches-localisation',
      section: 'Symptômes',
      title: 'Où se trouvent principalement les taches ?',
      icon: 'fa-solid fa-location-dot',
      type: 'choice',
      options: [

        {
          id: 'bord',
          label: 'Sur les bords des feuilles',
          icon: 'fa-solid fa-border-all',
          tags: ['taches-bord'],
          next: 'taches-evolution'
        },

        {
          id: 'centre',
          label: 'Au centre',
          icon: 'fa-solid fa-circle',
          tags: ['taches-centre'],
          next: 'taches-evolution'
        },

        {
          id: 'partout',
          label: 'Un peu partout',
          icon: 'fa-solid fa-expand',
          tags: ['taches-partout'],
          next: 'taches-evolution'
        }

      ]
    },

    {
      id: 'taches-evolution',
      section: 'Symptômes',
      title: 'Les taches s’agrandissent-elles ?',
      icon: 'fa-solid fa-chart-line',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-arrow-trend-up',
          tags: ['taches-progressives'],
          next: 'terreau-humidite'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-minus',
          tags: ['taches-stables'],
          next: 'luminosite'
        },

        {
          id: 'ne-sais-pas',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'luminosite'
        }

      ]
    },

    /* ========================================================
     * BLANC
     * ======================================================== */

    {
      id: 'blanc-aspect',
      section: 'Parasites / maladies',
      title: 'À quoi ressemblent les marques blanches ?',
      icon: 'fa-solid fa-magnifying-glass',
      type: 'choice',
      options: [

        {
          id: 'poudre',
          label: 'Une sorte de poudre',
          icon: 'fa-solid fa-cloud',
          tags: ['oïdium-possible'],
          next: 'blanc-se-nettoie'
        },

        {
          id: 'cotonneux',
          label: 'Des petits amas cotonneux',
          icon: 'fa-solid fa-cloud',
          tags: ['cochenille-possible'],
          next: 'blanc-se-nettoie'
        },

        {
          id: 'points',
          label: 'De petits points',
          icon: 'fa-solid fa-circle-dot',
          tags: ['parasites-points'],
          next: 'blanc-se-nettoie'
        },

        {
          id: 'depots',
          label: 'Comme un dépôt',
          icon: 'fa-solid fa-layer-group',
          tags: ['depot'],
          next: 'luminosite'
        }

      ]
    },

    {
      id: 'blanc-se-nettoie',
      section: 'Parasites / maladies',
      title: 'Les marques partent-elles lorsque tu les essuies doucement ?',
      icon: 'fa-solid fa-hand',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-check',
          tags: ['depot'],
          next: 'luminosite'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-xmark',
          tags: ['parasite-ou-maladie'],
          next: 'parasites-localisation'
        }

      ]
    },

    /* ========================================================
     * PARASITES
     * ======================================================== */

    {
      id: 'parasites-apparence',
      section: 'Parasites',
      title: 'À quoi ressemblent les insectes ?',
      icon: 'fa-solid fa-bug',
      type: 'choice',
      options: [

        {
          id: 'petits-noirs',
          label: 'Petits insectes noirs',
          icon: 'fa-solid fa-bug',
          tags: ['pucerons-possibles'],
          next: 'parasites-localisation'
        },

        {
          id: 'blancs',
          label: 'Petits insectes blancs',
          icon: 'fa-solid fa-bug',
          tags: ['aleurodes-possibles'],
          next: 'parasites-localisation'
        },

        {
          id: 'bruns',
          label: 'Bruns / marron',
          icon: 'fa-solid fa-bug',
          tags: ['cochenilles-possibles'],
          next: 'parasites-localisation'
        },

        {
          id: 'petits-volants',
          label: 'De petits insectes volants',
          icon: 'fa-solid fa-wind',
          tags: ['moucherons-possibles'],
          next: 'parasites-localisation'
        },

        {
          id: 'autre',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'parasites-localisation'
        }

      ]
    },

    {
      id: 'parasites-localisation',
      section: 'Parasites',
      title: 'Où les observes-tu principalement ?',
      icon: 'fa-solid fa-magnifying-glass',
      type: 'choice',
      options: [

        {
          id: 'dessus',
          label: 'Sur le dessus des feuilles',
          icon: 'fa-solid fa-leaf',
          tags: ['parasites-feuilles'],
          next: 'plante-isolation'
        },

        {
          id: 'dessous',
          label: 'Sous les feuilles',
          icon: 'fa-solid fa-leaf',
          tags: ['parasites-revers'],
          next: 'plante-isolation'
        },

        {
          id: 'tiges',
          label: 'Sur les tiges',
          icon: 'fa-solid fa-seedling',
          tags: ['parasites-tiges'],
          next: 'plante-isolation'
        },

        {
          id: 'terreau',
          label: 'Dans le terreau',
          icon: 'fa-solid fa-mountain',
          tags: ['parasites-sol'],
          next: 'plante-isolation'
        }

      ]
    },

    {
      id: 'plante-isolation',
      section: 'Parasites',
      title: 'As-tu d’autres plantes à proximité ?',
      icon: 'fa-solid fa-leaf',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-check',
          tags: ['autres-plantes'],
          next: 'terreau-humidite'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-xmark',
          next: 'terreau-humidite'
        }

      ]
    },

    /* ========================================================
     * TOILES
     * ======================================================== */

    {
      id: 'toiles-localisation',
      section: 'Parasites',
      title: 'Où vois-tu principalement les toiles ?',
      icon: 'fa-solid fa-spider',
      type: 'choice',
      options: [

        {
          id: 'feuilles',
          label: 'Sur les feuilles',
          icon: 'fa-solid fa-leaf',
          tags: ['acariens-feuilles'],
          next: 'luminosite'
        },

        {
          id: 'entre-feuilles',
          label: 'Entre les feuilles et les tiges',
          icon: 'fa-solid fa-spider',
          tags: ['acariens'],
          next: 'luminosite'
        },

        {
          id: 'sol',
          label: 'Près du terreau',
          icon: 'fa-solid fa-mountain',
          tags: ['araignees-sol'],
          next: 'terreau-humidite'
        }

      ]
    },

    /* ========================================================
     * CROISSANCE
     * ======================================================== */

    {
      id: 'croissance-duree',
      section: 'Croissance',
      title: 'Depuis combien de temps la croissance semble-t-elle ralentie ?',
      icon: 'fa-solid fa-chart-line',
      type: 'choice',
      options: [

        {
          id: 'quelques-jours',
          label: 'Quelques jours',
          icon: 'fa-solid fa-calendar-day',
          tags: ['croissance-recente'],
          next: 'luminosite'
        },

        {
          id: 'plusieurs-semaines',
          label: 'Plusieurs semaines',
          icon: 'fa-solid fa-calendar-week',
          tags: ['croissance-longue'],
          next: 'luminosite'
        },

        {
          id: 'plusieurs-mois',
          label: 'Plusieurs mois',
          icon: 'fa-solid fa-calendar-days',
          tags: ['croissance-tres-longue'],
          next: 'rempotage'
        }

      ]
    },

    /* ========================================================
     * TIGES
     * ======================================================== */

    {
      id: 'tiges-aspect',
      section: 'Structure',
      title: 'Que remarques-tu sur les tiges ?',
      icon: 'fa-solid fa-seedling',
      type: 'choice',
      options: [

        {
          id: 'molles',
          label: 'Elles sont molles',
          icon: 'fa-solid fa-arrow-down',
          tags: ['tiges-molles'],
          next: 'terreau-humidite'
        },

        {
          id: 'brunes',
          label: 'Elles brunissent',
          icon: 'fa-solid fa-circle',
          tags: ['tiges-brunes'],
          next: 'terreau-humidite'
        },

        {
          id: 'allongees',
          label: 'Elles sont très longues et fines',
          icon: 'fa-solid fa-up-long',
          tags: ['etiolation'],
          next: 'luminosite'
        },

        {
          id: 'rien',
          label: 'Je ne remarque rien de particulier',
          icon: 'fa-solid fa-check',
          next: 'luminosite'
        }

      ]
    },

    /* ========================================================
     * RACINES
     * ======================================================== */

    {
      id: 'racines-observation',
      section: 'Racines',
      title: 'As-tu pu observer les racines ?',
      icon: 'fa-solid fa-tree',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-eye',
          next: 'racines-aspect'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-xmark',
          next: 'terreau-humidite'
        }

      ]
    },

    {
      id: 'racines-aspect',
      section: 'Racines',
      title: 'Comment semblent être les racines ?',
      icon: 'fa-solid fa-tree',
      type: 'choice',
      options: [

        {
          id: 'blanches',
          label: 'Claires / blanches',
          icon: 'fa-solid fa-check',
          tags: ['racines-saines'],
          next: 'terreau-humidite'
        },

        {
          id: 'brunes',
          label: 'Brunes',
          icon: 'fa-solid fa-circle',
          tags: ['racines-brunes'],
          next: 'terreau-humidite'
        },

        {
          id: 'molles',
          label: 'Molles / pâteuses',
          icon: 'fa-solid fa-water',
          tags: ['pourriture-racines'],
          next: 'drainage'
        },

        {
          id: 'odeur',
          label: 'Elles sentent mauvais',
          icon: 'fa-solid fa-triangle-exclamation',
          tags: ['pourriture-racines'],
          next: 'drainage'
        }

      ]
    },

    /* ========================================================
     * TERREAU
     * ======================================================== */

    {
      id: 'terreau-aspect',
      section: 'Terreau',
      title: 'Comment décrirais-tu ton terreau ?',
      icon: 'fa-solid fa-mountain',
      type: 'choice',
      options: [

        {
          id: 'sec',
          label: 'Très sec',
          icon: 'fa-solid fa-sun',
          tags: ['terreau-sec'],
          next: 'arrosage-frequence'
        },

        {
          id: 'humide',
          label: 'Humide',
          icon: 'fa-solid fa-droplet',
          tags: ['terreau-humide'],
          next: 'drainage'
        },

        {
          id: 'compact',
          label: 'Très compact',
          icon: 'fa-solid fa-cubes',
          tags: ['terreau-compact'],
          next: 'rempotage'
        },

        {
          id: 'mouche',
          label: 'Il y a de petits insectes',
          icon: 'fa-solid fa-bug',
          tags: ['moucherons'],
          next: 'arrosage-frequence'
        }

      ]
    },

    /* ========================================================
     * HUMIDITÉ
     * ======================================================== */

    {
      id: 'terreau-humidite',
      section: 'Arrosage',
      title: 'Quel est l’état du terreau actuellement ?',
      icon: 'fa-solid fa-droplet',
      type: 'choice',
      options: [

        {
          id: 'sec',
          label: 'Sec',
          icon: 'fa-solid fa-sun',
          tags: ['sec'],
          next: 'arrosage-frequence'
        },

        {
          id: 'legerement-humide',
          label: 'Légèrement humide',
          icon: 'fa-solid fa-droplet',
          tags: ['humidite-correcte'],
          next: 'arrosage-frequence'
        },

        {
          id: 'tres-humide',
          label: 'Très humide',
          icon: 'fa-solid fa-water',
          tags: ['exces-eau'],
          next: 'drainage'
        },

        {
          id: 'je-ne-sais-pas',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'arrosage-frequence'
        }

      ]
    },

    /* ========================================================
     * ARROSAGE
     * ======================================================== */

    {
      id: 'arrosage-frequence',
      section: 'Arrosage',
      title: 'À quelle fréquence arroses-tu ta plante ?',
      icon: 'fa-solid fa-droplet',
      type: 'choice',
      options: [

        {
          id: 'quotidien',
          label: 'Tous les jours',
          icon: 'fa-solid fa-droplet',
          tags: ['arrosage-frequent'],
          next: 'drainage'
        },

        {
          id: 'plusieurs',
          label: 'Plusieurs fois par semaine',
          icon: 'fa-solid fa-droplet',
          tags: ['arrosage-frequent'],
          next: 'drainage'
        },

        {
          id: 'hebdo',
          label: 'Environ une fois par semaine',
          icon: 'fa-solid fa-calendar-week',
          tags: ['arrosage-hebdo'],
          next: 'drainage'
        },

        {
          id: 'rarement',
          label: 'Rarement',
          icon: 'fa-solid fa-clock',
          tags: ['arrosage-rare'],
          next: 'drainage'
        },

        {
          id: 'variable',
          label: 'Cela dépend',
          icon: 'fa-solid fa-shuffle',
          tags: ['arrosage-variable'],
          next: 'drainage'
        }

      ]
    },

    /* ========================================================
     * DRAINAGE
     * ======================================================== */

    {
      id: 'drainage',
      section: 'Pot',
      title: 'Ton pot possède-t-il des trous de drainage ?',
      icon: 'fa-solid fa-box',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-check',
          tags: ['drainage-ok'],
          next: 'luminosite'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-xmark',
          tags: ['drainage-mauvais'],
          next: 'luminosite'
        },

        {
          id: 'je-ne-sais-pas',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'luminosite'
        }

      ]
    },

    /* ========================================================
     * LUMINOSITÉ
     * ======================================================== */

    {
      id: 'luminosite',
      section: 'Environnement',
      title: 'Quelle lumière reçoit ta plante ?',
      icon: 'fa-solid fa-sun',
      type: 'choice',
      options: [

        {
          id: 'soleil-direct',
          label: 'Soleil direct',
          icon: 'fa-solid fa-sun',
          tags: ['soleil-direct'],
          next: 'temperature'
        },

        {
          id: 'indirecte',
          label: 'Lumière indirecte',
          icon: 'fa-solid fa-cloud-sun',
          tags: ['lumiere-indirecte'],
          next: 'temperature'
        },

        {
          id: 'faible',
          label: 'Peu de lumière',
          icon: 'fa-solid fa-cloud',
          tags: ['manque-lumiere'],
          next: 'temperature'
        },

        {
          id: 'exterieur',
          label: 'À l’extérieur',
          icon: 'fa-solid fa-tree',
          tags: ['exterieur'],
          next: 'temperature'
        }

      ]
    },

    /* ========================================================
     * TEMPÉRATURE
     * ======================================================== */

    {
      id: 'temperature',
      section: 'Environnement',
      title: 'La température a-t-elle changé récemment ?',
      icon: 'fa-solid fa-temperature-half',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui, changement important',
          icon: 'fa-solid fa-temperature-arrow-down',
          tags: ['changement-temperature'],
          next: 'emplacement'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-check',
          next: 'emplacement'
        },

        {
          id: 'je-ne-sais-pas',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'emplacement'
        }

      ]
    },

    /* ========================================================
     * EMPLACEMENT
     * ======================================================== */

    {
      id: 'emplacement',
      section: 'Environnement',
      title: 'Où se trouve ta plante ?',
      icon: 'fa-solid fa-location-dot',
      type: 'choice',
      options: [

        {
          id: 'fenetre',
          label: 'Près d’une fenêtre',
          icon: 'fa-solid fa-window-maximize',
          next: 'rempotage'
        },

        {
          id: 'salon',
          label: 'Dans une pièce de vie',
          icon: 'fa-solid fa-house',
          next: 'rempotage'
        },

        {
          id: 'salle-bain',
          label: 'Dans une pièce humide',
          icon: 'fa-solid fa-droplet',
          tags: ['humidite-ambiante'],
          next: 'rempotage'
        },

        {
          id: 'exterieur',
          label: 'Balcon / terrasse / jardin',
          icon: 'fa-solid fa-tree',
          next: 'rempotage'
        }

      ]
    },

    /* ========================================================
     * REMPOTAGE
     * ======================================================== */

    {
      id: 'rempotage',
      section: 'Entretien',
      title: 'Quand as-tu rempoté ta plante pour la dernière fois ?',
      icon: 'fa-solid fa-box-open',
      type: 'choice',
      options: [

        {
          id: 'recent',
          label: 'Il y a moins de 3 mois',
          icon: 'fa-solid fa-calendar-check',
          next: 'age-plante'
        },

        {
          id: 'moins-un-an',
          label: 'Il y a moins d’un an',
          icon: 'fa-solid fa-calendar',
          next: 'age-plante'
        },

        {
          id: 'plus-un-an',
          label: 'Il y a plus d’un an',
          icon: 'fa-solid fa-calendar-days',
          tags: ['rempotage-possible'],
          next: 'age-plante'
        },

        {
          id: 'jamais',
          label: 'Jamais',
          icon: 'fa-solid fa-question',
          tags: ['rempotage-possible'],
          next: 'age-plante'
        }

      ]
    },

    /* ========================================================
     * ÂGE
     * ======================================================== */

    {
      id: 'age-plante',
      section: 'Plante',
      title: 'Depuis combien de temps as-tu cette plante ?',
      icon: 'fa-solid fa-seedling',
      type: 'choice',
      options: [

        {
          id: 'moins-mois',
          label: 'Moins d’un mois',
          icon: 'fa-solid fa-calendar-day',
          tags: ['plante-nouvelle'],
          next: 'changement-recent'
        },

        {
          id: 'quelques-mois',
          label: 'Quelques mois',
          icon: 'fa-solid fa-calendar',
          next: 'changement-recent'
        },

        {
          id: 'plus-longtemps',
          label: 'Plus d’un an',
          icon: 'fa-solid fa-calendar-days',
          next: 'changement-recent'
        }

      ]
    },

    /* ========================================================
     * CHANGEMENT RÉCENT
     * ======================================================== */

    {
      id: 'changement-recent',
      section: 'Historique',
      title: 'Quelque chose a-t-il changé récemment ?',
      description:
        'Un déplacement, un rempotage, un changement d’arrosage ou de température peut être important.',
      icon: 'fa-solid fa-clock-rotate-left',
      type: 'choice',
      options: [

        {
          id: 'oui',
          label: 'Oui',
          icon: 'fa-solid fa-check',
          tags: ['changement-recent'],
          next: 'description'
        },

        {
          id: 'non',
          label: 'Non',
          icon: 'fa-solid fa-xmark',
          next: 'description'
        },

        {
          id: 'je-ne-sais-pas',
          label: 'Je ne sais pas',
          icon: 'fa-solid fa-question',
          next: 'description'
        }

      ]
    },

    /* ========================================================
     * DESCRIPTION
     * ======================================================== */

    {
      id: 'description',
      section: 'Observation',
      title: 'Veux-tu ajouter une précision ?',
      description:
        'Décris tout ce qui te semble important. Tu peux mentionner la taille, les feuilles, les tiges, les odeurs ou l’évolution.',
      icon: 'fa-solid fa-pen',
      type: 'text',
      optional: true,
      placeholder:
        'Exemple : les feuilles du bas jaunissent depuis environ une semaine...'
    }

  ];

  /* ==========================================================
   * RÉSULTAT
   * ========================================================== */

  resultat: DiagnosticResult = this.creerResultatVide();

  /* ==========================================================
   * GETTERS
   * ========================================================== */

  get question(): DiagnosticQuestion | undefined {
    return this.questions.find(
      item => item.id === this.questionActuelle
    );
  }

  get sectionActuelle(): string {
    return this.question?.section ?? 'Diagnostic';
  }

  get numeroQuestion(): number {
    return this.historiqueQuestions.length + 1;
  }

  get progression(): number {
    if (this.diagnosticTermine) {
      return 100;
    }

    const total = this.questions.length;
    const parcourues = this.historiqueQuestions.length;

    if (total <= 1) {
      return 5;
    }

    const value = Math.round(
      ((parcourues + 1) / total) * 100
    );

    return Math.min(
      95,
      Math.max(5, value)
    );
  }

  /* ==========================================================
   * INITIALISATION DU RÉSULTAT
   * ========================================================== */

  private creerResultatVide(): DiagnosticResult {
    return {
      titre: '',
      description: '',
      niveau: 'faible',
      confiance: 0,
      causes: [],
      conseils: [],
      actions: [],
      surveillance: []
    };
  }

  /* ==========================================================
   * DÉMARRER
   * ========================================================== */

  demarrerDiagnostic(): void {
    this.diagnosticDemarre = true;
    this.diagnosticTermine = false;
    this.chargement = false;

    this.questionActuelle = 'symptome-principal';

    this.historiqueQuestions = [];
    this.reponses = {};

    this.descriptionLibre = '';

    this.confiance = 0;

    this.resultat = this.creerResultatVide();
  }

  /* ==========================================================
   * SÉLECTION CHOIX
   * ========================================================== */

  selectionnerOption(
    question: DiagnosticQuestion,
    option: DiagnosticOption
  ): void {

    if (question.type !== 'choice') {
      return;
    }

    this.reponses[question.id] = option.id;

    /*
     * Une réponse existante peut avoir créé un ancien chemin.
     * On supprime les réponses qui se trouvent après le nouveau
     * point de navigation afin d'éviter un diagnostic incohérent.
     */
    this.nettoyerReponsesApres(question.id);

    if (option.finish) {
      this.terminerDiagnostic();
      return;
    }

    this.allerQuestionSuivante(
      question,
      option.next
    );
  }

  /* ==========================================================
   * MULTI
   * ========================================================== */

  toggleMultiOption(
    questionId: string,
    optionId: string
  ): void {

    const current = Array.isArray(
      this.reponses[questionId]
    )
      ? [
          ...(this.reponses[questionId] as string[])
        ]
      : [];

    const index = current.indexOf(optionId);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(optionId);
    }

    this.reponses[questionId] = current;
  }

  /* ==========================================================
   * TEXTE
   * ========================================================== */

  continuerTexte(): void {
    const question = this.question;

    if (!question) {
      return;
    }

    this.reponses[question.id] =
      this.descriptionLibre.trim();

    this.allerQuestionSuivante(question);
  }

  /* ==========================================================
   * CONTINUER
   * ========================================================== */

  continuer(): void {
    const question = this.question;

    if (!question) {
      return;
    }

    if (
      question.type === 'text'
    ) {
      this.continuerTexte();
      return;
    }

    if (!this.questionValide(question)) {
      return;
    }

    this.allerQuestionSuivante(question);
  }

  /* ==========================================================
   * VALIDATION
   * ========================================================== */

  questionValide(
    question: DiagnosticQuestion
  ): boolean {

    if (question.optional) {
      return true;
    }

    const valeur =
      this.reponses[question.id];

    if (
      valeur === undefined ||
      valeur === null
    ) {
      return false;
    }

    if (
      typeof valeur === 'string' &&
      valeur.trim() === ''
    ) {
      return false;
    }

    if (
      Array.isArray(valeur) &&
      valeur.length === 0
    ) {
      return false;
    }

    return true;
  }

  /* ==========================================================
   * NAVIGATION DYNAMIQUE
   * ========================================================== */

  private allerQuestionSuivante(
    question: DiagnosticQuestion,
    nextId?: string
  ): void {

    if (
      question.type !== 'text' &&
      !this.questionValide(question)
    ) {
      return;
    }

    if (
      !this.historiqueQuestions.includes(
        question.id
      )
    ) {
      this.historiqueQuestions.push(
        question.id
      );
    }

    const prochaineQuestion =
      nextId ??
      this.trouverProchaineQuestion();

    if (!prochaineQuestion) {
      this.terminerDiagnostic();
      return;
    }

    const cible =
      this.questions.find(
        item => item.id === prochaineQuestion
      );

    if (!cible) {
      this.terminerDiagnostic();
      return;
    }

    if (
      cible.condition &&
      !cible.condition()
    ) {
      const suivante =
        this.trouverQuestionApres(
          cible.id
        );

      if (!suivante) {
        this.terminerDiagnostic();
        return;
      }

      this.questionActuelle = suivante;
      this.restaurerValeurQuestion(suivante);

      return;
    }

    this.questionActuelle = cible.id;

    this.restaurerValeurQuestion(
      cible.id
    );
  }

  /* ==========================================================
   * TROUVER QUESTION SUIVANTE
   * ========================================================== */

  private trouverProchaineQuestion(): string | null {

    const index =
      this.questions.findIndex(
        question =>
          question.id ===
          this.questionActuelle
      );

    if (index < 0) {
      return null;
    }

    for (
      let i = index + 1;
      i < this.questions.length;
      i++
    ) {

      const question =
        this.questions[i];

      if (
        question.condition &&
        !question.condition()
      ) {
        continue;
      }

      if (
        this.historiqueQuestions.includes(
          question.id
        )
      ) {
        continue;
      }

      return question.id;
    }

    return null;
  }

  /* ==========================================================
   * TROUVER QUESTION APRÈS
   * ========================================================== */

  private trouverQuestionApres(
    questionId: string
  ): string | null {

    const index =
      this.questions.findIndex(
        question =>
          question.id === questionId
      );

    if (index < 0) {
      return null;
    }

    for (
      let i = index + 1;
      i < this.questions.length;
      i++
    ) {

      const question =
        this.questions[i];

      if (
        question.condition &&
        !question.condition()
      ) {
        continue;
      }

      if (
        this.historiqueQuestions.includes(
          question.id
        )
      ) {
        continue;
      }

      return question.id;
    }

    return null;
  }

  /* ==========================================================
   * RESTAURATION
   * ========================================================== */

  private restaurerValeurQuestion(
    questionId: string
  ): void {

    const valeur =
      this.reponses[questionId];

    if (
      typeof valeur === 'string'
    ) {
      this.descriptionLibre =
        valeur;
    } else {
      this.descriptionLibre = '';
    }
  }

  /* ==========================================================
   * NETTOYAGE DES RÉPONSES FUTURES
   * ========================================================== */

  private nettoyerReponsesApres(
    questionId: string
  ): void {

    const index =
      this.questions.findIndex(
        item =>
          item.id === questionId
      );

    if (index < 0) {
      return;
    }

    const idsASupprimer =
      this.questions
        .slice(index + 1)
        .map(item => item.id);

    for (
      const id of idsASupprimer
    ) {
      delete this.reponses[id];
    }

    this.historiqueQuestions =
      this.historiqueQuestions.filter(
        id =>
          id === questionId ||
          !idsASupprimer.includes(id)
      );
  }

  /* ==========================================================
   * RETOUR
   * ========================================================== */

  precedent(): void {

    if (
      this.historiqueQuestions.length === 0
    ) {
      return;
    }

    const actuelle =
      this.questionActuelle;

    const derniere =
      this.historiqueQuestions[
        this.historiqueQuestions.length - 1
      ];

    /*
     * Si la dernière question historique
     * correspond à la question actuelle, on retire
     * une étape supplémentaire.
     */
    if (derniere === actuelle) {
      this.historiqueQuestions.pop();
    }

    const precedente =
      this.historiqueQuestions.pop();

    if (!precedente) {
      this.questionActuelle =
        'symptome-principal';

      this.restaurerValeurQuestion(
        this.questionActuelle
      );

      return;
    }

    this.questionActuelle =
      precedente;

    this.restaurerValeurQuestion(
      precedente
    );
  }

  /* ==========================================================
   * TERMINER
   * ========================================================== */

  terminerDiagnostic(): void {

    if (this.chargement) {
      return;
    }

    this.chargement = true;

    setTimeout(() => {

      this.resultat =
        this.calculerDiagnostic();

      this.confiance =
        this.resultat.confiance;

      this.chargement = false;

      this.diagnosticDemarre = true;
      this.diagnosticTermine = true;

    }, 800);
  }

  /* ==========================================================
   * CALCUL DU DIAGNOSTIC
   * ========================================================== */

  calculerDiagnostic(): DiagnosticResult {

    const tags = this.getTags();

    const causes: string[] = [];
    const conseils: string[] = [];
    const actions: string[] = [];
    const surveillance: string[] = [];

    let score = 0;

    /* ========================================================
     * EXCÈS D'EAU
     * ======================================================== */

    if (
      tags.includes('exces-eau') ||
      tags.includes('arrosage-frequent') ||
      tags.includes('terreau-trempe')
    ) {

      score += 3;

      causes.push(
        'Excès d’humidité au niveau du substrat'
      );

      conseils.push(
        'Vérifie l’humidité du terreau avant chaque arrosage.'
      );

      conseils.push(
        'Laisse sécher légèrement le substrat lorsque la plante le permet.'
      );

      actions.push(
        'Vérifier les trous de drainage du pot.'
      );

      surveillance.push(
        'Surveille l’apparition de feuilles jaunes ou molles.'
      );
    }

    /* ========================================================
     * MANQUE D'EAU
     * ======================================================== */

    if (
      tags.includes('terreau-tres-sec') ||
      tags.includes('terreau-sec') ||
      tags.includes('sec') ||
      tags.includes('arrosage-rare') ||
      tags.includes('fletrissement')
    ) {

      score += 2;

      causes.push(
        'Manque d’eau possible'
      );

      conseils.push(
        'Vérifie l’humidité du terreau sur plusieurs centimètres.'
      );

      conseils.push(
        'Si le substrat est réellement sec, reprends progressivement un arrosage adapté.'
      );

      surveillance.push(
        'Observe si les feuilles retrouvent leur tenue après l’arrosage.'
      );
    }

    /* ========================================================
     * MANQUE DE LUMIÈRE
     * ======================================================== */

    if (
      tags.includes('manque-lumiere') ||
      tags.includes('etiolation')
    ) {

      score += 2;

      causes.push(
        'Lumière insuffisante possible'
      );

      conseils.push(
        'Installe progressivement la plante dans un emplacement plus lumineux.'
      );

      conseils.push(
        'Évite un passage brutal d’un endroit sombre à un soleil intense.'
      );

      surveillance.push(
        'Observe la nouvelle croissance et l’orientation des tiges.'
      );
    }

    /* ========================================================
     * PARASITES
     * ======================================================== */

    if (
      tags.includes('parasites') ||
      tags.includes('acariens') ||
      tags.includes('pucerons-possibles') ||
      tags.includes('cochenilles-possibles') ||
      tags.includes('aleurodes-possibles') ||
      tags.includes('parasite-ou-maladie')
    ) {

      score += 4;

      causes.push(
        'Présence possible de parasites'
      );

      conseils.push(
        'Inspecte soigneusement le dessus et le dessous des feuilles.'
      );

      conseils.push(
        'Si plusieurs plantes sont proches, vérifie également les autres.'
      );

      actions.push(
        'Isole temporairement la plante si une infestation est confirmée.'
      );

      surveillance.push(
        'Observe l’évolution du nombre d’insectes au cours des prochains jours.'
      );
    }

    /* ========================================================
     * RACINES
     * ======================================================== */

    if (
      tags.includes('pourriture-racines') ||
      tags.includes('racines-brunes')
    ) {

      score += 5;

      causes.push(
        'Problème racinaire possible'
      );

      conseils.push(
        'Évite de maintenir le substrat constamment détrempé.'
      );

      conseils.push(
        'Si les racines sont molles ou très abîmées, une inspection plus approfondie peut être nécessaire.'
      );

      actions.push(
        'Contrôler l’état des racines et du drainage.'
      );

      surveillance.push(
        'Surveille le flétrissement, le jaunissement et les mauvaises odeurs.'
      );
    }

    /* ========================================================
     * REMPOTAGE
     * ======================================================== */

    if (
      tags.includes('rempotage-possible') ||
      tags.includes('terreau-compact')
    ) {

      score += 1;

      causes.push(
        'Substrat ou pot potentiellement à revoir'
      );

      conseils.push(
        'Vérifie si les racines sont très serrées dans le pot.'
      );

      conseils.push(
        'Un rempotage n’est pas systématiquement nécessaire : vérifie d’abord l’état général de la plante.'
      );
    }

    /* ========================================================
     * TACHES
     * ======================================================== */

    if (
      tags.includes('taches-brunes') ||
      tags.includes('taches-jaunes') ||
      tags.includes('taches-progressives')
    ) {

      score += 2;

      causes.push(
        'Problème foliaire à surveiller'
      );

      conseils.push(
        'Évite de mouiller régulièrement les feuilles.'
      );

      conseils.push(
        'Retire uniquement les parties fortement abîmées avec un outil propre si nécessaire.'
      );

      surveillance.push(
        'Surveille si les taches s’étendent vers de nouvelles feuilles.'
      );
    }

    /* ========================================================
     * JAUNISSEMENT
     * ======================================================== */

    if (
      tags.includes('jaunissement') ||
      tags.includes('jaunissement-global')
    ) {

      score += 1;

      causes.push(
        'Jaunissement des feuilles à surveiller'
      );

      conseils.push(
        'Observe si les nouvelles feuilles sont également touchées.'
      );

      conseils.push(
        'Contrôle l’arrosage, la lumière et l’état du substrat.'
      );
    }

    /* ========================================================
     * CHUTE
     * ======================================================== */

    if (
      tags.includes('chute-importante') ||
      tags.includes('chute')
    ) {

      score += 1;

      causes.push(
        'Stress de la plante possible'
      );

      conseils.push(
        'Évite les changements brusques d’emplacement.'
      );

      conseils.push(
        'Vérifie simultanément l’humidité, la lumière et la température.'
      );
    }

    /* ========================================================
     * CHANGEMENT RÉCENT
     * ======================================================== */

    if (
      tags.includes('changement-recent')
    ) {

      causes.push(
        'Réaction possible à un changement récent'
      );

      conseils.push(
        'Évite de multiplier les changements en même temps.'
      );

      surveillance.push(
        'Observe la plante pendant quelques jours dans des conditions stables.'
      );
    }

    /* ========================================================
     * AUCUNE CAUSE FORTE
     * ======================================================== */

    if (causes.length === 0) {

      causes.push(
        'Cause indéterminée avec les informations disponibles'
      );

      conseils.push(
        'Observe les feuilles, les tiges, le terreau et les racines accessibles.'
      );

      conseils.push(
        'Évite d’ajouter plusieurs traitements simultanément.'
      );

      surveillance.push(
        'Note l’évolution des symptômes au fil des jours.'
      );
    }

    /* ========================================================
     * CONFIANCE
     * ======================================================== */

    const nombreReponses =
      Object.keys(this.reponses).length;

    let confiance =
      35 +
      nombreReponses * 3 +
      score * 4;

    confiance = Math.min(
      94,
      Math.max(
        35,
        confiance
      )
    );

    /* ========================================================
     * NIVEAU
     * ======================================================== */

    let niveau:
      | 'faible'
      | 'moyen'
      | 'important'
      | 'urgent' = 'faible';

    if (score >= 8) {
      niveau = 'urgent';
    } else if (score >= 5) {
      niveau = 'important';
    } else if (score >= 3) {
      niveau = 'moyen';
    }

    /* ========================================================
     * TITRE
     * ======================================================== */

    let titre =
      'État général à surveiller';

    if (
      tags.includes('pourriture-racines')
    ) {

      titre =
        'Problème racinaire possible';

    } else if (
      tags.includes('parasites') ||
      tags.includes('acariens')
    ) {

      titre =
        'Présence possible de parasites';

    } else if (
      tags.includes('exces-eau')
    ) {

      titre =
        'Excès d’humidité possible';

    } else if (
      tags.includes('sec') ||
      tags.includes('terreau-sec') ||
      tags.includes('terreau-tres-sec')
    ) {

      titre =
        'Manque d’eau possible';

    } else if (
      tags.includes('manque-lumiere')
    ) {

      titre =
        'Manque de lumière possible';

    } else if (
      tags.includes('taches-brunes')
    ) {

      titre =
        'Problème foliaire à surveiller';

    } else if (
      tags.includes('jaunissement')
    ) {

      titre =
        'Jaunissement des feuilles';
    }

    return {

      titre,

      description:
        'Ce résultat est construit à partir de tes observations et des réponses fournies. Plusieurs causes peuvent produire des symptômes similaires.',

      niveau,

      confiance,

      causes:
        this.unique(causes),

      conseils:
        this.unique(conseils),

      actions:
        this.unique(actions),

      surveillance:
        this.unique(surveillance)
    };
  }

  /* ==========================================================
   * TAGS
   * ========================================================== */

  private getTags(): string[] {

    const tags: string[] = [];

    for (
      const question of this.questions
    ) {

      const value =
        this.reponses[question.id];

      if (
        value === undefined ||
        value === null
      ) {
        continue;
      }

      const optionIds =
        Array.isArray(value)
          ? value
          : [value];

      for (
        const optionId of optionIds
      ) {

        if (
          typeof optionId !== 'string'
        ) {
          continue;
        }

        const option =
          question.options?.find(
            item =>
              item.id === optionId
          );

        if (
          option?.tags
        ) {

          tags.push(
            ...option.tags
          );
        }
      }
    }

    return this.unique(tags);
  }

  /* ==========================================================
   * UNIQUE
   * ========================================================== */

  private unique(
    values: string[]
  ): string[] {

    return [
      ...new Set(values)
    ];
  }

  /* ==========================================================
   * LABEL RÉPONSE
   * ========================================================== */

  getReponseLabel(
    questionId: string
  ): string {

    const question =
      this.questions.find(
        item =>
          item.id === questionId
      );

    if (!question) {
      return '';
    }

    const value =
      this.reponses[questionId];

    if (
      value === undefined ||
      value === null
    ) {
      return '';
    }

    if (
      Array.isArray(value)
    ) {

      return value
        .map(
          id =>
            question.options?.find(
              option =>
                option.id === id
            )?.label
        )
        .filter(
          (label): label is string =>
            Boolean(label)
        )
        .join(', ');
    }

    if (
      question.type === 'text'
    ) {

      return String(value);
    }

    if (
      typeof value === 'boolean'
    ) {

      return value
        ? 'Oui'
        : 'Non';
    }

    if (
      typeof value === 'number'
    ) {

      return String(value);
    }

    return (
      question.options?.find(
        option =>
          option.id === value
      )?.label ?? ''
    );
  }

  /* ==========================================================
   * MULTI SÉLECTION
   * ========================================================== */

  isMultiSelected(
    questionId: string,
    optionId: string
  ): boolean {

    const value =
      this.reponses[questionId];

    return (
      Array.isArray(value) &&
      value.includes(optionId)
    );
  }

  /* ==========================================================
   * ICÔNE RÉSULTAT
   * ========================================================== */

  getResultIcon(): string {

    switch (
      this.resultat.niveau
    ) {

      case 'urgent':
        return 'fa-solid fa-triangle-exclamation';

      case 'important':
        return 'fa-solid fa-bug';

      case 'moyen':
        return 'fa-solid fa-circle-exclamation';

      default:
        return 'fa-solid fa-leaf';
    }
  }

  /* ==========================================================
   * LABEL NIVEAU
   * ========================================================== */

  getNiveauLabel(): string {

    switch (
      this.resultat.niveau
    ) {

      case 'urgent':
        return 'Vigilance élevée';

      case 'important':
        return 'À traiter';

      case 'moyen':
        return 'Attention';

      default:
        return 'À surveiller';
    }
  }

  /* ==========================================================
   * NOUVEAU DIAGNOSTIC
   * ========================================================== */

  recommencer(): void {

    this.diagnosticDemarre = false;
    this.diagnosticTermine = false;
    this.chargement = false;

    this.questionActuelle =
      'symptome-principal';

    this.historiqueQuestions = [];

    this.reponses = {};

    this.descriptionLibre = '';

    this.confiance = 0;

    this.resultat =
      this.creerResultatVide();
  }

  /* ==========================================================
   * APPROFONDIR
   * ========================================================== */

  approfondir(): void {

    this.diagnosticTermine = false;
    this.diagnosticDemarre = true;

    const prochaine =
      this.trouverQuestionApres(
        this.questionActuelle
      );

    if (prochaine) {

      this.questionActuelle =
        prochaine;

      this.restaurerValeurQuestion(
        prochaine
      );

      return;
    }

    /*
     * Si toutes les questions du chemin ont été parcourues,
     * on revient vers la question texte pour permettre à
     * l'utilisateur d'ajouter des détails.
     */
    const description =
      this.questions.find(
        item =>
          item.id === 'description'
      );

    if (description) {

      this.questionActuelle =
        description.id;

      this.restaurerValeurQuestion(
        description.id
      );

      return;
    }

    this.terminerDiagnostic();
  }

  /* ==========================================================
   * BOT
   * ========================================================== */

  demanderAuBot(): void {

    /*
     * Point d'entrée pour ton futur chatbot.

     * Contexte disponible :
     *
     * const contexte = {
     *   tags: this.getTags(),
     *   reponses: this.reponses,
     *   diagnostic: this.resultat
     * };
     *
     * Tu pourras ensuite envoyer ce contexte
     * à ton backend / chatbot.
     */
  }
}