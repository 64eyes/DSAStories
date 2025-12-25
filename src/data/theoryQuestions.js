/**
 * Theory Questions Database
 * Multiple-choice questions for speed racing mode
 */

export const THEORY_QUESTIONS = {
  // C++ Foundations
  'cpp-foundations': [
    {
      id: 'cpp-1',
      question: 'What is the time complexity of accessing an element in a C-style array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correct: 0,
      explanation: 'Array access by index is O(1) because it uses direct memory addressing.',
    },
    {
      id: 'cpp-2',
      question: 'What happens if you use `delete` on a pointer that was allocated with `malloc`?',
      options: [
        'Undefined behavior',
        'Memory is correctly freed',
        'Compilation error',
        'Runtime error',
      ],
      correct: 0,
      explanation: '`delete` must be paired with `new`, and `free` with `malloc`. Mixing them causes undefined behavior.',
    },
    {
      id: 'cpp-3',
      question: 'What is the size of a pointer on a 64-bit system?',
      options: ['4 bytes', '8 bytes', '16 bytes', 'Depends on the type'],
      correct: 1,
      explanation: 'On a 64-bit system, pointers are 8 bytes regardless of what they point to.',
    },
    {
      id: 'cpp-4',
      question: 'What does `int* ptr = nullptr;` do?',
      options: [
        'Creates an uninitialized pointer',
        'Creates a null pointer',
        'Creates a pointer to address 0',
        'Causes a compilation error',
      ],
      correct: 1,
      explanation: '`nullptr` is the modern C++ way to represent a null pointer.',
    },
    {
      id: 'cpp-5',
      question: 'What is the difference between `new` and `malloc`?',
      options: [
        '`new` calls constructors, `malloc` does not',
        '`new` is faster',
        '`malloc` is type-safe',
        'There is no difference',
      ],
      correct: 0,
      explanation: '`new` is C++ and calls constructors, while `malloc` is C and only allocates raw memory.',
    },
  ],

  // Complexity & Big O
  'complexity': [
    {
      id: 'bigo-1',
      question: 'What is the time complexity of binary search on a sorted array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 1,
      explanation: 'Binary search eliminates half the search space each iteration, resulting in O(log n).',
    },
    {
      id: 'bigo-2',
      question: 'What is the best-case time complexity of quicksort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correct: 1,
      explanation: 'In the best case, quicksort partitions evenly, resulting in O(n log n).',
    },
    {
      id: 'bigo-3',
      question: 'What is the space complexity of merge sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: 'Merge sort requires O(n) extra space for the temporary arrays during merging.',
    },
    {
      id: 'bigo-4',
      question: 'What is the time complexity of finding the maximum element in an unsorted array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correct: 2,
      explanation: 'You must examine every element once, resulting in O(n).',
    },
    {
      id: 'bigo-5',
      question: 'What is the worst-case time complexity of insertion sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correct: 2,
      explanation: 'In the worst case (reverse sorted), insertion sort requires O(n²) comparisons.',
    },
  ],

  // Data Structures
  'data-structures': [
    {
      id: 'ds-1',
      question: 'What is the time complexity of inserting at the head of a linked list?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correct: 0,
      explanation: 'Inserting at the head only requires updating the head pointer, which is O(1).',
    },
    {
      id: 'ds-2',
      question: 'What data structure uses LIFO (Last In, First Out)?',
      options: ['Queue', 'Stack', 'Heap', 'Tree'],
      correct: 1,
      explanation: 'A stack follows LIFO: the last element added is the first one removed.',
    },
    {
      id: 'ds-3',
      question: 'What is the height of a balanced binary tree with n nodes?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 1,
      explanation: 'A balanced binary tree has height O(log n), allowing efficient operations.',
    },
    {
      id: 'ds-4',
      question: 'What is the time complexity of searching in a hash table (average case)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correct: 0,
      explanation: 'Hash tables provide O(1) average-case lookup time.',
    },
    {
      id: 'ds-5',
      question: 'What is the worst-case time complexity of searching in a binary search tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: 'In the worst case (unbalanced tree), a BST degrades to a linked list with O(n) search.',
    },
  ],

  // Algorithms
  'algorithms': [
    {
      id: 'alg-1',
      question: 'Which algorithm finds the shortest path in an unweighted graph?',
      options: ['Dijkstra', 'BFS', 'DFS', 'A*'],
      correct: 1,
      explanation: 'BFS (Breadth-First Search) finds the shortest path in unweighted graphs.',
    },
    {
      id: 'alg-2',
      question: 'What is the time complexity of Dijkstra\'s algorithm with a binary heap?',
      options: ['O(V)', 'O(V log V)', 'O(V²)', 'O(V + E log V)'],
      correct: 3,
      explanation: 'With a binary heap, Dijkstra\'s is O(V + E log V) where V is vertices and E is edges.',
    },
    {
      id: 'alg-3',
      question: 'What is the greedy choice property?',
      options: [
        'Always choose the largest option',
        'A locally optimal choice leads to a globally optimal solution',
        'Choose randomly',
        'Always choose the first option',
      ],
      correct: 1,
      explanation: 'Greedy algorithms make locally optimal choices that lead to global optimality.',
    },
    {
      id: 'alg-4',
      question: 'What is memoization used for in dynamic programming?',
      options: [
        'To store intermediate results',
        'To reduce space complexity',
        'To increase time complexity',
        'To avoid recursion',
      ],
      correct: 0,
      explanation: 'Memoization stores previously computed results to avoid redundant calculations.',
    },
    {
      id: 'alg-5',
      question: 'What is the time complexity of finding all permutations of n elements?',
      options: ['O(n)', 'O(n log n)', 'O(n!)', 'O(2ⁿ)'],
      correct: 2,
      explanation: 'There are n! permutations of n elements, so generating all of them is O(n!).',
    },
  ],
}

/**
 * Get random questions from a category
 * @param {string} category - The question category
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

