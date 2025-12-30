#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

ln -sf nginx.active_blue.conf nginx.current.conf
cp -f nginx.active_blue.conf default.conf

docker exec annuaire-did-nginx nginx -s reload
echo "Switched Nginx to upstream blue"
