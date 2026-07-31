---
title: Teaching the Asset Database to search by GUID
description: >-
  A small engine contribution born from support tickets: searching assets by
  GUID, shipped in Unity 6000.2.
pubDate: 2025-06-19
tags: [unity, asset-database, editor, tooling]
---

If you've ever debugged a broken reference in a Unity project, you know the
drill: the error gives you a GUID, and then you go spelunking — grepping .meta
files, writing a throwaway editor script, or pasting the GUID into your VCS
search and hoping. In support, we live in other people's projects, so this
dance happened weekly. GUIDs are the Asset Database's native language; it
always felt wrong that the Editor's search spoke everything *except* that
language.

So I contributed the missing piece to the engine: the ability to search assets
by GUID directly, which shipped with Unity 6000.2. It's a small feature — the
kind nobody writes a keynote about — but it deletes an entire category of
friction for anyone who debugs project data. The lesson I took from it is that
support work generates a very honest backlog: when you catch yourself doing the
same workaround in ten different customer projects, that's not a workflow,
that's a missing feature, and it's worth the effort of landing it upstream
instead of scripting around it one more time.
