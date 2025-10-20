# Notification Center

The notifier service now exposes a fully in-memory notification center with
per-user feeds and delivery state tracking. Use it to orchestrate outbound
communications (email, push, SMS, in-app) while providing the UI with a reliable
source for unread counts and activity history.

## Architecture

- `NotificationCenter` coordinates registered delivery channels and persists feed
  entries in `NotificationFeed` after each dispatch.
- Channels implement the `NotificationChannel` interface (`key` + async `send`).
- The default export wires an `InMemoryChannel` so the service works in local
  environments without additional setup.

```ts
import {
  notificationCenter,
  NotificationDispatchError,
} from "apps/svc-notifier/src/index";

await notificationCenter.dispatch({
  type: "enquiry.update",
  subject: "Ваша заявка обновлена",
  body: "Поставщик ответил на сообщение",
  recipients: ["user_123"],
  meta: { url: "/enquiries/abc" },
});
```

## Delivery states

| State       | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `queued`    | Payload accepted but no channels available (feed only).    |
| `delivered` | All channels reported success; `deliveredAt` timestamp set.|
| `partial`   | Some channels failed — inspect `failureReasons`.           |
| `failed`    | Every channel failed or missing.                           |

Channel-level status is exposed through `delivery.channels` where the value is
`pending`, `sent`, or `failed`.

## Feed helpers

`NotificationFeed` is injectable and powers read/unread UX:

```ts
const feed = notificationCenter.getFeed();
const unreadCount = feed.countUnread("user_123");
const latest = feed.list("user_123", { limit: 10 });
feed.markAllRead("user_123");
```

Each call returns immutable snapshots so UI layers can render safely without
mutating the underlying store.

## Error handling

`NotificationDispatchError` is thrown for partial or total failures and carries a
frozen delivery snapshot. Catch it to surface granular diagnostics to observability
pipelines or to schedule retries.
