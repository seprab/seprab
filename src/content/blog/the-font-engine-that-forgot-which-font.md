---
title: The font engine that forgot which font it was using
description: >-
  A crash deep inside glyph loading that only happened when two parts of the
  Editor used fonts at the same time — and why "load, then use" is not a
  contract you can rely on once threads are involved.
pubDate: 2026-10-01
tags: [unity, textcore, concurrency, cpp, debugging]
draft: true
---

This quarter's longest investigation started as an Editor crash inside
FreeType's glyph loading, reported while a studio was generating a font atlas
with the Font Asset Creator. It didn't reproduce on demand, and the stack
traces never pointed at the same glyph twice — the classic smell of a race.
The cause turned out to be architectural rather than a single bad line: the
font engine worked on a "current face" model, where every caller loads a font
face and then uses whatever is currently loaded. That's fine when one system
owns the engine, but the atlas generator runs its work on multiple threads,
and dynamic font assets elsewhere in the Editor were loading their own faces
in between. One caller could swap the face out from under another
mid-operation, which led to crashes, the occasional glyph or metric pulled
from the *wrong* font, and a leak when an atlas job was cancelled halfway.
The fix replaced the implicit current face with an explicit face handle that
travels with each operation, plus per-face and per-cache locks so a cached
face can be shared across threads safely. It took four separate bugs with it,
and it's now out in the Unity 6.3 LTS line.

The lesson I keep relearning is that an API that relies on callers following
a strict sequence is effectively a global variable with good manners, and
concurrency will eventually catch it misbehaving. The hard part wasn't writing
the handle. It was proving the theory with a crash that only appeared under
specific timing, and then changing a core text API without breaking the many
systems built on the old assumption. A small detail I enjoyed: several
existing font engine tests had long been disabled as "unstable", and in
hindsight they were probably flaky because of this exact bug. Flaky tests are
often a symptom someone quietly stopped listening to. Backporting the change
to the LTS stream a customer actually ships on also took as long as the fix
itself, which is a good reminder that "fixed in trunk" and "fixed for the
person who reported it" are two very different milestones.
