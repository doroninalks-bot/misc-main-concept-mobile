/**
 * Контент главной: баннеры героя, быстрые ссылки и плитки «Наши продукты».
 * Макет — Фигма 9bgbzWfk084WSVi7eU3awY: герой — раздел 12 (22878:39553),
 * быстрые ссылки и плитки — раздел 9 (22797:43970).
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
 * Баннеры героя — каруселью по центру, по кругу, в порядке макета (раздел 12):
 * серый, синий, фиолетовый. Градиент и иллюстрация у каждого свои — в
 * `src/screens/main/banner.css` по `id`, цвета фона — в `hero.tsx`.
 */
export const banners: Banner[] = [
  { id: "deposit-grey", title: "Вклад с Банки.ру выгоднее", text: "Бонус до\u00a0+1,5% к\u00a0ставке банка" },
  { id: "deposit", title: "Вклад с Банки.ру выгоднее", text: "Бонус до\u00a0+1,5% к\u00a0ставке банка" },
  { id: "account", title: "Войдите в аккаунт", text: "Получите персональные предложения" },
]

/** С какого баннера начинается карусель — с фиолетового «Войдите в аккаунт» */
export const BANNER_START = 2

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
  /** Слои иллюстрации — координаты в плашке 80 × 80 из макета */
  art: ProductArt[]
}

/**
 * Быстрые ссылки под поиском: плашка с иллюстрацией и подпись, лента
 * листается пальцем. Макет — раздел 9, 22797:44016. Пятую ссылку из макета —
 * повтор «Оформите ОСАГО» с кошельком — дизайнер убрал.
 */
export const shortcuts: Shortcut[] = [
  {
    id: "app",
    label: "Скачайте\nприложение",
    art: [{ src: `${PRODUCTS}/tag-purple.png`, left: -13, top: -8, width: 117 }],
  },
  {
    id: "deposit-bonus",
    label: "Бонус\nк\u00a0ставке",
    art: [{ src: `${PRODUCTS}/wallet-purple.png`, left: -16.76, top: -2.55, width: 107.47 }],
  },
  {
    id: "loan",
    label: "Получи\nзайм",
    art: [{ src: `${PRODUCTS}/coins-purple.png`, left: -11, top: -1, width: 115 }],
  },
  {
    id: "osago",
    label: "Оформите\nОСАГО",
    // Три слоя группы из макета: щит, перевернутая подставка и машина — кадры
    // из одной картинки
    art: [
      { src: `${PRODUCTS}/shield-purple.png`, left: -13.95, top: 14.05, width: 40.17, height: 41.72 },
      {
        src: `${PRODUCTS}/osago-purple.png`,
        left: -20.45,
        top: 55.76,
        width: 89.38,
        height: 49.9,
        rotate: 180,
        crop: { left: -29.54, top: -19.05, width: 228.28, height: 409.52 },
      },
      {
        src: `${PRODUCTS}/osago-purple.png`,
        left: 8.56,
        top: 11.16,
        width: 103.44,
        height: 105.05,
        crop: { left: -48.25, top: -55.56, width: 167.32, height: 164.75 },
      },
    ],
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
      art: [{ src: `${PRODUCTS}/save.png`, left: -22.5, top: 15, width: 275 }],
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
      art: [{ src: `${PRODUCTS}/coins-purple.png`, left: 65, top: 34, width: 127 }],
    },
    {
      id: "loans",
      title: "Займы",
      text: SUBTITLE,
      tag: "Бонус",
      tagWide: true,
      surface: "gray",
      art: [{ src: `${PRODUCTS}/wallet-purple.png`, left: 67, top: 36, width: 127 }],
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
