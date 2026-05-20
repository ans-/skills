---
name: poem
description: Use when generating Chinese primary-school ancient poem explanation posters or images from a poem id or title, especially requests mentioning 古诗讲解图, 拼音注音, 作者简介, 写作背景, 词语小注, 诗词含义, or bundled primary-poems.json.
---

# Poem Skill

Generate Chinese primary-school ancient poem explanation images from the bundled poem dataset.

## Bundled Data

- Poem dataset: `references/primary-poems.json`
- Lookup helper: `scripts/resolve_poem.mjs`

The dataset uses English keys:

| Key | Meaning |
| --- | --- |
| `id` | poem sequence number |
| `grade` | Chinese primary grade |
| `semester` | 上册 / 下册 |
| `title` | poem title |
| `author` | dynasty and author |
| `content` | poem text with line breaks |

## Workflow

1. Resolve the poem by id or title:

   ```bash
   node skills/poem/scripts/resolve_poem.mjs 41
   node skills/poem/scripts/resolve_poem.mjs 元日
   node skills/poem/scripts/resolve_poem.mjs 将进酒
   ```

   If a non-numeric title is not found in `primary-poems.json`, the helper returns a fallback object instead of failing. Fallback posters must omit grade, semester, textbook volume, and sequence number.

2. If generating an image, ask for a ready-to-use prompt:

   ```bash
   node skills/poem/scripts/resolve_poem.mjs 41 --prompt
   node skills/poem/scripts/resolve_poem.mjs 将进酒 --prompt
   ```

3. Use the Codex image generation tool directly unless the user asks for deterministic HTML/SVG rendering.

4. Save the chosen generated image to the requested path. If the user does not provide a filename, use the helper's `suggestedFilename`, where `a` means 上册 and `b` means 下册 for matched dataset poems. Fallback title-only prompts use `poem-<title>.png`.

5. Inspect the generated image before final response. Check at least:
   - title and author when known
   - id, grade, and semester only for poems found in the bundled dataset
   - poem text is present and not cropped
   - pinyin annotation is visible
   - explanation sections include 作者简介, 写作背景, 词语小注, 诗词含义
   - layout has no major text overlap

## Poster Content Requirements

Every poem explanation image should include:

- title area: poem title and author when known
- for matched dataset poems only: grade, semester, and id
- poem section: exact poem text from `primary-poems.json` for matched dataset poems, or the standard known text for fallback title-only poems, with pinyin annotation
- author section: short student-friendly biography plus a Chinese-style portrait illustration
- writing background: cultural or historical context in simple Chinese
- word notes: key vocabulary from the poem
- meaning section: line-by-line explanation plus a short theme summary

For text-heavy posters, prefer a vertical printable composition with clear section boundaries. Keep the visual style tied to the poem: 春节 imagery for `元日`, moon/night imagery for `静夜思`, landscape for mountain or river poems, farming scenes for `悯农`, and so on.

## Accuracy Notes

- The bundled JSON is the source of truth for poem id, grade, semester, title, author, and poem text.
- If a user provides a poem title that is not in the bundled JSON, do not block generation. Generate a title-only explanation poster and omit all grade, semester, textbook volume, and sequence metadata.
- Do not change poem text silently. If a requested poem name matches multiple entries, show the candidates and ask the user to choose.
- Pinyin is generated during prompt/image creation; verify obvious polyphones manually for the target poem when possible.
- Direct image generation may distort dense Chinese text. If the user requires exact text fidelity, offer deterministic rendering as a separate option.
