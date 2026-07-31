---
title: Chasing a GPU memory leak in the Profiler
description: >-
  A GPU memory leak that only happened when switching scenes with the
  Profiler attached — and what it taught me about owning a fix end to end.
pubDate: 2026-03-24
tags: [unity, profiling, performance, cpp]
---

A customer reported GPU memory climbing steadily during play sessions, but only
when the Profiler was attached, and only when they switched scenes. That
combination is what made it interesting: the tool you use to find leaks was
itself the leak. Working through captures, the pattern emerged — resources
allocated for profiler data collection during a scene switch were never being
released, so every transition left a little more GPU memory behind. On a
long play session with frequent scene loads, "a little" compounds into
gigabytes.

I ended up writing the engine fix myself, in the C++ side of the profiler,
and shepherding it through review and landing. What I learned is mostly about
process: a support engineer's superpower is that we see the bug in its natural
habitat — real project, real capture, real reproduction steps — which is
exactly the context an engine developer usually has to reconstruct from
scratch. Carrying a fix from a customer ticket all the way into the engine
source closes that loop, and it changed how I read "unreproducible"
performance reports. The leak is fixed in current Unity versions; if you see
GPU memory growth with the Profiler attached on an older version, detach the
Profiler and compare before assuming your assets are the problem.
