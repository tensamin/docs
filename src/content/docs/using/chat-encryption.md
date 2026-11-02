---
title: Chat encryption limits
description: How recoverable chat keys affect history access and account compromise.
---

This page describes the current Client source implementation. It is not an
independent security assessment or proof that a deployed release includes it.
File sharing and call encryption need their own verification.

## Recoverable history keys

The Client encrypts chat text with a key derived from a shared chat secret and
its epoch number. Messages identify the epoch needed to decrypt them. The
Client retains access to historical epoch secrets so it can open older messages.

Stored chat secrets are wrapped for the participants' long-term account keys.
Recovering the account key can therefore restore access to those wrapped
secrets and the history they protect. Password login recovers the same account
credential; it does not create a separate encryption identity for each device.

Services still process routing and delivery metadata, including account
identifiers and timestamps. Encrypting message text does not hide all metadata.

## Account compromise

This design does not provide per-message forward secrecy. Someone who obtains
an account's private key material and the corresponding stored envelopes may
recover historical chat secrets and decrypt messages covered by those secrets.

It also does not provide automatic post-compromise recovery. Rotating a chat
epoch does not remove an attacker's copy of an account key that can open the new
epoch's envelopes. Changing a login password does not replace that account key
or invalidate private-key copies already held elsewhere.

An unlocked or compromised client can also expose plaintext and keys available
to that client. Local encrypted storage does not protect against code running
with the client's own access.

## Transport security is separate

Transport encryption and MTP's separate session protections do not turn stored
chat history into a per-message ratchet. Using post-quantum algorithms does not
by itself provide forward secrecy or recovery after key compromise.

The application protocol composition still needs independent security review.
Do not treat successful builds, protocol tests or this documentation as a
security certification.
