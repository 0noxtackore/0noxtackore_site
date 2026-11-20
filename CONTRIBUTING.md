# Contributing to 0NOXTACKORE

Thank you for your interest in contributing to the official **0NOXTACKORE** website repository (`0noxtackore/0noxtackore_site`). Contributions that improve quality, accessibility, performance, documentation, or correctness are welcome.

## Ways to contribute

- **Report issues** — Bugs, broken layouts, accessibility problems, or incorrect content/metadata.
- **Suggest improvements** — UX, performance, SEO, or documentation enhancements.
- **Submit pull requests** — Focused fixes or improvements aligned with the project’s goals and design.

For significant changes, consider opening an issue first so we can align on scope and approach.

## Development setup

### Prerequisites

- [Node.js](https://nodejs.org/) 24+
- npm

### Getting started

```bash
git clone https://github.com/0noxtackore/0noxtackore_site.git
cd 0noxtackore_site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Quality checks

Before submitting a pull request, please ensure the project passes all checks:

```bash
npm run check   # lint + typecheck + build
```

You can also run individual commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Guidelines

- **Keep changes focused** — One logical change per pull request is easier to review.
- **Follow existing patterns** — Match the structure, naming, and style used in the codebase (Next.js App Router, TypeScript strict, Tailwind CSS v4).
- **Be careful with content and branding** — This repository represents the official 0NOXTACKORE website; avoid speculative or inaccurate claims.
- **Do not include secrets** — Never commit credentials, private keys, or sensitive configuration.

## Pull requests

1. Create a branch from `main`.
2. Make your changes and run `npm run check`.
3. Write a clear commit message describing the change.
4. Open a pull request against `main` with a concise summary of what changed and why.
5. Link any related issues when applicable.

## Questions

If you have questions about contributing, please open an issue in this repository or reach out through the official channels listed in the [README](README.md#official-channels).

---

© 2026 0NOXTACKORE
