/**
 * Theory Questions Database
 * Comprehensive academic-level questions based on CMU 04-630 syllabus
 * Multiple-choice questions for speed racing mode
 */

export const THEORY_QUESTIONS = {
  // C++ Foundations - Pointers, Memory Management, File Streams, Preprocessor
  'cpp': [
    {
      id: 'cpp-1',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What happens if you delete a pointer twice?',
      codeSnippet: `int* ptr = new int(42);
delete ptr;
delete ptr; // What happens here?`,
      options: [
        'Undefined behavior (double free)',
        'Memory is correctly freed twice',
        'Compilation error',
        'Runtime error with clear message',
      ],
      correctAnswer: 0,
      explanation: 'Deleting a pointer twice causes undefined behavior, often resulting in a "double free" error. The memory may have been reused, leading to corruption or crashes.',
    },
    {
      id: 'cpp-2',
      category: 'cpp',
      type: 'concept',
      question: 'What is the size of `int*` on a 64-bit system?',
      codeSnippet: null,
      options: ['4 bytes', '8 bytes', '16 bytes', 'Depends on the type being pointed to'],
      correctAnswer: 1,
      explanation: 'On a 64-bit system, all pointers are 8 bytes regardless of what they point to. The pointer size is determined by the address space, not the data type.',
    },
    {
      id: 'cpp-3',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What is the output of this code?',
      codeSnippet: `int arr[5] = {1, 2, 3, 4, 5};
int* p = arr;
std::cout << *(p + 2) << std::endl;`,
      options: ['1', '2', '3', 'Compilation error'],
      correctAnswer: 2,
      explanation: 'Pointer arithmetic: `p + 2` moves the pointer 2 positions forward, so `*(p + 2)` dereferences the element at index 2, which is 3.',
    },
    {
      id: 'cpp-4',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What happens when you use `delete` on a pointer allocated with `malloc`?',
      codeSnippet: `int* ptr = (int*)malloc(sizeof(int));
*ptr = 42;
delete ptr; // What happens?`,
      options: [
        'Undefined behavior',
        'Memory is correctly freed',
        'Compilation error',
        'Runtime error with clear message',
      ],
      correctAnswer: 0,
      explanation: '`delete` must be paired with `new`, and `free` with `malloc`. Mixing them causes undefined behavior because they use different memory allocators.',
    },
    {
      id: 'cpp-5',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What is the value of `x` after this code executes?',
      codeSnippet: `int x = 5;
int* p = &x;
int** pp = &p;
**pp = 10;`,
      options: ['5', '10', 'Undefined', 'Compilation error'],
      correctAnswer: 1,
      explanation: '`pp` is a pointer to a pointer. `**pp` dereferences twice: first to get `p`, then to get `x`. So `**pp = 10` sets `x = 10`.',
    },
    {
      id: 'cpp-6',
      category: 'cpp',
      type: 'concept',
      question: 'Which flag opens a file for appending in C++?',
      codeSnippet: null,
      options: ['ios::in', 'ios::out', 'ios::app', 'ios::binary'],
      correctAnswer: 2,
      explanation: '`ios::app` opens the file in append mode, meaning all writes go to the end of the file. This is useful for logging or accumulating data.',
    },
    {
      id: 'cpp-7',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What is the output of this code?',
      codeSnippet: `int arr[3] = {10, 20, 30};
int* p = arr;
std::cout << p[1] << " " << *(p + 1) << std::endl;`,
      options: ['10 10', '20 20', '10 20', '20 10'],
      correctAnswer: 1,
      explanation: 'Both `p[1]` and `*(p + 1)` are equivalent ways to access the element at index 1, which is 20.',
    },
    {
      id: 'cpp-8',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What happens when you dereference a null pointer?',
      codeSnippet: `int* ptr = nullptr;
int x = *ptr; // What happens?`,
      options: [
        'Undefined behavior (segmentation fault)',
        'x gets value 0',
        'Compilation error',
        'Runtime error with clear message',
      ],
      correctAnswer: 0,
      explanation: 'Dereferencing a null pointer causes undefined behavior, typically resulting in a segmentation fault. The program may crash immediately or corrupt memory.',
    },
    {
      id: 'cpp-9',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What is the difference between `int* p` and `int *p`?',
      codeSnippet: `int* p1;
int *p2;`,
      options: [
        'No difference, both declare pointers',
        'p1 is a pointer, p2 is not',
        'p1 is not a pointer, p2 is',
        'Syntax error in one of them',
      ],
      correctAnswer: 0,
      explanation: 'In C++, `int* p` and `int *p` are equivalent. The whitespace is ignored. Both declare a pointer to an integer. Style preference only.',
    },
    {
      id: 'cpp-10',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What is the output of this code?',
      codeSnippet: `int x = 5;
int& ref = x;
ref = 10;
std::cout << x << std::endl;`,
      options: ['5', '10', 'Undefined', 'Compilation error'],
      correctAnswer: 1,
      explanation: 'A reference is an alias. When you modify `ref`, you modify `x` because they refer to the same memory location. So `x` becomes 10.',
    },
    {
      id: 'cpp-11',
      category: 'cpp',
      type: 'code_prediction',
      question: 'What happens if you use `delete[]` on a pointer allocated with `new` (single object)?',
      codeSnippet: `int* ptr = new int(42);
delete[] ptr; // What happens?`,
      options: [
        'Undefined behavior',
        'Memory is correctly freed',
        'Compilation error',
        'Only the first element is freed',
      ],
      correctAnswer: 0,
      explanation: '`delete[]` must be paired with `new[]`, and `delete` with `new`. Using `delete[]` on a single object causes undefined behavior.',
    },
    {
      id: 'cpp-12',
      category: 'cpp',
      type: 'concept',
      question: 'What does the preprocessor directive `#include <iostream>` do?',
      codeSnippet: null,
      options: [
        'Includes the iostream library at compile time',
        'Includes the iostream library at runtime',
        'Defines a macro',
        'Creates a namespace',
      ],
      correctAnswer: 0,
      explanation: '`#include` is a preprocessor directive that copies the contents of the header file into the source file before compilation. It happens at compile time, not runtime.',
    },
  ],

  // Complexity & Analysis - Big O, Recurrence Relations
  'complexity': [
    {
      id: 'comp-1',
      category: 'complexity',
      type: 'concept',
      question: 'What is the time complexity of building a heap from an unsorted array?',
      codeSnippet: null,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 0,
      explanation: 'Building a heap bottom-up using heapify has time complexity O(n), not O(n log n). This is because most nodes are near the bottom and require fewer operations.',
    },
    {
      id: 'comp-2',
      category: 'complexity',
      type: 'code_prediction',
      question: 'What is the time complexity of this nested loop?',
      codeSnippet: `for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // O(1) operation
    }
}`,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'The inner loop runs (n-i) times for each i. Total iterations: n + (n-1) + ... + 1 = n(n+1)/2 = O(n²).',
    },
    {
      id: 'comp-3',
      category: 'complexity',
      type: 'concept',
      question: 'Solve the recurrence: T(n) = 2T(n/2) + O(n). What is T(n)?',
      codeSnippet: null,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'This is the Master Theorem case 2. With a=2, b=2, f(n)=O(n), we have T(n) = O(n log n). This describes merge sort and many divide-and-conquer algorithms.',
    },
    {
      id: 'comp-4',
      category: 'complexity',
      type: 'code_prediction',
      question: 'What is the time complexity of this recursive function?',
      codeSnippet: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`,
      options: ['O(n)', 'O(2ⁿ)', 'O(n log n)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'This naive Fibonacci implementation has exponential time complexity O(2ⁿ) because it recalculates the same values many times. Each call spawns two more calls.',
    },
    {
      id: 'comp-5',
      category: 'complexity',
      type: 'concept',
      question: 'What is the space complexity of quicksort (in-place version)?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'In-place quicksort uses O(log n) space for the recursion stack in the average case. In the worst case (unbalanced partitions), it can be O(n).',
    },
    {
      id: 'comp-6',
      category: 'complexity',
      type: 'code_prediction',
      question: 'What is the time complexity of this algorithm?',
      codeSnippet: `for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
        // O(1) operation
    }
}`,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'The inner loop runs i times for each i. Total: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 = O(n²).',
    },
    {
      id: 'comp-7',
      category: 'complexity',
      type: 'concept',
      question: 'Solve the recurrence: T(n) = T(n-1) + O(1). What is T(n)?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'This recurrence describes a linear scan. Each step does O(1) work and reduces the problem by 1. Solution: T(n) = O(n).',
    },
    {
      id: 'comp-8',
      category: 'complexity',
      type: 'code_prediction',
      question: 'What is the time complexity of binary search on a sorted array?',
      codeSnippet: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Binary search eliminates half the search space each iteration. With n elements, it takes at most log₂(n) iterations, so O(log n).',
    },
    {
      id: 'comp-9',
      category: 'complexity',
      type: 'concept',
      question: 'What is the amortized time complexity of inserting n elements into a dynamic array that doubles in size when full?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Amortized analysis: While some insertions trigger O(n) resizing, the average cost per insertion is O(1). The expensive operations are rare enough that they average out.',
    },
    {
      id: 'comp-10',
      category: 'complexity',
      type: 'code_prediction',
      question: 'What is the time complexity of this algorithm?',
      codeSnippet: `for (int i = 1; i < n; i *= 2) {
    for (int j = 0; j < i; j++) {
        // O(1) operation
    }
}`,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'The outer loop runs log n times (i = 1, 2, 4, 8, ..., n). The inner loop runs i times. Total: 1 + 2 + 4 + ... + n = 2n - 1 = O(n).',
    },
    {
      id: 'comp-11',
      category: 'complexity',
      type: 'concept',
      question: 'What is the best-case time complexity of quicksort?',
      codeSnippet: null,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'In the best case, quicksort partitions the array evenly each time, resulting in balanced recursion. This gives O(n log n) time complexity.',
    },
    {
      id: 'comp-12',
      category: 'complexity',
      type: 'concept',
      question: 'What is the time complexity of finding the kth largest element using a heap?',
      codeSnippet: null,
      options: ['O(n)', 'O(n log k)', 'O(k log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Build a min-heap of size k: O(k). For each remaining element: O(log k) to insert/extract. Total: O(k + (n-k)log k) = O(n log k).',
    },
  ],

  // Data Structures - ADTs, Trees, Heaps, Hash Tables
  'dsa': [
    {
      id: 'dsa-1',
      category: 'dsa',
      type: 'concept',
      question: 'In a Red-Black Tree, what color is the root node?',
      codeSnippet: null,
      options: ['Always red', 'Always black', 'Can be either', 'Depends on the tree size'],
      correctAnswer: 1,
      explanation: 'Red-Black Tree property: The root is always black. This is one of the invariants that maintains balance in the tree.',
    },
    {
      id: 'dsa-2',
      category: 'dsa',
      type: 'concept',
      question: 'What is the worst-case search time for a hash table with chaining collision resolution?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'In the worst case, all keys hash to the same bucket, creating a linked list. Searching this list is O(n).',
    },
    {
      id: 'dsa-3',
      category: 'dsa',
      type: 'concept',
      question: 'What is the maximum number of nodes in a binary tree of height h?',
      codeSnippet: null,
      options: ['h', '2h', '2^h - 1', '2^(h+1) - 1'],
      correctAnswer: 3,
      explanation: 'A complete binary tree of height h has at most 2^(h+1) - 1 nodes. This is the maximum when every level is completely filled.',
    },
    {
      id: 'dsa-4',
      category: 'dsa',
      type: 'concept',
      question: 'In an AVL tree, what is the maximum height difference allowed between left and right subtrees?',
      codeSnippet: null,
      options: ['0', '1', '2', 'log n'],
      correctAnswer: 1,
      explanation: 'AVL trees maintain balance by ensuring the height difference between left and right subtrees is at most 1. This guarantees O(log n) operations.',
    },
    {
      id: 'dsa-5',
      category: 'dsa',
      type: 'concept',
      question: 'What is the time complexity of extracting the minimum from a min-heap?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Extracting the minimum requires removing the root, moving the last element to root, and heapifying down. Heapify is O(log n).',
    },
    {
      id: 'dsa-6',
      category: 'dsa',
      type: 'concept',
      question: 'What is the time complexity of inserting into a balanced BST?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'In a balanced BST, insertion follows a path from root to leaf. The height is O(log n), so insertion is O(log n).',
    },
    {
      id: 'dsa-7',
      category: 'dsa',
      type: 'concept',
      question: 'What is the worst-case time complexity of searching in an unbalanced BST?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'An unbalanced BST can degenerate into a linked list. In this worst case, search requires traversing all n nodes: O(n).',
    },
    {
      id: 'dsa-8',
      category: 'dsa',
      type: 'concept',
      question: 'What is the time complexity of building a heap from n elements using bottom-up heapification?',
      codeSnippet: null,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 0,
      explanation: 'Bottom-up heapification starts from the last parent and works upward. Most nodes are near the bottom, requiring fewer operations. Total: O(n).',
    },
    {
      id: 'dsa-9',
      category: 'dsa',
      type: 'concept',
      question: 'In a hash table with open addressing, what happens when the load factor approaches 1?',
      codeSnippet: null,
      options: [
        'Performance improves',
        'Collisions increase, performance degrades',
        'No change',
        'Memory usage decreases',
      ],
      correctAnswer: 1,
      explanation: 'As load factor approaches 1, the table becomes nearly full. Open addressing requires more probes to find empty slots, degrading performance.',
    },
    {
      id: 'dsa-10',
      category: 'dsa',
      type: 'concept',
      question: 'What is the time complexity of finding the predecessor of a node in a BST?',
      codeSnippet: null,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Finding predecessor requires following at most one path from the node upward, then potentially going down. In a balanced tree, this is O(log n).',
    },
    {
      id: 'dsa-11',
      category: 'dsa',
      type: 'concept',
      question: 'What is the minimum number of nodes in an AVL tree of height h?',
      codeSnippet: null,
      options: ['h', '2^h', 'F(h+2) - 1 (Fibonacci)', '2^(h+1) - 1'],
      correctAnswer: 2,
      explanation: 'The minimum nodes in an AVL tree of height h follows the Fibonacci recurrence: N(h) = N(h-1) + N(h-2) + 1, giving approximately F(h+2) - 1 nodes.',
    },
    {
      id: 'dsa-12',
      category: 'dsa',
      type: 'concept',
      question: 'What collision resolution technique uses a secondary hash function?',
      codeSnippet: null,
      options: ['Chaining', 'Linear probing', 'Quadratic probing', 'Double hashing'],
      correctAnswer: 3,
      explanation: 'Double hashing uses a second hash function to determine the step size when probing for an empty slot. This reduces clustering compared to linear probing.',
    },
  ],

  // Algorithms - Sorting, Graph Traversals, Strategies
  'algos': [
    {
      id: 'algos-1',
      category: 'algos',
      type: 'concept',
      question: 'You need to find the shortest path in a weighted graph with no negative edges. Which algorithm?',
      codeSnippet: null,
      options: ['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford'],
      correctAnswer: 2,
      explanation: 'Dijkstra\'s algorithm finds shortest paths in weighted graphs with non-negative edges. It uses a greedy approach with a priority queue.',
    },
    {
      id: 'algos-2',
      category: 'algos',
      type: 'concept',
      question: 'Which sorting algorithms are stable?',
      codeSnippet: null,
      options: [
        'Quick sort, Heap sort',
        'Merge sort, Insertion sort',
        'Selection sort, Quick sort',
        'Heap sort, Selection sort',
      ],
      correctAnswer: 1,
      explanation: 'Stable sorts preserve relative order of equal elements. Merge sort and Insertion sort are stable. Quick sort and Heap sort are not.',
    },
    {
      id: 'algos-3',
      category: 'algos',
      type: 'concept',
      question: 'What is the time complexity of Dijkstra\'s algorithm with a binary heap?',
      codeSnippet: null,
      options: ['O(V)', 'O(V log V)', 'O(V²)', 'O((V + E) log V)'],
      correctAnswer: 3,
      explanation: 'With a binary heap, each extract-min is O(log V) and each edge relaxation is O(log V). Total: O((V + E) log V) where V is vertices and E is edges.',
    },
    {
      id: 'algos-4',
      category: 'algos',
      type: 'concept',
      question: 'Which algorithm finds all strongly connected components in a directed graph?',
      codeSnippet: null,
      options: ['BFS', 'DFS', 'Kosaraju\'s algorithm', 'Dijkstra'],
      correctAnswer: 2,
      explanation: 'Kosaraju\'s algorithm uses two DFS passes (one on the graph, one on the transpose) to find all strongly connected components.',
    },
    {
      id: 'algos-5',
      category: 'algos',
      type: 'concept',
      question: 'What is the greedy choice in the Activity Selection problem?',
      codeSnippet: null,
      options: [
        'Select activity with earliest start time',
        'Select activity with earliest finish time',
        'Select activity with longest duration',
        'Select activity randomly',
      ],
      correctAnswer: 1,
      explanation: 'The greedy choice is to always select the activity with the earliest finish time. This leaves maximum time for remaining activities.',
    },
    {
      id: 'algos-6',
      category: 'algos',
      type: 'concept',
      question: 'What is the optimal substructure property in dynamic programming?',
      codeSnippet: null,
      options: [
        'Problem can be broken into overlapping subproblems',
        'Optimal solution contains optimal solutions to subproblems',
        'Problem can be solved greedily',
        'Problem has exponential time complexity',
      ],
      correctAnswer: 1,
      explanation: 'Optimal substructure means an optimal solution to the problem contains optimal solutions to its subproblems. This allows building solutions bottom-up.',
    },
    {
      id: 'algos-7',
      category: 'algos',
      type: 'concept',
      question: 'What is the time complexity of finding the minimum spanning tree using Kruskal\'s algorithm?',
      codeSnippet: null,
      options: ['O(E)', 'O(E log E)', 'O(V²)', 'O(V log V)'],
      correctAnswer: 1,
      explanation: 'Kruskal\'s algorithm sorts edges (O(E log E)) and uses union-find for cycle detection. With path compression, total is O(E log E).',
    },
    {
      id: 'algos-8',
      category: 'algos',
      type: 'concept',
      question: 'Which algorithm is best for finding cycles in a directed graph?',
      codeSnippet: null,
      options: ['BFS', 'DFS with color marking', 'Dijkstra', 'Floyd-Warshall'],
      correctAnswer: 1,
      explanation: 'DFS with color marking (white/gray/black) can detect cycles efficiently. Gray nodes represent nodes in the current path; encountering a gray node indicates a back edge (cycle).',
    },
    {
      id: 'algos-9',
      category: 'algos',
      type: 'concept',
      question: 'What is the time complexity of the 0/1 Knapsack problem solved with dynamic programming?',
      codeSnippet: null,
      options: ['O(n)', 'O(nW)', 'O(2ⁿ)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'DP solution uses a 2D table of size n×W where n is items and W is capacity. Each cell takes O(1) to compute, so total is O(nW).',
    },
    {
      id: 'algos-10',
      category: 'algos',
      type: 'concept',
      question: 'Which sorting algorithm has the best average-case time complexity?',
      codeSnippet: null,
      options: ['Bubble sort', 'Insertion sort', 'Quick sort', 'Selection sort'],
      correctAnswer: 2,
      explanation: 'Quick sort has O(n log n) average-case time complexity, which is optimal for comparison-based sorting. It\'s often faster in practice due to cache efficiency.',
    },
    {
      id: 'algos-11',
      category: 'algos',
      type: 'concept',
      question: 'What is the difference between BFS and DFS in terms of data structure used?',
      codeSnippet: null,
      options: [
        'BFS uses stack, DFS uses queue',
        'BFS uses queue, DFS uses stack',
        'Both use the same structure',
        'BFS uses heap, DFS uses array',
      ],
      correctAnswer: 1,
      explanation: 'BFS uses a queue (FIFO) to explore level by level. DFS uses a stack (LIFO, often via recursion) to go deep before wide.',
    },
    {
      id: 'algos-12',
      category: 'algos',
      type: 'concept',
      question: 'What is the time complexity of finding all pairs shortest paths using Floyd-Warshall?',
      codeSnippet: null,
      options: ['O(V)', 'O(V log V)', 'O(V²)', 'O(V³)'],
      correctAnswer: 3,
      explanation: 'Floyd-Warshall uses three nested loops over all vertices, giving O(V³) time complexity. It works with negative edges (but not negative cycles).',
    },
  ],
}

/**
 * Get random questions from a category
 * @param {string} category - The question category ('cpp', 'complexity', 'dsa', 'algos')
 * @param {number} count - Number of questions to return
 * @returns {Array} - Array of question objects
 */
export function getRandomQuestions(category, count = 10) {
  const questions = THEORY_QUESTIONS[category] || []
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, questions.length))
}

/**
 * Get all available categories
 * @returns {Array<string>} - Array of category keys
 */
export function getCategories() {
  return Object.keys(THEORY_QUESTIONS)
}
