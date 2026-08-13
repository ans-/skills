---
name: podcast-lang-mark
description: Annotate podcast shows in an xlsx/csv export with lang_target / lang_from ISO language codes, a confidence score, and a self-updating Excel SQL-update formula column, judging each show from its title, author, and summary. Use whenever the user wants podcast show languages judged and filled in — 标注/标出/推测播客节目的语言, "podcast show 数据标注", label podcast languages, fill empty lang_target/lang_from columns, annotate a pod_shows export, or generate per-row update pod_shows SQL — even when they only hand over a spreadsheet of shows (id, title, author, summary) and ask for the language columns to be completed. Not for translating show content, analyzing already-labeled data, or non-podcast spreadsheets.
---

# Podcast Language Marking

Given a spreadsheet where each row is a podcast show (`id`, `title`, `author`, `summary`, plus empty `lang_target` / `lang_from` / `confidence` / `sql` columns — the last two are appended automatically if absent), infer the language fields for every row and write them back into the same file.

## Field semantics

| Field | Meaning |
| --- | --- |
| `lang_target` | ISO 639-1 two-letter code of the show's **audio content**. For language-learning shows: the language being taught. Never empty after annotation. |
| `lang_from` | The **scaffold language** — the language used to explain, or the audience's native language when the show demonstrably addresses that audience. Empty string for single-language shows. |
| `confidence` | One joint score in [0, 1], two decimals, covering both fields. |
| `sql` | A live Excel formula so hand-edits to `lang_target`/`lang_from` regenerate the statement instantly. |

The formula the `sql` column must contain (column letters vary with the sheet):

```
="update pod_shows set lang_target = '"&F2&"', lang_from = '"&G2&"', updated_at = CURRENT_TIMESTAMP where id = '"&A2&"' ;"
```

## Judgment rules — where naive labeling goes wrong

The single biggest trap: **an English summary does not mean `lang_from = 'en'`**. Immersion / comprehensible-input shows (Miku Real Japanese, Nihongo con Teppei, InnerFrench …) write English summaries as international marketing while the audio is 100% target language. For those, `lang_from` stays `''`. Only fill `lang_from` on positive evidence:

- **Explicit statement** — "completely in Spanish", "I will only speak German" (→ from=''); "英語と日本語の解説が入ります" (→ en/ja). Gold signal, confidence 0.90+.
- **Summary written in the learners' native language** — a Japanese-language summary for an English-conversation show means Japanese-speaking audience → `en`/`ja`. Same for Korean, Chinese, etc.
- **Ecosystem clues** — WeChat 公众号 / QQ group → Chinese audience; a translation/transcript-translation offering implies a bilingual product; Patreon/ko-fi alone implies an international (usually English-scaffolded or immersion) audience and proves nothing by itself.
- **True-beginner courses** ("absolute basics", A1, "from zero") almost always need a scaffold language. If the summary is in English, lean `lang_from='en'` but cap confidence ≤ 0.70 — the show may still be slow-immersion.

Other rules:

- Non-language-learning shows (true-crime, self-help, tech talk…) get the content language as `lang_target`, `lang_from=''`.
- Well-known brands may be judged on brand knowledge (BBC Learning English, VOA Learning English → `en`/`''`, 0.90+).
- Codes are lowercase ISO 639-1: Norwegian `no`, Persian `fa`, Portuguese `pt` (no pt-BR variants — two letters only).
- One confidence covers both fields, so "target certain, scaffold guessy" lands at 0.55–0.70, not 0.90. Reserve ≤ 0.50 for title-only guesses (empty/useless summary).

Judge from title/author/summary only — no web lookups unless the user asks; say so in the report.

## Workflow

Scripts live in `scripts/` next to this file. `dump` is stdlib-only; `fill` needs openpyxl (bootstrap: `python3 -m venv <scratch>/venv && <scratch>/venv/bin/pip install openpyxl`, then run with the venv python). If the input is a csv, load it into a new xlsx with openpyxl first.

1. **Dump** — `python3 scripts/langmark.py dump <file.xlsx>` → JSON of every row. Read all of it; do not sample.
2. **Judge** every row by the rules above; write `annotations.json` in the scratchpad:
   `[{"id": "...", "lang_target": "ja", "lang_from": "", "confidence": 0.78}, ...]`
3. **Fill** — `python scripts/langmark.py fill <file.xlsx> annotations.json [--table pod_shows]`. Writes values, appends missing columns, sets the sql formula, and refuses to save unless every row is annotated.
4. **Verify** — `dump` again; formulas come back as `=...` strings, so confirm the sql column references the right column letters and spot-check a row with empty `lang_from` (must render `lang_from = ''`).
5. **Report** (this is a judgment task — the user must be able to audit you):
   - State the interpretation used for `lang_from` (scaffold-language reading, marketing-English trap handling).
   - Distribution table: rows per `lang_target`, how many bilingual.
   - **Review list**: every row with confidence ≤ 0.62, with id, title, chosen values, and the specific doubt.
   - Surface any policy-level calls the user may want reversed (e.g. non-language shows, whether "audience native language" should fill `lang_from` for immersion shows) and offer to re-run with the flipped policy.

Excel note: openpyxl writes formulas without cached values. The file computes fine in Excel/Numbers/WPS, but a script reading it with `data_only=True` sees `None` until a spreadsheet app has saved it once. If the user wants a standalone `.sql` file, generate it from the annotation values, not by reading the formula cells back.
