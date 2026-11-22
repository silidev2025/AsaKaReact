// The changelog page (/changelog), opened from the version number in the
// status bar. It shows CHANGELOG.md from the project folder, one card per
// version. To add release notes, edit CHANGELOG.md; this page updates itself.
//
// "?raw" at the end of the import gives the file's text instead of running it.
// "marked" turns Markdown (# headings, - lists) into HTML.

import { marked, type Token, type TokensList } from "marked";
import { APP } from "../../config/app";
import { ROUTES } from "../../config/routes";
import changelogMarkdown from "../../../CHANGELOG.md?raw";
import s from "./ChangelogPage.module.css";

/**
 * Splits the changelog into one HTML card per version. A new card starts at
 * every "## version" heading. The file's own "# Changelog" title is left out,
 * because the page already has that heading.
 */
function splitIntoEntries(markdown: string) {
  const tokens = marked.lexer(markdown);
  const entries: Token[][] = [];

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 2) {
      entries.push([token]); // start a new card
    } else if (entries.length > 0) {
      entries[entries.length - 1]?.push(token); // add to the current card
    }
    // Anything before the first "##" (the title, blank lines) is skipped.
  }

  // marked.parser needs the link list from the whole file to resolve links.
  return entries.map((entry) =>
    marked.parser(Object.assign(entry, { links: tokens.links }) as TokensList),
  );
}

const ENTRIES = splitIntoEntries(changelogMarkdown);

export default function ChangelogPage() {
  return (
    <main className={s.page}>
      <a href={ROUTES.home} className={s.backLink}>
        Back to {APP.name}
      </a>

      <header className={s.hero}>
        <p className={s.eyebrow}>Release notes</p>
        <h1>Changelog</h1>
        <p>
          {APP.name} is a living document and is updated regularly, especially
          every term, to reflect latest changes in course offerings, room
          status, and other relevant information. Aside from the data itself,
          the website also undergoes improvements to provide a better user
          experience. Below are the major updates and changes made to{" "}
          {APP.name} since its initial release.
        </p>
      </header>

      <div className={s.entries}>
        {ENTRIES.map((html, index) => (
          // dangerouslySetInnerHTML puts ready-made HTML on the page. Only
          // use it with text you trust; here it's our own CHANGELOG.md.
          <article
            key={index}
            className={s.entry}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </main>
  );
}
