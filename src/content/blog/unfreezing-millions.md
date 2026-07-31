---
title: "Unfreezing millions: hunting an 8-year-old race condition"
description: >-
  How a mobile game freeze that had been shipping for eight years was finally
  root-caused: a race condition hidden by ARM instruction reordering.
pubDate: 2026-07-31
tags: [unity, debugging, concurrency, mobile]
draft: true
---

For years, players of some of the world's biggest mobile games occasionally hit a
freeze that nobody could reproduce on demand. The telemetry was humbling: one
title alone counted around 1.2 million freeze events in a single month. Together
with a colleague supporting another top-grossing studio, we compared notes and
realized we were staring at the same ghost — a deadlock in the engine's async
texture upload path that had been in the codebase for roughly eight years. The
hard part was that the code *looked* correct. You could read it top to bottom and
convince yourself it was fine, because on x86 it mostly was.

The missing piece was ARM instruction reordering. The CPU is allowed to reorder
memory operations in ways the source code doesn't show, and on ARM devices the
window between two "safe-looking" reads and writes was real enough to corrupt the
upload manager's state under load. What I learned: when a bug only exists at
scale, telemetry *is* your reproduction case — a million monthly events is a
statistical certainty you can reason about, even if your desk device never
freezes once. From first report to a landed engine fix took about eight weeks,
and watching the freeze counters collapse afterwards is one of the most
satisfying charts I've seen in this job.
