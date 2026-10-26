#!/usr/bin/env node
/**
 * Contrôle bloquant du cycle SEO mensuel.
 *
 * Trois défauts se sont répétés à chaque cycle parce qu'ils n'étaient encadrés
 * que par de la prose. Ce script les rend impossibles à ignorer : il sort en
 * erreur, et l'étape 11 (rapport) ne peut pas se terminer tant qu'il échoue.
 *
 *   1. Un chantier ouvert non relancé pendant le cycle courant.
 *   2. Une revue de baseline échue sans verdict.
 *   3. Un relevé dont une métrique n'a pas de source déclarée.
 *
 * Usage : node scripts/seo-check.mjs [--cycle AAAA-MM]
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SEO = path.join(ROOT, 'seo');

const arg = process.argv.indexOf('--cycle');
const CYCLE = arg !== -1 ? process.argv[arg + 1] : new Date().toISOString().slice(0, 7);

const problemes = [];
const avertissements = [];

/**
 * Lecteur YAML minimal : ces fichiers sont écrits par des agents selon un
 * gabarit fixe, donc on n'embarque pas de dépendance pour les lire. On extrait
 * les blocs d'une liste et on lit des clés plates — suffisant ici, et ça évite
 * d'ajouter js-yaml au projet pour trois fichiers.
 */
function blocs(contenu, cleListe) {
  const lignes = contenu.split('\n');
  const debut = lignes.findIndex((l) => l.trimEnd() === `${cleListe}:`);
  if (debut === -1) return [];
  const out = [];
  let courant = null;
  for (const ligne of lignes.slice(debut + 1)) {
    if (/^\S/.test(ligne) && ligne.trim() !== '') break; // fin du bloc
    const item = ligne.match(/^\s{2}- (.*)$/);
    if (item) {
      if (courant) out.push(courant);
      courant = [item[1]];
    } else if (courant && ligne.trim()) {
      courant.push(ligne.trim());
    }
  }
  if (courant) out.push(courant);
  return out.map((l) => l.join('\n'));
}

const champ = (bloc, cle) => {
  const m = bloc.match(new RegExp(`(?:^|\\n)\\s*${cle}:\\s*(.*)`));
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  return v === '' || v === 'null' ? null : v;
};

const memeCycle = (date) => typeof date === 'string' && date.slice(0, 7) === CYCLE;
const echu = (date) => typeof date === 'string' && date <= new Date().toISOString().slice(0, 10);

// ── 1. Registre des actions ────────────────────────────────────────────────
const fRegistre = path.join(SEO, 'registre-actions.yml');
if (!existsSync(fRegistre)) {
  problemes.push('seo/registre-actions.yml est absent.');
} else {
  const contenu = readFileSync(fRegistre, 'utf8');
  const declare = champ(contenu, 'cycle_courant');
  if (declare !== CYCLE) {
    problemes.push(
      `registre-actions.yml : cycle_courant vaut « ${declare} », le cycle en cours est « ${CYCLE} ». ` +
        `Le registre n'a pas été repris ce mois-ci.`,
    );
  }
  for (const bloc of blocs(contenu, 'actions')) {
    const id = champ(bloc, 'id') ?? '(sans id)';
    const etat = champ(bloc, 'etat');
    if (etat === 'fait') continue;
    const relance = champ(bloc, 'derniere_relance');
    if (!memeCycle(relance)) {
      problemes.push(
        `Action « ${id} » (${etat}) : dernière relance ${relance ?? 'jamais'}, ` +
          `aucune pendant le cycle ${CYCLE}. C'est le défaut 1.`,
      );
    }
    const echeance = champ(bloc, 'echeance');
    if (echeance && echu(echeance)) {
      avertissements.push(`Action « ${id} » : échéance ${echeance} dépassée.`);
    }
  }
}

// ── 2. Baselines ───────────────────────────────────────────────────────────
const fBaselines = path.join(SEO, 'baselines.yml');
if (!existsSync(fBaselines)) {
  problemes.push('seo/baselines.yml est absent.');
} else {
  const contenu = readFileSync(fBaselines, 'utf8');
  for (const bloc of blocs(contenu, 'baselines')) {
    const id = champ(bloc, 'id') ?? '(sans id)';
    const verdict = champ(bloc, 'verdict');
    const attendu = champ(bloc, 'verdict_attendu_le');
    if (!attendu) {
      problemes.push(`Baseline « ${id} » : pas de verdict_attendu_le. Sans date ferme, rien ne sera tranché.`);
      continue;
    }
    if (!verdict && echu(attendu)) {
      problemes.push(
        `Baseline « ${id} » : verdict attendu le ${attendu}, toujours null. ` +
          `Trancher « confirme » ou « retour-arriere ». C'est le défaut 2.`,
      );
    }
    if (verdict && !['confirme', 'retour-arriere'].includes(verdict)) {
      problemes.push(`Baseline « ${id} » : verdict « ${verdict} » invalide.`);
    }
  }
}

// ── 3. Relevé du cycle ─────────────────────────────────────────────────────
const fReleve = path.join(SEO, 'releves', `${CYCLE}.yml`);
if (!existsSync(fReleve)) {
  avertissements.push(
    `seo/releves/${CYCLE}.yml est absent — normal avant la collecte, bloquant au moment du rapport.`,
  );
} else {
  const contenu = readFileSync(fReleve, 'utf8');
  const lignes = contenu.split('\n');
  lignes.forEach((ligne, i) => {
    // Une métrique est une clé numérique ; elle doit être accompagnée d'une source.
    if (!/^\s{2,}[a-z_]+:\s*-?[\d.]+\s*$/.test(ligne)) return;
    const fenetre = lignes.slice(Math.max(0, i - 6), i + 7).join('\n');
    if (!/source:/.test(fenetre)) {
      problemes.push(
        `Relevé ${CYCLE} ligne ${i + 1} : « ${ligne.trim()} » n'a pas de source déclarée. ` +
          `C'est le défaut 3.`,
      );
    }
  });
  if (/integrite_donnees:\s*true/.test(contenu)) {
    avertissements.push(
      `Relevé ${CYCLE} : drapeau integrite_donnees posé — une source a divergé d'un facteur > 2 et doit être écartée.`,
    );
  }
}

// ── 4. Report de cycle ─────────────────────────────────────────────────────
const fProchain = path.join(SEO, 'prochain-cycle.yml');
if (!existsSync(fProchain)) {
  problemes.push('seo/prochain-cycle.yml est absent.');
} else {
  const contenu = readFileSync(fProchain, 'utf8');
  const entrees = ['a_trancher', 'a_surveiller', 'a_poursuivre', 'ecartes']
    .flatMap((cle) => blocs(contenu, cle));
  if (entrees.length > 10) {
    avertissements.push(
      `prochain-cycle.yml : ${entrees.length} entrées pour un plafond de 10. ` +
        `Le cycle accumule du retard — à signaler plutôt qu'à empiler.`,
    );
  }
  for (const bloc of entrees) {
    const quoi = champ(bloc, 'quoi') ?? champ(bloc, 'sujet') ?? '(sans libellé)';
    const ancre = champ(bloc, 'echeance') ?? champ(bloc, 'seuil') ?? champ(bloc, 'mesurer_le') ?? champ(bloc, 'motif');
    if (!ancre) {
      problemes.push(
        `Report de cycle « ${quoi.slice(0, 60)} » : ni échéance, ni seuil, ni date de mesure. ` +
          `Sans ancre, l'entrée ne sera jamais tranchée.`,
      );
    }
  }
}

// ── Sortie ─────────────────────────────────────────────────────────────────
console.log(`\nContrôle SEO — cycle ${CYCLE}\n${'─'.repeat(42)}`);
for (const a of avertissements) console.log(`  ⚠  ${a}`);
for (const p of problemes) console.log(`  ✗  ${p}`);

if (problemes.length === 0) {
  console.log(`  ✓  ${avertissements.length ? 'Aucun blocage' : 'Tout est à jour'}.\n`);
  process.exit(0);
}
console.log(`\n${problemes.length} blocage(s). Le rapport mensuel ne peut pas être produit.\n`);
process.exit(1);
