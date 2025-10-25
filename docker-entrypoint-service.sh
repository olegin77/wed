#!/bin/sh
set -e

echo "==> Generating Prisma Client..."
cd /app

# Generate Prisma client (will generate for all installed @prisma/client versions)
pnpm prisma generate --schema=/app/schema.prisma

# Copy generated client to all @prisma/client installations to handle multiple TS versions
echo "==> Ensuring Prisma Client is available for all TypeScript versions..."
SOURCE_PRISMA=$(find /app/node_modules/.pnpm -path "*/@prisma/client*/.prisma/client" -type d 2>/dev/null | head -1)

if [ -n "$SOURCE_PRISMA" ]; then
    # Find all @prisma/client installations
    for client_dir in /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client; do
        if [ -d "$client_dir" ]; then
            target_prisma="$(dirname "$client_dir")/.prisma"
            if [ ! -d "$target_prisma/client" ]; then
                echo "  -> Copying to: $target_prisma"
                mkdir -p "$target_prisma"
                cp -r "$SOURCE_PRISMA"/* "$target_prisma/" 2>/dev/null || true
            fi
        fi
    done
fi

echo "==> Starting service: $SERVICE_NAME"
cd /app/apps/$SERVICE_NAME

# Execute the original command
exec "$@"
