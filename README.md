# Design Tokens Pipeline

This repository stores design tokens in `tokens.json` and generates a ready-to-serve CSS file.

It also stores canonical SVG icons in `icons/` and builds a web-consumable icon output in `dist/icons/web/` for build-time consumption by `web`.

The same web output is also staged and published as the npm package `@101/design-icons-web`.

## Output

Build command creates:

- `dist/tokens.css`
- `dist/icons/web/monochrome/*.svg`
- `dist/icons/web/multicolor/*.svg`
- `dist/npm/design-icons-web/*`

The CSS file contains:

- `:root` variables (global + components + light theme as default)
- `[data-theme="dark"]` overrides for dark theme

## Local build

Requirements:

- Node.js 18+

Run:

```bash
node scripts/build-css.mjs
```

Or with npm:

```bash
npm run build:css
npm run build:icons
npm run build:icons:web-package
npm run check:icons:web-package
```

### Icons

Source of truth:

- `icons/monochrome/*.svg`
- `icons/multicolor/*.svg`

Build output for web:

- `dist/icons/web/monochrome/*.svg`
- `dist/icons/web/multicolor/*.svg`

The icons build copies already cleaned SVG files from `icons/` into a stable consumable output for `web`.
It does not re-optimize or transform the files.

### Web package

The staged npm package for `web` is created in:

- `dist/npm/design-icons-web/package.json`
- `dist/npm/design-icons-web/monochrome/*.svg`
- `dist/npm/design-icons-web/multicolor/*.svg`

Consumer import contract:

```ts
import ProjectIcon from "@101/design-icons-web/monochrome/project.svg?component";
```

The package version is resolved from the release tag `design-icons-web-vX.Y.Z`.
Without a matching tag, local staging uses `0.0.0-development`.

## GitLab CI/CD

Pipeline file: `.gitlab-ci.yml`

Stages:

1. `build_css` - generates `dist/tokens.css` and stores it as artifact.
2. `build_icons` - generates `dist/icons/web/*` and stores them as artifact.
3. `build_icons_web_package` - stages `@101/design-icons-web` in `dist/npm/design-icons-web` and validates it with `npm pack --dry-run`.
4. `publish_icons_web_package` - publishes `@101/design-icons-web` to GitLab Package Registry for tags matching `design-icons-web-vX.Y.Z`.
5. `deploy_css` - uploads `dist/tokens.css` to your server via `rsync` over SSH.

### Required CI/CD variables

Set these in GitLab project settings (`Settings -> CI/CD -> Variables`):

- `SSH_HOST` - target server host
- `SSH_PORT` - optional, default `22`
- `SSH_USER` - SSH user
- `SSH_PRIVATE_KEY` - private key for deploy user (plain or file variable)
- `SSH_PRIVATE_KEY_DEPLOY` - optional override key for deploy job (if not set, `SSH_PRIVATE_KEY` is used)
- `TOKENS_DEPLOY_PATH` - absolute directory on server where `tokens.css` must be uploaded
- `DEPLOY_PATH` - legacy fallback variable for `tokens.css` deploy path during migration

Optional (recommended):

- `SSH_KNOWN_HOSTS` - prefilled known_hosts entry for strict host verification

Package publishing uses GitLab CI-provided variables:

- `CI_API_V4_URL`
- `CI_PROJECT_ID`
- `CI_JOB_TOKEN` or `NODE_AUTH_TOKEN`

Deploy jobs run only on default branch and only when required variables are present. `deploy_css` prefers `TOKENS_DEPLOY_PATH` and falls back to legacy `DEPLOY_PATH` during migration.

## Server result

After successful deploy, files will be available at:

- `${TOKENS_DEPLOY_PATH}/tokens.css`

Icons are not published as runtime URLs. `web` is expected to consume the published npm package `@101/design-icons-web`, which contains raw SVG files for build-time imports.
