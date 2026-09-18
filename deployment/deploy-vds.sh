#!/usr/bin/env bash
set -euo pipefail
umask 022
stage=starting
report_status() {
  rc=$?
  if [ -d /var/www/proskurnin.ru/resources ]; then
    printf '{"stage":"%s","exitCode":%s}\n' "$stage" "$rc" > /var/www/proskurnin.ru/resources/europe2026-deploy-status.json
  fi
}
trap report_status EXIT
exec 9>/var/lock/europe2026-deploy.lock
flock -n 9 || exit 0
repo=/srv/europe2026-deploy
root=/var/www/europe2026.proskurnin.com
state=/var/lib/europe2026-deploy
mkdir -p "$state"
stage=fetch-build
git -C "$repo" fetch --quiet origin deploy
git -C "$repo" reset --hard FETCH_HEAD >/dev/null
release=$(cat "$repo/source-commit")
[[ "$release" =~ ^[0-9a-f]{40}$ ]] || exit 1
if [ -f "$state/deployed" ] && [ "$(cat "$state/deployed")" = "$release" ]; then exit 0; fi
# Existing production installation is required; never create a new account database.
stage=check-current-symlink
test -L "$root/current"
previous=$(readlink -f "$root/current")
test -f "$previous/index.html"
test -f "$repo/site/index.html"
test -f "$repo/site/account/index.html"
stage=inspect-account-container
app_source=$(docker inspect europe-account | python3 -c 'import json,sys; c=json.load(sys.stdin)[0]; m=[m["Source"] for m in c["Mounts"] if m["Destination"]=="/app" and m["Type"]=="bind"]; assert len(m)==1,"Expected existing /app directory bind mount"; print(m[0])')
test -d "$app_source"
test -f "$app_source/start.mjs"
next="$root/releases/git-$release"
stage=prepare-release
if [ -e "$next" ]; then
  test "$(readlink -f "$root/current")" != "$next"
  mv "$next" "$next.failed-$(date +%s)-$$"
fi
mkdir -p "$next"
cp -a "$repo/site/." "$next/"
for config in maps-config.json .htaccess; do
  if [ -f "$previous/$config" ]; then cp -a "$previous/$config" "$next/$config"; fi
done
backup="$state/backup-$release-$(date +%s)-$$"
mkdir -m 700 "$backup"
files=(app.mjs core.mjs public-plan.mjs start.mjs owner-invite.mjs)
for name in "${files[@]}"; do
  test -f "$app_source/$name"
  cp -a "$app_source/$name" "$backup/$name"
done
rollback() {
  code=$?
  trap - ERR
  for name in "${files[@]}"; do cp -a "$backup/$name" "$app_source/$name"; done
  docker restart europe-account >/dev/null || true
  ln -s "$previous" "$root/rollback-$$"
  mv -Tf "$root/rollback-$$" "$root/current"
  echo "Deployment failed ($code); restored previous release. See journalctl -u europe2026-deploy." >&2
  exit "$code"
}
trap rollback ERR
# Keep the existing plan.json, Docker mounts, environment, SQLite, sessions and uploads.
stage=update-account-code
for name in "${files[@]}"; do cp "$repo/account/$name" "$app_source/$name"; chmod 644 "$app_source/$name"; done
docker restart europe-account >/dev/null
stage=check-account-api
curl --fail --silent --show-error --retry 12 --retry-connrefused --retry-delay 2 \
  http://127.0.0.1:3220/api/trip/plan > "$backup/public-health.json"
python3 - "$backup/public-health.json" <<'PY'
import json,sys
p=json.load(open(sys.argv[1]))['plan']
assert p['days']
assert not p.get('expenses') and not p.get('checks')
assert not p.get('execution',{}).get('events')
PY
stage=switch-site
ln -s "$next" "$root/next-$$"
mv -Tf "$root/next-$$" "$root/current"
curl --fail --silent --show-error --resolve europe2026.proskurnin.com:443:127.0.0.1 \
  https://europe2026.proskurnin.com/deploy-version.json | python3 -c 'import json,sys; assert json.load(sys.stdin)["commit"]==sys.argv[1]' "$release"
stage=complete
printf '%s\n' "$release" > "$state/deployed"
trap - ERR
echo "Deployed Europe 2026 $release"
