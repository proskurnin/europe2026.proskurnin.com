# Europe 2026 deployment

Push to main runs TypeScript/account/storage checks, builds with Node 22 and publishes generated site/API/deployment code to deploy. Private plan.json and account databases are excluded. A subsequent Actions job connects over restricted SSH, runs the existing server oneshot deployment and checks the expected source commit and account API. verify-production then confirms the public HTTPS version.

CI requires EUROPE_DEPLOY_SSH_KEY and EUROPE_DEPLOY_KNOWN_HOSTS repository secrets. The host key must be verified through an already trusted server connection. The deploy-europe key is forced to ci-entry.sh, which accepts only `deploy <40-character SHA>`; forwarding and PTY are disabled. Its only sudo permission is the root-owned ci-deploy.sh wrapper. No Docker-group access or general root shell is granted.

The server retains its existing private plan, SQLite database, videos, sessions, mounts, maps-config.json and .htaccess. Backend code is backed up and health-checked before switching the frontend release; failures restore prior code and the current symlink. The wrapper returns failure for a mismatching commit or unhealthy public API.

After the first successful end-to-end CI run, provision /etc/europe2026-ci-ready and disable europe2026-deploy.timer. install-vds.sh preserves this cutover and does not recreate polling. Keep europe2026-deploy.service for CI and manual recovery.

Server checks and manual deployment:

```sh
systemctl start europe2026-deploy.service
journalctl -u europe2026-deploy.service -n 50
cat /var/lib/europe2026-deploy/deployed
systemctl is-enabled europe2026-deploy.timer
```

The last command should report disabled after cutover. The protected SSH entry expects an exact SHA; the root manual service fetches the latest deploy branch. Public commit evidence: https://europe2026.proskurnin.com/deploy-version.json.

The initial CI user/key/sudo provisioning is performed by server administration; it is not bootstrapped by a public workflow. Keep all wrappers and sudo configuration root-owned. Private plan/journal updates remain a separate operation against the existing plan.json mount. No Google Doc synchronization is configured by this pipeline.
