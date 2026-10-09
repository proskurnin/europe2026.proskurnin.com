# Авторизация и общие данные на основном сайте

Этот сервис обслуживает собственный VPS, а не копию Sites. Внешние библиотеки для API не нужны: Node 22, встроенные HTTP, crypto и SQLite.

- Код: `/opt/europe-account/releases/<release>`.
- Постоянная база: `/var/lib/europe-account/europe.sqlite` (не находится в DocumentRoot).
- Контейнер: `europe-account`, существующий образ `node:22-bullseye-slim`, непривилегированный пользователь 1000:1000, read-only filesystem, без capabilities, no-new-privileges, порт только `127.0.0.1:3220`.
- Apache проксирует `/api/account/` и `/api/trip/` только в HTTPS VirtualHost europe2026.proskurnin.com. Маршрут статуса рейса сохранён отдельно.
- `plan.json` монтируется внутрь сервиса вне публичного каталога. После изменения плана нужно обновить его копию и перезапустить сервис.

Сборка интерфейса:

```sh
EUROPE_STATIC=1 npm run build
node scripts/prepare-apache-export.mjs
```

prebuild генерирует очищенный data/public-plan.json. Приложение импортирует только его; закрытая версия приходит с API после входа. Не копировать data/plan.json или базу в публичный выпуск.

Проверки:

```sh
node --test server/account/app.test.mjs
./node_modules/.bin/tsc --noEmit --pretty false
```

Владелец задаёт пароль сам по одноразовой ссылке. Команда восстановления (email берётся у владельца):

```sh
docker exec europe-account node /app/owner-invite.mjs OWNER_EMAIL
```

Ссылка содержит секрет в URL-фрагменте, действует сутки и не должна попадать в Git, логи или чужие сообщения. Повторный запуск отзовёт прежнюю неиспользованную ссылку. Пароль владельца нельзя менять через публичную регистрацию; назначение владельца доступно только этой серверной команде. При восстановлении того же владельца активные сессии отзываются после установки нового пароля.

База использует WAL. Для согласованной копии использовать SQLite backup, а не копирование одного файла при работающем сервисе. Пример внутри контейнера:

```sh
docker exec europe-account node --input-type=module -e 'import {DatabaseSync,backup} from "node:sqlite"; const db=new DatabaseSync("/data/europe.sqlite"); await backup(db,"/data/backup.sqlite"); db.close();'
```

Хранить копии вне публичного каталога с ограниченными правами. Не удалять каталог базы при обновлении кода. Откат интерфейса на старый выпуск может снова открыть прежние общедоступные данные; для отката использовать выпуск с теми же ограничениями доступа.
