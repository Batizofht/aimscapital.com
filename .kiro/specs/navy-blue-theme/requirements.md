# Requirements Document

## Introduction

The AIMS Capital public marketing website currently mixes a navy blue accent color (used in the header, hero sections, and call-to-action bands) with white and light gray section backgrounds throughout the rest of the site. This feature converts the entire public-facing marketing site to a sitewide dark mode where navy blue is the only primary background/brand color — no white or light-gray section backgrounds remain. The scope is strictly limited to the public marketing site (the `app/` and `components/` directories at the repository root, excluding `app/account/**`). The member account dashboard (`app/account/**`) and the separate `aimsadmin/**` admin application must remain visually and functionally unchanged, including protection from any unintended cascading effects caused by the shared `app/globals.css` token file.

## Glossary

- **Public_Site**: The set of Next.js routes and their rendering components that are publicly reachable and are not part of the member account dashboard. Includes, but is not limited to: `/` (home), `/about`, `/services`, `/practice-areas`, `/projects`, `/partnerships`, `/publications`, `/team`, `/blog`, `/blog/[slug]`, `/contact`, `/membership`, `/search`, and the not-found (404) page. Also includes shared layout components rendered on every Public_Site page: `Header`, `Footer`, `LanguageSwitcher`, `SearchDropdown`, `ChatWidget`, `CookieBanner`, `BookConsultation`, and the "go to top" button.
- **Account_Dashboard**: The set of routes and components under `app/account/**`, including `app/account/layout.tsx` and all pages it renders (dashboard, services, appointments, messages, settings).
- **Admin_App**: The separate application under `aimsadmin/**`, built and served independently from the Next.js app.
- **Navy_Theme**: The single, consistent set of navy blue color values used as the primary background and brand color across the Public_Site (for example, the shade values currently represented by `#0F2B4A`, `#1a3d5c`, `#0a1d32`, and the `sky-*` Tailwind tokens defined in `app/globals.css`), including a small number of graduated navy shades used for layering foreground panels/cards on top of a navy background.
- **Semantic_Status_Color**: A color used only to convey functional meaning unrelated to branding, such as error (red), success (green), warning/pending (amber). Semantic_Status_Colors are excluded from the "navy blue is the only primary color" rule.
- **Primary_Surface**: Any section, page background, card, panel, header, footer, or call-to-action band on the Public_Site whose color communicates brand identity (as opposed to conveying status/validation).
- **Shared_Theme_Tokens**: The CSS custom properties defined in `app/globals.css` (the `--color-sky-*` values and the `body` text color) that are loaded once by the root layout and are available to every route rendered under `app/`, including Account_Dashboard.
- **Contrast_Ratio**: The WCAG relative luminance contrast ratio between a text color and the background color it is rendered on.

## Requirements

### Requirement 1: Sitewide Navy Dark Theme on Public Pages

**User Story:** As a site visitor, I want every public page to use a consistent navy blue dark theme, so that the site feels cohesive and no page abruptly switches to a white/light background.

#### Acceptance Criteria

1. THE Public_Site SHALL render every page background and section background using a Navy_Theme color as the Primary_Surface.
2. WHERE a page or section currently renders a white or light-gray Primary_Surface (including but not limited to backgrounds implemented with `bg-white`, `bg-gray-50`, `bg-gray-100`, `bg-sky-50`, or hardcoded near-white hex values), THE Public_Site SHALL replace that Primary_Surface with a Navy_Theme color.
3. IF the replacement of a white or light-gray Primary_Surface with a Navy_Theme color is incomplete or fails for a given page or section, THEN THE Public_Site SHALL continue to render that page or section with its existing white or light-gray Primary_Surface rather than failing to render.
4. THE Public_Site SHALL apply the Navy_Theme to the following routes and their rendered sections: home, about, services, practice-areas, projects, partnerships, publications, team, blog list, blog detail, contact, membership, search, and the not-found (404) page.
5. THE Public_Site SHALL apply the Navy_Theme to the shared layout components rendered across Public_Site pages, including Header, Footer, LanguageSwitcher, SearchDropdown, ChatWidget, CookieBanner, and BookConsultation.
6. WHEN a new Public_Site page or section is added after this change, THE Public_Site SHALL use a Navy_Theme Primary_Surface consistent with the rest of the site.

### Requirement 2: Single Navy Color Family as the Only Primary Color

**User Story:** As a brand stakeholder, I want navy blue to be the only primary color across the redesigned site, so that the visual identity stays consistent and no competing brand colors are introduced.

#### Acceptance Criteria

1. THE Public_Site SHALL use color values from a single defined Navy_Theme palette for every Primary_Surface, button, link accent, and section divider that conveys brand identity.
2. THE Public_Site SHALL NOT introduce a new non-navy brand accent color as part of this redesign.
3. WHERE a Semantic_Status_Color is required to convey validation, error, success, or pending state, THE Public_Site SHALL retain the existing Semantic_Status_Color and SHALL NOT treat it as a Primary_Surface subject to the navy-only rule.
4. THE Public_Site SHALL consolidate existing hardcoded navy hex literals (for example `#0F2B4A`, `#1a3d5c`, `#1a3f5e`, `#0a1d32`) and the `sky-*` Tailwind tokens into the same Navy_Theme palette so that all navy usages resolve to the same defined set of shades.
5. IF the consolidation of navy hex literals and `sky-*` tokens into a single Navy_Theme palette is incomplete or fails for a given file, THEN THE Public_Site SHALL launch with the inconsistent navy shades in that file rather than blocking release of the redesign.

### Requirement 3: Readable Text on Dark Navy Backgrounds

**User Story:** As a site visitor, I want text and key content to remain clearly readable after the dark navy redesign, so that I can read page content without strain.

#### Acceptance Criteria

1. THE Public_Site SHALL render body text with a Contrast_Ratio of at least 4.5:1 against the Navy_Theme background it is displayed on.
2. THE Public_Site SHALL render heading text and other large-scale text (at or above 24px, or 19px bold) with a Contrast_Ratio of at least 3:1 against the Navy_Theme background it is displayed on.
3. WHERE existing text color is a dark color intended for a light background (for example `#1a1a1a`, `#333333`, `text-gray-500`, `text-gray-400`), THE Public_Site SHALL replace that text color with a light or white color that meets the Contrast_Ratio thresholds defined in Acceptance Criteria 3.1 and 3.2, and SHALL NOT replace it with a different dark color that fails those thresholds.
4. THE Public_Site SHALL visually distinguish section boundaries and cards from the surrounding page background (for example through a lighter/darker navy shade, border, or subtle shadow) so that individual sections and notable content (such as engagement highlights, credentials, and stats) remain visually distinct and readable rather than blending into a single flat surface.

### Requirement 4: Consistent Interactive and Hover States

**User Story:** As a site visitor, I want hover, focus, and active states on links, buttons, and cards to look correct on the new dark navy background, so that interactive elements remain clear and usable.

#### Acceptance Criteria

1. THE Public_Site SHALL apply hover, focus, and active state styling to interactive elements using colors from the Navy_Theme palette or light/white foreground colors, consistent with a dark background.
2. WHERE an interactive element currently uses a light-background hover style (for example `hover:bg-sky-50`, `hover:bg-gray-50`, `hover:bg-gray-100`), THE Public_Site SHALL replace that hover style with a Navy_Theme-consistent alternative that remains visible against the dark background.
3. WHEN a user hovers, focuses, or activates an interactive element on the Public_Site, THE Public_Site SHALL maintain a Contrast_Ratio of at least 4.5:1 between the element's text/icon color and its background color in that state.
4. THE Public_Site SHALL NOT apply Public_Site hover/interactive style changes to any element rendered within the Account_Dashboard or the Admin_App.

### Requirement 5: Exclusion of the Account Dashboard

**User Story:** As a logged-in member, I want my account dashboard to keep its current appearance, so that the dark theme redesign of the marketing site does not disrupt my dashboard experience.

#### Acceptance Criteria

1. THE Account_Dashboard SHALL retain its current visual appearance and shall not receive the Navy_Theme Primary_Surface changes described in Requirement 1.
2. IF a change to Shared_Theme_Tokens in `app/globals.css` would alter the rendered color of any element within the Account_Dashboard, THEN THE Public_Site redesign SHALL avoid that change by scoping new navy styling to Public_Site components/classes rather than redefining Shared_Theme_Tokens relied upon by the Account_Dashboard, regardless of any other reason offered for making the change.
3. THE Public_Site redesign SHALL NOT modify files under `app/account/**`.
4. WHEN the Navy_Theme redesign is implemented, THE Account_Dashboard SHALL render with the same background colors, text colors, and component styling it used before the redesign.

### Requirement 6: Exclusion of the Admin Application

**User Story:** As an administrator, I want the aimsadmin application to remain unaffected by the public site redesign, so that admin workflows continue to look and behave exactly as before.

#### Acceptance Criteria

1. THE Public_Site redesign SHALL NOT modify any file under `aimsadmin/**`.
2. THE Admin_App SHALL render with the same background colors, text colors, and component styling it used before the Public_Site redesign.

### Requirement 7: Scope Boundaries of the Redesign

**User Story:** As the development team, I want a clear, explicit boundary for which files and directories are in scope, so that the redesign cannot accidentally leak into excluded areas.

#### Acceptance Criteria

1. THE Public_Site redesign SHALL be limited to files within the `app/` directory (excluding `app/account/**`) and the `components/` directory at the repository root.
2. THE Public_Site redesign SHALL treat `app/account/**` and `aimsadmin/**` as out of scope for all style, markup, and token changes.
3. IF a shared component or shared style token is explicitly used by both the Public_Site and the Account_Dashboard, THEN THE Public_Site redesign SHALL introduce a Public_Site-scoped alternative (new class, token, or component variant) so that the Account_Dashboard is unaffected; introducing this alternative does not prohibit also changing the original shared definition, provided the change does not alter the Account_Dashboard's rendered appearance.
4. THE Public_Site redesign restrictions in Acceptance Criteria 7.3 apply only to components and style tokens explicitly shared with the Account_Dashboard, and SHALL NOT be extended to unrelated base styles or utilities that the Account_Dashboard does not consume.
