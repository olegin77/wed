# Log ingestion service

## Daily log rotation

- `apps/svc-logs/src/server.js` now derives log filenames from the UTC date in `YYYY-MM-DD` format and validates the value against a digit-only pattern before writing.
- The service writes to a deterministic `logs/` directory adjacent to the source file so CI security rules can verify the target without permitting arbitrary paths.
- Both `mkdir` and `appendFile` calls are annotated with eslint justifications explaining why dynamic paths remain safe after validation.
