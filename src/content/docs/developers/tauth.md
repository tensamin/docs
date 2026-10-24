---
title: TAuth getting started
description: Register your app and connect it to a user's Tensamin account.
sidebar:
  order: 1
---

TAuth lets your app request limited access to a Tensamin account without receiving the user's account credentials. You register an app key, publish its identity on your domain, and send users to Tensamin to approve access.

This guide covers the integration flow. See the [TAuth reference](/developers/tauth-reference/) for request fields, scopes, limits, and failure handling. TAuth uses signed requests and MTP messages, not an OAuth or OpenID Connect endpoint contract.

## 1. Register your app

You need a domain where you can publish DNS TXT records and serve an HTTPS file. You also need an app backend that can keep the app credential private and receive a callback.

Registration currently uses the Iota operator CLI. Ask your Iota operator to run it if you do not operate the service yourself. The owner must already exist on that Iota, its account credential must be available locally, and Iota must have a configured `iota_id`. See [Iota setup](/installation/#setup-an-iota) if you need to host one.

Replace the example values, including owner user ID `7`, with your own:

```sh
iota apps create \
  --owner-user-id 7 \
  --domain example.com \
  --name Example \
  --redirect https://example.com/tauth/callback \
  --output ./example.ta \
  --manifest-output ./tauth.json \
  hosted --omega-url https://omega.example
```

The command exports a private `.ta` credential, a signed public manifest, and a DNS TXT value. Keep `.ta` on your backend, outside source control and browser bundles. Publish only the manifest and TXT value. Use fresh output paths because the CLI refuses to overwrite existing files.

Register the callback URL exactly as your app will use it. HTTPS is required except for HTTP loopback URLs during local development.

## 2. Publish your app identity

Serve the generated `tauth.json` unchanged at:

```text
https://example.com/.well-known/tauth.json
```

Publish the TXT value printed by the CLI at `_tauth.example.com`. Its format is:

```text
v=TAUTH1;app=<app-id>;manifest=<sha256-of-manifest-body>
```

The hash covers the exact file bytes. Reformatting the JSON or adding a newline changes it. DNS binds your domain to the app key and manifest. The manifest contains your app name, registered redirects, and signed owner certificate. This verifies cryptographic bindings, not a developer's real-world identity.

## 3. Start an authorization

On your backend, create a fresh random state and PKCE verifier. Store them as a pending authorization tied to the browser session that started it. Never accept the stored pending authorization from the browser.

Use the app credential to sign a request containing your app ID, domain, exact callback URL, requested scopes, state, PKCE challenge, and expiry. Start with `identity.read` if your app only needs the current user's identity. The request can be valid for at most five minutes.

Open `https://app.tensamin.net/authorize?request=<encoded-request>` with the signed JSON request encoded as base64url. A popup is supported. Tensamin attempts to open the desktop client and also provides a web authorization page. It checks discovery and the request signature before presenting your app and requested scopes.

An existing secure grant can skip the prompt for the same or narrower scopes. Requesting additional scopes requires approval.

## 4. Handle the callback

On approval, your callback receives `code`, `state`, and `locator`. The locator is a signed description of the user's gateway route. On denial, the callback receives `error=access_denied` and `state`.

1. Look up the pending authorization for the initiating browser session and require an exact state match.
2. Handle denial without exchanging a code.
3. Exchange the code over TAuth MTP with the app ID, registered redirect URI, and stored PKCE verifier. Validate the signed locator before using its route.
4. Keep the resulting session token private and use only the operations covered by its granted scopes.

Codes are single-use and expire after 60 seconds. Exchange also rechecks the original request's expiry and DNS/manifest discovery. A code can therefore fail before its own expiry if the request has expired or discovery has changed. Start a fresh authorization rather than reusing an old callback.

The popup also posts the result to its opener. If you consume that message, check the sender origin, popup window, and pending state. Do not exchange the same result through both message and redirect handlers.

## 5. Support disconnecting

Users can revoke your app in the Tensamin client's app settings. Your app can also disconnect its current user's grant with `TAuthDisconnectDelete`. Revocation deletes that user's grant, sessions, pending codes, and app JSON together. Be ready to ask for authorization again when a session becomes invalid.

For app-owned JSON, request `metadata.read` and/or `metadata.write`. Each user has one JSON value per app, limited to 16 MiB. Users can inspect and edit it themselves, so validate it when reading.

Continue with the [TAuth reference](/developers/tauth-reference/) for routing modes, exact redirect rules, revocation, and troubleshooting.
