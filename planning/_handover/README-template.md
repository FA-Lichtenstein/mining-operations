# Portfolio research — template & handover protocol

Local agent tasks (PR-XX) produce HTML research docs under `planning/`. This folder holds handover markdown and shared conventions.

---

## Shared CSS fragment

Copy the `<style>` block below into every new HTML deliverable (or start from [`_template.html`](../_template.html)). Source of truth: [`ukwazi-services-summary.html`](../ukwazi-services-summary.html).

```css
:root {
  --text: #1a1a1a;
  --muted: #555;
  --accent: #2c5f2d;
  --border: #ddd;
  --bg-soft: #f7f9f7;
}
* { box-sizing: border-box; }
body {
  font-family: "Segoe UI", system-ui, sans-serif;
  line-height: 1.55;
  color: var(--text);
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}
h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
h2 {
  font-size: 1.2rem;
  margin-top: 2rem;
  margin-bottom: 0.6rem;
  color: var(--accent);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.25rem;
}
h3 { font-size: 1rem; margin: 1.25rem 0 0.4rem; }
p, li { font-size: 0.95rem; }
.meta {
  color: var(--muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}
.lead {
  font-size: 1.02rem;
  background: var(--bg-soft);
  border-left: 4px solid var(--accent);
  padding: 0.85rem 1rem;
  margin: 1rem 0 1.5rem;
}
ul { padding-left: 1.25rem; margin: 0.4rem 0 0.8rem; }
li { margin-bottom: 0.35rem; }
dl { margin: 0.5rem 0; }
dt { font-weight: 600; margin-top: 0.6rem; }
dd { margin: 0.15rem 0 0.5rem 0; color: var(--text); }
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin: 0.75rem 0 1rem;
}
th, td {
  border: 1px solid var(--border);
  padding: 0.45rem 0.6rem;
  text-align: left;
  vertical-align: top;
}
th { background: var(--bg-soft); font-weight: 600; }
.tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--accent);
  margin-right: 0.35rem;
}
.portfolio-box {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem 1.1rem;
  margin-top: 0.75rem;
}
.portfolio-box h3 { margin-top: 0; color: var(--accent); }
a { color: var(--accent); }
code {
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 0.85em;
  background: var(--bg-soft);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
footer {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--muted);
}
```

The registry [`index.html`](../index.html) adds `.status`, `.status-complete`, `.status-pending`, and `.planned-output` for task tracking only.

---

## Using `_template.html`

1. Copy `../_template.html` to the **planned output filename** shown in your registry row (e.g. `cv-ukwazi-alignment.html` for PR-03). Do not invent alternate slugs.
2. Replace HTML comments with real content.
3. Fill meta line: task ID, date, upstream deps.
4. Write executive summary in `.lead`.
5. Add body sections appropriate to the task (Wave 1 = web research; Wave 2 = chapter-bounded source summary).
6. Complete the **Portfolio relevance scorecard** (see [theme-taxonomy.md](theme-taxonomy.md)).
7. Add one paragraph **Suggested Angular+Firebase sketch**.
8. Update footer with your PR-XX handover path.

---

## Row-ID protocol for `index.html`

PR-01 pre-seeded empty rows for all tasks. **Agents must only edit their own row** to avoid merge conflicts when tasks run in parallel.

| Rule | Detail |
|------|--------|
| Row ID | `id="pr-XX"` (lowercase, hyphenated; PR-07b → `id="pr-07b"`) |
| Editable cells | Status, output path, last-updated only |
| Do not | Add/remove rows, reorder tables, edit other agents' rows, or change the page-level registry date |
| Planned output | Pending rows show `<span class="planned-output">filename.html</span>` — use that exact filename when creating your HTML |
| On complete | Set status to `complete`, replace planned span with `<a href="filename.html">filename.html</a>`, set last-updated to `YYYY-MM-DD` |

Example — after completing PR-03, update only:

```html
<tr id="pr-03">
  ...
  <td><span class="status status-complete">complete</span></td>
  ...
  <td><a href="cv-ukwazi-alignment.html">cv-ukwazi-alignment.html</a></td>
  <td>2026-05-28</td>
</tr>
```

---

## Handover markdown format

Every task produces `PR-XX.md` (PR-07b → `PR-07b.md`).

```markdown
# PR-XX — {Task title}

## Inputs read
- `path/to/file` — brief note
- https://example.com — brief note

## Key findings
- Bullet 1
- Bullet 2
- … (5–10 bullets)

## Open questions / risks
- Question or risk 1
- …

## Recommended next tasks
- PR-YY — why it unblocks or follows on
- …
```

Handover docs are **machine-readable**: the next agent should need no chat history.

---

## Related files

| File | Purpose |
|------|---------|
| [theme-taxonomy.md](theme-taxonomy.md) | T1–T6 definitions, scorecard columns, composite formula |
| [../index.html](../index.html) | Task registry |
| [../_template.html](../_template.html) | Blank HTML skeleton |
| [../ukwazi-services-summary.html](../ukwazi-services-summary.html) | Anchor reference doc (registered by PR-02) |
