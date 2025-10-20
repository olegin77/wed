# GraphQL schema generation

Сервис `svc-gql` собирает схему из нескольких SDL-файлов в `apps/svc-gql/schema/`.

## Скрипт сборки

- `build-schema.mjs` читает все `.gql`-файлы, сортирует их по имени и формирует единый `schema.graphql`.
- В выходной файл добавляется баннер и комментарий с указанием исходного файла — так легче отследить, откуда пришла конкретная часть схемы.
- Скрипт используется как модуль (`buildSchema()`) и как CLI (`node apps/svc-gql/schema/build-schema.mjs`).

```bash
pnpm --filter svc-gql exec node schema/build-schema.mjs
```

## Контурные типы

- `core.gql` содержит базовые сущности платформы: `Enquiry`, `Invoice` и т.д.
- `vendor.gql` описывает публичные поля поставщика и запросы `vendor`/`vendors`.

Получившийся артефакт `schema.graphql` можно отдавать в Apollo Gateway, выкладывать в CI или прикреплять к документации.

## Дальнейшие шаги

- Добавить в пайплайн CI проверку, что `schema.graphql` синхронизирован с `.gql`-файлами.
- Подключить генерацию TypeScript-тайпингов на основе финальной схемы (например, `graphql-codegen`).
