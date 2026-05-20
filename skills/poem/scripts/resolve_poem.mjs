#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(__dirname, "..");
const dataPath = path.join(skillDir, "references", "primary-poems.json");
const poems = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const imageSpec = {
  width: 1024,
  height: 1536,
  aspectRatio: "2:3",
  orientation: "portrait",
};
const imageSpecPrompt = `Target image size: ${imageSpec.width} x ${imageSpec.height} px. Aspect ratio: ${imageSpec.aspectRatio} ${imageSpec.orientation}. Use this exact canvas size when the image tool supports explicit dimensions; otherwise state this target clearly in the prompt and avoid square, landscape, or cropped layouts.`;

const args = process.argv.slice(2);
const promptMode = args.includes("--prompt");
const query = args.filter((arg) => arg !== "--prompt").join(" ").trim();

if (!query) {
  console.error("Usage: node scripts/resolve_poem.mjs <id-or-title> [--prompt]");
  process.exit(2);
}

const normalize = (value) =>
  String(value)
    .replace(/[（(].*?[）)]/g, "")
    .replace(/[·.\s《》〈〉，。！？、：:；;“”"']/g, "")
    .toLowerCase();

const toGradeNumber = (grade) => {
  const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
  return map[String(grade).replace("年级", "")] ?? String(grade).replace("年级", "");
};

const toSemesterCode = (semester) => (semester === "上册" ? "a" : semester === "下册" ? "b" : semester);

let match = null;
const isNumericQuery = /^\d+$/.test(query);
if (isNumericQuery) {
  match = poems.find((poem) => poem.id === Number(query));
} else {
  const wanted = normalize(query);
  match =
    poems.find((poem) => normalize(poem.title) === wanted) ??
    poems.find((poem) => normalize(poem.title).includes(wanted) || wanted.includes(normalize(poem.title)));
}

if (!match) {
  if (!isNumericQuery) {
    const fallback = {
      found: false,
      title: query,
      suggestedFilename: `poem-${normalize(query) || "untitled"}.png`,
      imageSpec,
    };

    if (!promptMode) {
      console.log(JSON.stringify(fallback, null, 2));
      process.exit(0);
    }

    console.log(`Generate a high-resolution vertical Chinese educational poster for an ancient poem lesson.

${imageSpecPrompt}

Poem lookup status:
- The title "${query}" was not found in the bundled primary-poems.json dataset.
- Do not include grade, semester, textbook volume, or sequence number anywhere in the image.
- Use the title exactly as provided by the user: ${query}
- suggested output filename: ${fallback.suggestedFilename}

The poster must include clear, readable Chinese text and pinyin annotation above every Chinese character in the poem.

Required title section:
Large title: ${query}

Required content sections:
1. 古诗原文: include the standard text of ${query} if known, with pinyin annotation. If the exact text is uncertain, create the poster around the title and explanation sections without inventing textbook metadata.
2. 作者简介: concise student-friendly biography with a tasteful Chinese-style author portrait illustration when the author is known.
3. 写作背景: explain the historical/cultural context in simple Chinese.
4. 词语小注: explain important words from the poem or title.
5. 诗词含义: explain the poem line by line when text is known, then add a short summary of the feeling or theme.

Visual style:
Chinese classical education poster, vertical layout, printable high-resolution image, rice-paper texture, elegant ink painting details suited to the poem title, clear section borders, no messy overlap, no cropped text, no watermark.

Text accuracy rules:
Do not invent grade, semester, textbook volume, or sequence number. Keep all Chinese text legible. Use standard Mandarin pinyin with tone marks or tone numbers consistently.`);
    process.exit(0);
  }

  const wanted = normalize(query);
  const suggestions = poems
    .filter((poem) => normalize(poem.title).includes(wanted) || wanted.includes(normalize(poem.title)))
    .slice(0, 8)
    .map(({ id, grade, semester, title, author }) => ({ id, grade, semester, title, author }));

  console.error(JSON.stringify({ error: "Poem not found", query, suggestions }, null, 2));
  process.exit(1);
}

const suggestedFilename = `${toGradeNumber(match.grade)}-${toSemesterCode(match.semester)}-${match.id}.png`;
const result = { ...match, suggestedFilename, imageSpec };

if (!promptMode) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log(`Generate a high-resolution vertical Chinese educational poster for a primary-school ancient poem lesson.

${imageSpecPrompt}

Poem metadata:
- id: ${match.id}
- grade: ${match.grade}
- semester: ${match.semester}
- title: ${match.title}
- author: ${match.author}
- suggested output filename: ${suggestedFilename}

The poster must include clear, readable Chinese text and pinyin annotation above every Chinese character in the poem.

Required poem section:
Title: ${match.grade}${match.semester} · 第${match.id}首
Large title: ${match.title}
Author: ${match.author}
Poem text:
${match.content}

Required explanation sections:
1. 作者简介: concise student-friendly biography with a tasteful Chinese-style author portrait illustration.
2. 写作背景: explain the historical/cultural context in simple Chinese.
3. 词语小注: explain important words from the poem.
4. 诗词含义: explain the poem line by line, then add a short summary of the feeling or theme.

Visual style:
Chinese classical education poster, vertical layout, printable high-resolution image, rice-paper texture, elegant ink painting details, restrained festive accents when appropriate to the poem, clear section borders, no messy overlap, no cropped text, no watermark.

Text accuracy rules:
Use the poem text above exactly. Do not invent extra poem lines. Keep all Chinese text legible. If pinyin is uncertain, use standard Mandarin pinyin with tone marks or tone numbers consistently.`);
