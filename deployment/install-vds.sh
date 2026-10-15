#!/usr/bin/env bash
set -euo pipefail
# One-time installation called by the already authorized Proskurnin.Ru deploy.
repo=/srv/europe2026-deploy
url=https://github.com/proskurnin/europe2026.proskurnin.com.git
if [ ! -d "$repo/.git" ]; then
  git clone --single-branch --branch deploy "$url" "$repo"
fi
test "$(git -C "$repo" remote get-url origin)" = "$url"
git -C "$repo" fetch origin deploy
git -C "$repo" reset --hard FETCH_HEAD
install -m 755 "$repo/deployment/deploy-vds.sh" /usr/local/sbin/europe2026-deploy
cat > /etc/systemd/system/europe2026-deploy.service <<'UNIT'
[Unit]
Description=Deploy Europe 2026 from GitHub build branch
After=network-online.target docker.service
Wants=network-online.target
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/europe2026-deploy
TimeoutStartSec=180
UNIT
install -d -m 755 /usr/local/libexec
install -m 755 "$repo/deployment/ci-entry.sh" /usr/local/libexec/europe2026-ci-entry
install -m 755 "$repo/deployment/ci-deploy.sh" /usr/local/sbin/europe2026-ci-deploy
systemctl daemon-reload
# Never recreate polling after the verified CI cutover. Before cutover, leave
# the already configured fallback timer untouched.
if [ -f /etc/europe2026-ci-ready ] && [ -f /etc/systemd/system/europe2026-deploy.timer ]; then
  systemctl disable --now europe2026-deploy.timer
fi
systemctl start europe2026-deploy.service
