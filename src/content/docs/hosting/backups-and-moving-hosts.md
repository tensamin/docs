---
title: Backups and moving hosts
description: Back up complete Iota state and restore the same service on another host.
sidebar:
  order: 2
---

Back up the whole deployment, not just its messages database. Store encrypted
copies off the Iota host and restrict access. Backups contain private identities
and account credentials.

## What to keep

Record the installed version and the service's actual paths. Standard unmanaged
Linux installations use `/etc/iota` for configuration and `/var/lib/iota` for
state. NixOS can override `stateDir` and generates configuration there.

Include:

- The complete configuration and state directories, including hidden files.
- The entire `identity` directory, including `iota.mk` and
  `password-auth.setup`. Losing password-authentication setup can break existing
  password logins. Do not regenerate it as a recovery step.
- All of `storage`, including SQLite files, user credentials, assets, blobs, and
  any remaining SQLite journal files.
- TLS material outside those directories, or a documented way to provision it
  again. Preserve secret file permissions.
- Service configuration, path overrides, and update trust configuration. On
  NixOS, retain the system configuration, flake lock, and secret provisioning.

The startup database backup is a single fixed file at
`storage/backups/messages.sqlite3`. Later startups replace it. It excludes
identity, configuration, credentials stored outside SQLite, and asset files.
It is not a complete backup or a versioned recovery history.

## Take a stopped-daemon backup

Schedule downtime. Stop socket activation as well as the service so a console
connection cannot start the daemon during the copy. On an unmanaged installation:

```sh
sudo systemctl stop iota-update.timer iota-update.service
sudo systemctl stop iota-daemon.socket iota-daemon.service
```

On NixOS:

```sh
sudo systemctl stop iota.socket iota.service
```

Confirm the daemon is stopped. Do not run Iota console commands until the copy
finishes. Copy the complete directories listed above with a tool that preserves
ownership, permissions, and symlinks. Include external secrets separately.
Verify the backup is readable and contains the identity and asset files.

After the copy, start `iota-daemon.socket` and `iota-daemon.service`, or
`iota.socket` and `iota.service` on NixOS. Start `iota-update.timer` again only if
it was active before maintenance. Check `iota health` and try an account login.

## Restore or move the same Iota

1. Keep the old daemon stopped. Never run two copies of the same identity and
   state at once.
2. Install the matching Iota version on the destination using
   [installation](/installation/#setup-an-iota), then stop its socket and service
   as above before restoring files.
3. Restore configuration and complete state together into the intended paths.
   Do not merge a backup into unrelated account state. Restore ownership for the
   destination service user and keep private files private.
4. Provision valid TLS files and update paths or network settings that changed.
   On NixOS, restore declared settings and secrets rather than overwriting a
   generated configuration file.
5. Start the destination socket and service. Check `iota health`, upstream
   connectivity, account login, messages, and an existing asset before ending
   maintenance. Keep the old host stopped.

Test restores on an isolated host without public connectivity. Retain the
original backup while investigating failures. There is no universal recovery
procedure for missing identities, credentials, or incompatible state versions.

## Moving an account is different

Restoring the same Iota preserves its identity. Moving one account to a different
Iota changes its hosting assignment. Exporting and importing a `.tu` credential
does not transfer its message history or assets.

`iota users hosting release 42 --yes` releases the Omega assignment while keeping
the old host's data. Purge, account deletion, and local force-detach have different
effects. See [account operations](/hosting/manage-your-iota/#hosted-accounts).
Do not delete the old data expecting credential import to recover it. These
commands are not a documented, complete account-data migration workflow.
