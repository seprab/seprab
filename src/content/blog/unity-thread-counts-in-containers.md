---
title: Unity in containers, and threads that don't fit
description: >-
  Why Unity's worker-thread assumptions misbehave inside containers and CI,
  and the engine changes that make thread counts configurable.
pubDate: 2026-07-31
tags: [unity, docker, ci, build-pipeline]
draft: true
---

Ever since my [first experiments running Unity in Docker](/blog/linux-docker-unity-android/),
I keep meeting the same class of problem: the engine sizes its thread pools by
asking the machine how many cores it has, and inside a container that answer is
often a lie. A build agent with 64 host cores but a 4-core cgroup quota gets an
engine spawning worker threads for 64 — garbage-collection helpers, build
workers, job threads — all fighting over four cores' worth of quota. The result
ranges from mysteriously slow imports to crashes that only reproduce "in CI",
which is exactly where nobody wants to debug them.

Through several customer escalations I ended up contributing engine changes to
make these counts explicit — configurable garbage-collector helper threads and
build-driver thread counts — so a containerized Unity can be told the truth
instead of guessing it. Two takeaways if you run Unity headless at scale:
first, treat every "works on my machine, dies in CI" report as a resource-limit
mismatch until proven otherwise; second, pin thread counts explicitly in
containerized environments rather than trusting auto-detection. The class of
failure this eliminates is one of the most expensive to diagnose remotely,
because the logs look healthy right up until they don't.
