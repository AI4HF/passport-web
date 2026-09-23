# AI4HF Passport — Frontend (`passport-web`)

Angular 17 SPA for the AI Product Passport, built on the PrimeNG "Sakai" admin template.
Angular 17.0.7 · PrimeNG 17.2.0 · PrimeFlex 3.3.1 · `@ngx-translate` · RxJS 7.8 · TypeScript 5.2.

The backend lives in the sibling repo `../passport`; workspace-level and cross-repo concerns are in
[`../CLAUDE.md`](../CLAUDE.md). Read that too — nearly every entity change requires a matching backend change.

## Engineering approach

Development phase — no backward compatibility required (see [`../CLAUDE.md`](../CLAUDE.md)). When the
backend contract changes, update models, services, and templates in the same sweep — no fallback field
mappings in model constructors, no feature flags. Prefer the simplest implementation that meets the
requirement: reuse the established patterns below instead of introducing new abstractions (no wrapper
services, no generic form builders, no state-management libraries).

## Layout

```
src/
  environments/environment.ts        # dev: PASSPORT_API_URL = http://localhost:8080
  environments/environment.prod.ts   # prod: PASSPORT_API_URL = 'api'  (nginx-proxied)
  assets/i18n/en.json                # the ONLY translation file; every visible string lives here
  app/
    app.module.ts                    # TranslateModule.forRoot, AuthInterceptor registration, MessageService
    app-routing.module.ts            # top-level lazy routes, all behind authGuard
    core/
      guards/                        # authGuard, auth.interceptor, per-flow "did you fill step 1" guards
      resolvers/                     # *-management.resolver.ts — pre-navigation data fetch
      services/                      # one HTTP service per backend resource + storageUtil, role, activeStudy
    layout/                          # Sakai template: app.menu.component.ts is the role-driven navigation
    modules/                         # one folder per functional area (see table in ../CLAUDE.md)
    shared/
      components/base.component.ts   # abstract base every component extends
      components/stepper/            # left-hand step navigation inside *-edit flows
      components/cascade-validation-dialog/
      components/selected-study-dropdown/
      models/                        # plain classes mirroring backend entities/DTOs
      pipes/
```

## Build & run

```bash
npm install && npm start
```

```bash
npm run build:prod
```

`npm test` runs Karma but there are **no meaningful specs**. Verify changes by running the app against a live
backend and walking the affected flow.

## The five patterns you must follow

### 1. `BaseComponent`

Every component extends `shared/components/base.component.ts` and takes `protected injector: Injector`:

```ts
export class FooTableComponent extends BaseComponent implements OnInit {
  constructor(protected injector: Injector) { super(injector); }
}
```

It provides `router`, `route`, `translateService`, `messageService`, `layoutService`, a `destroy$` subject, and
**every domain service as a public field** (`modelService`, `datasetService`, `activeStudyService`, …).

**Registering a new service means editing `base.component.ts` twice** — declare the field, then
`this.fooService = injector.get(FooService)` in the constructor. This class is ~40 services long by design;
follow the pattern rather than injecting into individual components.

`BaseComponent` also supplies `ngOnDestroy` (completes `destroy$`, calls the overridable `clearState()`) and a
document-level Escape handler that calls `closeDialog()` / clears `display` on any component that has them.

**Always** pipe subscriptions through `takeUntil(this.destroy$)`.

### 2. Service layer (`core/services/`)

```ts
@Injectable({ providedIn: 'root' })
export class FooService {
    readonly endpoint = environment.PASSPORT_API_URL + '/foo';
    private httpClient: HttpClient;
    constructor(private injector: Injector) { this.httpClient = injector.get(HttpClient); }

    getFooList(studyId: String): Observable<Foo[]> {
        return this.httpClient.get<Foo[]>(`${this.endpoint}?studyId=${studyId}`).pipe(
            map((response: any) => response.map((f: any) => new Foo(f))),
            catchError((error) => { console.error(error); throw error; })
        );
    }
}
```

Conventions:
- `studyId` is appended as a query param to **every** request (including GET/DELETE) — the backend needs it as
  the authorization scope. It comes from `this.activeStudyService.getActiveStudy()`.
- Responses are always re-wrapped into model classes via `map`.
- `create*` sets the audit fields from session storage before POSTing:
  `foo.createdBy = StorageUtil.retrieveUserId()`, `foo.lastUpdatedBy = ...`,
  `foo.owner = StorageUtil.retrieveOrganizationId()`. `update*` sets `lastUpdatedBy` only.
- Deletion-validation calls use `{ responseType: 'text' }` because the backend returns a bare comma-separated
  string.
- Note `String` (capital S) is used for id parameters throughout — legacy, but match it locally for consistency.

### 3. Models (`shared/models/`)

Plain classes — **not interfaces** — with a defensive constructor:

```ts
export class Foo {
    /** The ID of the Foo */
    fooId: string;
    ...
    constructor(data: any) {
        if (!data) { return; }
        this.fooId = data.fooId;
        ...                         // every field copied explicitly
        this.createdAt = new Date(data.createdAt);
    }
}
```

Adding a field means editing both the declaration and the constructor. Field names must match the backend JSON
exactly (camelCase of the Java field, not the DB column). TSDoc on every field is the norm.

### 4. Table + form component pairs

The CRUD unit is a `*-table` component that hosts a `*-form` component in a PrimeNG dialog.
`modules/model-management/model-management-{table,form}` is the reference implementation.

**Table component** holds: `fooList`, `columns: any[]` (`{header, field}` pairs set in the constructor),
`loading`, `displayForm`, `selectedFooId`, plus cascade state (`displayCascadeDialog`, `cascadeTables`,
`cascadeAuthorized`, `pendingDeletionFooId`). It loads on `ngOnInit` guarded by
`if (this.activeStudyService.getActiveStudy())`, exposes `filter(table, event)` for PrimeNG global filtering,
and reloads via `onFormClosed()`.

Deletion is a two-step dance:
1. Call `fooService.validateFooDeletion(id)`.
2. Empty response → delete immediately. Non-empty 200 → show `<app-cascade-validation-dialog>` with
   `authorized=true` for confirmation. HTTP 409 → show the same dialog with `authorized=false` (blocked).

**Form component** takes `@Input() fooId` and `@Output() formClosed`, loads the entity (or `new Foo({})`),
`forkJoin`s any dropdown lookups, then builds a `FormGroup` of `FormControl`s in `initializeForm()`. Save
branches on whether `fooId` is set.

Every user message goes through translate + toast:

```ts
this.translateService.get(['Success', 'ModelManagement.Model is deleted successfully']).subscribe(t => {
  this.messageService.add({ severity: 'success', summary: t['Success'], detail: t['...'] });
});
```

### 5. Multi-step edit flows

Larger areas use a `<area>-management` → `<area>-management-dashboard` (list) + `<area>-management-edit`
(stepper shell) structure, where the shell component builds a `steps` array of
`{ name, routerLink, queryParams }` from translated labels and renders `<app-stepper [steps]="...">`.
Child routes are protected by flow guards that bounce the user back to step 1 when the route param is still
`'new'`. Note the two generations coexist: functional guards (`authGuard` in `auth.guard.ts`,
`studyDetailsGuard`) and older class-based ones implementing `CanActivate`
(`DatasetGuard` in `dataset.guard.ts`, `LpGuard` in `lp.guard.ts`, `PopulationGuard` in
`population-details.guard.ts`). Prefer the functional style for new guards.

Nesting is deep and consistent: each step's table/form pair is itself a module with its own routing module.

## Auth & session

- `authGuard` (`core/guards/auth.guard.ts`) only checks that `StorageUtil.retrieveToken()` is non-null.
- `AuthInterceptor` attaches `Authorization: Bearer <token>` and maps error statuses to navigation:
  - `401` → clear all session data, go to `/login`
  - `403` → go to `/not-found` with a "Forbidden" message
  - `410` → the study's Keycloak group is gone: clear roles (keeping `STUDY_OWNER` if present), clear the
    active study, go to `/study-management`
- `StorageUtil` (`core/services/storageUtil.service.ts`) is the only place that touches
  `localStorage`/`sessionStorage`. It keys on `token`, `userId`, `personnelName`, `personnelSurname`,
  `organizationName`, `organizationId` and picks local vs session storage from a `rememberMe` flag.
- `ActiveStudyService` stores the active study id under `sessionStorage['activeStudy']` and exposes it via
  `getActiveStudy()` / `getActiveStudyAsObservable()`. **Never read the study id from anywhere else.**
- `RoleService` holds the logged-in user's `Role[]`; `app.menu.component.ts` rebuilds the navigation from it.

## Roles and navigation

`shared/models/role.enum.ts` mirrors the backend enum; `roles.constant.ts` supplies display labels for
dropdowns. Compare against `Role.X`, never a string literal. `layout/app.menu.component.ts` maps roles
to menu groups:

| Role | Menu group | Routes |
|---|---|---|
| *(all)* | Study Management | `/study-management` |
| `DATA_SCIENTIST` | Data Scientist | `/parameter-management`, `/learning-process-management`, `/model-management` |
| `SURVEY_MANAGER` | Survey Manager | `/survey-management` |
| `DATA_ENGINEER` | Data Engineer | `/featureset-management`, `/dataset-management` |
| `QUALITY_ASSURANCE_SPECIALIST` | Quality Assurance | `/passport-management` |
| `ORGANIZATION_ADMIN` | Organization Admin | `/organization-management/organization` |

A new role or a new module needs an entry here or it will be unreachable, plus the matching backend/Keycloak
changes listed in [`../CLAUDE.md`](../CLAUDE.md).

## i18n

- `assets/i18n/en.json`, loaded by `TranslateHttpLoader`; `environment.defaultLanguage = 'en'`.
- Top-level keys are global words (`Save`, `Error`, `Next`) plus one namespace per module
  (`StudyManagement`, `DatasetManagement`, `ModelManagement`, `LearningProcessManagement`,
  `PassportManagement`, `OrganizationManagement`, `SurveyManagement`,
  `ParameterManagement`, `FeatureSetManagement`, `ParameterAssignment`, `EvaluationMeasure`,
  `ModelEvaluation`, `LinkedArticle`,
  `CascadeValidation`, `AuditLogTable`, `AuditLogBook`, `Tooltip`, `NotFound`).
- **No hard-coded user-visible strings.** Templates use the `translate` pipe; TS uses
  `translateService.get(...)`. Commits touching strings are tagged `:globe_with_meridians:`.
- Only English exists today, despite the multi-locale wiring.

## Passport generation & PDF export

`modules/passport-management/`:
- `passport-management-table` — lists passports for the active study, links to `audit-logs/:passportId`.
- `passport-management-form` — a model dropdown (the passport's unit is the model) plus checkboxes bound to
  `PassportDetailsSelection` (`modelDetails`, `datasets`, `featureSets`, `learningProcessDetails`,
  `parameterDetails`, `populationDetails`, `experimentDetails`, `linkedArticleDetails`, `surveyDetails`,
  `studyDetails`, `evaluationMeasures`, `modelFigures`, `excludeEmptyFields`) → `POST /passport`.
- `passport-pdf-export` — receives every section as an `@Input()`, renders the printable HTML template, then
  either posts that HTML to `POST /passport/generate-and-sign` (via
  `passportService.generateAndSignPdf(html, studyId, GenerateAndSignPdfOptionsDto)` — the options carry the
  `passportId`, and the server stores the signed document on that passport the first time, returning the
  stored bytes thereafter; `passportService.downloadSignedPdf(...)` fetches it directly) for a PAdES-signed PDF,
  or converts it locally to `.docx` with the globally-loaded `html-docx-js`. Both download through
  `file-saver`. (`html2pdf.js`, `jspdf` and `html2canvas` are still in `package.json` but no longer
  referenced — the PDF path moved server-side.)

**Adding a section to the passport** requires, in this repo: a boolean on
`shared/models/passportDetailsSelection.model.ts`, a field on `passportDetails.model.ts`, a checkbox in
`passport-management-form`, an `@Input()` + template block in `passport-pdf-export`, and i18n keys — plus the
mirrored backend changes.

## Gotchas

- `dist/`, `.angular/`, and `node_modules/` are present in the working tree — ignore them when searching.
- `StudyManagementResolver` still calls `Number(route.paramMap.get('id'))` even though ids are UUID strings —
  legacy dead-ish code; the guards handle the real flow. Safe to fix or delete legacy quirks like this when
  you touch the area.
- `ModelService` has both `getModelList(studyId)` and `getModelsByStudyId(studyId)` hitting the same URL.
- `ModelManagementFormComponent` carries a `hardcodedModels` autofill list loaded from JSON — demo scaffolding.
- The prod build resolves the API at the relative path `api`; `docker/nginx-custom.conf` proxies it.
- `Node.js 16.14.0` is what the README claims; Angular 17 in practice wants Node 18+.
