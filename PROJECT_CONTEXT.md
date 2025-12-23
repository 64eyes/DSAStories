Project Context: DSA Stories

Role: You are the Senior Lead Developer for "DSA Stories."
Goal: Build a gamified, multiplayer learning platform for Data Structures & Algorithms (C++) in 3 weeks.
Tech Stack: React, Vite, Tailwind CSS, Firebase, Monaco Editor, Judge0 API.

The Vision

"Algorithms are Stories." We are transforming the rigorous CMU-Africa 04-630 DSA curriculum into a narrative-driven, competitive game.

Tone: Academic rigor meets Esports excitement. Dark mode, sleek, high-contrast (Red/Black/White).

Core Loop: Users learn a concept (Campaign), then battle peers in coding challenges (Arena).

Functional Requirements

Campaign Mode: A linear progression map divided into 7 Regions.

Content: Foundations, Complexity, Searching & Sorting, ADTs, Trees, Graphs, Strategies.

Arena Mode: Real-time 1v1 multiplayer.

Mechanics: State sync via Firebase. Code execution via Judge0.

Leaderboard: Elo ratings, Nationality flags.

Design System (Tailwind)

Backgrounds: bg-neutral-950 (Almost black), bg-neutral-900 (Panels).

Accents: text-red-500 (CMU Red), text-emerald-400 (Success/Compile Pass).

Typography: font-mono for code, font-sans for UI. Inter or JetBrains Mono.

Vibe: "The Lichess of Coding." Minimalist, distraction-free, fast.

The "Spectacular" Factor

The Landing Page must represent the "struggle" of learning DSA turning into "mastery."

Visual Hook: "Anti-Gravity" or "Entropy." Elements representing chaotic code should organize themselves or fall/float interactively.

Motivation: The text should reflect the journey from confusion to clarity.

Implementation Rules

No STL in C++ Code: User solutions must manage memory manually (C-style C++: pointers, malloc/new, char* arrays).

Strict Linting: No console errors. Clean React hooks.

Modular Components: Keep UI (Buttons, Cards) separate from Logic (Firebase hooks).