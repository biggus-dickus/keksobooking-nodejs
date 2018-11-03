# Личный проект «Кексобукинг» [![Build status][travis-image]][travis-url]

* Студент: [Макс Масленко](https://up.htmlacademy.ru/nodejs/2/user/107049).
* Наставник: [Вадим Шевяков](https://htmlacademy.ru/profile/id574589).

---

### Быстрый запуск приложения (`NODE_ENV = 'development'`)
1. Установить соединение с MongoDB в активной сессии терминала: `npm run db:start`.
2. Заполнить БД тестовыми данными: `npm run db:fill`.
3. Поднять локальный сервер: `npm start`.

### Корректные настройки для `.env` (при отсутствии будут использоваться значения по умолчанию)

```
NODE_ENV=development

SERVER_PORT=3000
SERVER_HOST=localhost

DB_HOST=localhost:27017
DB_NAME=keksobooking
DB_USER=root
DB_PASS=root

SERVER_LOG_LEVEL=info
```

___

<a href="https://htmlacademy.ru/intensive/nodejs"><img align="left" width="50" height="50" alt="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/nodejs/logo-for-github-2.png"></a>

Репозиторий создан для обучения на интенсивном онлайн‑курсе «[Профессиональный Node.js, уровень 1](https://htmlacademy.ru/intensive/nodejs)» от [HTML Academy](https://htmlacademy.ru).

[travis-image]: https://travis-ci.com/htmlacademy-nodejs/107049-keksobooking.svg?branch=master
[travis-url]: https://travis-ci.com/htmlacademy-nodejs/107049-keksobooking
