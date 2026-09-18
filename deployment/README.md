# Europe 2026 deployment

A push to main runs TypeScript and role checks, builds with Node 22 and publishes only the static site, API code and deployment scripts to deploy. The deploy branch contains no private plan or database. GitHub Actions needs only its built-in repository token.

The existing Proskurnin.Ru deployment installs deployment/install-vds.sh once on the same VPS. An independent systemd timer checks deploy every minute. It preserves the existing Docker container settings and private plan, account database, videos, sessions, maps-config.json and .htaccess. API code is backed up, restarted and checked before the static current symlink switches. On failure the code and symlink are restored; failed release directories are retained for inspection.

Server checks:

```sh
systemctl status europe2026-deploy.timer
journalctl -u europe2026-deploy.service -n 50
cat /var/lib/europe2026-deploy/deployed
```

Public verification: https://europe2026.proskurnin.com/deploy-version.json contains the published main commit. Successful Actions means a build was published, not that the VPS has deployed it. Verify this URL separately.

Private plan/journal updates must be applied separately to the server's existing plan.json mount and the europe-account container restarted. This deployment intentionally does not overwrite that file from the public source repository. No Google Doc synchronization is configured by this pipeline.
