import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

// Токены, шрифты и стили всех компонентов дизайн-системы — одним файлом
import "@banki/design-system/styles.css"
import { initCanvasEmbed, initTheme } from "@banki/design-system"

import { App } from "./app"

initTheme()
// Пинч над экраном в рамке «Страниц сайта» зумит доску, а не вкладку
initCanvasEmbed()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
