# 엔딩 배경 이미지 생성 프롬프트

## 공통 스타일 지침

모든 프롬프트 앞에 아래 스타일을 붙여주세요:

```
16-bit pixel art RPG game background, 1280x720, wide landscape,
fantasy medieval setting, soft lighting, no characters, no text, no UI,
clean composition suitable for overlaying text dialogue box
```

---

## 1. bg_battle — 전투/투기장

**사용 엔딩**: 강철의 전사, 마검사, 수호기사, 투기장의 챔피언

```
A grand stone colosseum arena at golden hour,
circular fighting pit with sand floor,
tall stone walls with banners and torch brackets,
rows of wooden spectator seats rising up,
dramatic sunset sky with orange and purple clouds visible above the open roof,
scattered weapons and shields on the arena floor,
dust particles floating in warm light beams
```

---

## 2. bg_library — 도서관/마법탑

**사용 엔딩**: 현자의 길, 치유의 마법사, 연금술사

```
Interior of a tall magical library tower at night,
towering dark wooden bookshelves reaching the ceiling on both sides,
floating glowing orbs providing soft blue and purple ambient light,
a large arched window showing a starry night sky with a crescent moon,
scattered open spellbooks and scrolls on wooden tables,
mystical runes faintly glowing on the stone floor,
glass potion bottles and alchemical flasks on shelves,
cozy and mysterious atmosphere
```

---

## 3. bg_forest — 숲/자연

**사용 엔딩**: 공감의 시인, 자급자족 사냥꾼, 드루이드

```
A magical enchanted forest clearing in early morning,
massive ancient oak trees with thick trunks and lush green canopy,
soft golden sunlight filtering through the leaves creating god rays,
a small sparkling stream running through moss-covered rocks,
wildflowers in purple, blue, and white scattered across the grass,
tiny glowing fireflies and floating pollen in the air,
a fallen mossy log in the foreground,
peaceful and serene atmosphere
```

---

## 4. bg_market — 시장/광장

**사용 엔딩**: 황금의 상인, 음유시인, 길드 마스터

```
A bustling medieval fantasy town marketplace at midday,
colorful fabric awnings over wooden merchant stalls,
cobblestone plaza with a decorative stone fountain in the center,
half-timbered buildings with flower boxes lining the square,
hanging shop signs with sword, potion, and bread icons,
wooden crates, barrels, and sacks of goods displayed,
warm bright daylight with clear blue sky,
lively and prosperous atmosphere, no people shown
```

---

## 5. bg_village — 마을/집

**사용 엔딩**: 마을의 수호자, 발명가, 평범한 하루

```
A cozy medieval fantasy village at peaceful dusk,
small thatched-roof cottages with warm light glowing from windows,
a winding dirt path between the houses,
wooden fences with small vegetable gardens,
a well-maintained stone wall surrounding the village,
rolling green hills in the background,
soft pink and orange sunset sky with a few clouds,
smoke gently rising from chimneys,
warm, safe, and homely atmosphere
```

---

## 6. bg_lazy — 여관 침대

**사용 엔딩**: 나태한 모험가 (배드 엔딩)

```
Interior of a messy medieval tavern bedroom,
a rumpled unmade wooden bed with wrinkled sheets and blankets,
a small dusty window with faded curtains letting in dim grey afternoon light,
empty ale mugs and food crumbs on a bedside table,
clothes and boots scattered on the wooden plank floor,
cobwebs in the corner of the stone walls,
a single melted-down candle on a plate,
gloomy, lazy, and slightly depressing atmosphere
```

---

## 7. bg_hero — 왕성/대전

**사용 엔딩**: 진정한 용사, 전설의 영웅 (히든/트루 엔딩)

```
A majestic royal throne room in a grand fantasy castle,
tall marble pillars lined on both sides leading to an ornate golden throne,
a long red velvet carpet stretching down the center aisle,
enormous stained glass windows casting colorful light beams across the floor,
royal banners in deep blue and gold hanging from the ceiling,
polished marble floor reflecting the light,
grand chandelier with magical floating crystals overhead,
epic, glorious, and awe-inspiring atmosphere
```

---

## 사용 방법

1. **공통 스타일 지침**을 앞에 붙이고, 각 배경 프롬프트를 뒤에 이어 붙여서 사용
2. 이미지 생성 도구: ChatGPT (DALL-E), Midjourney, Stable Diffusion 등
3. 생성 후 1280x720으로 리사이즈, WebP로 변환하여 200KB 이하로 최적화

### 예시 (완성 프롬프트)

```
16-bit pixel art RPG game background, 1280x720, wide landscape,
fantasy medieval setting, soft lighting, no characters, no text, no UI,
clean composition suitable for overlaying text dialogue box.
A grand stone colosseum arena at golden hour, ...
```

### Midjourney 사용 시 추가 파라미터

```
--ar 16:9 --style raw --v 6
```

### Stable Diffusion 사용 시 네거티브 프롬프트

```
Negative: people, characters, text, UI elements, watermark,
signature, blurry, low quality, modern objects, 3D render
```
