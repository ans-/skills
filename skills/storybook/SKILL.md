---
name: storybook
description: Generate personalized illustrated storybooks with custom artwork. Supports 4-10 pages (default 6), age-appropriate text length (3-18 years), and multiple art styles. Use when creating picture books, children's storybooks, or illustrated stories.
---

# Storybook Skill

Generate personalized illustrated storybooks with cover, story pages, and custom artwork.

## Workflow

Creating a storybook involves these steps:

1. Gather requirements (theme, age, pages, style)
2. Generate story structure (title, cover, pages)
3. Create illustrations with generate_image tool
4. Output complete storybook

## Step 1: Gather Requirements

Before generating, confirm these parameters:

| Parameter  | Options                                                          | Default         |
| ---------- | ---------------------------------------------------------------- | --------------- |
| Theme      | User-provided story topic                                        | Required        |
| Target Age | 3-18 years                                                       | 6 years         |
| Page Count | 5-10 pages                                                       | 6 pages         |
| Art Style  | watercolor, cartoon, pixel-art, claymation, comic, coloring-book | cartoon         |
| Language   | Any supported language                                           | User's language |

## Step 2: Generate Story Structure

### Text Length Guidelines (by age)

| Age Range   | Characters per Page |
| ----------- | ------------------- |
| 0-3 years   | 10-20               |
| 4-6 years   | 20-40               |
| 7-9 years   | 40-70               |
| 10-18 years | 70-100              |

### Story Structure

1. **Cover Page**: Title + subtitle + cover illustration
2. **Opening** (1-2 pages): Introduce characters and setting
3. **Development** (2-4 pages): Build the story, introduce conflict
4. **Climax** (1-2 pages): Peak of the story
5. **Resolution** (1 page): Conclusion with positive message

### Output Format

## Page N: [Page Title]

![Page N](page_n.png)

[Story text appropriate for target age]

---

**Illustration Prompt**: [Detailed prompt for generate_image]

```

## Step 3: Create Illustrations

For each page, use `generate_image` tool with consistent:

- **Character descriptions**: Same appearance throughout
- **Art style**: Match user's chosen style
- **Color palette**: Child-friendly, cohesive
- **Composition**: Clear focal point, simple backgrounds

### Cover Illustration Guidelines

For the cover image, follow these rules:

- **Include**: Title and subtitle text only
- **Exclude**: Author names, publisher info, watermarks, or any other text
- Prompt should explicitly specify "No author name, no publisher info, no watermarks, title only"

### Illustration Prompt Template

```

[Art style] illustration for children's book. [Scene description].
Characters: [Character details for consistency].
Style: [Specific style notes]. Warm, friendly colors, child-appropriate.
No text, no words, no labels. (For cover: include title and subtitle only, no author info)

```

### Language in Illustrations

If the storybook has a specified language, ensure any text appearing in illustrations (signs, books, banners, etc.) matches that language:

| Language | Example Text   |
| -------- | -------------- |
| zh-Hans  | 中文标题       |
| en       | English Title  |
| ja       | 日本語タイトル |

## Step 4: Output

Create in the specified output directory:

```

[story-name]/
├── story.json # Story metadata and content
├── story.md # Human-readable story document
├── cover.png/jpg # Cover illustration
├── page_1.png/jpg # Page illustrations
├── page_2.png/jpg
└── ...

````

### story.md Format

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

### story.json Format

Generate a `story.json` file with this structure:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
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
````

**Fields:**

- `id`: Unique identifier for the story (UUID v4 format, e.g., "550e8400-e29b-41d4-a716-446655440000")
- `title`: Main story title
- `subtitle`: A short phrase describing the story theme (e.g., "一个关于勇气与爱的故事")
- `cover_image`: Filename of cover illustration
- `style`: Art style used, one of: `watercolor`, `cartoon`, `pixel-art`, `claymation`, `comic`, `coloring-book`, `other`
- `target_age`: Integer from 0-18, representing the target age of the reader
- `tags`: Array of one or more category tags (in English):
  - `Emotions` - Help children identify and express emotions, learn to manage negative feelings, build psychological resilience
  - `Habits` - Focus on daily life skills like brushing teeth, using the toilet, sleeping on time, and tidying up
  - `Science` - Cover nature, universe, human body, and technology knowledge to spark curiosity and exploration
  - `Social` - Explore friendship, sharing, teamwork, and how to resolve peer conflicts
  - `Cognition` - For younger children, teach colors, shapes, numbers, letters, and basic object recognition
  - `Life` - Involve birth, growth, aging, and understanding of death, guiding children to respect and love life
  - `Character` - Cultivate core values and personality traits like honesty, bravery, kindness, and responsibility
  - `Art` - Inspire aesthetic sense and creativity through colors, composition, and unique visual styles
  - `Adventure` - Imaginative fantasy journeys that encourage children to face the unknown and develop problem-solving skills
  - `Family` - Depict love and connection among family members, enhancing children's sense of security and belonging
  - `Story` - Narrative-driven tales with engaging plot development
  - `Idiom` - Stories based on Chinese idioms (成语), teaching cultural wisdom and moral lessons through classic tales
  - `Fable` - Fables and parables (寓言) that convey life lessons through allegorical characters and events
- `language`: Language code (zh-Hans, en, ja, etc.)
- `pages[]`: Array of page objects
  - `page_title`: Optional page title/chapter name
  - `text`: Story text for this page
  - `image`: Filename of page illustration
  - `image_description`: Prompt used for image generation

**JSON Format Requirements:**

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
> - Left double quote: `“` (U+201C)
> - Right double quote: `”` (U+201D)
> - Example: `“你好”` instead of `\"你好\"`

## Example Usage

**User**: Create a storybook about a brave little mouse for my 5-year-old

**Response structure**:

1. Confirm: 6 pages, age 5 (20-40 chars/page), cartoon style
2. Generate story with cover + 5 story pages
3. Create illustrations for each page
4. Output complete storybook

## Art Style References

| Style         | Description                                         |
| ------------- | --------------------------------------------------- |
| watercolor    | Soft, flowing colors with visible brushstrokes      |
| cartoon       | Bold outlines, bright colors, expressive characters |
| pixel-art     | Retro 8-bit/16-bit style                            |
| claymation    | 3D clay-like textured characters                    |
| comic         | Panel-style with dynamic poses                      |
| coloring-book | Black outlines only, for printing and coloring      |

For detailed story templates, see [references/story-templates.md](references/story-templates.md).
