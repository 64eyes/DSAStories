Project Context: DSA Stories

Role: You are the Senior Lead Developer & Architect for "DSA Stories."
Goal: Build a gamified, multiplayer learning platform for Data Structures & Algorithms (C++) in a 3-week sprint.
Target Audience: CMU-Africa MSIT students and global self-taught programmers.
Core Philosophy: "Algorithms are Stories." We prioritize narrative, intuition, and memory management rigor over rote memorization.

1. Technical Stack & Standards

Frontend

Framework: React 18 + Vite (Fast, component-based).

Language: JavaScript (ES6+).

Styling: Tailwind CSS (Utility-first).

State Management: React Context API + Custom Hooks (keep it simple for MVP).

Routing: react-router-dom (v6).

Icons: lucide-react (Clean, modern icons).

Animations: framer-motion (Critical for the "Anti-Gravity" and "Chaos to Order" effects).

Code Editor: @monaco-editor/react (VS Code engine).

Backend (Serverless)

Platform: Firebase.

Authentication: Firebase Auth (Google & GitHub providers).

Database (Game State): Firebase Realtime Database (Low latency for multiplayer sync).

Database (User Data): Cloud Firestore (Profiles, progress, leaderboards).

Hosting: Vercel (Frontend) or Firebase Hosting.

Code Execution

Compiler: Judge0 API (Rapid API version).

Language: C++ (GCC 12+).

Constraint: Code submissions MUST NOT use STL containers (std::vector, std::map, std::string). Users must use C-style arrays, pointers, and manual memory management (new, delete, malloc, free).

2. Design System & UI Vibe

The Aesthetic: "Dark Mode IDE meets High-Stakes Esports."

Backgrounds: Deepest darks (bg-neutral-950), not pure black.

Surface: Dark grey with subtle borders (bg-neutral-900, border-neutral-800).

Primary Accent: CMU Red (text-red-600, bg-red-600). Used for "Call to Action" and "Critical Errors."

Secondary Accent: Emerald Green (text-emerald-500). Used for "Compile Success" and "Correct Answer."

Typography:

Headings: Inter or Space Grotesk (Bold, tight tracking).

Code: JetBrains Mono or Fira Code (Ligatures enabled).

Effects:

Glassmorphism: Subtle semi-transparent overlays for modals.

Glow: Slight red glow on hover states for competitive elements.

3. Application Architecture (The Roadmap)

The app consists of three distinct modules.

🗺️ Module A: The Story Mode (Campaign)

A linear progression map. Users cannot skip regions (initially).

UI: A visual node-based map (like Super Mario World or a tech tree) connecting 7 Regions.

The Curriculum (7 Regions):

The Genesis (Foundations): SDLC, Abstraction, C/C++ Syntax, Pointers, Memory Leaks.

The Architect (Complexity): Big O, Recurrence, Pseudo-code.

The Search & Sort Library: Linear/Binary Search, Bubble/Insertion/Selection vs Quick/Merge Sort.

The Vault (ADTs): Arrays, Linked Lists, Stacks, Queues (Manual implementation).

The Forest (Trees): BST, AVL, Red-Black Trees (Rotations), Heaps.

The Web (Graphs): BFS/DFS, Shortest Path (Dijkstra), MST.

The Grandmaster: Algorithmic Strategies (Greedy, DP, Backtracking).

⚔️ Module B: The Arena (Multiplayer MVP)

Real-time battles with spectator support.

Lobby System: Users create a room -> Get a 6-digit code -> Share with friend -> Friend joins.

Modes (Launch MVP):

1v1 Debug Duel: Fix a bug. First to pass tests wins.

4-Player Battle Royale: Free-for-all. 4 players on one screen. Viewers see a 2x2 grid of progress.

Optimization Race: Winner determined by lowest time complexity and memory usage.

Theory Blitz: Rapid-fire multiple choice (e.g., "What is the worst case of Quicksort?").

Integrity System (Anti-Cheat):

Focus Check: Detect if user switches tabs (blur event). Flash warning to spectators.

Paste Guard: Disable pasting into the editor to prevent LLM copy-pasta.

Replay: Record keystrokes for post-game review.

Tech Requirement: Must use Firebase Realtime DB to sync state (progress bars, "Opponent Submitted" alerts) with < 100ms latency.

🏆 Module C: Social & Profile

Leaderboards: Filter by Global, Weekly, and Nationality.

Profile: User avatar, Nationality Flag (Emoji), "Elo Rating" (starts at 1200), and Badges earned from Campaign.

4. Future Roadmap (Post-Launch / Version 2.0)

Features to be built after the initial 3-week sprint.

Co-op Pair Programming: 2v2 Relay mode where partners swap roles (Driver/Navigator) every 60 seconds.

Code Golf: Solve a problem using the fewest characters possible.

The Unit Tester: Player A writes unit tests (corner cases), Player B writes code to pass them.

Visualizer Betting: Spectators bet "coins" on which algorithm (e.g., QuickSort vs MergeSort) will finish sorting a specific random dataset first.

5. Specific "Spectacular" Features (For Cursor to Generate)

The Landing Page (Entropy Hook):

Initial State: A clean, rigid grid of code blocks and textbooks.

Interaction: When the user clicks "Enter," gravity activates. The elements fall, collide (using matter-js or framer-motion physics), and reveal the sleek "Arena" UI underneath.

Headline: "Turn Your Struggle into a Story."

The Code Editor:

Must support C++ syntax highlighting.

Must have a "Run" button that hits Judge0.

Must have a "Check Memory" button (simulating Valgrind checks).

6. Development Guidelines for Cursor

Components: Write small, reusable functional components (e.g., Button.jsx, CodeEditor.jsx, CampaignNode.jsx).

Routing: Use src/pages/ for full views and src/components/ for parts.

Error Handling: Always implement try-catch blocks for Firebase and API calls. Fail gracefully with UI feedback (Toast notifications).

Mobile First: The UI must be responsive. The Code Editor can be read-only on mobile, but Quizzes must be playable.


Functional Requirements:
### Campaign Data Schema (Full 7 Regions)
const CAMPAIGN_REGIONS = [
  {
    id: 1,
    title: "The Genesis",
    subtitle: "Foundations & Memory Management",
    position: { x: 50, y: 5 }, // Top Center
    status: "active",
    chapters: [
      { id: "1-1", title: "The Software Development Lifecycle", type: "theory" },
      { id: "1-2", title: "C++ Syntax & Types", type: "code" },
      { id: "1-3", title: "Pointers & References", type: "code" },
      { id: "1-4", title: "The Memory Leak", type: "debug" }
    ]
  },
  {
    id: 2,
    title: "The Architect",
    subtitle: "Complexity & Big O",
    position: { x: 20, y: 18 }, // Left
    status: "locked",
    chapters: [
      { id: "2-1", title: "Formalisms (Pseudocode)", type: "theory" },
      { id: "2-2", title: "Big O Analysis", type: "quiz" },
      { id: "2-3", title: "Recurrence Relationships", type: "quiz" },
      { id: "2-4", title: "Iterative vs Recursive", type: "code" }
    ]
  },
  {
    id: 3,
    title: "The Search & Sort Library",
    subtitle: "Linear vs Logarithmic",
    position: { x: 80, y: 31 }, // Right
    status: "locked",
    chapters: [
      { id: "3-1", title: "Searching Algorithms", type: "code" },
      { id: "3-2", title: "Basic Sorts (Bubble/Insertion)", type: "visualizer" },
      { id: "3-3", title: "Advanced Sorts (Quick/Merge)", type: "code" },
      { id: "3-4", title: "Stability & Efficiency", type: "theory" }
    ]
  },
  {
    id: 4,
    title: "The Vault",
    subtitle: "Abstract Data Types",
    position: { x: 35, y: 44 }, // Center-Left
    status: "locked",
    chapters: [
      { id: "4-1", title: "Encapsulation & Hiding", type: "theory" },
      { id: "4-2", title: "Dynamic Arrays", type: "code" },
      { id: "4-3", title: "Linked Lists (Singly/Doubly)", type: "code" },
      { id: "4-4", title: "Stacks & Queues", type: "debug" }
    ]
  },
  {
    id: 5,
    title: "The Forest",
    subtitle: "Trees & Heaps",
    position: { x: 65, y: 57 }, // Center-Right
    status: "locked",
    chapters: [
      { id: "5-1", title: "Binary Search Trees", type: "visualizer" },
      { id: "5-2", title: "Tree Traversals", type: "code" },
      { id: "5-3", title: "Red-Black Trees", type: "theory" },
      { id: "5-4", title: "Heaps & Priority Queues", type: "code" }
    ]
  },
  {
    id: 6,
    title: "The Web",
    subtitle: "Graphs & Hashing",
    position: { x: 50, y: 70 }, // Center
    status: "locked",
    chapters: [
      { id: "6-1", title: "Graph Representations", type: "theory" },
      { id: "6-2", title: "BFS & DFS", type: "code" },
      { id: "6-3", title: "Shortest Path (Dijkstra)", type: "code" },
      { id: "6-4", title: "Hash Tables & Collisions", type: "code" }
    ]
  },
  {
    id: 7,
    title: "The Grandmaster",
    subtitle: "Strategies & Correctness",
    position: { x: 50, y: 85 }, // Bottom Center (The End)
    status: "locked",
    chapters: [
      { id: "7-1", title: "Greedy Algorithms", type: "code" },
      { id: "7-2", title: "Divide & Conquer", type: "code" },
      { id: "7-3", title: "Dynamic Programming", type: "code" },
      { id: "7-4", title: "Formal Verification", type: "theory" },
      { id: "7-5", title: "The Final Exam", type: "exam" }
    ]
  }
];