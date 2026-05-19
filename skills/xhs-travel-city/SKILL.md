---
name: xhs-travel-city
description: "Use when the user provides a city name and wants a Xiaohongshu-ready travel route infographic workflow: generate a JSON image prompt, call Codex image generation directly for a high-resolution route map, draft a concise emoji-rich Xiaohongshu note, ask for confirmation, then publish online with xhs."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [xiaohongshu, travel, image-generation, codex, route-map, social-media]
    related_skills: [xiaohongshu-cli]
---

# XHS Travel City

## Overview

This skill turns a user-provided city name into a complete Xiaohongshu travel-note package:

1. Generate a structured JSON prompt for a city travel route infographic.
2. Call the native Codex image generation tool directly to create a high-resolution route-map image.
3. Draft a concise Xiaohongshu爆款笔记文案 with clear sections and emoji.
4. Send both image and copy to the user for review.
5. Only after explicit user confirmation, publish the image note online with `xhs post`.

The workflow is designed for city itinerary posts such as “西安三日游路线图”, “洛阳三日路线图”, or “杭州两日citywalk”.

## When to Use

Use this skill when the user says things like:

- “为 <城市> 生成小红书旅行路线图并发布”
- “做一张 <城市> 三日游攻略图，再写小红书文案”
- “城市名：西安，生成图片和小红书笔记，确认后发线上”
- “按照之前那个旅行路线图流程做”

Do **not** use this skill for:

- Pure copywriting with no image generation.
- Travel planning where the user wants detailed factual verification instead of a visual guide.
- Non-Xiaohongshu publishing targets.
- Cases where the user explicitly forbids posting or only wants a draft.

## Inputs

Minimum input:

- City name, e.g. `西安`, `洛阳`, `杭州`.

Optional user-provided parameters:

- Days: default `3日` if omitted.
- Theme: default `经典行程`; examples: `亲子`, `博物馆`, `美食`, `citywalk`, `古迹`, `自然风光`.
- Style: default `复古手绘与水彩、米色羊皮纸底、边缘轻微火漆纹`.
- Aspect ratio: default `portrait` for Xiaohongshu first image.
- Posting preference: title/body/hashtags, if provided.

If the user only provides a city name, choose sensible defaults and proceed without asking:

- `days = 3`
- `type = 旅行路线图`
- `goal = 自媒体攻略首图与打印折页封面`
- `style = 复古手绘与水彩、米色羊皮纸底，边缘有轻微火漆纹`
- `aspect_ratio = portrait`

## Workflow

### Step 1 — Build the JSON prompt

Create a JSON object before image generation. It should include:

```json
{
  "type": "旅行路线图",
  "goal": "生成一张<城市>三日经典行程的可视化路线图，作为自媒体攻略首图与打印折页封面",
  "style": "复古手绘与水彩、米色羊皮纸底，边缘有轻微火漆纹",
  "title_section": {
    "title_text": "<城市>三日·<主题短语>",
    "subtitle": "D1–D3 穿越<城市文化意象>的动线"
  },
  "route": {
    "transport": "根据城市选择：地铁 + 公交 + 步行 / 高铁 + 地铁 + 公交 + 步行",
    "stops": [
      "D1 ...",
      "D2 ...",
      "D3 ..."
    ],
    "line_style": "朱红实线示当日主线，靛青虚线示跨区机动段，圆点编号与日期同色"
  },
  "stop_illustrations": "每处站点配小插画：...",
  "side_panel": {
    "enabled": "true",
    "position": "右侧竖栏",
    "content_type": "每日要点 3 天 × 2–3 条"
  },
  "side_panel_bullets": {
    "D1": ["...", "...", "..."],
    "D2": ["...", "...", "..."],
    "D3": ["...", "...", "..."]
  },
  "legend": {
    "items": [
      "朱红实线：当日主动线",
      "靛青虚线：地铁/公交",
      "绿色八角：必去世界遗产/5A看点",
      "小叶子：可喝茶歇脚或体验非遗处"
    ]
  },
  "extras": [
    "和纸罗盘在左上",
    "小字注：为手绘示意，请结合导航App使用"
  ],
  "constraints": {
    "must_keep": [
      "D1→D3 顺序自洽、方位大致合理",
      "每站有图与名",
      "侧栏不挤压主图路线"
    ],
    "avoid": [
      "一天塞入过度景点",
      "路线标签压在插画之上",
      "五种以上线型",
      "水印或logo",
      "英文乱码"
    ]
  }
}
```

For well-known cities, choose classic 3-day routes with sensible clustering:

- D1: city center / old town / food street.
- D2: one major outlying heritage or scenic area.
- D3: museums / parks / night-view district / return-friendly route.

If live factual precision matters (opening days, show times, ticket rules), verify with web tools. Otherwise label such details as “建议” rather than guaranteed facts.

### Step 2 — Convert JSON prompt to Codex image prompt

Use the JSON as source of truth. Convert it into a single detailed prompt for the native `image_generate` tool.

Required image generation settings:

- Tool: `image_generate`
- Aspect ratio: `portrait`
- Style: direct Codex generation, no external image skill required.
- Prompt must explicitly say:
  - “直接生成一张高清大图中文旅行路线图海报”
  - “整张图由 Codex 直接生成”
  - “复古手绘与水彩风格，米色羊皮纸底纹”
  - “不要水印，不要logo，不要英文乱码”

Important limitation:

- AI image models may distort dense Chinese text. Still include the requested Chinese text in the prompt, but warn the user if the generated image has text issues. If the user wants exact printable Chinese text, offer a deterministic local-layout version in a follow-up; do not use it in this direct-Codex workflow unless the user approves.

### Step 3 — Generate the image directly with Codex

Call:

```python
image_generate(
  aspect_ratio="portrait",
  prompt="<full prompt derived from JSON>"
)
```

Do not call `baoyu-imagine`, `baoyu-infographic`, browser-based image tools, or local drawing scripts for the direct-Codex version.

### Step 4 — Draft Xiaohongshu copy

After the image is generated, draft a concise Xiaohongshu爆款笔记文案:

Requirements:

- Chinese.
- Short and punchy.
- Clear paragraph breaks.
- Emoji-rich but not cluttered.
- Include route by day.
- Include 3–5 useful tips.
- Include hashtags at the end.
- Avoid exaggerated false claims.

Template:

```text
<城市><天数>游路线图整理好了📍  
第一次来<城市>，照着这条走就很稳！

Day1️⃣ <主题线>  
<景点A> → <景点B> → <景点C>  
<一句氛围描述>✨

Day2️⃣ <主题线>  
<景点A> → <景点B> → <景点C>  
<一句体验建议>👀

Day3️⃣ <主题线>  
<景点A> → <景点B> → <景点C>  
<一句收尾亮点>🌙

✅ 小Tips  
📌 <tip1>  
📌 <tip2>  
📌 <tip3>  
📌 <tip4>

<一句收藏引导>💛

#<城市>旅游 #<城市>攻略 #<城市><天数>游 #旅行路线图 #周末去哪儿
```

### Step 5 — Send preview and ask for confirmation

Send the generated image and copy to the user in the same response.

Use the platform media mechanism:

```text
MEDIA:/absolute/path/to/generated.png
```

Then ask for explicit confirmation before posting:

```text
老板，确认这版图片和文案可以直接发小红书吗？回复“确认发布”我再发线上；如果要改，我可以先改标题、路线、图片风格或文案。
```

Never publish online in the same turn as the first preview unless the user has already explicitly approved the exact image and copy.

### Step 6 — Publish to Xiaohongshu after confirmation

When the user replies with explicit approval such as:

- “确认发布”
- “可以发”
- “直接发线上”
- “就用这版”

Load or follow the `xiaohongshu-cli` workflow.

Before any `xhs` command, check authentication:

```bash
xhs status --yaml >/dev/null && echo "AUTH_OK" || echo "AUTH_NEEDED"
```

If auth is needed, stop and ask the user to authenticate:

```bash
xhs login --qrcode
```

If authenticated, publish:

```bash
xhs post --title "<title>" --body "<body>" --images /absolute/path/to/image.png
```

After posting, report the result, including note URL or note ID if returned by the CLI. If the CLI does not return a URL, say so and include the raw success identifier.

## Title Rules for Posting

Generate short titles suitable for Xiaohongshu:

- `<城市>三日游路线图｜第一次去照着走`
- `<城市>3天2晚攻略📍路线图整理好了`
- `第一次去<城市>怎么玩？这张路线图收好`

Keep title concise; avoid too many hashtags in the title.

## Common Pitfalls

1. **Publishing without confirmation.** Always preview image + copy first. Only post after explicit approval.

2. **Using other image skills when direct Codex was requested.** If the user says “不要使用其他skill” or “调用codex直接生成”, use only `image_generate` for the image.

3. **Overloading the route.** Three days should feel realistic. Avoid packing too many distant attractions into one day.

4. **Dense Chinese text may be imperfect in image output.** If text fidelity matters, offer deterministic post-processing as a separate option after the direct-Codex draft.

5. **Skipping auth check before posting.** Always run `xhs status` first. Do not ask for raw cookies.

6. **Too-long Xiaohongshu copy.** Keep paragraphs short and mobile-friendly. Emojis should guide scanning, not overwhelm.

7. **Forgetting to send the actual image.** Use `MEDIA:/absolute/path.png`, not just a path or description.

## Verification Checklist

Before sending preview:

- [ ] JSON prompt created internally and city/day/theme are clear.
- [ ] `image_generate` was called directly with `aspect_ratio="portrait"`.
- [ ] No external image skill or local drawing script was used for direct-Codex generation.
- [ ] Generated image path is available and sent with `MEDIA:`.
- [ ] Xiaohongshu copy has clear Day1/Day2/Day3 sections.
- [ ] Copy uses emojis and concise paragraphs.
- [ ] User is asked to confirm before online posting.

Before posting:

- [ ] User explicitly confirmed this exact image and copy.
- [ ] `xhs status` returned authenticated.
- [ ] `xhs post` includes title, body, and image path.
- [ ] Result URL/ID is reported to the user.
