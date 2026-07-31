---
title: Why a Unity engineer went back to C++ school
description: >-
  Six months of Udacity's C++ Nanodegree, as someone who reads engine source
  for a living — what the projects taught me and what changed at work.
pubDate: 2024-07-15
tags: [cpp, learning, career]
---

I've written C# professionally for years, but the Unity engine itself is C++ —
and in engine support, the deeper the ticket goes, the more time I spend
reading native code. I wanted that reading to become *writing*, so I spent six
months on Udacity's C++ Nanodegree. The projects were the point: an A* route
planner over real map data, a Linux process monitor built straight on
`/proc`, a multithreaded traffic simulation with message queues and
condition variables, and a chatbot whose whole purpose was practicing
ownership — raw pointers to smart pointers, copy/move semantics, the rule of
five. My capstone was a small snake game, because apparently no C++ journey
is complete without one.

The surprise was how directly it paid off in support work. Memory-management
tickets stopped being pattern-matching against known issues and started being
things I could reason about from first principles; concurrency bugs in
customer call stacks became legible; and reading the engine's allocator and
job-system code went from intimidating to just… reading. If you support or
extend a C++ engine from the managed side, my advice is to close the loop:
you don't need to become a systems programmer, but being able to *think* in
the engine's language changes what you can do for people. All the course
projects are on my <a href="https://github.com/seprab">GitHub</a>.
