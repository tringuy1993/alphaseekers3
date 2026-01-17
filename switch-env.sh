#!/bin/bash
# Switch between development and production environment settings
# Usage: ./switch-env.sh [dev|prod]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

case "$1" in
    dev|development)
        cp .env.development .env.local
        echo "Switched to DEVELOPMENT environment"
        echo "  API URL: http://127.0.0.1:8000/"
        ;;
    prod|production)
        cp .env.production .env.local
        echo "Switched to PRODUCTION environment"
        echo "  API URL: https://www.alpha-seekers.com/"
        ;;
    status)
        if grep -q "127.0.0.1:8000" .env.local 2>/dev/null; then
            echo "Current environment: DEVELOPMENT"
        elif grep -q "alpha-seekers.com" .env.local 2>/dev/null; then
            echo "Current environment: PRODUCTION"
        else
            echo "Current environment: UNKNOWN"
        fi
        ;;
    *)
        echo "Usage: $0 {dev|prod|status}"
        echo ""
        echo "Commands:"
        echo "  dev, development  - Switch to development settings (localhost API)"
        echo "  prod, production  - Switch to production settings (alpha-seekers.com API)"
        echo "  status            - Show current environment"
        exit 1
        ;;
esac
