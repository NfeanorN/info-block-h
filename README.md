# Инфомат (info-block-h)

Информационный киоск поликлиники: навигация, НПА, расписание врачей, оценка персонала.

Стек как у HospitalLine: Next.js 16, React 19, Tailwind CSS 4, TypeScript, i18n (kk/ru).

## Запуск

```powershell
npm install
npm run dev
```

Откройте http://localhost:3000

## Экраны

- `/` — главная
- `/navigation` — навигация по поликлинике
- `/legal` — нормативно-правовая информация
- `/schedule` — расписание врачей
- `/appeal` — оценка персонала / обращения

Данные пока в моках (`src/lib/data`). Обращения сохраняются в `localStorage`.
