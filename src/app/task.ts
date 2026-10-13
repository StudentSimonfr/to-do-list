// Code commun React + Angular : modèle, validation JSON, lecture/écriture localStorage

export interface Task {
  id: string;
  title: string;          // min 3 caractères (hors espaces)
  description?: string;
  dueDate?: string;       // YYYY-MM-DD
  done: boolean;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

export const STORAGE_KEY = 'tasks';

// Vérifie la FORME d'un objet venant de JSON.parse (pas les règles métier)
export function isTask(v: unknown): v is Task {
  if (typeof v !== 'object' || v === null) return false;
  const t = v as Record<string, unknown>;
  return typeof t['id'] === 'string'
    && typeof t['title'] === 'string'
    && typeof t['done'] === 'boolean'
    && typeof t['createdAt'] === 'string'
    && typeof t['updatedAt'] === 'string'
    && (t['description'] === undefined || typeof t['description'] === 'string')
    && (t['dueDate'] === undefined || typeof t['dueDate'] === 'string');
}

// Lecture : ne plante jamais, renvoie [] en cas de souci (absent, JSON cassé, mauvaise forme)
export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isTask) : [];
  } catch {
    return [];
  }
}

// Écriture : renvoie false si ça échoue (quota dépassé, navigation privée, ...)
export function saveTasks(tasks: Task[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    console.warn('Sauvegarde locale impossible');
    return false;
  }
}
