# skills

Useful Skills for Codex and other agents.

## Quick Install

```bash
# Install all skills
npx skills add ans-/skills

# Install a specific skill
npx skills add ans-/skills --skill storybook
npx skills add ans-/skills --skill poem
```

## Skills

| Skill | Description |
| --- | --- |
| `storybook` | Creates personalized illustrated storybooks for children, including story structure, age-appropriate text, custom artwork prompts, and output files such as `story.json`, `story.md`, cover, and page images. |
| `poem` | Generates Chinese ancient poem explanation posters from a bundled 112-poem primary-school dataset or a title-only fallback. Accepts a poem id or title, prepares direct image-generation prompts with pinyin, author bio, writing background, vocabulary notes, and line-by-line meaning, uses a standard `1024 x 1536` portrait `2:3` target, and omits grade/semester metadata when the title is outside the dataset. |
| `xhs-travel-city` | Creates a Xiaohongshu-ready city travel route package from a city name, including a structured route-map image prompt, direct Codex image generation guidance, draft post copy, and a confirmation-before-publishing workflow. |
