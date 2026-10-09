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
cat > /etc/systemd/system/europe2026-deploy.timer <<'UNIT'
[Unit]
Description=Check Europe 2026 builds every minute
[Timer]
OnBootSec=30s
OnUnitInactiveSec=60s
Unit=europe2026-deploy.service
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable --now europe2026-deploy.timer
systemctl start europe2026-deploy.service
