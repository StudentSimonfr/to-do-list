To-Do List Angular

Application de gestion de tâches développée en Angular dans le cadre du module Framework JS . Elle permet de créer, modifier, filtrer et supprimer des tâches, avec sauvegarde automatique dans le navigateur.

Fonctionnalités :

Créer une tâche : titre obligatoire, description et date facultatives. Le formulaire est réinitialisé après l'ajout.

Lister les tâches : titre, statut (à faire / faite), échéance, avec mise à jour en temps réel.
Cocher / décocher une tâche : le titre est barré et le compteur « X à faire / Y faites » se met à jour.

Modifier une tâche : édition directe dans la liste, avec les mêmes validations que la création.
Possibilitée de supprimer une tâche avec demande de confirmation.

Filtrer, rechercher, trier : filtre par statut (toutes / à faire / faites), recherche par texte, tri par échéance puis par titre.

Persistance locale : les tâches sont conservées après un rechargement de la page (localStorage).

Deux vues avec navigation sans rechargement :

stats : 
total, faites, à faire et pourcentage de tâches terminées (0 % si la liste est vide).
Règles de validation

tâches :
Titre  obligatoire, 3 caractères minimum hors espaces de début et de fin.

date facultative. Si elle est renseignée, elle doit être une date réelle (au format DD-MM-YYYY) supérieure ou égale à aujourd'hui (date locale).

Les messages d'erreur s'affichent sous les champs concernés, qui sont signalés comme invalides.
Le bouton « Ajouter » reste désactivé tant que le formulaire est invalide.

Prérequis :
Node.js (version LTS recommandée) et npm
Git
Angular CLI (facultatif, les scripts npm suffisent) : npm install -g @angular/cli

Vérification :

bash
node -v
npm -v
Installation
bash
# Cloner le dépôt
git clone <url-du-depot>

# Installer les dépendances
npm install

Scripts disponibles:

Commande	Description:

npm start	

Lance le serveur de développement sur http://localhost:4200 (rechargement automatique)

npm run build	Génère la version de production dans le dossier dist/

npm test	

Lance les tests unitaires


Structure du projet :
src/
 ├─ app/
 │   ├─ app.ts / app.html / app.css   # Composant racine : en-tête, navigation, <router-outlet>
 │   ├─ app.routes.ts                 # Routes : "" (liste) et "stats"
 │   ├─ app.config.ts                 # Configuration de l'application (provideRouter)
 │   ├─ task.ts                       # Modèle Task, validation du JSON, lecture/écriture localStorage
 │   ├─ task.service.ts               # TaskService : état des tâches (signals) + opérations + sauvegarde
 │   ├─ task-validators.ts            # Validateurs : titre (min 3 hors espaces) et date d'échéance
 │   ├─ task-form/                    # Formulaire d'ajout et d'édition (Reactive Forms)
 │   ├─ task-item/                    # Affichage d'une tâche (input / output)
 │   ├─ task-list/                    # Page "/" : formulaire, filtres, recherche, liste
 │   └─ stats/                        # Page "/stats" : statistiques
 ├─ main.ts                           # Point d'entrée
 └─ styles.css                        # Styles globaux

Choix techniques :
Composants standalone : chaque composant déclare lui-même ce qu'il utilise dans imports.

Signals (signal, computed, effect) pour l'état de l'application :

TaskService est la source de vérité unique des tâches, partagée entre la liste et les statistiques grâce à l'injection de dépendances (providedIn: 'root') ;

le filtre, la recherche et le tri sont calculés avec computed() : la liste complète reste intacte dans le service ;

les compteurs et le pourcentage sont aussi des computed().

Mises à jour immuables : chaque modification crée un nouveau tableau ([...list], map, filter), ce qui permet à Angular de détecter les changements.

Communication entre composants : input() pour faire descendre les données, output() pour faire remonter les actions. TaskItem ne modifie jamais les données directement.

Reactive Forms typés (FormGroup, FormControl) avec des validateurs personnalisés pour les règles métier.

Routing avec provideRouter, routerLink et <router-outlet> : navigation sans rechargement de page.


Modèle de données :
ts
interface Task {
  id: string;           // uuid
  title: string;        // 3 caractères minimum hors espaces
  description?: string;
  dueDate?: string;     // YYYY-MM-DD
  done: boolean;
  createdAt: string;    // ISO
  updatedAt: string;    // ISO
}

Persistance (localStorage):

Les tâches sont enregistrées en JSON sous la clé tasks.
Lecture au démarrage : le JSON est lu dans un try/catch, puis la forme de chaque élément est vérifiée. Si les données sont absentes, corrompues ou invalides, l'application démarre avec une liste vide, sans erreur.

Écriture : un effect() du TaskService sauvegarde la liste à chaque modification. Une éventuelle erreur d'écriture (quota dépassé, navigation privée) est interceptée.
La lecture est faite avant la mise en place de la sauvegarde, pour qu'une liste vide n'écrase jamais des données existantes.

Les données restent propres à ce navigateur : elles ne sont pas partagées entre appareils. Aucune donnée sensible n'est stockée.


Accessibilité :

Chaque champ de formulaire est associé à un <label>.

Les messages d'erreur sont reliés aux champs (aria-describedby, aria-invalid) et annoncés aux lecteurs d'écran (aria-live).

Les boutons d'action portent un nom explicite (aria-label, par exemple « Supprimer titre de la tâche »).

Les filtres indiquent leur état (aria-pressed).

Navigation possible entièrement au clavier, avec un indicateur de focus visible.

Performance :

@for avec track t.id : seules les lignes modifiées sont mises à jour.
Filtre, recherche et tri calculés par computed(), uniquement quand leurs dépendances changent.
Liste testée avec 200 tâches ou plus.

Tests :

bash
npm test

Les tests couvrent notamment :

l'ajout d'une tâche (done = false par défaut) ;
le changement de statut et la mise à jour des compteurs ;
le pourcentage de 0 % pour une liste vide ;
la création de l'application et l'affichage du titre.
Scénarios à vérifier manuellement
Titre « a » ou composé uniquement d'espaces : refusé.
Échéance passée ou date impossible (par exemple 31 février) : refusée. Échéance vide : acceptée.
Liste vide : message « Aucune tâche pour le moment », et 0 % sur la page /stats.
Ajout, modification, changement de statut, suppression puis rechargement de la page : la liste est identique.
Données du localStorage corrompues (localStorage.setItem('tasks', 'abc') dans la console, puis rechargement) : l'application démarre avec une liste vide.
Auteur

Projet réalisé par Simon GUIGUE
