# Мобильный концепт главной

Мобильная версия концепта главной страницы Банки.ру — для исследования с респондентами.

Прототип на React (Vite + TypeScript). Основной вьюпорт — мобильный.
Правила работы — [AGENTS.md](AGENTS.md).

## Запуск

```bash
npm install
npm run dev
```

Дизайн-система ставится из приватного репозитория GitHub. Если `npm install`
падает на `design-system` — один раз на компьютере: `gh auth login` и
`gh auth setup-git`, а если в ошибке `git@github.com` —
`git config --global url."https://github.com/AlexaDIS211/design-system".insteadOf "ssh://git@github.com/AlexaDIS211/design-system"`.

Local — адрес для компьютера, Network — для телефона в той же Wi-Fi.

| Команда | Что делает |
|---|---|
| `npm run dev` | прототип локально, правки видны сразу |
| `npm run check` | проверка типов — ошибок быть не должно |
| `npm run build` | сборка, как на Vercel |

## Экраны

| Маршрут | Экран | Документация |
|---|---|---|
| `/` | главная: баннеры каруселью, быстрые ссылки, продукты | [docs/screens/main.md](docs/screens/main.md) |
| `/main-v3` | главная, вариант 3: баннеры лентой с наклоном | [docs/screens/main.md](docs/screens/main.md#вариант-3-лента-с-наклоном) |
| `/main-v4` | главная, вариант 4: у соседних баннеров размыта иллюстрация | [docs/screens/main.md](docs/screens/main.md#вариант-4-размыта-иллюстрация) |
| `/canvas` | доска со всеми экранами, не для респондентов | [docs/screens/canvas.md](docs/screens/canvas.md) |
| `/kit` | ведет на сайт дизайн-системы | — |
| любой другой | «Такого экрана нет», служебный | [docs/screens/not-found.md](docs/screens/not-found.md) |

## Сценарий

`/`, `/main-v3` и `/main-v4` — три варианта главной, отличаются только баннерами: на `/main-v3` другой слайдер, на `/main-v4` у соседних баннеров размыта иллюстрация. Респондент смотрит баннеры, листает их и быстрые ссылки.

## Где что лежит

- `src/screens/<экран>/` — экраны, по папке на экран
- `src/routes.tsx` — список экранов и их маршрутов
- `src/components/` — свои компоненты прототипа, если понадобились; общие — из
  дизайн-системы `@banki/design-system`
- `src/data/` — контент и тексты, в том числе `canvas.ts` — содержимое доски
- `src/canvas.tsx` — служебный `/canvas`: доска из дизайн-системы
- `public/` — свои картинки прототипа, в `public/assets/images/<прототип>/`
- `docs/` — экраны, изменения, архитектура, git
- `node_modules/@banki/design-system/` — дизайн-система: гайды компонентов
  `docs/components/`, правила текстов `docs/tone-of-voice.md`, словарь Фигмы
  `docs/figma-map.md`, данные витрин `docs/content/`, исходники `src/`
- `_sources/` — выгрузки из Фигмы, в сборку не идут

## Дизайн-система

Пакет `@banki/design-system`, версия — тег в `package.json`. Обновить —
командой
`npm install "git+https://github.com/AlexaDIS211/design-system.git#vX.Y.Z"` с нужным тегом — одной правки тега в `package.json` мало, npm оставит версию из lock-файла. Что изменилось — Releases репозитория
`design-system`. Правка компонента — пулл-реквестом в `design-system`, не здесь.

## Деплой

`git push` в `main` → Vercel. Один раз при подключении проекта в Vercel —
переменная `DS_GITHUB_TOKEN` (Settings → Environment Variables): токен GitHub
только на чтение репозитория `design-system`. Без нее Vercel не скачает
дизайн-систему — `scripts/vercel-install.sh` напишет об этом в логе сборки.

| Ветка | Что | Ссылка |
|---|---|---|
| `main` | основной сценарий, для респондентов | <ссылка> |
