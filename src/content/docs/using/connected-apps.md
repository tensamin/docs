---
title: TAuth Apps
description: Review apps authorized through Tensamin and revoke their access.
sidebar:
  order: 7
---

Connected apps use Tensamin authorization, also called TAuth, to request access
for their own service. An app's authorization is separate from signing into the
Tensamin client on another device.

## Review access

Open the Apps page in Settings to see existing authorizations. Each entry shows
the app name, domain, and granted scopes. Scopes describe the access granted to
that app. Check the domain as well as the name, because a familiar name alone
does not identify a service you trust.

An entry marked **Insecure** needs particular caution. Do not treat a successful
authorization as proof that an external service protects your data.

If the table says **No authorized apps**, there are no grants listed for this
account. This table is not a list of devices holding your private keyring.

## Remove access

Use the revoke action beside an app and confirm the request. The confirmation
also deletes that app's stored JSON data in Tensamin.

Revoking access does not erase copies that an external app has already received.
Contact that service separately if you need it to delete your data.

## App data

The App data column contains editable JSON metadata. You normally do not need
to edit it. Only change it when you understand the app's expected format, and
use the save action to apply a change. Invalid JSON is rejected, but valid JSON
can still contain values the app cannot use.
