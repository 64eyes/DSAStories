DSA Stories: The Spirit of Computing

Project Lead: Oloruntobi Madamori

Target Launch: January 2026 (3-Week MVP Sprint)

Status: In Development

1. Executive Summary

DSA Stories is a global, gamified learning platform designed to demystify Data Structures and Algorithms (DSA) through narrative and competition. While inspired by the rigorous graduate-level curriculum at Carnegie Mellon University Africa, the platform is built for every DSA enthusiast worldwide—from self-taught beginners to CS graduates refining their skills.

Unlike traditional coding platforms that focus solely on "getting the right answer" (LeetCode) or passive video consumption (Udemy), DSA Stories focuses on the narrative of logic and live social competition. It treats algorithms not as dry mathematical formulas, but as tools with history, purpose, and "personality."

2. The Philosophy

"Algorithms are Stories": Every data structure tells a story of a specific problem it was born to solve. The app teaches the why and how before the code.

The "Lichess" of Coding: Coding is traditionally isolated. We are bringing the adrenaline of live, ranked, multiplayer matchmaking to algorithmic thinking.

Rigorous Simplicity: We cover complex topics (Red-Black Trees, Graph Theory, NP-Completeness) but break them down into intuitive, interactive visualizations.

3. Target Audience

The Student: University students (including the incoming CMU cohort) struggling to visualize abstract concepts like recursion or pointers.

The Bootcamper: Self-taught developers who know syntax but lack foundational theory.

The Professional: Engineers preparing for technical interviews who want a fun way to keep their skills sharp.

4. Functional Requirements: The Features

🗺️ Module A: The Story Mode (Campaign)

A structured, linear journey through the universe of computing. Users progress by solving challenges, unlocking new "Regions" of the map.

Region 1: The Genesis (Foundations)

Concepts: The Software Development Life Cycle (SDLC), Abstraction, Memory Management.

C/C++ Dive: Pointers, References, Memory Leaks (The "Gatekeepers").

Format: Interactive "Fix the Bug" challenges and "Memory Map" visualizations.

Region 2: The Architect (Complexity & Formalism)

Concepts: Pseudo-code, Flow-charts, Finite State Machines (FSM).

Analysis: Big O Notation, Recurrence Relationships.

Activity: "The Complexity Scale" – Drag and drop algorithms into their correct time complexity tiers ($O(1)$ vs $O(N^2)$).

Region 3: The Search & Sort Library

Concepts: Linear vs Binary Search ($O(n)$ vs $O(\log n)$).

Sorting: Bubble, Selection, Insertion (The Basics) vs. Quicksort, Merge Sort (The Recursive powerhouses).

Activity: "Race the Sort" – Predict the next swap in a visual sorting algorithm.

Region 4: The Vault (Abstract Data Types)

Concepts: Encapsulation, Information Hiding.

Containers: Arrays, Linked Lists (Singly/Doubly), Stacks, Queues.

Activity: "The Stack Maze" – Navigate a maze using only Push/Pop operations.

Region 5: The Forest (Trees & Heaps)

Concepts: BST, Traversal (In/Pre/Post-order), AVL, Red-Black Trees.

Heaps: Priority Queues, Heap Sort.

Activity: "Balance the Tree" – Manually perform rotations to balance a Red-Black tree.

Region 6: The Web (Graphs & Hashing)

Concepts: BFS/DFS, Topological Sort, MST (Prim/Kruskal), Shortest Path (Dijkstra/Floyd).

Hashing: Collisions, Chaining, Probing.

Activity: "The Network Builder" – Connect nodes with minimum cost (Kruskal’s visualizer).

Region 7: The Grandmaster (Strategies & Correctness)

Concepts: Divide-and-conquer, Greedy, Backtracking, Branch-and-bound.

Verification: Invariants, Pre/Post-conditions, STL Deep Dive.

Activity: "The N-Queens Solver" – Visual backtracking challenge.

⚔️ Module B: The Arena (Live Multiplayer)

The core differentiator. A real-time lobby system where 2-4 players compete.

Lobby System:

"Quick Match" (Auto-pairing by Elo rating).

"Custom Game" (Invite friends via link).

Game Modes:

Blitz (Speed Theory): 2 minutes. Rapid-fire multiple choice on Big O, Syntax, and Logic.

Debug Duel: 5 minutes. Both players are given broken code. First to pass all test cases wins.

Optimization Race: Players submit working code. The winner is determined by who has the lowest time complexity and memory usage.

Spectator Mode: Allow other students to watch high-level matches (Grandmaster tier) to learn.

🏆 Module C: Progression & Social

Global Leaderboard: Rankings categorized by "All Time," "Weekly," and "Language" (C++ vs C).

Nationality Flags: Celebrating the global nature of the user base (e.g., Nigerian, Rwandan, Kenyan flags next to profiles).

Elo Rating: Users start at 1200. Win to gain, lose to drop. Titles: Novice, Appellant, Engineer, Architect, Grandmaster.

5. Technical Architecture (The MVP Stack)

To achieve a live launch in 3 weeks, we prioritize speed of development and scalability.

Layer

Technology

Reasoning

Frontend

React.js + Vite

Industry standard, blazing fast, component-based.

Styling

Tailwind CSS

Rapid UI development, mobile-responsive by default.

Code Editor

Monaco Editor

The engine behind VS Code. Provides syntax highlighting and intellisense.

Backend/DB

Firebase (BaaS)

Handles Auth, Database, and Realtime Sockets out of the box. Essential for the 3-week timeline.

Execution

Judge0 API

Cloud-based code compiler. Allows us to run C/C++ code safely without managing our own servers.

Hosting

Vercel

One-click deployment for React apps.

6. 3-Week Development Roadmap

Week 1: The Foundation (Skeleton)

Days 1-2: Project initialization. Setup Firebase Auth (Google/GitHub). Build the Landing Page.

Days 3-4: Integrate Monaco Editor. Connect to Judge0 API to ensure code can be compiled and run.

Days 5-7: Build the "Story Mode" UI map and populate Content for Region 1 & 2 (Basics & Complexity).

Week 2: The Multiplayer Engine (The Hardest Part)

Days 8-10: Implement the "Lobby" logic using Firebase Realtime Database. (Players joining/leaving rooms).

Days 11-12: Implement "State Sync". When Player A answers a question, Player B's progress bar updates instantly.

Days 13-14: Build the Scoring System and Elo calculation logic.

Week 3: Content & Polish

Days 15-17: Populate content for Regions 3-6 (Sorting, Trees, Graphs). Write test cases for the coding challenges.

Days 18-19: Gamification UI (Badges, Profile Flags, Leaderboards).

Days 20-21: Testing "Optimization Race" mode to ensure Judge0 returns memory/time usage correctly. Launch Day.

7. Call for Collaborators

I am looking for passionate individuals to join this sprint:

Frontend Developer: Comfortable with React hooks and managing complex state (for the multiplayer game).

Backend/Firebase Lead: Experience with NoSQL data modeling and security rules.

Content Engineers (TAs/Students): To write the C++ coding challenges, edge cases, and "Story" explanations for the algorithms.

UI Designer: To give the app a clean, "dark mode" aesthetic similar to Lichess or modern IDEs.

8. Why Sponsor/Support This?

Educational Impact: Directly addresses the high failure rate in DSA courses by making practice addictive.

Innovation: Moves away from static textbooks to dynamic, social learning.

Scalability: Built on modern tech that can easily expand to include Python, Java, or other CS topics.