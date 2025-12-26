/**
 * Campaign Chapter Content
 * Contains narrative, objectives, starter code, and solutions for each chapter
 */

export const CHAPTER_CONTENT = {
  // Region 1: The Genesis - C++ Foundations (20 Micro-Challenges)
  // Cluster 1: I/O and Structure (1-1 to 1-4)
  '1-1': {
    title: 'The Boot Sequence',
    story: `# The Boot Sequence

The Archives are offline. The initialization script is riddled with syntax errors. You must restore the standard I/O streams.

The system cannot boot without proper input/output capabilities. The compiler is reporting that \`cout\` is not defined—a critical error that prevents any output from being displayed.

**Your Mission:** Fix the includes and namespace to output "System Online".`,
    objective: 'Fix the includes and namespace to output "System Online"',
    starterCode: `// MISSING: Include the IO library
int main() {
    // ERROR: cout is not defined in this scope
    cout << "System Online" << endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    std::cout << "System Online" << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'System Online\n',
    testCaseInput: '',
    nextChapterId: '1-2',
    resources: [
      {
        title: 'C++ Input/Output',
        link: 'https://en.cppreference.com/w/cpp/io',
      },
    ],
  },
  '1-2': {
    title: 'The Console Output',
    story: `# The Console Output

The diagnostic terminal is showing garbled text. The output stream needs proper formatting to display system status.

Multiple values must be printed on separate lines with correct formatting. The stream operators are not properly chained.

**Your Mission:** Fix the output statements to print "Status: OK" and "Code: 200" on separate lines.`,
    objective: 'Fix output formatting to print multiple lines correctly',
    starterCode: `#include <iostream>

int main() {
    std::cout << "Status: OK" << "Code: 200";
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    std::cout << "Status: OK" << std::endl;
    std::cout << "Code: 200" << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Status: OK\nCode: 200\n',
    testCaseInput: '',
    nextChapterId: '1-3',
    resources: [
      {
        title: 'std::cout',
        link: 'https://en.cppreference.com/w/cpp/io/cout',
      },
    ],
  },
  '1-3': {
    title: 'The Input Stream',
    story: `# The Input Stream

The sensor array requires user input to calibrate. The input stream is not properly configured to read from the console.

Without proper input handling, the system cannot receive configuration parameters from the operator.

**Your Mission:** Read an integer from input and print it back with the message "Received: [value]" where [value] is the integer you read. The program should work with any integer input value.`,
    objective: 'Read an integer from input and display it in the format "Received: [value]"',
    starterCode: `#include <iostream>

int main() {
    int value;
    // TODO: Read value from input
    std::cout << "Received: " << value << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int value;
    std::cin >> value;
    std::cout << "Received: " << value << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Received: 42\n',
    testCaseInput: '42',
    nextChapterId: '1-4',
    resources: [
      {
        title: 'std::cin',
        link: 'https://en.cppreference.com/w/cpp/io/cin',
      },
    ],
  },
  '1-4': {
    title: 'The Program Structure',
    story: `# The Program Structure

The main function is missing. Without the entry point, the system cannot execute any code.

Every C++ program must have a \`main\` function as its entry point. The compiler cannot find it.

**Your Mission:** Add the missing main function that prints "Program Started".`,
    objective: 'Add the main function to create a valid C++ program',
    starterCode: `#include <iostream>

// TODO: Add main function here
    std::cout << "Program Started" << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    std::cout << "Program Started" << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Program Started\n',
    testCaseInput: '',
    nextChapterId: '1-5',
    resources: [
      {
        title: 'main function',
        link: 'https://en.cppreference.com/w/cpp/language/main_function',
      },
    ],
  },
  // Cluster 2: Variables, Constants, Types (1-5 to 1-8)
  '1-5': {
    title: 'The Variable Declaration',
    story: `# The Variable Declaration

The temperature sensor readings are uninitialized. Variables must be declared before use, or the system will read garbage values.

Uninitialized variables contain undefined values, leading to unpredictable behavior and system instability.

**Your Mission:** Declare an integer variable named \`temperature\`, assign it the value 25, and print it.`,
    objective: 'Declare and initialize an integer variable',
    starterCode: `#include <iostream>

int main() {
    // TODO: Declare and initialize temperature
    std::cout << "Temperature: " << temperature << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int temperature = 25;
    std::cout << "Temperature: " << temperature << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Temperature: 25\n',
    testCaseInput: '',
    nextChapterId: '1-6',
    resources: [
      {
        title: 'Variables',
        link: 'https://www.learncpp.com/cpp-tutorial/introduction-to-variables/',
      },
    ],
  },
  '1-6': {
    title: 'The Constant Value',
    story: `# The Constant Value

The reactor's maximum safe temperature must never change. Using a regular variable risks accidental modification.

Constants protect critical values from being overwritten. The system requires a constant to store the maximum temperature limit.

**Your Mission:** Declare a constant integer \`MAX_TEMP\` with value 100 and print it.`,
    objective: 'Declare and use a constant variable',
    starterCode: `#include <iostream>

int main() {
    // TODO: Declare constant MAX_TEMP = 100
    std::cout << "Max Temperature: " << MAX_TEMP << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    const int MAX_TEMP = 100;
    std::cout << "Max Temperature: " << MAX_TEMP << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Max Temperature: 100\n',
    testCaseInput: '',
    nextChapterId: '1-7',
    resources: [
      {
        title: 'const keyword',
        link: 'https://en.cppreference.com/w/cpp/language/cv',
      },
    ],
  },
  '1-7': {
    title: 'The Type Mismatch',
    story: `# The Type Mismatch

The calculation is producing incorrect results. A floating-point value is being stored in an integer variable, causing precision loss.

Type compatibility is critical. Mixing types incorrectly leads to data loss and calculation errors.

**Your Mission:** Fix the type declaration to store a floating-point value (3.14) correctly.`,
    objective: 'Use the correct data type for floating-point values',
    starterCode: `#include <iostream>

int main() {
    int pi = 3.14; // ERROR: Wrong type
    std::cout << "Pi: " << pi << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    double pi = 3.14;
    std::cout << "Pi: " << pi << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Pi: 3.14\n',
    testCaseInput: '',
    nextChapterId: '1-8',
    resources: [
      {
        title: 'Fundamental Types',
        link: 'https://en.cppreference.com/w/cpp/language/types',
      },
    ],
  },
  '1-8': {
    title: 'The Character Code',
    story: `# The Character Code

The security system requires single-character input for access codes. The system is reading integers instead of characters.

Character types are essential for single-byte data. Using the wrong type causes input parsing failures.

**Your Mission:** Read a character from input and print it with the message "Code: [character]" where [character] is the character you read. The program should work with any character input.`,
    objective: 'Read and display a character value in the format "Code: [character]"',
    starterCode: `#include <iostream>

int main() {
    // TODO: Declare and read a character
    std::cout << "Code: " << code << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    char code;
    std::cin >> code;
    std::cout << "Code: " << code << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Code: A\n',
    testCaseInput: 'A',
    nextChapterId: '1-9',
    resources: [
      {
        title: 'char type',
        link: 'https://en.cppreference.com/w/cpp/language/types',
      },
    ],
  },
  // Cluster 3: Control Flow (1-9 to 1-13)
  '1-9': {
    title: 'The Conditional Check',
    story: `# The Conditional Check

The reactor temperature is critical. The system must check if the temperature exceeds the safe limit and trigger an alarm.

Conditional statements enable decision-making in code. Without proper conditionals, the system cannot respond to changing states.

**Your Mission:** Check if temperature (read from input) is greater than 100. If true, print "ALARM: Overheating!".`,
    objective: 'Use an if statement to check a condition',
    starterCode: `#include <iostream>

int main() {
    int temperature;
    std::cin >> temperature;
    // TODO: Add if statement to check temperature > 100
    std::cout << "ALARM: Overheating!" << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int temperature;
    std::cin >> temperature;
    if (temperature > 100) {
        std::cout << "ALARM: Overheating!" << std::endl;
    }
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'ALARM: Overheating!\n',
    testCaseInput: '150',
    nextChapterId: '1-10',
    resources: [
      {
        title: 'if statement',
        link: 'https://en.cppreference.com/w/cpp/language/if',
      },
    ],
  },
  '1-10': {
    title: 'The If-Else Branch',
    story: `# The If-Else Branch

The system status must display different messages based on the temperature reading. A single condition is not enough.

If-else statements provide alternative execution paths. The system needs to handle both safe and unsafe conditions.

**Your Mission:** If temperature > 100, print "ALARM". Otherwise, print "Status: Normal".`,
    objective: 'Use if-else to handle two different conditions',
    starterCode: `#include <iostream>

int main() {
    int temperature;
    std::cin >> temperature;
    // TODO: Add if-else statement
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int temperature;
    std::cin >> temperature;
    if (temperature > 100) {
        std::cout << "ALARM" << std::endl;
    } else {
        std::cout << "Status: Normal" << std::endl;
    }
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Status: Normal\n',
    testCaseInput: '75',
    nextChapterId: '1-11',
    resources: [
      {
        title: 'if-else',
        link: 'https://en.cppreference.com/w/cpp/language/if',
      },
    ],
  },
  '1-11': {
    title: 'The Switch Statement',
    story: `# The Switch Statement

The command center requires handling multiple operation modes. Using multiple if-else statements is inefficient and error-prone.

Switch statements provide clean multi-way branching. The system needs to handle mode codes: 1=Standby, 2=Active, 3=Emergency.

**Your Mission:** Use a switch statement to print the mode name based on the input code (1, 2, or 3).`,
    objective: 'Use a switch statement for multi-way branching',
    starterCode: `#include <iostream>

int main() {
    int mode;
    std::cin >> mode;
    // TODO: Add switch statement
    // case 1: "Standby"
    // case 2: "Active"
    // case 3: "Emergency"
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int mode;
    std::cin >> mode;
    switch (mode) {
        case 1:
            std::cout << "Standby" << std::endl;
            break;
        case 2:
            std::cout << "Active" << std::endl;
            break;
        case 3:
            std::cout << "Emergency" << std::endl;
            break;
    }
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Active\n',
    testCaseInput: '2',
    nextChapterId: '1-12',
    resources: [
      {
        title: 'switch statement',
        link: 'https://en.cppreference.com/w/cpp/language/switch',
      },
    ],
  },
  '1-12': {
    title: 'The For Loop',
    story: `# The For Loop

The diagnostic system needs to run 10 consecutive tests. Manual repetition would be inefficient and error-prone.

For loops enable controlled repetition. The system requires exactly 10 iterations to complete the diagnostic sequence.

**Your Mission:** Use a for loop to print "Test 1" through "Test 10".`,
    objective: 'Use a for loop to repeat code a specific number of times',
    starterCode: `#include <iostream>

int main() {
    // TODO: Add for loop to print Test 1 to Test 10
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    for (int i = 1; i <= 10; i++) {
        std::cout << "Test " << i << std::endl;
    }
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Test 1\nTest 2\nTest 3\nTest 4\nTest 5\nTest 6\nTest 7\nTest 8\nTest 9\nTest 10\n',
    testCaseInput: '',
    nextChapterId: '1-13',
    resources: [
      {
        title: 'for loop',
        link: 'https://en.cppreference.com/w/cpp/language/for',
      },
    ],
  },
  '1-13': {
    title: 'The While Loop',
    story: `# The While Loop

The data stream must be processed until it reaches the end marker (value 0). The number of iterations is unknown beforehand.

While loops handle condition-based repetition. The system must continue processing until the termination condition is met.

**Your Mission:** Use a while loop to read integers and sum them until you read 0, then print the sum. The program should work with any sequence of integers ending with 0.`,
    objective: 'Use a while loop to read and sum integers until 0 is encountered',
    starterCode: `#include <iostream>

int main() {
    int sum = 0;
    int value;
    // TODO: Add while loop to read and sum until 0
    std::cout << "Sum: " << sum << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int sum = 0;
    int value;
    std::cin >> value;
    while (value != 0) {
        sum += value;
        std::cin >> value;
    }
    std::cout << "Sum: " << sum << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Sum: 15\n',
    testCaseInput: '5\n7\n3\n0\n',
    nextChapterId: '1-14',
    resources: [
      {
        title: 'while loop',
        link: 'https://en.cppreference.com/w/cpp/language/while',
      },
    ],
  },
  // Cluster 4: Functions (1-14 to 1-17)
  '1-14': {
    title: 'The Function Call',
    story: `# The Function Call

The system requires modular code organization. A function exists but is never called, leaving critical operations unexecuted.

Functions enable code reuse and organization. The system must call the function to execute its logic.

**Your Mission:** Call the \`displayStatus\` function that prints "System Operational".`,
    objective: 'Call a function to execute its code',
    starterCode: `#include <iostream>

void displayStatus() {
    std::cout << "System Operational" << std::endl;
}

int main() {
    // TODO: Call displayStatus()
    return 0;
}`,
    solution: `#include <iostream>

void displayStatus() {
    std::cout << "System Operational" << std::endl;
}

int main() {
    displayStatus();
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'System Operational\n',
    testCaseInput: '',
    nextChapterId: '1-15',
    resources: [
      {
        title: 'Functions',
        link: 'https://en.cppreference.com/w/cpp/language/functions',
      },
    ],
  },
  '1-15': {
    title: 'The Function Parameter',
    story: `# The Function Parameter

The temperature display function needs to accept a value as input. The function is defined but cannot receive data.

Function parameters enable data passing. The system must modify the function to accept and display the temperature value.

**Your Mission:** Modify \`displayTemp\` to accept an integer parameter and print "Temperature: [value]".`,
    objective: 'Define a function with parameters',
    starterCode: `#include <iostream>

void displayTemp(/* TODO: Add parameter */) {
    std::cout << "Temperature: " << temp << std::endl;
}

int main() {
    displayTemp(25);
    return 0;
}`,
    solution: `#include <iostream>

void displayTemp(int temp) {
    std::cout << "Temperature: " << temp << std::endl;
}

int main() {
    displayTemp(25);
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Temperature: 25\n',
    testCaseInput: '',
    nextChapterId: '1-16',
    resources: [
      {
        title: 'Function Parameters',
        link: 'https://www.learncpp.com/cpp-tutorial/introduction-to-function-parameters-and-arguments/',
      },
    ],
  },
  '1-16': {
    title: 'The Return Value',
    story: `# The Return Value

The calculation function must return a result. The function performs computation but doesn't return the value to the caller.

Return values enable functions to produce results. The system needs the function to return the calculated sum.

**Your Mission:** Modify \`calculateSum\` to return the sum of two integers.`,
    objective: 'Define a function that returns a value',
    starterCode: `#include <iostream>

int calculateSum(int a, int b) {
    int sum = a + b;
    // TODO: Return the sum
}

int main() {
    int result = calculateSum(10, 20);
    std::cout << "Sum: " << result << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

int calculateSum(int a, int b) {
    int sum = a + b;
    return sum;
}

int main() {
    int result = calculateSum(10, 20);
    std::cout << "Sum: " << result << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Sum: 30\n',
    testCaseInput: '',
    nextChapterId: '1-17',
    resources: [
      {
        title: 'Return Values',
        link: 'https://www.learncpp.com/cpp-tutorial/return-values/',
      },
    ],
  },
  '1-17': {
    title: 'The Pass-by-Reference',
    story: `# The Pass-by-Reference

The system needs to modify a variable inside a function. Pass-by-value creates a copy, so the original remains unchanged.

References enable functions to modify their arguments. The system must use pass-by-reference to update the original variable.

**Your Mission:** Modify \`increment\` to use a reference parameter that increments the original variable.`,
    objective: 'Use pass-by-reference to modify function arguments',
    starterCode: `#include <iostream>

void increment(/* TODO: Use reference */ int value) {
    value++;
}

int main() {
    int num = 5;
    increment(num);
    std::cout << "Value: " << num << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

void increment(int& value) {
    value++;
}

int main() {
    int num = 5;
    increment(num);
    std::cout << "Value: " << num << std::endl;
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Value: 6\n',
    testCaseInput: '',
    nextChapterId: '1-18',
    resources: [
      {
        title: 'References',
        link: 'https://en.cppreference.com/w/cpp/language/reference',
      },
    ],
  },
  // Cluster 5: Pointers and Dynamic Memory (1-18 to 1-20)
  '1-18': {
    title: 'The Pointer Declaration',
    story: `# The Pointer Declaration

The memory address must be stored for direct access. Regular variables hold values, but pointers hold addresses.

Pointers enable direct memory manipulation. The system needs a pointer to access a variable's memory location.

**Your Mission:** Declare a pointer to an integer, assign it the address of variable \`value\`, and print the value through the pointer.`,
    objective: 'Declare a pointer and use it to access a variable',
    starterCode: `#include <iostream>

int main() {
    int value = 42;
    // TODO: Declare pointer and assign address of value
    // TODO: Print value through pointer
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int value = 42;
    int* ptr = &value;
    std::cout << "Value: " << *ptr << std::endl;
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Value: 42\n',
    testCaseInput: '',
    nextChapterId: '1-19',
    resources: [
      {
        title: 'Pointers',
        link: 'https://en.cppreference.com/w/cpp/language/pointer',
      },
    ],
  },
  '1-19': {
    title: 'The Dynamic Allocation',
    story: `# The Dynamic Allocation

The system needs memory allocated at runtime. Stack variables have fixed size, but heap allocation provides flexibility.

Dynamic memory allocation enables runtime-sized data structures. The system must allocate memory on the heap.

**Your Mission:** Allocate an integer on the heap with value 100, print it, and deallocate it.`,
    objective: 'Allocate and deallocate memory on the heap',
    starterCode: `#include <iostream>

int main() {
    // TODO: Allocate integer on heap with value 100
    // TODO: Print the value
    // TODO: Deallocate the memory
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int* ptr = new int(100);
    std::cout << "Value: " << *ptr << std::endl;
    delete ptr;
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Value: 100\n',
    testCaseInput: '',
    nextChapterId: '1-20',
    resources: [
      {
        title: 'new and delete',
        link: 'https://en.cppreference.com/w/cpp/memory/new/operator_new',
      },
    ],
  },
  '1-20': {
    title: 'The Memory Protocol',
    story: `# The Memory Protocol

Warning: Memory leak detected. The system allocated memory but failed to deallocate it, violating the 04-630 protocol.

Every \`new\` must have a matching \`delete\`. Memory leaks cause system instability and eventual crashes. This is the final test of memory management.

**Your Mission:** Allocate an integer array of size 5 on the heap, initialize it, print all values, and properly deallocate it using \`delete[]\`.`,
    objective: 'Allocate an array on the heap and properly deallocate it',
    starterCode: `#include <iostream>

int main() {
    // TODO: Allocate array of 5 integers
    // TODO: Initialize array with values 10, 20, 30, 40, 50
    // TODO: Print all values
    // TODO: Deallocate using delete[]
    return 0;
}`,
    solution: `#include <iostream>

int main() {
    int* arr = new int[5];
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;
    
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    delete[] arr;
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: '10 20 30 40 50 \n',
    testCaseInput: '',
    nextChapterId: '2-1',
    requiredSyntax: ['new', 'delete'],
    resources: [
      {
        title: 'Dynamic Arrays',
        link: 'https://en.cppreference.com/w/cpp/memory/new/operator_new',
      },
    ],
  },
  '2-1': {
    title: 'Formalisms (Pseudocode)',
    story: `# The Architect's Blueprint

Before writing code, the Architect draws plans. **Pseudocode** is the bridge between human thought and machine execution.

Learn to express algorithms in structured, language-agnostic form. This skill separates novices from masters.

**Your Mission:** Write pseudocode for finding the maximum element in an array.`,
    objective: 'Write pseudocode for finding the maximum value',
    starterCode: `#include <iostream>

// Write pseudocode as comments, then implement
// PSEUDOCODE:
// 1. 
// 2. 
// 3. 

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    int size = 5;
    
    // Implement your algorithm here
    
    return 0;
}`,
    solution: `#include <iostream>

// PSEUDOCODE:
// 1. Initialize max to first element
// 2. Loop through remaining elements
// 3. If current element > max, update max
// 4. Return max

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    int size = 5;
    
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    std::cout << "Maximum: " << max << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Maximum: 9\n',
    testCaseInput: '',
    nextChapterId: '2-2',
  },
  '2-2': {
    title: 'Big O Analysis',
    story: `# The Language of Efficiency

**Big O notation** describes how algorithms scale. O(1) is constant. O(n) is linear. O(n²) is quadratic. O(log n) is logarithmic.

Master this language, and you'll see the hidden costs in every algorithm.

**Your Mission:** Analyze the time complexity of a nested loop algorithm.`,
    objective: 'Identify and explain the Big O complexity',
    starterCode: `#include <iostream>

// What is the time complexity of this algorithm?
// Answer: O(?)

int main() {
    int n = 10;
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            std::cout << i * j << " ";
        }
        std::cout << std::endl;
    }
    
    return 0;
}`,
    solution: `#include <iostream>

// Time Complexity: O(n²)
// Explanation: Nested loops, each running n times
// Outer loop: n iterations
// Inner loop: n iterations per outer iteration
// Total: n × n = n² operations

int main() {
    int n = 10;
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            std::cout << i * j << " ";
        }
        std::cout << std::endl;
    }
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: '0 0 0 0 0 0 0 0 0 0 \n0 1 2 3 4 5 6 7 8 9 \n0 2 4 6 8 10 12 14 16 18 \n0 3 6 9 12 15 18 21 24 27 \n0 4 8 12 16 20 24 28 32 36 \n0 5 10 15 20 25 30 35 40 45 \n0 6 12 18 24 30 36 42 48 54 \n0 7 14 21 28 35 42 49 56 63 \n0 8 16 24 32 40 48 56 64 72 \n0 9 18 27 36 45 54 63 72 81 \n',
    testCaseInput: '',
    nextChapterId: '2-3',
  },
  '2-3': {
    title: 'Recurrence Relationships',
    story: `# The Recursive Pattern

Recursive algorithms have **recurrence relations** that describe their complexity. T(n) = 2T(n/2) + O(n) describes merge sort.

Solve these equations, and you'll predict performance before running code.

**Your Mission:** Solve the recurrence T(n) = T(n-1) + O(1).`,
    objective: 'Solve and implement a recurrence relation',
    starterCode: `#include <iostream>

// Recurrence: T(n) = T(n-1) + O(1)
// Base case: T(1) = O(1)
// Solve: T(n) = ?

int factorial(int n) {
    // Implement recursive factorial
    // This matches the recurrence T(n) = T(n-1) + O(1)
}

int main() {
    int n = 5;
    std::cout << "Factorial of " << n << ": " << factorial(n) << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

// Recurrence: T(n) = T(n-1) + O(1)
// Solution: T(n) = O(n) - linear time

int factorial(int n) {
    if (n <= 1) return 1; // Base case: O(1)
    return n * factorial(n - 1); // T(n-1) + O(1)
}

int main() {
    int n = 5;
    std::cout << "Factorial of " << n << ": " << factorial(n) << std::endl;
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Factorial of 5: 120\n',
    testCaseInput: '',
    nextChapterId: '2-4',
  },
  '2-4': {
    title: 'Iterative vs Recursive',
    story: `# Two Paths, One Goal

Some problems can be solved **iteratively** (with loops) or **recursively** (with function calls). Each has trade-offs.

Iteration: Less memory, sometimes clearer. Recursion: Elegant, but risks stack overflow.

**Your Mission:** Implement the same algorithm both ways.`,
    objective: 'Implement an algorithm both iteratively and recursively',
    starterCode: `#include <iostream>

// Implement sum of array elements both ways

int sumIterative(int* arr, int size) {
    // Iterative version
}

int sumRecursive(int* arr, int size, int index) {
    // Recursive version
    // Hint: Base case when index >= size
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    
    std::cout << "Iterative sum: " << sumIterative(arr, size) << std::endl;
    std::cout << "Recursive sum: " << sumRecursive(arr, size, 0) << std::endl;
    
    return 0;
}`,
    solution: `#include <iostream>

int sumIterative(int* arr, int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}

int sumRecursive(int* arr, int size, int index) {
    if (index >= size) return 0; // Base case
    return arr[index] + sumRecursive(arr, size, index + 1);
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    
    std::cout << "Iterative sum: " << sumIterative(arr, size) << std::endl;
    std::cout << "Recursive sum: " << sumRecursive(arr, size, 0) << std::endl;
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Iterative sum: 15\nRecursive sum: 15\n',
    testCaseInput: '',
    nextChapterId: '3-1',
  },
  '3-1': {
    title: 'Searching Algorithms',
    story: `# The Search Begins

**Linear Search:** Check every element. O(n) time. Simple but slow.

**Binary Search:** Divide and conquer. O(log n) time. Requires sorted data.

Master both. Know when to use each.

**Your Mission:** Implement linear and binary search.`,
    objective: 'Implement linear and binary search algorithms',
    starterCode: `#include <iostream>

int linearSearch(int* arr, int size, int target) {
    // Implement linear search
}

int binarySearch(int* arr, int left, int right, int target) {
    // Implement binary search (assumes sorted array)
}

int main() {
    int unsorted[] = {5, 2, 8, 1, 9};
    int sorted[] = {1, 2, 5, 8, 9};
    int size = 5;
    
    std::cout << "Linear search for 8: " << linearSearch(unsorted, size, 8) << std::endl;
    std::cout << "Binary search for 8: " << binarySearch(sorted, 0, size - 1, 8) << std::endl;
    
    return 0;
}`,
    solution: `#include <iostream>

int linearSearch(int* arr, int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int binarySearch(int* arr, int left, int right, int target) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, left, mid - 1, target);
    return binarySearch(arr, mid + 1, right, target);
}

int main() {
    int unsorted[] = {5, 2, 8, 1, 9};
    int sorted[] = {1, 2, 5, 8, 9};
    int size = 5;
    
    std::cout << "Linear search for 8: " << linearSearch(unsorted, size, 8) << std::endl;
    std::cout << "Binary search for 8: " << binarySearch(sorted, 0, size - 1, 8) << std::endl;
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Linear search for 8: 2\nBinary search for 8: 3\n',
    testCaseInput: '',
    nextChapterId: '3-2',
  },
  '3-2': {
    title: 'Basic Sorts (Bubble/Insertion)',
    story: `# Order from Chaos

**Bubble Sort:** Compare adjacent pairs, swap if wrong order. O(n²) time. Simple but inefficient.

**Insertion Sort:** Build sorted array one element at a time. O(n²) worst case, O(n) best case.

These are your first tools for ordering data.

**Your Mission:** Implement bubble sort and insertion sort.`,
    objective: 'Implement bubble sort and insertion sort',
    starterCode: `#include <iostream>

void bubbleSort(int* arr, int size) {
    // Implement bubble sort
}

void insertionSort(int* arr, int size) {
    // Implement insertion sort
}

void printArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

int main() {
    int arr1[] = {64, 34, 25, 12, 22};
    int arr2[] = {64, 34, 25, 12, 22};
    int size = 5;
    
    bubbleSort(arr1, size);
    std::cout << "Bubble sorted: ";
    printArray(arr1, size);
    
    insertionSort(arr2, size);
    std::cout << "Insertion sorted: ";
    printArray(arr2, size);
    
    return 0;
}`,
    solution: `#include <iostream>

void bubbleSort(int* arr, int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void insertionSort(int* arr, int size) {
    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

void printArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

int main() {
    int arr1[] = {64, 34, 25, 12, 22};
    int arr2[] = {64, 34, 25, 12, 22};
    int size = 5;
    
    bubbleSort(arr1, size);
    std::cout << "Bubble sorted: ";
    printArray(arr1, size);
    
    insertionSort(arr2, size);
    std::cout << "Insertion sorted: ";
    printArray(arr2, size);
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Bubble sorted: 12 22 25 34 64 \nInsertion sorted: 12 22 25 34 64 \n',
    testCaseInput: '',
    nextChapterId: '3-3',
  },
  '3-3': {
    title: 'Advanced Sorts (Quick/Merge)',
    story: `# The Divide and Conquer

**Quick Sort:** Choose a pivot, partition, recurse. O(n log n) average, O(n²) worst case.

**Merge Sort:** Divide, sort, merge. O(n log n) guaranteed, but uses extra memory.

These are the weapons of efficiency.

**Your Mission:** Implement both algorithms.`,
    objective: 'Implement quicksort and mergesort',
    starterCode: `#include <iostream>

void quickSort(int* arr, int low, int high) {
    // Implement quicksort
}

void mergeSort(int* arr, int left, int right) {
    // Implement mergesort
}

void printArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

int main() {
    int arr1[] = {64, 34, 25, 12, 22};
    int arr2[] = {64, 34, 25, 12, 22};
    int size = 5;
    
    quickSort(arr1, 0, size - 1);
    std::cout << "Quick sorted: ";
    printArray(arr1, size);
    
    mergeSort(arr2, 0, size - 1);
    std::cout << "Merge sorted: ";
    printArray(arr2, size);
    
    return 0;
}`,
    solution: `#include <iostream>

int partition(int* arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int* arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void merge(int* arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int* leftArr = new int[n1];
    int* rightArr = new int[n2];
    
    for (int i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (int j = 0; j < n2; j++) rightArr[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (leftArr[i] <= leftArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) arr[k++] = leftArr[i++];
    while (j < n2) arr[k++] = rightArr[j++];
    
    delete[] leftArr;
    delete[] rightArr;
}

void mergeSort(int* arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void printArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

int main() {
    int arr1[] = {64, 34, 25, 12, 22};
    int arr2[] = {64, 34, 25, 12, 22};
    int size = 5;
    
    quickSort(arr1, 0, size - 1);
    std::cout << "Quick sorted: ";
    printArray(arr1, size);
    
    mergeSort(arr2, 0, size - 1);
    std::cout << "Merge sorted: ";
    printArray(arr2, size);
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Quick sorted: 12 22 25 34 64 \nMerge sorted: 12 22 25 34 64 \n',
    testCaseInput: '',
    nextChapterId: '3-4',
  },
  '3-4': {
    title: 'Stability & Efficiency',
    story: `# The Final Test

**Stable sorts** preserve the relative order of equal elements. Merge sort is stable. Quick sort is not.

**Efficiency** isn't just Big O—it's also memory usage, cache performance, and real-world behavior.

**Your Mission:** Compare stability and efficiency of different sorting algorithms.`,
    objective: 'Demonstrate understanding of stability and efficiency trade-offs',
    starterCode: `#include <iostream>

// Which sorts are stable? Which are most efficient?
// Implement a comparison

struct Element {
    int value;
    int originalIndex;
};

void printStability(Element* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << "(" << arr[i].value << "," << arr[i].originalIndex << ") ";
    }
    std::cout << std::endl;
}

int main() {
    // Create array with duplicate values
    // Test stability of different algorithms
    
    return 0;
}`,
    solution: `#include <iostream>

struct Element {
    int value;
    int originalIndex;
};

void printStability(Element* arr, int size) {
    for (int i = 0; i < size; i++) {
        std::cout << "(" << arr[i].value << "," << arr[i].originalIndex << ") ";
    }
    std::cout << std::endl;
}

int main() {
    Element arr[] = {{3, 0}, {1, 1}, {3, 2}, {2, 3}};
    int size = 4;
    
    std::cout << "Original: ";
    printStability(arr, size);
    
    std::cout << "\\nStable sort (merge) preserves order of equal elements" << std::endl;
    std::cout << "Unstable sort (quick) may change order of equal elements" << std::endl;
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Original: (3,0) (1,1) (3,2) (2,3) \n\nStable sort (merge) preserves order of equal elements\nUnstable sort (quick) may change order of equal elements\n',
    testCaseInput: '',
    nextChapterId: '4-1',
  },
  '4-1': {
    title: 'Encapsulation & Hiding',
    story: `# The Vault Opens

**Encapsulation** bundles data and methods together. **Data hiding** protects internal state.

In C++, use \`private\` to hide, \`public\` to expose. This is the foundation of object-oriented design.

**Your Mission:** Create a class with private data and public methods.`,
    objective: 'Implement encapsulation with private members and public interface',
    starterCode: `#include <iostream>

class Counter {
    // Add private member variable
    // Add public methods: increment, decrement, getValue
};

int main() {
    Counter c;
    // Test your class
    
    return 0;
}`,
    solution: `#include <iostream>

class Counter {
private:
    int count;
    
public:
    Counter() : count(0) {}
    
    void increment() { count++; }
    void decrement() { count--; }
    int getValue() const { return count; }
};

int main() {
    Counter c;
    c.increment();
    c.increment();
    c.decrement();
    std::cout << "Count: " << c.getValue() << std::endl;
    return 0;
}`,
    difficulty: 'Novice',
    expectedOutput: 'Count: 1\n',
    testCaseInput: '',
    nextChapterId: '4-2',
  },
  '4-2': {
    title: 'Dynamic Arrays',
    story: `# Building from Scratch

Without \`std::vector\`, you must build dynamic arrays yourself. Allocate with \`new[]\`, resize by copying, deallocate with \`delete[]\`.

This is manual memory management at its core.

**Your Mission:** Implement a dynamic array class.`,
    objective: 'Create a dynamic array class with manual memory management',
    starterCode: `#include <iostream>

class DynamicArray {
    // Implement: data pointer, size, capacity
    // Methods: push, get, resize
};

int main() {
    DynamicArray arr;
    // Test your dynamic array
    
    return 0;
}`,
    solution: `#include <iostream>

class DynamicArray {
private:
    int* data;
    int size;
    int capacity;
    
    void resize() {
        capacity *= 2;
        int* newData = new int[capacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }
    
public:
    DynamicArray() : size(0), capacity(2) {
        data = new int[capacity];
    }
    
    ~DynamicArray() {
        delete[] data;
    }
    
    void push(int value) {
        if (size >= capacity) resize();
        data[size++] = value;
    }
    
    int get(int index) {
        return data[index];
    }
    
    int getSize() const { return size; }
};

int main() {
    DynamicArray arr;
    arr.push(10);
    arr.push(20);
    arr.push(30);
    
    for (int i = 0; i < arr.getSize(); i++) {
        std::cout << arr.get(i) << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: '10 20 30 \n',
    testCaseInput: '',
    nextChapterId: '4-3',
  },
  '4-3': {
    title: 'Linked Lists (Singly/Doubly)',
    story: `# The Chain of Nodes

**Singly Linked List:** Each node points to the next. O(1) insertion, but O(n) access.

**Doubly Linked List:** Each node points both ways. More memory, but bidirectional traversal.

Build these from scratch. No STL allowed.

**Your Mission:** Implement both linked list types.`,
    objective: 'Implement singly and doubly linked lists',
    starterCode: `#include <iostream>

struct Node {
    int data;
    Node* next;
    // Add prev for doubly linked
};

class LinkedList {
    // Implement singly or doubly linked list
};

int main() {
    // Test your linked list
    
    return 0;
}`,
    solution: `#include <iostream>

struct Node {
    int data;
    Node* next;
    Node* prev; // For doubly linked
    
    Node(int val) : data(val), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
private:
    Node* head;
    Node* tail;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}
    
    void append(int value) {
        Node* newNode = new Node(value);
        if (!head) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
    }
    
    void printForward() {
        Node* current = head;
        while (current) {
            std::cout << current->data << " ";
            current = current->next;
        }
        std::cout << std::endl;
    }
    
    void printBackward() {
        Node* current = tail;
        while (current) {
            std::cout << current->data << " ";
            current = current->prev;
        }
        std::cout << std::endl;
    }
    
    ~DoublyLinkedList() {
        Node* current = head;
        while (current) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }
};

int main() {
    DoublyLinkedList list;
    list.append(1);
    list.append(2);
    list.append(3);
    
    std::cout << "Forward: ";
    list.printForward();
    std::cout << "Backward: ";
    list.printBackward();
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Forward: 1 2 3 \nBackward: 3 2 1 \n',
    testCaseInput: '',
    nextChapterId: '4-4',
  },
  '4-4': {
    title: 'Stacks & Queues',
    story: `# The Debug Challenge

**Stack:** LIFO (Last In, First Out). Push and pop.

**Queue:** FIFO (First In, First Out). Enqueue and dequeue.

Both can be built with arrays or linked lists. Choose wisely.

**Your Mission:** Fix the memory leaks in this stack and queue implementation.`,
    objective: 'Fix memory leaks in stack and queue implementations',
    starterCode: `#include <iostream>

class Stack {
private:
    int* data;
    int top;
    int capacity;
    
public:
    Stack(int cap) : top(-1), capacity(cap) {
        data = new int[capacity];
    }
    
    void push(int value) {
        data[++top] = value;
    }
    
    int pop() {
        return data[top--];
    }
    
    // MEMORY LEAK: Missing destructor
};

int main() {
    Stack s(10);
    s.push(1);
    s.push(2);
    std::cout << s.pop() << std::endl;
    
    return 0;
}`,
    solution: `#include <iostream>

class Stack {
private:
    int* data;
    int top;
    int capacity;
    
public:
    Stack(int cap) : top(-1), capacity(cap) {
        data = new int[capacity];
    }
    
    ~Stack() {
        delete[] data; // Fixed: Properly deallocate
    }
    
    void push(int value) {
        data[++top] = value;
    }
    
    int pop() {
        return data[top--];
    }
};

int main() {
    Stack s(10);
    s.push(1);
    s.push(2);
    std::cout << s.pop() << std::endl;
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: '2\n',
    testCaseInput: '',
    nextChapterId: '5-1',
  },
  '5-1': {
    title: 'Binary Search Trees',
    story: `# Entering The Forest

**Binary Search Tree (BST):** Left subtree < root < right subtree. Enables O(log n) search in balanced trees.

But imbalance leads to O(n) worst case. Balance is everything.

**Your Mission:** Implement BST insertion and search.`,
    objective: 'Implement BST insertion and search operations',
    starterCode: `#include <iostream>

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
    // Implement insert and search
};

int main() {
    // Test your BST
    
    return 0;
}`,
    solution: `#include <iostream>

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root;
    
    TreeNode* insertRec(TreeNode* node, int value) {
        if (!node) return new TreeNode(value);
        
        if (value < node->data) {
            node->left = insertRec(node->left, value);
        } else if (value > node->data) {
            node->right = insertRec(node->right, value);
        }
        
        return node;
    }
    
    bool searchRec(TreeNode* node, int value) {
        if (!node) return false;
        if (node->data == value) return true;
        if (value < node->data) return searchRec(node->left, value);
        return searchRec(node->right, value);
    }
    
public:
    BST() : root(nullptr) {}
    
    void insert(int value) {
        root = insertRec(root, value);
    }
    
    bool search(int value) {
        return searchRec(root, value);
    }
};

int main() {
    BST tree;
    tree.insert(5);
    tree.insert(3);
    tree.insert(7);
    
    std::cout << "Search 3: " << (tree.search(3) ? "Found" : "Not found") << std::endl;
    std::cout << "Search 10: " << (tree.search(10) ? "Found" : "Not found") << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Search 3: Found\nSearch 10: Not found\n',
    testCaseInput: '',
    nextChapterId: '5-2',
  },
  '5-2': {
    title: 'Tree Traversals',
    story: `# Walking Through The Forest

**Inorder:** Left, Root, Right. Produces sorted order for BST.

**Preorder:** Root, Left, Right. Useful for copying trees.

**Postorder:** Left, Right, Root. Useful for deletion.

**Level-order:** Breadth-first, level by level.

**Your Mission:** Implement all four traversal methods.`,
    objective: 'Implement inorder, preorder, postorder, and level-order traversals',
    starterCode: `#include <iostream>

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root) {
    // Implement
}

void preorder(TreeNode* root) {
    // Implement
}

void postorder(TreeNode* root) {
    // Implement
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    
    // Test traversals
    
    return 0;
}`,
    solution: `#include <iostream>

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    std::cout << root->data << " ";
    inorder(root->right);
}

void preorder(TreeNode* root) {
    if (!root) return;
    std::cout << root->data << " ";
    preorder(root->left);
    preorder(root->right);
}

void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    std::cout << root->data << " ";
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    
    std::cout << "Inorder: ";
    inorder(root);
    std::cout << "\\nPreorder: ";
    preorder(root);
    std::cout << "\\nPostorder: ";
    postorder(root);
    std::cout << std::endl;
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: 'Inorder: 2 1 3 \nPreorder: 1 2 3 \nPostorder: 2 3 1 \n',
    testCaseInput: '',
    nextChapterId: '5-3',
  },
  '5-3': {
    title: 'Red-Black Trees',
    story: `# The Balanced Path

**Red-Black Trees** maintain balance through color properties. Every path from root to leaf has the same number of black nodes.

This ensures O(log n) operations. But rotations are complex.

**Your Mission:** Understand the properties and implement a rotation.`,
    objective: 'Implement tree rotation for balancing',
    starterCode: `#include <iostream>

struct RBNode {
    int data;
    RBNode* left;
    RBNode* right;
    RBNode* parent;
    bool isRed; // true for red, false for black
    
    RBNode(int val) : data(val), left(nullptr), right(nullptr), parent(nullptr), isRed(true) {}
};

RBNode* rotateLeft(RBNode* root, RBNode* x) {
    // Implement left rotation
}

RBNode* rotateRight(RBNode* root, RBNode* y) {
    // Implement right rotation
}

int main() {
    // Test rotations
    
    return 0;
}`,
    solution: `#include <iostream>

struct RBNode {
    int data;
    RBNode* left;
    RBNode* right;
    RBNode* parent;
    bool isRed;
    
    RBNode(int val) : data(val), left(nullptr), right(nullptr), parent(nullptr), isRed(true) {}
};

RBNode* rotateLeft(RBNode* root, RBNode* x) {
    RBNode* y = x->right;
    x->right = y->left;
    
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    
    if (!x->parent) root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    
    y->left = x;
    x->parent = y;
    
    return root;
}

RBNode* rotateRight(RBNode* root, RBNode* y) {
    RBNode* x = y->left;
    y->left = x->right;
    
    if (x->right) x->right->parent = y;
    x->parent = y->parent;
    
    if (!y->parent) root = x;
    else if (y == y->parent->left) y->parent->left = x;
    else y->parent->right = x;
    
    x->right = y;
    y->parent = x;
    
    return root;
}

int main() {
    // Rotation implementation complete
    std::cout << "Red-Black tree rotations implemented" << std::endl;
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Red-Black tree rotations implemented\n',
    testCaseInput: '',
    nextChapterId: '5-4',
  },
  '5-4': {
    title: 'Heaps & Priority Queues',
    story: `# The Heap Structure

**Heap:** Complete binary tree with heap property. Max heap: parent >= children. Min heap: parent <= children.

**Priority Queue:** Abstract data type implemented with heaps. O(log n) insert, O(1) peek, O(log n) extract.

**Your Mission:** Implement a min heap.`,
    objective: 'Implement a min heap with insert and extract operations',
    starterCode: `#include <iostream>

class MinHeap {
    // Implement min heap
    // Methods: insert, extractMin, getMin
};

int main() {
    // Test your min heap
    
    return 0;
}`,
    solution: `#include <iostream>

class MinHeap {
private:
    int* heap;
    int size;
    int capacity;
    
    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
    
    void heapifyUp(int i) {
        while (i > 0 && heap[parent(i)] > heap[i]) {
            int temp = heap[i];
            heap[i] = heap[parent(i)];
            heap[parent(i)] = temp;
            i = parent(i);
        }
    }
    
    void heapifyDown(int i) {
        int smallest = i;
        int l = left(i);
        int r = right(i);
        
        if (l < size && heap[l] < heap[smallest]) smallest = l;
        if (r < size && heap[r] < heap[smallest]) smallest = r;
        
        if (smallest != i) {
            int temp = heap[i];
            heap[i] = heap[smallest];
            heap[smallest] = temp;
            heapifyDown(smallest);
        }
    }
    
public:
    MinHeap(int cap) : size(0), capacity(cap) {
        heap = new int[capacity];
    }
    
    ~MinHeap() {
        delete[] heap;
    }
    
    void insert(int value) {
        if (size >= capacity) return;
        
        heap[size] = value;
        heapifyUp(size);
        size++;
    }
    
    int extractMin() {
        if (size == 0) return -1;
        
        int min = heap[0];
        heap[0] = heap[size - 1];
        size--;
        heapifyDown(0);
        
        return min;
    }
    
    int getMin() {
        return size > 0 ? heap[0] : -1;
    }
};

int main() {
    MinHeap heap(10);
    heap.insert(3);
    heap.insert(1);
    heap.insert(4);
    heap.insert(2);
    
    std::cout << "Min: " << heap.getMin() << std::endl;
    std::cout << "Extracted: " << heap.extractMin() << std::endl;
    std::cout << "New Min: " << heap.getMin() << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Min: 1\nExtracted: 1\nNew Min: 2\n',
    testCaseInput: '',
    nextChapterId: '6-1',
  },
  '6-1': {
    title: 'Graph Representations',
    story: `# The Web Begins

Graphs can be represented as **adjacency lists** (array of lists) or **adjacency matrices** (2D array).

Each has trade-offs. Lists save memory for sparse graphs. Matrices enable O(1) edge queries.

**Your Mission:** Implement both representations.`,
    objective: 'Implement adjacency list and adjacency matrix representations',
    starterCode: `#include <iostream>

// Adjacency List: Array of pointers to linked lists
// Adjacency Matrix: 2D array

class Graph {
    // Implement both representations
};

int main() {
    // Test graph representations
    
    return 0;
}`,
    solution: `#include <iostream>

class GraphMatrix {
private:
    int** matrix;
    int vertices;
    
public:
    GraphMatrix(int v) : vertices(v) {
        matrix = new int*[v];
        for (int i = 0; i < v; i++) {
            matrix[i] = new int[v];
            for (int j = 0; j < v; j++) {
                matrix[i][j] = 0;
            }
        }
    }
    
    ~GraphMatrix() {
        for (int i = 0; i < vertices; i++) {
            delete[] matrix[i];
        }
        delete[] matrix;
    }
    
    void addEdge(int u, int v) {
        matrix[u][v] = 1;
        matrix[v][u] = 1; // Undirected
    }
    
    void print() {
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                std::cout << matrix[i][j] << " ";
            }
            std::cout << std::endl;
        }
    }
};

int main() {
    GraphMatrix g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    g.print();
    
    return 0;
}`,
    difficulty: 'Engineer',
    expectedOutput: '0 1 0 0 \n1 0 0 1 \n0 0 0 0 \n0 1 0 0 \n',
    testCaseInput: '',
    nextChapterId: '6-2',
  },
  '6-2': {
    title: 'BFS & DFS',
    story: `# Traversing The Web

**BFS (Breadth-First Search):** Explore level by level. Uses a queue. Finds shortest paths in unweighted graphs.

**DFS (Depth-First Search):** Go deep before wide. Uses recursion or a stack. Simpler, but may not find shortest paths.

**Your Mission:** Implement both traversal algorithms.`,
    objective: 'Implement BFS and DFS graph traversals',
    starterCode: `#include <iostream>

// Implement BFS and DFS
// Assume graph has vertices 0 to n-1

void BFS(int** graph, int vertices, int start) {
    // Implement BFS
}

void DFS(int** graph, int vertices, int start) {
    // Implement DFS
}

int main() {
    // Test BFS and DFS
    
    return 0;
}`,
    solution: `#include <iostream>

class Queue {
private:
    int* arr;
    int front, rear, capacity;
    
public:
    Queue(int cap) : front(0), rear(-1), capacity(cap) {
        arr = new int[capacity];
    }
    
    ~Queue() { delete[] arr; }
    
    void enqueue(int x) { arr[++rear] = x; }
    int dequeue() { return arr[front++]; }
    bool isEmpty() { return front > rear; }
};

void BFS(int** graph, int vertices, int start) {
    bool* visited = new bool[vertices];
    for (int i = 0; i < vertices; i++) visited[i] = false;
    
    Queue q(vertices);
    visited[start] = true;
    q.enqueue(start);
    
    while (!q.isEmpty()) {
        int v = q.dequeue();
        std::cout << v << " ";
        
        for (int i = 0; i < vertices; i++) {
            if (graph[v][i] && !visited[i]) {
                visited[i] = true;
                q.enqueue(i);
            }
        }
    }
    
    delete[] visited;
}

void DFSRecursive(int** graph, int vertices, int v, bool* visited) {
    visited[v] = true;
    std::cout << v << " ";
    
    for (int i = 0; i < vertices; i++) {
        if (graph[v][i] && !visited[i]) {
            DFSRecursive(graph, vertices, i, visited);
        }
    }
}

void DFS(int** graph, int vertices, int start) {
    bool* visited = new bool[vertices];
    for (int i = 0; i < vertices; i++) visited[i] = false;
    
    DFSRecursive(graph, vertices, start, visited);
    
    delete[] visited;
}

int main() {
    int vertices = 4;
    int** graph = new int*[vertices];
    for (int i = 0; i < vertices; i++) {
        graph[i] = new int[vertices];
        for (int j = 0; j < vertices; j++) {
            graph[i][j] = 0;
        }
    }
    
    graph[0][1] = graph[1][0] = 1;
    graph[0][2] = graph[2][0] = 1;
    graph[1][3] = graph[3][1] = 1;
    
    std::cout << "BFS: ";
    BFS(graph, vertices, 0);
    std::cout << "\\nDFS: ";
    DFS(graph, vertices, 0);
    std::cout << std::endl;
    
    for (int i = 0; i < vertices; i++) delete[] graph[i];
    delete[] graph;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'BFS: 0 1 2 3 \nDFS: 0 1 3 2 \n',
    testCaseInput: '',
    nextChapterId: '6-3',
  },
  '6-3': {
    title: 'Shortest Path (Dijkstra)',
    story: `# The Path of Least Resistance

**Dijkstra's Algorithm** finds shortest paths from a source to all vertices in a weighted graph.

It uses a priority queue (min heap) and greedy selection. O((V + E) log V) with binary heap.

**Your Mission:** Implement Dijkstra's algorithm.`,
    objective: 'Implement Dijkstra\'s shortest path algorithm',
    starterCode: `#include <iostream>

// Implement Dijkstra's algorithm
// Find shortest paths from source to all vertices

void dijkstra(int** graph, int vertices, int source) {
    // Implement Dijkstra
}

int main() {
    // Test Dijkstra's algorithm
    
    return 0;
}`,
    solution: `#include <iostream>
#include <climits>

int minDistance(int* dist, bool* sptSet, int vertices) {
    int min = INT_MAX, minIndex;
    
    for (int v = 0; v < vertices; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v];
            minIndex = v;
        }
    }
    
    return minIndex;
}

void dijkstra(int** graph, int vertices, int source) {
    int* dist = new int[vertices];
    bool* sptSet = new bool[vertices];
    
    for (int i = 0; i < vertices; i++) {
        dist[i] = INT_MAX;
        sptSet[i] = false;
    }
    
    dist[source] = 0;
    
    for (int count = 0; count < vertices - 1; count++) {
        int u = minDistance(dist, sptSet, vertices);
        sptSet[u] = true;
        
        for (int v = 0; v < vertices; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    
    std::cout << "Vertex\\tDistance from Source\\n";
    for (int i = 0; i < vertices; i++) {
        std::cout << i << "\\t" << dist[i] << "\\n";
    }
    
    delete[] dist;
    delete[] sptSet;
}

int main() {
    int vertices = 5;
    int** graph = new int*[vertices];
    for (int i = 0; i < vertices; i++) {
        graph[i] = new int[vertices];
        for (int j = 0; j < vertices; j++) {
            graph[i][j] = 0;
        }
    }
    
    graph[0][1] = 4;
    graph[0][2] = 2;
    graph[1][2] = 1;
    graph[1][3] = 5;
    graph[2][3] = 8;
    graph[2][4] = 10;
    graph[3][4] = 2;
    
    dijkstra(graph, vertices, 0);
    
    for (int i = 0; i < vertices; i++) delete[] graph[i];
    delete[] graph;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Vertex\tDistance from Source\n0\t0\n1\t3\n2\t2\n3\t8\n4\t10\n',
    testCaseInput: '',
    nextChapterId: '6-4',
  },
  '6-4': {
    title: 'Hash Tables & Collisions',
    story: `# The Hash Function

**Hash tables** provide O(1) average-case insertion and lookup. But collisions must be handled.

**Chaining:** Use linked lists for collisions. **Open addressing:** Find next available slot.

**Your Mission:** Implement a hash table with collision handling.`,
    objective: 'Implement a hash table with collision resolution',
    starterCode: `#include <iostream>

struct HashNode {
    int key;
    int value;
    HashNode* next;
    
    HashNode(int k, int v) : key(k), value(v), next(nullptr) {}
};

class HashTable {
    // Implement hash table with chaining
};

int main() {
    // Test your hash table
    
    return 0;
}`,
    solution: `#include <iostream>

struct HashNode {
    int key;
    int value;
    HashNode* next;
    
    HashNode(int k, int v) : key(k), value(v), next(nullptr) {}
};

class HashTable {
private:
    HashNode** table;
    int capacity;
    
    int hash(int key) {
        return key % capacity;
    }
    
public:
    HashTable(int cap) : capacity(cap) {
        table = new HashNode*[capacity];
        for (int i = 0; i < capacity; i++) {
            table[i] = nullptr;
        }
    }
    
    ~HashTable() {
        for (int i = 0; i < capacity; i++) {
            HashNode* current = table[i];
            while (current) {
                HashNode* next = current->next;
                delete current;
                current = next;
            }
        }
        delete[] table;
    }
    
    void insert(int key, int value) {
        int index = hash(key);
        HashNode* newNode = new HashNode(key, value);
        
        if (!table[index]) {
            table[index] = newNode;
        } else {
            newNode->next = table[index];
            table[index] = newNode;
        }
    }
    
    int get(int key) {
        int index = hash(key);
        HashNode* current = table[index];
        
        while (current) {
            if (current->key == key) {
                return current->value;
            }
            current = current->next;
        }
        
        return -1; // Not found
    }
};

int main() {
    HashTable ht(10);
    ht.insert(1, 100);
    ht.insert(11, 200); // Collision with 1
    ht.insert(2, 300);
    
    std::cout << "Key 1: " << ht.get(1) << std::endl;
    std::cout << "Key 11: " << ht.get(11) << std::endl;
    std::cout << "Key 2: " << ht.get(2) << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Key 1: 100\nKey 11: 200\nKey 2: 300\n',
    testCaseInput: '',
    nextChapterId: '7-1',
  },
  '7-1': {
    title: 'Greedy Algorithms',
    story: `# The Grandmaster's First Lesson

**Greedy algorithms** make locally optimal choices at each step. They don't always produce globally optimal solutions, but when they do, they're efficient.

**Activity Selection, Fractional Knapsack**—these are greedy problems.

**Your Mission:** Solve the activity selection problem.`,
    objective: 'Implement greedy algorithm for activity selection',
    starterCode: `#include <iostream>

struct Activity {
    int start;
    int finish;
};

// Implement greedy activity selection
// Select maximum number of non-overlapping activities

void selectActivities(Activity* activities, int n) {
    // Implement greedy selection
}

int main() {
    Activity activities[] = {{1, 2}, {3, 4}, {0, 6}, {5, 7}, {8, 9}, {5, 9}};
    int n = 6;
    
    selectActivities(activities, n);
    
    return 0;
}`,
    solution: `#include <iostream>

struct Activity {
    int start;
    int finish;
};

void selectActivities(Activity* activities, int n) {
    // Sort by finish time (assuming sorted for simplicity)
    // Greedy: Always pick activity with earliest finish time
    
    int lastFinish = 0;
    std::cout << "Selected activities: ";
    
    for (int i = 0; i < n; i++) {
        if (activities[i].start >= lastFinish) {
            std::cout << "(" << activities[i].start << "," << activities[i].finish << ") ";
            lastFinish = activities[i].finish;
        }
    }
    std::cout << std::endl;
}

int main() {
    Activity activities[] = {{1, 2}, {3, 4}, {0, 6}, {5, 7}, {8, 9}, {5, 9}};
    int n = 6;
    
    selectActivities(activities, n);
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Selected activities: (1,2) (3,4) (5,7) (8,9) \n',
    testCaseInput: '',
    nextChapterId: '7-2',
  },
  '7-2': {
    title: 'Divide & Conquer',
    story: `# The Strategy of Division

**Divide and Conquer:** Break problem into subproblems, solve recursively, combine results.

Merge sort, quicksort, binary search—all use this pattern.

**Your Mission:** Implement a divide-and-conquer solution for finding maximum subarray sum.`,
    objective: 'Implement divide-and-conquer maximum subarray algorithm',
    starterCode: `#include <iostream>

// Implement Kadane's algorithm or divide-and-conquer
// Find maximum sum of contiguous subarray

int maxSubarraySum(int* arr, int left, int right) {
    // Implement divide-and-conquer approach
}

int main() {
    int arr[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int n = 9;
    
    std::cout << "Max subarray sum: " << maxSubarraySum(arr, 0, n - 1) << std::endl;
    
    return 0;
}`,
    solution: `#include <iostream>
#include <climits>

int maxCrossingSum(int* arr, int left, int mid, int right) {
    int leftSum = INT_MIN;
    int sum = 0;
    
    for (int i = mid; i >= left; i--) {
        sum += arr[i];
        if (sum > leftSum) leftSum = sum;
    }
    
    int rightSum = INT_MIN;
    sum = 0;
    
    for (int i = mid + 1; i <= right; i++) {
        sum += arr[i];
        if (sum > rightSum) rightSum = sum;
    }
    
    return leftSum + rightSum;
}

int maxSubarraySum(int* arr, int left, int right) {
    if (left == right) return arr[left];
    
    int mid = left + (right - left) / 2;
    
    int leftMax = maxSubarraySum(arr, left, mid);
    int rightMax = maxSubarraySum(arr, mid + 1, right);
    int crossMax = maxCrossingSum(arr, left, mid, right);
    
    return std::max(std::max(leftMax, rightMax), crossMax);
}

int main() {
    int arr[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int n = 9;
    
    std::cout << "Max subarray sum: " << maxSubarraySum(arr, 0, n - 1) << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Max subarray sum: 6\n',
    testCaseInput: '',
    nextChapterId: '7-3',
  },
  '7-3': {
    title: 'Dynamic Programming',
    story: `# The Final Weapon

**Dynamic Programming:** Solve overlapping subproblems optimally. Store results to avoid recomputation.

**Memoization** (top-down) or **tabulation** (bottom-up). Both transform exponential time to polynomial.

**Your Mission:** Solve the classic 0/1 Knapsack problem with DP.`,
    objective: 'Implement dynamic programming solution for 0/1 knapsack',
    starterCode: `#include <iostream>

// 0/1 Knapsack: Items cannot be split
// Maximize value within weight capacity

int knapsack(int* weights, int* values, int n, int capacity) {
    // Implement DP solution
}

int main() {
    int weights[] = {10, 20, 30};
    int values[] = {60, 100, 120};
    int capacity = 50;
    int n = 3;
    
    std::cout << "Max value: " << knapsack(weights, values, n, capacity) << std::endl;
    
    return 0;
}`,
    solution: `#include <iostream>

int knapsack(int* weights, int* values, int n, int capacity) {
    int** dp = new int*[n + 1];
    for (int i = 0; i <= n; i++) {
        dp[i] = new int[capacity + 1];
    }
    
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (i == 0 || w == 0) {
                dp[i][w] = 0;
            } else if (weights[i - 1] <= w) {
                dp[i][w] = std::max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    int result = dp[n][capacity];
    
    for (int i = 0; i <= n; i++) {
        delete[] dp[i];
    }
    delete[] dp;
    
    return result;
}

int main() {
    int weights[] = {10, 20, 30};
    int values[] = {60, 100, 120};
    int capacity = 50;
    int n = 3;
    
    std::cout << "Max value: " << knapsack(weights, values, n, capacity) << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Max value: 220\n',
    testCaseInput: '',
    nextChapterId: '7-4',
  },
  '7-4': {
    title: 'Formal Verification',
    story: `# The Proof

**Formal verification** proves algorithms correct through mathematical reasoning.

**Invariants, preconditions, postconditions**—these are the tools of correctness.

**Your Mission:** Write invariants and prove a simple algorithm correct.`,
    objective: 'Document invariants and prove algorithm correctness',
    starterCode: `#include <iostream>

// Prove correctness of finding maximum element
// Document invariants, preconditions, postconditions

int findMax(int* arr, int n) {
    // Precondition: n > 0, arr is not null
    // Invariant: max contains maximum of arr[0..i-1]
    // Postcondition: returns maximum element
    
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    std::cout << "Max: " << findMax(arr, 5) << std::endl;
    return 0;
}`,
    solution: `#include <iostream>

// PROOF OF CORRECTNESS:
// Precondition: n > 0, arr points to valid array of n integers
// Invariant: At start of iteration i, max = maximum(arr[0..i-1])
// Base case: i=1, max = arr[0] = maximum(arr[0..0]) ✓
// Inductive step: If max = maximum(arr[0..i-1]), then after comparing with arr[i],
//                 max = maximum(arr[0..i]) ✓
// Postcondition: After loop (i=n), max = maximum(arr[0..n-1]) ✓

int findMax(int* arr, int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    std::cout << "Max: " << findMax(arr, 5) << std::endl;
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Max: 9\n',
    testCaseInput: '',
    nextChapterId: '7-5',
  },
  '7-5': {
    title: 'The Final Exam',
    story: `# The Grandmaster's Challenge

This is it. The final test. Everything you've learned comes together here.

**Memory management. Complexity analysis. Data structures. Algorithms. Correctness.**

Prove you're ready to become a Grandmaster.

**Your Mission:** Solve a comprehensive problem combining all concepts.`,
    objective: 'Complete the final comprehensive challenge',
    starterCode: `#include <iostream>

// FINAL EXAM: Implement a complete data structure
// Requirements:
// 1. Use manual memory management (no STL)
// 2. Implement efficient operations (analyze complexity)
// 3. Handle all edge cases
// 4. Prove correctness

// Implement a Priority Queue using a binary heap
// Must support: insert, extractMin, getMin
// Must be memory-safe

class PriorityQueue {
    // Your implementation here
};

int main() {
    // Test your implementation
    
    return 0;
}`,
    solution: `#include <iostream>

class PriorityQueue {
private:
    int* heap;
    int size;
    int capacity;
    
    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
    
    void heapifyUp(int i) {
        while (i > 0 && heap[parent(i)] > heap[i]) {
            int temp = heap[i];
            heap[i] = heap[parent(i)];
            heap[parent(i)] = temp;
            i = parent(i);
        }
    }
    
    void heapifyDown(int i) {
        int smallest = i;
        int l = left(i);
        int r = right(i);
        
        if (l < size && heap[l] < heap[smallest]) smallest = l;
        if (r < size && heap[r] < heap[smallest]) smallest = r;
        
        if (smallest != i) {
            int temp = heap[i];
            heap[i] = heap[smallest];
            heap[smallest] = temp;
            heapifyDown(smallest);
        }
    }
    
public:
    PriorityQueue(int cap) : size(0), capacity(cap) {
        heap = new int[capacity];
    }
    
    ~PriorityQueue() {
        delete[] heap; // Memory-safe: proper deallocation
    }
    
    void insert(int value) {
        if (size >= capacity) return; // Edge case: capacity check
        
        heap[size] = value;
        heapifyUp(size);
        size++;
    }
    
    int extractMin() {
        if (size == 0) return -1; // Edge case: empty queue
        
        int min = heap[0];
        heap[0] = heap[size - 1];
        size--;
        heapifyDown(0);
        
        return min;
    }
    
    int getMin() {
        return size > 0 ? heap[0] : -1; // Edge case: empty queue
    }
    
    // Complexity Analysis:
    // insert: O(log n) - heapifyUp
    // extractMin: O(log n) - heapifyDown
    // getMin: O(1) - direct access
};

int main() {
    PriorityQueue pq(10);
    pq.insert(5);
    pq.insert(2);
    pq.insert(8);
    pq.insert(1);
    
    std::cout << "Min: " << pq.getMin() << std::endl;
    std::cout << "Extracted: " << pq.extractMin() << std::endl;
    std::cout << "New Min: " << pq.getMin() << std::endl;
    
    return 0;
}`,
    difficulty: 'Grandmaster',
    expectedOutput: 'Min: 1\nExtracted: 1\nNew Min: 2\n',
    testCaseInput: '',
    nextChapterId: null,
  },
}

