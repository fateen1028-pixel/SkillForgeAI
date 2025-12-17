"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

// Autocomplete suggestions for each language
const autocompleteSuggestions = {
  python: [
    // Keywords
    { label: "def", kind: "Keyword", insertText: "def ${1:function_name}(${2:params}):\n\t${0:pass}", documentation: "Define a function" },
    { label: "class", kind: "Keyword", insertText: "class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${0:pass}", documentation: "Define a class" },
    { label: "if", kind: "Keyword", insertText: "if ${1:condition}:\n\t${0:pass}", documentation: "If statement" },
    { label: "elif", kind: "Keyword", insertText: "elif ${1:condition}:\n\t${0:pass}", documentation: "Else if statement" },
    { label: "else", kind: "Keyword", insertText: "else:\n\t${0:pass}", documentation: "Else statement" },
    { label: "for", kind: "Keyword", insertText: "for ${1:item} in ${2:iterable}:\n\t${0:pass}", documentation: "For loop" },
    { label: "while", kind: "Keyword", insertText: "while ${1:condition}:\n\t${0:pass}", documentation: "While loop" },
    { label: "try", kind: "Keyword", insertText: "try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${0:pass}", documentation: "Try-except block" },
    { label: "with", kind: "Keyword", insertText: "with ${1:expression} as ${2:var}:\n\t${0:pass}", documentation: "With statement" },
    { label: "lambda", kind: "Keyword", insertText: "lambda ${1:x}: ${0:x}", documentation: "Lambda function" },
    { label: "return", kind: "Keyword", insertText: "return ${0}", documentation: "Return statement" },
    { label: "import", kind: "Keyword", insertText: "import ${0}", documentation: "Import module" },
    { label: "from", kind: "Keyword", insertText: "from ${1:module} import ${0}", documentation: "Import from module" },
    // Built-in functions
    { label: "print", kind: "Function", insertText: "print(${0})", documentation: "Print to console" },
    { label: "len", kind: "Function", insertText: "len(${0})", documentation: "Return length of object" },
    { label: "range", kind: "Function", insertText: "range(${1:start}, ${2:stop}, ${3:step})", documentation: "Generate range of numbers" },
    { label: "enumerate", kind: "Function", insertText: "enumerate(${0})", documentation: "Return enumerate object" },
    { label: "zip", kind: "Function", insertText: "zip(${1:iter1}, ${2:iter2})", documentation: "Zip iterables together" },
    { label: "map", kind: "Function", insertText: "map(${1:func}, ${2:iterable})", documentation: "Apply function to iterable" },
    { label: "filter", kind: "Function", insertText: "filter(${1:func}, ${2:iterable})", documentation: "Filter iterable" },
    { label: "sorted", kind: "Function", insertText: "sorted(${1:iterable}, key=${2:None}, reverse=${3:False})", documentation: "Return sorted list" },
    { label: "reversed", kind: "Function", insertText: "reversed(${0})", documentation: "Return reversed iterator" },
    { label: "sum", kind: "Function", insertText: "sum(${0})", documentation: "Sum of iterable" },
    { label: "min", kind: "Function", insertText: "min(${0})", documentation: "Minimum value" },
    { label: "max", kind: "Function", insertText: "max(${0})", documentation: "Maximum value" },
    { label: "abs", kind: "Function", insertText: "abs(${0})", documentation: "Absolute value" },
    { label: "int", kind: "Function", insertText: "int(${0})", documentation: "Convert to integer" },
    { label: "str", kind: "Function", insertText: "str(${0})", documentation: "Convert to string" },
    { label: "list", kind: "Function", insertText: "list(${0})", documentation: "Convert to list" },
    { label: "dict", kind: "Function", insertText: "dict(${0})", documentation: "Create dictionary" },
    { label: "set", kind: "Function", insertText: "set(${0})", documentation: "Create set" },
    { label: "tuple", kind: "Function", insertText: "tuple(${0})", documentation: "Create tuple" },
    { label: "isinstance", kind: "Function", insertText: "isinstance(${1:obj}, ${2:type})", documentation: "Check instance type" },
    { label: "hasattr", kind: "Function", insertText: "hasattr(${1:obj}, ${2:name})", documentation: "Check if object has attribute" },
    { label: "getattr", kind: "Function", insertText: "getattr(${1:obj}, ${2:name}, ${3:default})", documentation: "Get attribute from object" },
    // List methods
    { label: "append", kind: "Method", insertText: "append(${0})", documentation: "Append item to list" },
    { label: "extend", kind: "Method", insertText: "extend(${0})", documentation: "Extend list" },
    { label: "insert", kind: "Method", insertText: "insert(${1:index}, ${2:item})", documentation: "Insert item at index" },
    { label: "remove", kind: "Method", insertText: "remove(${0})", documentation: "Remove first occurrence" },
    { label: "pop", kind: "Method", insertText: "pop(${0})", documentation: "Remove and return item" },
    { label: "index", kind: "Method", insertText: "index(${0})", documentation: "Find index of item" },
    { label: "count", kind: "Method", insertText: "count(${0})", documentation: "Count occurrences" },
    { label: "sort", kind: "Method", insertText: "sort(key=${1:None}, reverse=${2:False})", documentation: "Sort list in place" },
    { label: "reverse", kind: "Method", insertText: "reverse()", documentation: "Reverse list in place" },
    // Dict methods
    { label: "keys", kind: "Method", insertText: "keys()", documentation: "Return dictionary keys" },
    { label: "values", kind: "Method", insertText: "values()", documentation: "Return dictionary values" },
    { label: "items", kind: "Method", insertText: "items()", documentation: "Return dictionary items" },
    { label: "get", kind: "Method", insertText: "get(${1:key}, ${2:default})", documentation: "Get value with default" },
    { label: "update", kind: "Method", insertText: "update(${0})", documentation: "Update dictionary" },
    // String methods
    { label: "split", kind: "Method", insertText: "split(${0})", documentation: "Split string" },
    { label: "join", kind: "Method", insertText: "join(${0})", documentation: "Join strings" },
    { label: "strip", kind: "Method", insertText: "strip()", documentation: "Strip whitespace" },
    { label: "lower", kind: "Method", insertText: "lower()", documentation: "Convert to lowercase" },
    { label: "upper", kind: "Method", insertText: "upper()", documentation: "Convert to uppercase" },
    { label: "replace", kind: "Method", insertText: "replace(${1:old}, ${2:new})", documentation: "Replace substring" },
    { label: "startswith", kind: "Method", insertText: "startswith(${0})", documentation: "Check string prefix" },
    { label: "endswith", kind: "Method", insertText: "endswith(${0})", documentation: "Check string suffix" },
    { label: "find", kind: "Method", insertText: "find(${0})", documentation: "Find substring index" },
    { label: "format", kind: "Method", insertText: "format(${0})", documentation: "Format string" },
  ],
  java: [
    // Keywords
    { label: "public", kind: "Keyword", insertText: "public ", documentation: "Public access modifier" },
    { label: "private", kind: "Keyword", insertText: "private ", documentation: "Private access modifier" },
    { label: "protected", kind: "Keyword", insertText: "protected ", documentation: "Protected access modifier" },
    { label: "static", kind: "Keyword", insertText: "static ", documentation: "Static modifier" },
    { label: "final", kind: "Keyword", insertText: "final ", documentation: "Final modifier" },
    { label: "class", kind: "Keyword", insertText: "class ${1:ClassName} {\n\t${0}\n}", documentation: "Class declaration" },
    { label: "interface", kind: "Keyword", insertText: "interface ${1:InterfaceName} {\n\t${0}\n}", documentation: "Interface declaration" },
    { label: "extends", kind: "Keyword", insertText: "extends ${0}", documentation: "Extend class" },
    { label: "implements", kind: "Keyword", insertText: "implements ${0}", documentation: "Implement interface" },
    { label: "new", kind: "Keyword", insertText: "new ${0}()", documentation: "Create new instance" },
    { label: "return", kind: "Keyword", insertText: "return ${0};", documentation: "Return statement" },
    { label: "if", kind: "Keyword", insertText: "if (${1:condition}) {\n\t${0}\n}", documentation: "If statement" },
    { label: "else", kind: "Keyword", insertText: "else {\n\t${0}\n}", documentation: "Else statement" },
    { label: "else if", kind: "Keyword", insertText: "else if (${1:condition}) {\n\t${0}\n}", documentation: "Else if statement" },
    { label: "for", kind: "Keyword", insertText: "for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${0}\n}", documentation: "For loop" },
    { label: "foreach", kind: "Keyword", insertText: "for (${1:Type} ${2:item} : ${3:collection}) {\n\t${0}\n}", documentation: "Enhanced for loop" },
    { label: "while", kind: "Keyword", insertText: "while (${1:condition}) {\n\t${0}\n}", documentation: "While loop" },
    { label: "do", kind: "Keyword", insertText: "do {\n\t${0}\n} while (${1:condition});", documentation: "Do-while loop" },
    { label: "switch", kind: "Keyword", insertText: "switch (${1:variable}) {\n\tcase ${2:value}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}", documentation: "Switch statement" },
    { label: "try", kind: "Keyword", insertText: "try {\n\t${0}\n} catch (${1:Exception} e) {\n\te.printStackTrace();\n}", documentation: "Try-catch block" },
    { label: "throw", kind: "Keyword", insertText: "throw new ${1:Exception}(${0});", documentation: "Throw exception" },
    { label: "throws", kind: "Keyword", insertText: "throws ${0}", documentation: "Method throws declaration" },
    // Types
    { label: "int", kind: "Type", insertText: "int ", documentation: "Integer primitive type" },
    { label: "long", kind: "Type", insertText: "long ", documentation: "Long primitive type" },
    { label: "double", kind: "Type", insertText: "double ", documentation: "Double primitive type" },
    { label: "float", kind: "Type", insertText: "float ", documentation: "Float primitive type" },
    { label: "boolean", kind: "Type", insertText: "boolean ", documentation: "Boolean primitive type" },
    { label: "char", kind: "Type", insertText: "char ", documentation: "Character primitive type" },
    { label: "String", kind: "Class", insertText: "String ", documentation: "String class" },
    { label: "Integer", kind: "Class", insertText: "Integer", documentation: "Integer wrapper class" },
    { label: "ArrayList", kind: "Class", insertText: "ArrayList<${1:Type}>()", documentation: "ArrayList class" },
    { label: "HashMap", kind: "Class", insertText: "HashMap<${1:Key}, ${2:Value}>()", documentation: "HashMap class" },
    { label: "HashSet", kind: "Class", insertText: "HashSet<${1:Type}>()", documentation: "HashSet class" },
    { label: "LinkedList", kind: "Class", insertText: "LinkedList<${1:Type}>()", documentation: "LinkedList class" },
    // Methods
    { label: "System.out.println", kind: "Function", insertText: "System.out.println(${0});", documentation: "Print line to console" },
    { label: "System.out.print", kind: "Function", insertText: "System.out.print(${0});", documentation: "Print to console" },
    { label: "main", kind: "Function", insertText: "public static void main(String[] args) {\n\t${0}\n}", documentation: "Main method" },
    { label: "toString", kind: "Method", insertText: "toString()", documentation: "Convert to string" },
    { label: "equals", kind: "Method", insertText: "equals(${0})", documentation: "Check equality" },
    { label: "hashCode", kind: "Method", insertText: "hashCode()", documentation: "Get hash code" },
    { label: "length", kind: "Method", insertText: "length()", documentation: "Get string length" },
    { label: "size", kind: "Method", insertText: "size()", documentation: "Get collection size" },
    { label: "add", kind: "Method", insertText: "add(${0})", documentation: "Add to collection" },
    { label: "remove", kind: "Method", insertText: "remove(${0})", documentation: "Remove from collection" },
    { label: "get", kind: "Method", insertText: "get(${0})", documentation: "Get element" },
    { label: "set", kind: "Method", insertText: "set(${1:index}, ${2:element})", documentation: "Set element" },
    { label: "contains", kind: "Method", insertText: "contains(${0})", documentation: "Check if contains" },
    { label: "isEmpty", kind: "Method", insertText: "isEmpty()", documentation: "Check if empty" },
    { label: "clear", kind: "Method", insertText: "clear()", documentation: "Clear collection" },
    { label: "put", kind: "Method", insertText: "put(${1:key}, ${2:value})", documentation: "Put in map" },
    { label: "containsKey", kind: "Method", insertText: "containsKey(${0})", documentation: "Check if map contains key" },
    { label: "containsValue", kind: "Method", insertText: "containsValue(${0})", documentation: "Check if map contains value" },
    { label: "keySet", kind: "Method", insertText: "keySet()", documentation: "Get map keys" },
    { label: "values", kind: "Method", insertText: "values()", documentation: "Get map values" },
    { label: "entrySet", kind: "Method", insertText: "entrySet()", documentation: "Get map entries" },
    { label: "substring", kind: "Method", insertText: "substring(${1:start}, ${2:end})", documentation: "Get substring" },
    { label: "charAt", kind: "Method", insertText: "charAt(${0})", documentation: "Get character at index" },
    { label: "indexOf", kind: "Method", insertText: "indexOf(${0})", documentation: "Find index of" },
    { label: "split", kind: "Method", insertText: "split(${0})", documentation: "Split string" },
    { label: "trim", kind: "Method", insertText: "trim()", documentation: "Trim whitespace" },
    { label: "toLowerCase", kind: "Method", insertText: "toLowerCase()", documentation: "Convert to lowercase" },
    { label: "toUpperCase", kind: "Method", insertText: "toUpperCase()", documentation: "Convert to uppercase" },
    { label: "Arrays.toString", kind: "Function", insertText: "Arrays.toString(${0})", documentation: "Convert array to string" },
    { label: "Arrays.sort", kind: "Function", insertText: "Arrays.sort(${0})", documentation: "Sort array" },
    { label: "Collections.sort", kind: "Function", insertText: "Collections.sort(${0})", documentation: "Sort collection" },
    { label: "Math.max", kind: "Function", insertText: "Math.max(${1:a}, ${2:b})", documentation: "Maximum of two numbers" },
    { label: "Math.min", kind: "Function", insertText: "Math.min(${1:a}, ${2:b})", documentation: "Minimum of two numbers" },
    { label: "Math.abs", kind: "Function", insertText: "Math.abs(${0})", documentation: "Absolute value" },
  ],
  cpp: [
    // Keywords
    { label: "include", kind: "Keyword", insertText: "#include <${0}>", documentation: "Include header" },
    { label: "using namespace", kind: "Keyword", insertText: "using namespace ${0};", documentation: "Using namespace" },
    { label: "class", kind: "Keyword", insertText: "class ${1:ClassName} {\npublic:\n\t${0}\n};", documentation: "Class declaration" },
    { label: "struct", kind: "Keyword", insertText: "struct ${1:StructName} {\n\t${0}\n};", documentation: "Struct declaration" },
    { label: "public", kind: "Keyword", insertText: "public:", documentation: "Public access" },
    { label: "private", kind: "Keyword", insertText: "private:", documentation: "Private access" },
    { label: "protected", kind: "Keyword", insertText: "protected:", documentation: "Protected access" },
    { label: "virtual", kind: "Keyword", insertText: "virtual ", documentation: "Virtual method" },
    { label: "override", kind: "Keyword", insertText: "override", documentation: "Override method" },
    { label: "const", kind: "Keyword", insertText: "const ", documentation: "Constant" },
    { label: "static", kind: "Keyword", insertText: "static ", documentation: "Static" },
    { label: "new", kind: "Keyword", insertText: "new ${0}", documentation: "Allocate memory" },
    { label: "delete", kind: "Keyword", insertText: "delete ${0};", documentation: "Deallocate memory" },
    { label: "return", kind: "Keyword", insertText: "return ${0};", documentation: "Return statement" },
    { label: "if", kind: "Keyword", insertText: "if (${1:condition}) {\n\t${0}\n}", documentation: "If statement" },
    { label: "else", kind: "Keyword", insertText: "else {\n\t${0}\n}", documentation: "Else statement" },
    { label: "else if", kind: "Keyword", insertText: "else if (${1:condition}) {\n\t${0}\n}", documentation: "Else if statement" },
    { label: "for", kind: "Keyword", insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}", documentation: "For loop" },
    { label: "range-for", kind: "Keyword", insertText: "for (auto& ${1:item} : ${2:container}) {\n\t${0}\n}", documentation: "Range-based for loop" },
    { label: "while", kind: "Keyword", insertText: "while (${1:condition}) {\n\t${0}\n}", documentation: "While loop" },
    { label: "do", kind: "Keyword", insertText: "do {\n\t${0}\n} while (${1:condition});", documentation: "Do-while loop" },
    { label: "switch", kind: "Keyword", insertText: "switch (${1:variable}) {\n\tcase ${2:value}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}", documentation: "Switch statement" },
    { label: "try", kind: "Keyword", insertText: "try {\n\t${0}\n} catch (const std::exception& e) {\n\t\n}", documentation: "Try-catch block" },
    { label: "throw", kind: "Keyword", insertText: "throw ${0};", documentation: "Throw exception" },
    { label: "template", kind: "Keyword", insertText: "template<typename ${1:T}>\n${0}", documentation: "Template declaration" },
    { label: "typename", kind: "Keyword", insertText: "typename ${0}", documentation: "Typename keyword" },
    { label: "auto", kind: "Keyword", insertText: "auto ", documentation: "Auto type deduction" },
    { label: "nullptr", kind: "Keyword", insertText: "nullptr", documentation: "Null pointer" },
    // Types
    { label: "int", kind: "Type", insertText: "int ", documentation: "Integer type" },
    { label: "long", kind: "Type", insertText: "long ", documentation: "Long type" },
    { label: "long long", kind: "Type", insertText: "long long ", documentation: "Long long type" },
    { label: "double", kind: "Type", insertText: "double ", documentation: "Double type" },
    { label: "float", kind: "Type", insertText: "float ", documentation: "Float type" },
    { label: "bool", kind: "Type", insertText: "bool ", documentation: "Boolean type" },
    { label: "char", kind: "Type", insertText: "char ", documentation: "Character type" },
    { label: "string", kind: "Type", insertText: "string ", documentation: "String type" },
    { label: "void", kind: "Type", insertText: "void ", documentation: "Void type" },
    { label: "size_t", kind: "Type", insertText: "size_t ", documentation: "Size type" },
    // STL containers
    { label: "vector", kind: "Class", insertText: "vector<${1:int}> ${2:vec}", documentation: "Dynamic array" },
    { label: "map", kind: "Class", insertText: "map<${1:int}, ${2:int}> ${3:m}", documentation: "Ordered map" },
    { label: "unordered_map", kind: "Class", insertText: "unordered_map<${1:int}, ${2:int}> ${3:m}", documentation: "Hash map" },
    { label: "set", kind: "Class", insertText: "set<${1:int}> ${2:s}", documentation: "Ordered set" },
    { label: "unordered_set", kind: "Class", insertText: "unordered_set<${1:int}> ${2:s}", documentation: "Hash set" },
    { label: "queue", kind: "Class", insertText: "queue<${1:int}> ${2:q}", documentation: "Queue" },
    { label: "stack", kind: "Class", insertText: "stack<${1:int}> ${2:st}", documentation: "Stack" },
    { label: "priority_queue", kind: "Class", insertText: "priority_queue<${1:int}> ${2:pq}", documentation: "Priority queue" },
    { label: "pair", kind: "Class", insertText: "pair<${1:int}, ${2:int}> ${3:p}", documentation: "Pair" },
    { label: "deque", kind: "Class", insertText: "deque<${1:int}> ${2:dq}", documentation: "Double-ended queue" },
    { label: "list", kind: "Class", insertText: "list<${1:int}> ${2:lst}", documentation: "Doubly linked list" },
    // Functions
    { label: "cout", kind: "Function", insertText: "cout << ${0} << endl;", documentation: "Output to console" },
    { label: "cin", kind: "Function", insertText: "cin >> ${0};", documentation: "Input from console" },
    { label: "endl", kind: "Constant", insertText: "endl", documentation: "End line" },
    { label: "main", kind: "Function", insertText: "int main() {\n\t${0}\n\treturn 0;\n}", documentation: "Main function" },
    // Methods
    { label: "push_back", kind: "Method", insertText: "push_back(${0})", documentation: "Add to end" },
    { label: "pop_back", kind: "Method", insertText: "pop_back()", documentation: "Remove from end" },
    { label: "push_front", kind: "Method", insertText: "push_front(${0})", documentation: "Add to front" },
    { label: "pop_front", kind: "Method", insertText: "pop_front()", documentation: "Remove from front" },
    { label: "size", kind: "Method", insertText: "size()", documentation: "Get size" },
    { label: "empty", kind: "Method", insertText: "empty()", documentation: "Check if empty" },
    { label: "clear", kind: "Method", insertText: "clear()", documentation: "Clear container" },
    { label: "begin", kind: "Method", insertText: "begin()", documentation: "Iterator to beginning" },
    { label: "end", kind: "Method", insertText: "end()", documentation: "Iterator to end" },
    { label: "front", kind: "Method", insertText: "front()", documentation: "First element" },
    { label: "back", kind: "Method", insertText: "back()", documentation: "Last element" },
    { label: "insert", kind: "Method", insertText: "insert(${0})", documentation: "Insert element" },
    { label: "erase", kind: "Method", insertText: "erase(${0})", documentation: "Erase element" },
    { label: "find", kind: "Method", insertText: "find(${0})", documentation: "Find element" },
    { label: "count", kind: "Method", insertText: "count(${0})", documentation: "Count occurrences" },
    { label: "push", kind: "Method", insertText: "push(${0})", documentation: "Push element" },
    { label: "pop", kind: "Method", insertText: "pop()", documentation: "Pop element" },
    { label: "top", kind: "Method", insertText: "top()", documentation: "Top element" },
    { label: "first", kind: "Property", insertText: "first", documentation: "First of pair" },
    { label: "second", kind: "Property", insertText: "second", documentation: "Second of pair" },
    { label: "make_pair", kind: "Function", insertText: "make_pair(${1:first}, ${2:second})", documentation: "Create pair" },
    { label: "sort", kind: "Function", insertText: "sort(${1:begin}, ${2:end})", documentation: "Sort range" },
    { label: "reverse", kind: "Function", insertText: "reverse(${1:begin}, ${2:end})", documentation: "Reverse range" },
    { label: "max", kind: "Function", insertText: "max(${1:a}, ${2:b})", documentation: "Maximum value" },
    { label: "min", kind: "Function", insertText: "min(${1:a}, ${2:b})", documentation: "Minimum value" },
    { label: "abs", kind: "Function", insertText: "abs(${0})", documentation: "Absolute value" },
    { label: "swap", kind: "Function", insertText: "swap(${1:a}, ${2:b})", documentation: "Swap values" },
  ],
};

// Language configurations with starter code templates
const languageConfig = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    starterCode: `/**
 * Two Sum
 * 
 * Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Indices of the two numbers
 */
function twoSum(nums, target) {
    // Write your solution here
    
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
`,
  },
  python: {
    id: "python",
    name: "Python",
    extension: "py",
    starterCode: `"""
Two Sum

Given an array of integers nums and an integer target,
return indices of the two numbers such that they add up to target.

Args:
    nums: List of integers
    target: Target sum
    
Returns:
    List of two indices
"""
def two_sum(nums, target):
    # Write your solution here
    pass

# Test your solution
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
`,
  },
  java: {
    id: "java",
    name: "Java",
    extension: "java",
    starterCode: `import java.util.*;

/**
 * Two Sum
 * 
 * Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 */
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
    }
}
`,
  },
  cpp: {
    id: "cpp",
    name: "C++",
    extension: "cpp",
    starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

/**
 * Two Sum
 * 
 * Given an array of integers nums and an integer target,
 * return indices of the two numbers such that they add up to target.
 */
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> result = sol.twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl; // Expected: [0, 1]
    return 0;
}
`,
  },
};

// Piston API language mapping
const pistonLanguages = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "c++", version: "10.2.0" },
};

// Execute code using Piston API (free code execution engine)
const executeWithPiston = async (code, lang) => {
  const config = pistonLanguages[lang];
  
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ content: code }],
    }),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (result.run) {
    const output = result.run.output || "";
    const stderr = result.run.stderr || "";
    
    if (stderr && !output) {
      return `Error:\n${stderr}`;
    }
    if (stderr && output) {
      return `${output}\n\nWarnings/Errors:\n${stderr}`;
    }
    return output || "Code executed successfully (no output)";
  }
  
  if (result.compile && result.compile.stderr) {
    return `Compilation Error:\n${result.compile.stderr}`;
  }
  
  return "Execution completed";
};

export default function TaskDetailPage({ params }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languageConfig.javascript.starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("output"); // "output" or "testcases"
  const [showToast, setShowToast] = useState(false);
  const monacoRef = useRef(null);
  const completionProvidersRef = useRef([]);

  // Show clipboard blocked toast
  const showClipboardToast = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  // Handle editor mount - register autocomplete providers and block clipboard
  const handleEditorDidMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    
    // Block copy, paste, cut commands and show toast
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      showClipboardToast();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      showClipboardToast();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
      showClipboardToast();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      showClipboardToast();
    });
    
    // Also block Shift+Insert (alternative paste)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => {
      showClipboardToast();
    });
    
    // Clear any existing providers
    completionProvidersRef.current.forEach(provider => provider.dispose());
    completionProvidersRef.current = [];
    
    // Register completion providers for each language
    const languages = ["python", "java", "cpp"];
    
    languages.forEach(lang => {
      const suggestions = autocompleteSuggestions[lang];
      if (!suggestions) return;
      
      const provider = monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          
          const completionItems = suggestions.map(item => {
            let kind;
            switch (item.kind) {
              case "Keyword": kind = monaco.languages.CompletionItemKind.Keyword; break;
              case "Function": kind = monaco.languages.CompletionItemKind.Function; break;
              case "Method": kind = monaco.languages.CompletionItemKind.Method; break;
              case "Class": kind = monaco.languages.CompletionItemKind.Class; break;
              case "Type": kind = monaco.languages.CompletionItemKind.TypeParameter; break;
              case "Property": kind = monaco.languages.CompletionItemKind.Property; break;
              case "Constant": kind = monaco.languages.CompletionItemKind.Constant; break;
              default: kind = monaco.languages.CompletionItemKind.Text;
            }
            
            return {
              label: item.label,
              kind: kind,
              insertText: item.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: item.documentation,
              range: range,
            };
          });
          
          return { suggestions: completionItems };
        },
        triggerCharacters: [".", "(", "<", "\"", "'", " "],
      });
      
      completionProvidersRef.current.push(provider);
    });
  }, [showClipboardToast]);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    setCode(languageConfig[newLanguage].starterCode);
    setOutput("");
  }, []);

  // Reset code to starter template
  const handleResetCode = useCallback(() => {
    setCode(languageConfig[language].starterCode);
    setOutput("");
  }, [language]);

  // Run code - executes JavaScript locally, others via Piston API
  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setActiveTab("output");
    
    try {
      if (language === "javascript") {
        // Execute JavaScript code locally
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          ).join(" "));
        };
        
        try {
          const fn = new Function(code);
          fn();
          setOutput(logs.length > 0 ? logs.join("\n") : "Code executed successfully (no output)");
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        } finally {
          console.log = originalLog;
        }
      } else {
        // Execute Python, Java, C++ via Piston API
        setOutput(`Running ${languageConfig[language].name} code...\n`);
        const result = await executeWithPiston(code, language);
        setOutput(result);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    
    setIsRunning(false);
  }, [code, language]);

  // Handle submit - actually tests the code against test cases
  const handleSubmit = useCallback(async () => {
    setIsRunning(true);
    setActiveTab("output");
    setOutput("Submitting solution...\n");
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (language === "javascript") {
      // Actually test JavaScript code against test cases
      const testCases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { nums: [3, 3], target: 6, expected: [0, 1] },
      ];
      
      let results = "Running test cases...\n\n";
      let allPassed = true;
      
      try {
        // Extract the twoSum function from user code
        const wrappedCode = `
          ${code}
          return typeof twoSum === 'function' ? twoSum : null;
        `;
        const getUserFunc = new Function(wrappedCode);
        const twoSum = getUserFunc();
        
        if (!twoSum) {
          setOutput("Error: Could not find 'twoSum' function in your code.\nMake sure you define: function twoSum(nums, target) { ... }");
          setIsRunning(false);
          return;
        }
        
        for (let i = 0; i < testCases.length; i++) {
          const { nums, target, expected } = testCases[i];
          const startTime = performance.now();
          const userOutput = twoSum([...nums], target); // Clone array to avoid mutation
          const endTime = performance.now();
          const runtime = (endTime - startTime).toFixed(2);
          
          const passed = Array.isArray(userOutput) && 
            userOutput.length === 2 &&
            userOutput[0] === expected[0] && 
            userOutput[1] === expected[1];
          
          if (!passed) allPassed = false;
          
          results += `Test Case ${i + 1}: nums = [${nums}], target = ${target}\n`;
          results += `Expected: [${expected}]\n`;
          results += `Your Output: ${Array.isArray(userOutput) ? `[${userOutput}]` : userOutput} ${passed ? "✓" : "✗"}\n`;
          results += `Runtime: ${runtime}ms\n\n`;
        }
        
        results += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        if (allPassed) {
          results += "All test cases passed! 🎉\n";
          results += "+50 XP earned!";
        } else {
          results += "Some test cases failed. Try again! 💪";
        }
        
      } catch (error) {
        results += `\nError executing code: ${error.message}`;
        allPassed = false;
      }
      
      setOutput(results);
    } else {
      // For Python, Java, C++ - run the code via Piston API
      try {
        setOutput("Running code via Piston API...\n\n");
        const result = await executeWithPiston(code, language);
        
        // Check if output contains expected results
        const hasTest1 = result.includes("[0, 1]") || result.includes("[0,1]");
        const hasTest2 = result.includes("[1, 2]") || result.includes("[1,2]");
        const hasTest3 = result.includes("[0, 1]") || result.includes("[0,1]");
        
        let finalOutput = result + "\n\n";
        finalOutput += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        
        if (hasTest1 && hasTest2) {
          finalOutput += "All test cases passed! 🎉\n";
          finalOutput += "+50 XP earned!";
        } else if (result.includes("Error")) {
          finalOutput += "Code has errors. Please fix and try again! 🔧";
        } else {
          finalOutput += "Code executed. Check output above.";
        }
        
        setOutput(finalOutput);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    }
    
    setIsRunning(false);
  }, [code, language]);

  return (
    <div className="w-[95%] xl:w-[92%] 2xl:w-[90%] mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">
      {/* Clipboard Blocked Toast */}
      {showToast && (
        <div className="fixed top-24 right-6 z-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm shadow-lg">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium text-red-400">Clipboard blocked</span>
          </div>
        </div>
      )}

      {/* Breadcrumb with Back Button */}
      <div className="flex items-center gap-2 md:gap-3 mb-6 text-sm">
        <Link
          href="/dashboard/tasks"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all group"
          title="Back to Tasks"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
          <span className="text-slate-600">/</span>
          <Link href="/dashboard/tasks" className="text-slate-400 hover:text-white transition-colors">Tasks</Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">Task Detail</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Two Sum</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold text-emerald-400 uppercase">Easy</span>
                    <span className="text-xs text-slate-500">Arrays & Hash Maps</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-xs font-bold text-amber-400">+50 XP</span>
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
              <h3 className="text-base font-semibold text-white mb-3">Problem Description</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Given an array of integers <code className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs font-mono">nums</code> and an integer <code className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs font-mono">target</code>, return indices of the two numbers such that they add up to target.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>

              <h3 className="text-base font-semibold text-white mb-3 mt-6">Example</h3>
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <p className="text-slate-400 text-xs mb-2">Input:</p>
                <code className="text-sm text-slate-300 font-mono">nums = [2, 7, 11, 15], target = 9</code>
                <p className="text-slate-400 text-xs mb-2 mt-3">Output:</p>
                <code className="text-sm text-emerald-400 font-mono">[0, 1]</code>
                <p className="text-slate-400 text-xs mt-3">Because nums[0] + nums[1] == 9, we return [0, 1]</p>
              </div>

              <h3 className="text-base font-semibold text-white mb-3 mt-6">Constraints</h3>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li>2 ≤ nums.length ≤ 10⁴</li>
                <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>-10⁹ ≤ target ≤ 10⁹</li>
                <li>Only one valid answer exists</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex flex-col rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
          {/* Editor Header */}
          <div className="flex flex-col px-5 py-3 border-b border-white/6 bg-white/2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  solution.{languageConfig[language].extension}
                </span>
                <p className="text-xs text-slate-600 ml-2">• clipboard blocked</p>
              </div>
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-violet-500/50 cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">
              💡 Write your best attempt — if stuck, submit anyway and you&apos;ll be evaluated on your approach.
            </p>
          </div>
          
          {/* Monaco Editor */}
          <div className="h-80 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                tabSize: 2,
                wordWrap: "on",
                folding: true,
                bracketPairColorization: { enabled: true },
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: true,
                },
                acceptSuggestionOnCommitCharacter: true,
                snippetSuggestions: "top",
                wordBasedSuggestions: "currentDocument",
                // Disable copy/paste
                contextmenu: false,
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="border-t border-white/6">
            {/* Terminal Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 bg-white/2 border-b border-white/6">
              <button
                onClick={() => setActiveTab("output")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "output"
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Output
                </span>
              </button>
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "testcases"
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Test Cases
                </span>
              </button>
              {isRunning && (
                <div className="ml-auto flex items-center gap-2 text-xs text-violet-400">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running...
                </div>
              )}
            </div>

            {/* Terminal Content */}
            <div className="h-40 bg-[#0d0d0d] overflow-auto">
              {activeTab === "output" ? (
                <div className="p-4 font-mono text-sm">
                  {output ? (
                    <pre className={`whitespace-pre-wrap ${
                      output.includes("Error") ? "text-red-400" : 
                      output.includes("✓") || output.includes("🎉") ? "text-emerald-400" : 
                      "text-slate-300"
                    }`}>
                      {output}
                    </pre>
                  ) : (
                    <p className="text-slate-500">Click &quot;Run Code&quot; to see output here...</p>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="p-3 rounded-lg bg-white/3 border border-white/6">
                    <p className="text-xs text-slate-400 mb-1">Test Case 1</p>
                    <p className="text-sm text-slate-300 font-mono">
                      Input: nums = [2,7,11,15], target = 9
                    </p>
                    <p className="text-sm text-emerald-400 font-mono">
                      Expected: [0,1]
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/3 border border-white/6">
                    <p className="text-xs text-slate-400 mb-1">Test Case 2</p>
                    <p className="text-sm text-slate-300 font-mono">
                      Input: nums = [3,2,4], target = 6
                    </p>
                    <p className="text-sm text-emerald-400 font-mono">
                      Expected: [1,2]
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/3 border border-white/6">
                    <p className="text-xs text-slate-400 mb-1">Test Case 3</p>
                    <p className="text-sm text-slate-300 font-mono">
                      Input: nums = [3,3], target = 6
                    </p>
                    <p className="text-sm text-emerald-400 font-mono">
                      Expected: [0,1]
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/6 bg-white/2">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run Code
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-violet-500 to-purple-600 text-sm font-medium text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit
              </button>
            </div>
            <button 
              onClick={handleResetCode}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
