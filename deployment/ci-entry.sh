#!/bin/bash
# Forced SSH command, executed as deploy-europe.
set -euo pipefail
if [[ ${SSH_ORIGINAL_COMMAND:-} =~ ^deploy\ ([a-f0-9]{40})$ ]]; then
  exec /usr/bin/sudo -n /usr/local/sbin/europe2026-ci-deploy "${BASH_REMATCH[1]}"
fi
echo 'Only deploy <40-character commit SHA> is allowed.' >&2
exit 64
