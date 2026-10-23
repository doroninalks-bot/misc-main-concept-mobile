/**
 * Контент главной: баннеры героя, быстрые ссылки и плитки «Наши продукты».
 * Макет — Фигма 9bgbzWfk084WSVi7eU3awY: экран — 22682:28402, баннеры и
 * быстрые ссылки — 22713:55662.
 */

const IMAGES = "/assets/images/misc-main-concept-mobile"
const PRODUCTS = `${IMAGES}/products`

export type BannerId = "account" | "deposit" | "deposit-grey"

export interface Banner {
  id: BannerId
  title: string
  text: string
}

/**
 * Баннеры героя — каруселью по центру, по кругу. Цвет, подсветка и иллюстрация
 * у каждого свои — в `src/screens/main/banner.css` по `id`.
 */
export const banners: Banner[] = [
  { id: "account", title: "Войдите в аккаунт", text: "Получите персональные предложения" },
  { id: "deposit", title: "Вклад с Банки.ру выгоднее", text: "Бонус до\u00a0+1,5% к\u00a0ставке банка" },
  { id: "deposit-grey", title: "Вклад с Банки.ру выгоднее", text: "Бонус до\u00a0+1,5% к\u00a0ставке банка" },
]

/** С какого баннера начинается карусель */
export const BANNER_START = 0

/** Через сколько баннер сменяется сам — столько же идет полоса в пагинации */
export const HERO_INTERVAL_MS = 6000

export interface ProductArt {
  src: string
  left: number
  top: number
  width: number
  /** По умолчанию квадрат */
  height?: number
  rotate?: number
  /** Кадр из картинки, в процентах рамки — как «Crop» в Фигме */
  crop?: { left: number; top: number; width: number; height: number }
}

export interface Product {
  id: string
  title: string
  text?: string
  tag?: string
  /** Тег из макета: розовый — «Бонус 3000 Б», иначе сиреневый; `wide` — поля 12 у коротких */
  tagTone?: "pink" | "lilac"
  tagWide?: boolean
  /** `tall` — плитка 248 вместо 120 */
  tall?: boolean
  surface: "gray" | "promo" | "accent"
  /** Слои иллюстрации — координаты в плитке 168 из макета */
  art: ProductArt[]
  /** Круглая кнопка со стрелкой вместо подписи — «Все продукты» */
  arrow?: boolean
}

export interface Shortcut {
  id: string
  /** Перенос строки — как в макете */
  label: string
  tag?: string
  surface: "promo" | "accent"
  /** Слои иллюстрации — координаты в плашке 80 × 80 из макета */
  art: ProductArt[]
}

/**
 * Быстрые ссылки под поиском: плашка с иллюстрацией и подпись, лента
 * листается пальцем. Макет — «Вариант 10», 22711:55364. Пятую ссылку из
 * макета — повтор «Оформите ОСАГО» с кошельком — дизайнер убрал.
 */
export const shortcuts: Shortcut[] = [
  {
    id: "app",
    label: "Скачайте\nприложение",
    tag: "Без\u00a0%",
    surface: "promo",
    art: [{ src: `${PRODUCTS}/products.png`, left: -13.6, top: -13.6, width: 132.6, rotate: -3.98 }],
  },
  {
    id: "deposit-bonus",
    label: "Бонус\nк\u00a0ставке",
    surface: "accent",
    art: [{ src: `${PRODUCTS}/wallet.png`, left: -6, top: 3, width: 114 }],
  },
  {
    id: "osago",
    label: "Оформите\nОСАГО",
    surface: "accent",
    // Три слоя группы из макета: щит, тень-подставка и машина
    art: [
      {
        src: `${PRODUCTS}/is-small.png`,
        left: 11.1,
        top: 15.9,
        width: 32.5,
        height: 36.5,
        crop: { left: -20.51, top: -5.02, width: 387.69, height: 345.21 },
      },
      { src: `${PRODUCTS}/kasko-base.png`, left: 4.8, top: 52.2, width: 72.7, height: 28.7 },
      {
        src: `${PRODUCTS}/kasko.png`,
        left: 22.5,
        top: 11.9,
        width: 79.5,
        height: 90.7,
        crop: { left: -49.56, top: -49.03, width: 181.94, height: 159.46 },
      },
    ],
  },
  {
    id: "loan",
    label: "Получи\nзайм",
    surface: "accent",
    art: [{ src: `${PRODUCTS}/coins-percent.png`, left: -8, top: -1, width: 113 }],
  },
]

const SUBTITLE = "Решение за 5 минут"

/** Плитки «Наши продукты» в две колонки: у «Вкладов» и «Кредитов» нет подписи — так в макете */
export const productColumns: Product[][] = [
  [
    {
      id: "deposits",
      title: "Вклады",
      tag: "Бонус 3000 Б",
      tagTone: "pink",
      tall: true,
      surface: "promo",
      art: [{ src: `${PRODUCTS}/coins.png`, left: -20, top: 19, width: 268 }],
    },
    {
      id: "currency",
      title: "Курсы валют",
      text: SUBTITLE,
      surface: "gray",
      art: [{ src: `${PRODUCTS}/currency.png`, left: 35, top: 5, width: 165 }],
    },
    {
      id: "osago",
      title: "ОСАГО",
      text: SUBTITLE,
      tag: "Кэшбэк",
      surface: "gray",
      // Три слоя группы из макета: щит, тень-подставка и машина
      art: [
        {
          src: `${PRODUCTS}/is-small.png`,
          left: 82.5,
          top: 52.8,
          width: 38.9,
          height: 43.7,
          crop: { left: -20.51, top: -5.02, width: 387.69, height: 345.21 },
        },
        { src: `${PRODUCTS}/kasko-base.png`, left: 75, top: 96.2, width: 86.9, height: 34.3 },
        {
          src: `${PRODUCTS}/kasko.png`,
          left: 96.2,
          top: 48,
          width: 95.1,
          height: 108.5,
          crop: { left: -49.56, top: -49.03, width: 181.94, height: 159.46 },
        },
      ],
    },
    {
      id: "mortgage-insurance",
      title: "Ипотечное страхование",
      tag: "Кэшбэк",
      surface: "gray",
      art: [
        {
          src: `${PRODUCTS}/is.png`,
          left: 79,
          top: 49,
          width: 114,
          height: 100.8,
          crop: { left: -37.34, top: -61.23, width: 165.07, height: 186.67 },
        },
      ],
    },
  ],
  [
    {
      id: "credits",
      title: "Кредиты",
      tag: "Без %",
      tagWide: true,
      surface: "gray",
      art: [{ src: `${PRODUCTS}/coins-percent.png`, left: 68, top: 37, width: 118 }],
    },
    {
      id: "loans",
      title: "Займы",
      text: SUBTITLE,
      tag: "Бонус",
      tagWide: true,
      surface: "gray",
      art: [{ src: `${PRODUCTS}/wallet.png`, left: 76, top: 47, width: 113 }],
    },
    {
      id: "cards",
      title: "Банковские карты",
      text: SUBTITLE,
      tag: "Бонус 3000 Б",
      tagTone: "pink",
      tall: true,
      surface: "promo",
      art: [{ src: `${PRODUCTS}/cards.png`, left: 11, top: 33, width: 218 }],
    },
    {
      id: "all",
      title: "Все продукты",
      surface: "accent",
      art: [{ src: `${PRODUCTS}/products.png`, left: 55.2, top: 18.2, width: 156.1, rotate: -3.98 }],
      arrow: true,
    },
  ],
]
