#!/bin/sh
# Установка на Vercel. Дизайн-система — приватный репозиторий на GitHub, у
# Vercel к нему нет доступа. Токен из переменной DS_GITHUB_TOKEN (только чтение
# репозитория design-system) подставляется в адреса GitHub — и npm забирает
# пакет по https, в том числе когда в package-lock записан ssh-адрес.
set -e

if [ -z "$DS_GITHUB_TOKEN" ]; then
  echo "Нет переменной DS_GITHUB_TOKEN: добавьте ее в Vercel → Settings → Environment Variables" >&2
  exit 1
fi

AUTH="https://x-access-token:${DS_GITHUB_TOKEN}@github.com/"
git config --global url."$AUTH".insteadOf "ssh://git@github.com/"
git config --global --add url."$AUTH".insteadOf "git@github.com:"
git config --global --add url."$AUTH".insteadOf "https://github.com/"

npm ci
