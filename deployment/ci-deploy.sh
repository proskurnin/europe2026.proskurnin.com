#!/bin/bash
# Root-owned, narrowly allowed through sudo; never executes supplied commands.
set -euo pipefail
test "$(id -u)" = 0
test "$#" = 1
[[ "$1" =~ ^[a-f0-9]{40}$ ]] || exit 64
expected=$1
# systemctl start waits for this Type=oneshot unit on systemd 229.
# Do not use --wait, which is unavailable on this host.
/bin/systemctl start europe2026-deploy.service
actual=$(cat /var/lib/europe2026-deploy/deployed)
if [ "$actual" != "$expected" ]; then
  echo "Production commit mismatch: expected $expected, got $actual" >&2
  exit 1
fi
curl --fail --silent --show-error --connect-timeout 5 --max-time 20 \
  --resolve europe2026.proskurnin.com:443:127.0.0.1 \
  https://europe2026.proskurnin.com/deploy-version.json |
  python3 -c 'import json,sys; assert json.load(sys.stdin)["commit"] == sys.argv[1]' "$expected"
curl --fail --silent --show-error --connect-timeout 5 --max-time 20 \
  http://127.0.0.1:3220/api/trip/plan |
  python3 -c 'import json,sys; p=json.load(sys.stdin)["plan"]; assert p["days"]; assert not p.get("expenses") and not p.get("checks"); assert not p.get("execution",{}).get("events")'
echo "Deployed and verified Europe 2026 $expected"
