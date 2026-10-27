
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import {
  LanguageService,
  Language
} from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [],
  templateUrl: './demande.html',
  styleUrl: './demande.css',
})
export class Demande implements OnInit, OnDestroy {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly languageService = inject(LanguageService);
  private readonly destroy$ = new Subject<void>();

  // ============================================================
  // INPUTS — COMPATIBILITÉ AVEC LE COMPOSANT PARENT
  // ============================================================

  @Input() darkMode = false;

  private _language: Language =
    this.languageService.currentLanguage;

  @Input()
  set language(value: Language) {
    if (value !== 'fr' && value !== 'en') {
      return;
    }

    this._language = value;

    // Synchronise la langue globale si le parent fournit une valeur.
    this.languageService.setLanguage(value);
  }

  get language(): Language {
    return this._language;
  }

  // ============================================================
  // OUTPUTS — API EXISTANTE CONSERVÉE
  // ============================================================

  @Output() requestClick = new EventEmitter<string>();

  // ============================================================
  // STATE
  // ============================================================

  selectedType: string | null = null;

  // ============================================================
  // LIFECYCLE — SYNCHRONISATION DU LANGUAGE SERVICE
  // ============================================================

  ngOnInit(): void {
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this._language = language;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // LANGUAGE
  // ============================================================

  get isEnglish(): boolean {
    return this.language === 'en';
  }

  // ============================================================
  // CONTENT — FR / EN
  // ============================================================

  get content() {
    return this.isEnglish
      ? {
          eyebrow: 'YOUR SPACE, YOUR IDEAS',
          titleStart: 'Let’s grow',
          titleAccent: 'Arboria',
          titleEnd: 'together.',
          description:
            'Have an idea, a need or something you would like to improve? Submit a request and help us shape an experience that truly reflects you.',
          primary: 'Make a request',
          secondary: 'Explore possibilities',
          sectionLabel: 'WHAT CAN YOU REQUEST?',
          sectionTitle: 'Your ideas can make a difference.',
          sectionDescription:
            'From personalizing your space to suggesting new features, every idea helps Arboria evolve.',
          cards: [
            {
              id: 'personalization',
              number: '01',
              icon: '✳',
              title: 'Personalize your space',
              description:
                'Suggest adjustments, new settings or improvements to make your user space your own.',
              tag: 'YOUR EXPERIENCE',
            },
            {
              id: 'feature',
              number: '02',
              icon: '✧',
              title: 'Suggest a feature',
              description:
                'Imagine new tools, services or possibilities that could enrich the Arboria experience.',
              tag: 'NEW POSSIBILITIES',
            },
            {
              id: 'improvement',
              number: '03',
              icon: '↗',
              title: 'Improve Arboria',
              description:
                'Share your feedback and ideas to help us make the platform more useful and intuitive.',
              tag: 'LET’S EVOLVE',
            },
          ],
          footerTitle: 'Every great idea starts somewhere.',
          footerDescription:
            'Yours might be the next step in Arboria’s evolution.',
          footerButton: 'Share my idea',
          note: 'Your request is an opportunity to make Arboria better.',
        }
      : {
          eyebrow: 'VOTRE ESPACE, VOS IDÉES',
          titleStart: 'Faisons grandir',
          titleAccent: 'Arboria',
          titleEnd: 'ensemble.',
          description:
            'Une idée, un besoin ou quelque chose à améliorer ? Envoyez une demande et contribuez à créer une expérience qui vous ressemble.',
          primary: 'Faire une demande',
          secondary: 'Découvrir les possibilités',
          sectionLabel: 'QUE POUVEZ-VOUS DEMANDER ?',
          sectionTitle: 'Vos idées peuvent faire la différence.',
          sectionDescription:
            'Personnalisation de votre espace, nouvelles fonctionnalités ou améliorations : chaque idée aide Arboria à évoluer.',
          cards: [
            {
              id: 'personalization',
              number: '01',
              icon: '✳',
              title: 'Personnaliser votre espace',
              description:
                'Proposez des réglages, de nouvelles options ou des améliorations pour adapter votre espace à vos besoins.',
              tag: 'VOTRE EXPÉRIENCE',
            },
            {
              id: 'feature',
              number: '02',
              icon: '✧',
              title: 'Suggérer une fonctionnalité',
              description:
                'Imaginez de nouveaux outils, services ou possibilités pour enrichir votre expérience Arboria.',
              tag: 'NOUVELLES POSSIBILITÉS',
            },
            {
              id: 'improvement',
              number: '03',
              icon: '↗',
              title: 'Améliorer Arboria',
              description:
                'Partagez vos remarques et vos idées pour rendre la plateforme plus utile, fluide et intuitive.',
              tag: 'FAISONS ÉVOLUER',
            },
          ],
          footerTitle: 'Chaque grande idée commence quelque part.',
          footerDescription:
            'La vôtre sera peut-être la prochaine étape d’Arboria.',
          footerButton: 'Partager mon idée',
          note: 'Chaque demande est une occasion de faire évoluer Arboria.',
        };
  }

  // ============================================================
  // SELECT REQUEST TYPE — API CONSERVÉE
  // ============================================================

  selectType(type: string): void {
    this.selectedType = type;
    this.requestClick.emit(type);
  }

  // ============================================================
  // OPEN REQUEST — API CONSERVÉE
  // ============================================================

  openRequest(): void {
    this.requestClick.emit(this.selectedType ?? 'general');
  }
}
