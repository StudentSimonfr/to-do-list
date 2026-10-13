import { ValidatorFn } from '@angular/forms';

// Titre : au moins 3 caractères hors espaces de début et de fin
export const titleMin3: ValidatorFn = control =>
  String(control.value ?? '').trim().length >= 3 ? null : { titleMin3: true };

const pad = (n: number) => String(n).padStart(2, '0');
const format = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Date du jour en heure LOCALE, au format YYYY-MM-DD
export const todayLocal = () => format(new Date());

// Échéance : facultative, mais si présente = date réelle et >= aujourd'hui
export const validDueDate: ValidatorFn = control => {
  const v = String(control.value ?? '');
  if (!v) return null;                                  // champ vide = valide
  const d = new Date(v + 'T00:00:00');
  const exists = !Number.isNaN(d.getTime()) && format(d) === v;   // rejette le 31 février
  return exists && v >= todayLocal() ? null : { dueDate: true };
};