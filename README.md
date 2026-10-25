# Harshad Dike — Portfolio

A responsive React + TypeScript portfolio for Harshad Laxman Dike, a Software Developer in Pune, India. It includes a custom architecture illustration, a categorized technical skills library with genuine vendor marks, and factual sections for experience, projects, research, education, certifications, contact, and FAQs.

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Design foundations

The visual system uses deep navy surfaces, electric blue for primary emphasis, restrained violet highlights, and subtle borders. Space Grotesk is used for headings, Inter for body copy, and JetBrains Mono for technical labels. Shared color, typography, spacing, radius, border, shadow, and transition tokens are in `src/index.css`.

Dark mode is the default; the header control switches themes and saves the preference in local storage. Keyboard focus styles, reduced-motion preferences, print styling, and responsive navigation are supported.

The hero architecture illustration uses a subtle looping motion treatment, and page sections randomly reveal from above, below, or with a restrained pop as they enter the viewport. These effects are disabled when reduced motion is requested.

## Functional notes

- Search is local to the page; use the header control or `Ctrl+K` / `Cmd+K`.
- Contact details can be copied and the contact form prepares a draft in the visitor's email app. This static site does not claim to deliver a message or have a configured form service.
- The resume link is omitted because no resume PDF is included.
- No cookie banner or UTM tracking is included because the site does not use cookies or analytics.
- The footer's last-updated date is maintained in `portfolioUpdatedAt` in `src/data/portfolio.ts`.
