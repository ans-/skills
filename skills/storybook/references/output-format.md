# Output Format Reference

Detailed format specifications for storybook output files.

## Directory Structure

```
[story-name]/
├── story.json      # Story metadata and content
├── story.md        # Human-readable story document
├── cover.png/jpg   # Cover illustration
├── page_1.png/jpg  # Page illustrations
├── page_2.png/jpg
└── ...
```

## story.md Format

Generate a `story.md` file with this structure:

```markdown
# [Story Title]

**[Subtitle]**

![封面](cover.png)

---

## 第 1 页：[Page Title]

![第一页](page_1.png)

[Story text for page 1]

---

## 第 2 页：[Page Title]

![第二页](page_2.png)

[Story text for page 2]

---

... (repeat for each page)
```

**Format Rules:**

- **Title**: Use `#` heading with story title
- **Subtitle**: Bold text describing the theme (e.g., `**小东和小花的冬日科学探险**`)
- **Cover**: Embed cover image with `![封面](cover.png)`
- **Page separator**: Use `---` between pages
- **Page heading**: Use `## 第 N 页：[Page Title]` format
- **Page image**: Embed with `![第N页](page_n.png)` before the text
- **Page text**: Story content appropriate for target age

## story.json Format

Generate a `story.json` file with this structure:

```json
{
  "id": "a9108b2f-7a01-4ba2-bc13-278b0a3fd75e",
  "title": "绘本标题",
  "subtitle": "一句话描述故事主题",
  "cover_image": "cover.png",
  "style": "cartoon",
  "target_age": 6,
  "tags": ["Emotions", "Family"],
  "language": "zh-Hans",
  "pages": [
    {
      "page_title": "分页标题（如果有的话）",
      "text": "这是第一页的故事内容...",
      "image": "page_1.png",
      "image_description": "插画描述"
    }
  ]
}
```

### Fields

- `id`: UUID v4 format. Generate with: `bash scripts/generate_uuid.sh`
- `title`: Main story title
- `subtitle`: Short phrase describing the theme (e.g., "一个关于勇气与爱的故事")
- `cover_image`: Filename of cover illustration
- `style`: One of: `watercolor`, `cartoon`, `pixel-art`, `claymation`, `comic`, `coloring-book`, `other`
- `target_age`: Integer 0-18
- `tags`: One or more category tags (in English), see [Tags Reference](#tags-reference)
- `language`: Language code (zh-Hans, en, ja, etc.)
- `pages[]`: Array of page objects
  - `page_title`: Optional page title/chapter name
  - `text`: Story text for this page
  - `image`: Filename of page illustration
  - `image_description`: Prompt used for image generation

### Tags Reference

| Tag         | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `Emotions`  | Identify and express emotions, manage negative feelings, build resilience |
| `Habits`    | Daily life skills: brushing teeth, toilet training, sleeping, tidying up  |
| `Science`   | Nature, universe, human body, technology — spark curiosity                |
| `Social`    | Friendship, sharing, teamwork, resolving peer conflicts                   |
| `Cognition` | Colors, shapes, numbers, letters, basic object recognition                |
| `Life`      | Birth, growth, aging, death — respect and love for life                   |
| `Character` | Honesty, bravery, kindness, responsibility — core values                  |
| `Art`       | Aesthetic sense and creativity through colors, composition, visual styles |
| `Adventure` | Fantasy journeys, facing the unknown, problem-solving                     |
| `Family`    | Love among family members, security and belonging                         |
| `Story`     | Narrative-driven tales with engaging plot development                     |
| `Idiom`     | Chinese idioms (成语) — cultural wisdom and moral lessons                 |
| `Fable`     | Fables and parables (寓言) — life lessons through allegory                |

### JSON Format Requirements

> [!IMPORTANT]
> The generated `story.json` must be valid JSON. Escape special characters in string values:
>
> - Double quotes (`"`) → `\"`
> - Backslash (`\`) → `\\`
> - Newlines → `\n`
> - Tabs → `\t`
>
> For Chinese (zh-Hans / zh-Hant) and Japanese (ja) text content, use CJK quotation marks instead of ASCII double quotes:
>
> - Left double quote: `"` (U+201C)
> - Right double quote: `"` (U+201D)
> - Example: `"你好"` instead of `\"你好\"`
