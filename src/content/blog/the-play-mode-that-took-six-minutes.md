---
title: The Play Mode that took six minutes
description: >-
  My first big diagnosis as a junior support engineer: why entering Play Mode
  exploded from seconds to minutes after a Unity upgrade, and the one
  component hiding 91% of the cost.
pubDate: 2021-06-16
tags: [unity, editor, serialization, performance, debugging]
draft: true
---

Early in my time at Unity, a studio reported that entering Play Mode had gone
from about 10–15 seconds to over a minute and a half after upgrading from
2018.4 to 2019.4 — bad enough to block their whole team's engine upgrade ahead
of a launch. On my machine their project was even worse: the domain reload took
**362 seconds**. The usual suspects (platform settings, asset pipeline
rollbacks, the generic checklist) changed nothing, so I went digging with the
Editor Iteration Profiler and then further down: I modified the Editor source
to print per-object timings for the managed-object backup/restore step of the
domain reload, dumped all ~4,800 objects into a table, and sorted it. One
single component — a debug overlay — accounted for **91%** of the restore
time.

The root cause was a serialized array of objects whose type contained nested
lists of itself: an object-composition cycle serialized by value. Unity's
serialization depth limit had quietly risen from 7 to 10 between those two
versions, and each extra level multiplied the object graph — the Editor log
had even been warning about it ("Serialization depth limit exceeded") all
along. Removing the self-referencing fields dropped the reload from 362 to
**4.6 seconds**, faster than the version they were upgrading *from*. Two
lessons stuck with me: a "performance regression after upgrade" is often an
old defect that a new version stopped forgiving, and the boring warning
everyone scrolls past is frequently the whole answer. It remains one of my
favorite tickets — my manager still owed the team drinks over it.
