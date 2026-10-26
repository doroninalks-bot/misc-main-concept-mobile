import type { CSSProperties } from "react"

import { cx, maskIcon } from "@banki/design-system"

import type { Product, ProductArt } from "@/data/main"

import "./product-tiles.css"

/**
 * «Наши продукты»: плитки в две колонки, сверху вниз — как в макете. Общие у
 * обоих вариантов главной, отличаются только данные: тексты и иллюстрации.
 */
export function ProductTiles({ columns }: { columns: Product[][] }) {
  return (
    <section className="product-tiles" aria-labelledby="product-tiles-title">
      <h1 id="product-tiles-title" className="text-h1">
        Наши продукты
      </h1>
      <div className="product-tiles__grid">
        {columns.map((column, index) => (
          <div key={index} className="product-tiles__column">
            {column.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductTile({ product }: { product: Product }) {
  return (
    <a
      href="#"
      className={cx(
        "product-tile",
        `product-tile--${product.surface}`,
        product.tall && "product-tile--tall",
        product.arrow && "product-tile--arrow",
      )}
      onClick={(event) => event.preventDefault()}
    >
      {product.art.map((layer, index) => (
        <ArtLayer key={index} layer={layer} />
      ))}
      <span className="product-tile__title text-h4">{product.title}</span>
      {product.text && <span className="product-tile__text text-body-12">{product.text}</span>}
      {product.tag && (
        // Не Tag дизайн-системы: тег в точности из макета — решение дизайнера
        <span
          className={cx(
            "product-tile__tag text-body-12 text-medium",
            `product-tile__tag--${product.tagTone ?? "lilac"}`,
            product.tagWide && "product-tile__tag--wide",
          )}
        >
          {product.tag}
        </span>
      )}
      {product.arrow && (
        <span className="product-tile__arrow">
          <span className="product-tile__arrow-icon" style={maskIcon("/assets/icons/navigation/arrow-right-24.svg")} />
        </span>
      )}
    </a>
  )
}

/**
 * Слой иллюстрации: рамка из макета, внутри — картинка целиком или кадр из нее.
 * Нужен и быстрым ссылкам главной — там те же иллюстрации.
 */
export function ArtLayer({ layer, className }: { layer: ProductArt; className?: string }) {
  const { left, top, width, height = width, rotate, crop } = layer
  const style = {
    left,
    top,
    width,
    height,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  } as CSSProperties

  if (!crop) return <img className={cx("product-tile__art", className)} src={layer.src} alt="" style={style} />

  return (
    <span className={cx("product-tile__art product-tile__art--crop", className)} style={style}>
      <img
        src={layer.src}
        alt=""
        style={{ left: `${crop.left}%`, top: `${crop.top}%`, width: `${crop.width}%`, height: `${crop.height}%` }}
      />
    </span>
  )
}
