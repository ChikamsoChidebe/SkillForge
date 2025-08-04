// Comprehensive course content for SkillForge
export const COMPREHENSIVE_COURSES = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master the basics of React including components, state, props, and hooks. Build real-world applications from scratch.',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://i.pinimg.com/736x/a8/0a/cf/a80acf16d26543b5192e88dc6d862e0e.jpg',
    category: 'Frontend',
    level: 'Beginner',
    duration: '15 hours',
    price: 0,
    rating: 4.8,
    studentsCount: 1247,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    tags: ['React', 'JavaScript', 'Frontend', 'Components'],
    modules: [
      {
        id: 1,
        title: 'Introduction to React',
        duration: '120 min',
        lessons: [
          {
            id: 1,
            title: 'What is React?',
            type: 'text',
            duration: '15 min',
            content: `# What is React?

React is a powerful JavaScript library for building user interfaces, particularly web applications. Created by Facebook (now Meta) in 2013, React has revolutionized how developers think about building interactive UIs.

## Key Concepts

### Component-Based Architecture
React applications are built using components - reusable pieces of code that represent parts of a user interface. Think of components as custom HTML elements that you can create and reuse throughout your application.

### Virtual DOM
React uses a Virtual DOM, which is a JavaScript representation of the actual DOM. This allows React to:
- Efficiently update only the parts of the page that have changed
- Provide better performance compared to traditional DOM manipulation
- Make applications more predictable and easier to debug

### Declarative Programming
With React, you describe what the UI should look like for any given state, and React takes care of updating the DOM when the state changes. This is different from imperative programming where you manually manipulate the DOM.

## Why Choose React?

1. **Reusability**: Components can be reused across different parts of your application
2. **Maintainability**: Clear component structure makes code easier to maintain
3. **Performance**: Virtual DOM ensures efficient updates
4. **Community**: Large ecosystem with extensive third-party libraries
5. **Job Market**: High demand for React developers

## React Ecosystem

- **React Router**: For handling navigation in single-page applications
- **Redux/Zustand**: For state management in complex applications
- **Next.js**: Full-stack React framework
- **React Native**: For building mobile applications
- **Testing Library**: For testing React components

## Real-World Applications

React is used by major companies including:
- Facebook/Meta
- Netflix
- Airbnb
- Uber
- WhatsApp
- Instagram

In the next lesson, we'll set up your development environment and create your first React application.`
          },
          {
            id: 2,
            title: 'What is React? - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What is React primarily used for?',
                options: ['Building user interfaces', 'Database management', 'Server configuration', 'File processing'],
                correct: 0
              },
              {
                question: 'Who created React?',
                options: ['Google', 'Facebook/Meta', 'Microsoft', 'Apple'],
                correct: 1
              },
              {
                question: 'What is the Virtual DOM?',
                options: ['A real DOM element', 'A JavaScript representation of the DOM', 'A CSS framework', 'A database'],
                correct: 1
              }
            ]
          },
          {
            id: 3,
            title: 'Setting up Development Environment',
            type: 'text',
            duration: '20 min',
            content: `# Setting up Your React Development Environment

Before we start building React applications, we need to set up our development environment with the necessary tools.

## Prerequisites

### Node.js and npm
Node.js is a JavaScript runtime that allows us to run JavaScript outside the browser. npm (Node Package Manager) comes bundled with Node.js and helps us manage project dependencies.

**Installation Steps:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Verify installation by opening terminal/command prompt and running:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`

### Code Editor
While you can use any text editor, we recommend **Visual Studio Code** for its excellent React support:

**Recommended VS Code Extensions:**
- ES7+ React/Redux/React-Native snippets
- Bracket Pair Colorizer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

## Creating Your First React App

### Using Create React App
Create React App is the official tool for setting up new React projects with zero configuration.

\`\`\`bash
# Install Create React App globally (optional)
npm install -g create-react-app

# Create a new React application
npx create-react-app my-first-react-app

# Navigate to the project directory
cd my-first-react-app

# Start the development server
npm start
\`\`\`

### Project Structure
After creating your React app, you'll see this folder structure:

\`\`\`
my-first-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
\`\`\`

**Key Files:**
- **public/index.html**: The HTML template
- **src/index.js**: Entry point of your React application
- **src/App.js**: Main App component
- **package.json**: Project configuration and dependencies

### Development Server
When you run \`npm start\`, React starts a development server with:
- Hot reloading (automatic page refresh on code changes)
- Error overlay for debugging
- Built-in build tools

Your development environment is now ready! In the next lesson, we'll explore JSX syntax.`
          },
          {
            id: 4,
            title: 'Setting up Development Environment - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What command creates a new React app?',
                options: ['npm create react-app', 'npx create-react-app', 'npm install react', 'react new app'],
                correct: 1
              },
              {
                question: 'What port does React development server use by default?',
                options: ['8080', '3000', '5000', '4000'],
                correct: 1
              },
              {
                question: 'Which file is the entry point of a React application?',
                options: ['App.js', 'index.html', 'index.js', 'main.js'],
                correct: 2
              }
            ]
          },
          {
            id: 5,
            title: 'Understanding JSX',
            type: 'text',
            duration: '25 min',
            content: `# Understanding JSX

JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within your JavaScript files. It's one of React's most distinctive features.

## What is JSX?

JSX looks like HTML but is actually JavaScript. When you write JSX, it gets transformed into regular JavaScript function calls.

### JSX Example:
\`\`\`jsx
const element = <h1>Hello, World!</h1>;
\`\`\`

### Compiled JavaScript:
\`\`\`javascript
const element = React.createElement('h1', null, 'Hello, World!');
\`\`\`

## JSX Syntax Rules

### 1. Single Parent Element
JSX expressions must have exactly one parent element:

\`\`\`jsx
// ❌ Wrong - Multiple parent elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ Correct - Single parent element
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);

// ✅ Also correct - React Fragment
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
\`\`\`

### 2. Self-Closing Tags
Elements without children must be self-closed:

\`\`\`jsx
// ✅ Correct
<img src="image.jpg" alt="Description" />
<br />
<input type="text" />

// ❌ Wrong
<img src="image.jpg" alt="Description">
<br>
<input type="text">
\`\`\`

### 3. camelCase Attributes
HTML attributes in JSX use camelCase:

\`\`\`jsx
// HTML
<div class="container" tabindex="1"></div>

// JSX
<div className="container" tabIndex="1"></div>
\`\`\`

**Common Attribute Changes:**
- \`class\` → \`className\`
- \`for\` → \`htmlFor\`
- \`tabindex\` → \`tabIndex\`
- \`onclick\` → \`onClick\`

## Embedding JavaScript in JSX

Use curly braces \`{}\` to embed JavaScript expressions:

\`\`\`jsx
const name = 'John';
const age = 25;

const element = (
  <div>
    <h1>Hello, {name}!</h1>
    <p>You are {age} years old.</p>
    <p>Next year you'll be {age + 1}.</p>
  </div>
);
\`\`\`

JSX makes React components more readable and allows you to leverage the full power of JavaScript within your markup.`
          },
          {
            id: 6,
            title: 'Understanding JSX - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What does JSX stand for?',
                options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JavaScript XHTML'],
                correct: 0
              },
              {
                question: 'Which attribute should you use instead of "class" in JSX?',
                options: ['class', 'className', 'cssClass', 'htmlClass'],
                correct: 1
              },
              {
                question: 'How do you embed JavaScript expressions in JSX?',
                options: ['{{ }}', '{ }', '[ ]', '( )'],
                correct: 1
              }
            ]
          },
          {
            id: 7,
            title: 'Your First React Component',
            type: 'text',
            duration: '20 min',
            content: `# Your First React Component

Now that you understand JSX, let's create your first React component! We'll build a simple greeting component and learn the fundamentals of component creation.

## Creating a Simple Component

Let's start with a basic greeting component:

\`\`\`jsx
// Greeting.js
function Greeting() {
  return (
    <div>
      <h1>Hello, React Developer!</h1>
      <p>Welcome to your first React component.</p>
    </div>
  );
}

export default Greeting;
\`\`\`

## Using Your Component

To use your component in the main App:

\`\`\`jsx
// App.js
import Greeting from './Greeting';

function App() {
  return (
    <div className="App">
      <Greeting />
    </div>
  );
}

export default App;
\`\`\`

## Component Variations

### Arrow Function Component
\`\`\`jsx
const Greeting = () => {
  return (
    <div>
      <h1>Hello, React Developer!</h1>
      <p>Welcome to your first React component.</p>
    </div>
  );
};

export default Greeting;
\`\`\`

## Component Best Practices

1. **One component per file**
2. **Use descriptive names**
3. **Keep components small and focused**
4. **Extract reusable logic**
5. **Use consistent naming conventions**

Congratulations! You've created your first React components. In the next lesson, we'll learn how to make components dynamic using props.`
          },
          {
            id: 8,
            title: 'Your First React Component - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'How do you export a React component?',
                options: ['export component MyComponent', 'export default MyComponent', 'export MyComponent default', 'default export MyComponent'],
                correct: 1
              },
              {
                question: 'What must React component names start with?',
                options: ['lowercase letter', 'uppercase letter', 'underscore', 'number'],
                correct: 1
              },
              {
                question: 'Which is the correct way to define a function component?',
                options: ['function myComponent()', 'function MyComponent()', 'Function MyComponent()', 'component MyComponent()'],
                correct: 1
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'Components and Props',
        duration: '180 min',
        lessons: [
          {
            id: 9,
            title: 'Understanding Props',
            type: 'text',
            duration: '30 min',
            content: `# Understanding Props in React

Props (short for "properties") are how you pass data from parent components to child components in React. They make components reusable and dynamic.

## What are Props?

Props are read-only data that a parent component passes to a child component. Think of them as function parameters for components.

### Basic Props Example

\`\`\`jsx
// Child component that receives props
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Parent component that passes props
function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}
\`\`\`

## Destructuring Props

You can destructure props to make your code cleaner:

\`\`\`jsx
// Instead of using props.name
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// You can destructure
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Multiple props
function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}
\`\`\`

## Props Best Practices

1. **Use descriptive prop names**
2. **Keep props simple and focused**
3. **Use PropTypes for validation**
4. **Provide default props when appropriate**
5. **Don't mutate props (they're read-only)**

Props are fundamental to React's component architecture. They enable you to create reusable, configurable components that can work with different data.`
          },
          {
            id: 10,
            title: 'Understanding Props - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What are props in React?',
                options: ['Properties passed from parent to child', 'Internal component state', 'CSS styles', 'Event handlers'],
                correct: 0
              },
              {
                question: 'Are props read-only?',
                options: ['No, they can be modified', 'Yes, they are read-only', 'Only in class components', 'Only in function components'],
                correct: 1
              },
              {
                question: 'How do you destructure props in a function component?',
                options: ['function Component(props)', 'function Component({prop1, prop2})', 'function Component[prop1, prop2]', 'function Component<prop1, prop2>'],
                correct: 1
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
    learningOutcomes: [
      'Build React components from scratch',
      'Understand JSX and component lifecycle',
      'Manage component state and props',
      'Handle user events and interactions',
      'Create reusable UI components'
    ]
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Complete guide to Python for data analysis, visualization, and machine learning. Master pandas, numpy, matplotlib, and scikit-learn.',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '18 hours',
    price: 0,
    rating: 4.9,
    studentsCount: 892,
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400',
    tags: ['Python', 'Data Science', 'Pandas', 'NumPy', 'Machine Learning'],
    modules: [
      {
        id: 1,
        title: 'Python Fundamentals for Data Science',
        duration: '240 min',
        lessons: [
          {
            id: 1,
            title: 'Python Data Types and Structures',
            type: 'text',
            duration: '30 min',
            content: `# Python Data Types and Structures for Data Science

Python provides powerful built-in data structures that are essential for data science work. Understanding these structures is crucial for effective data manipulation and analysis.

## Core Data Types

### Numbers
\`\`\`python
# Integers
age = 25
count = 1000

# Floats
temperature = 98.6
pi = 3.14159

# Complex numbers (useful in signal processing)
complex_num = 3 + 4j
\`\`\`

### Strings
\`\`\`python
# String creation
name = "Data Science"
description = 'Python for analysis'
multiline = """
This is a
multiline string
"""

# String methods for data cleaning
text = "  Data Science  "
clean_text = text.strip().lower()
words = text.split()
\`\`\`

## Essential Data Structures

### Lists - Ordered Collections
\`\`\`python
# Creating lists
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "hello", 3.14, True]

# List operations
numbers.append(6)  # Add element
numbers.extend([7, 8])  # Add multiple elements
first_three = numbers[:3]  # Slicing

# List comprehensions (powerful for data processing)
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

### Dictionaries - Key-Value Pairs
\`\`\`python
# Creating dictionaries
student = {
    "name": "John",
    "age": 22,
    "grades": [85, 90, 78]
}

# Dictionary operations
student["email"] = "john@email.com"  # Add new key
age = student.get("age", 0)  # Safe access

# Dictionary comprehensions
square_dict = {x: x**2 for x in range(5)}
\`\`\`

Python's data structures form the foundation for all data science operations. Master these basics to excel in data analysis.`
          },
          {
            id: 2,
            title: 'Python Data Types - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'Which data structure is ordered and allows duplicates?',
                options: ['Set', 'Dictionary', 'List', 'Tuple'],
                correct: 2
              },
              {
                question: 'How do you safely access a dictionary value?',
                options: ['dict[key]', 'dict.get(key)', 'dict.access(key)', 'dict->key'],
                correct: 1
              },
              {
                question: 'What is a list comprehension?',
                options: ['A way to understand lists', 'A concise way to create lists', 'A list documentation', 'A list method'],
                correct: 1
              }
            ]
          },
          {
            id: 3,
            title: 'NumPy Fundamentals',
            type: 'text',
            duration: '40 min',
            content: `# NumPy Fundamentals for Data Science

NumPy (Numerical Python) is the foundation of the Python data science ecosystem. It provides support for large, multi-dimensional arrays and matrices, along with mathematical functions to operate on these arrays.

## Why NumPy?

### Performance Benefits
- **Speed**: NumPy operations are implemented in C, making them much faster than pure Python
- **Memory Efficiency**: Arrays use less memory than Python lists
- **Vectorization**: Perform operations on entire arrays without explicit loops

## Creating NumPy Arrays

### From Python Lists
\`\`\`python
import numpy as np

# 1D array
arr1d = np.array([1, 2, 3, 4, 5])
print(arr1d)  # [1 2 3 4 5]

# 2D array
arr2d = np.array([[1, 2, 3], [4, 5, 6]])
print(arr2d)
# [[1 2 3]
#  [4 5 6]]
\`\`\`

### Using NumPy Functions
\`\`\`python
# Create arrays with specific values
zeros = np.zeros((3, 4))          # 3x4 array of zeros
ones = np.ones((2, 3))            # 2x3 array of ones
full = np.full((2, 2), 7)         # 2x2 array filled with 7
eye = np.eye(3)                   # 3x3 identity matrix

# Create arrays with ranges
arange_arr = np.arange(0, 10, 2)  # [0 2 4 6 8]
linspace_arr = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]

# Random arrays
random_arr = np.random.random((3, 3))     # Random values [0, 1)
random_int = np.random.randint(1, 10, (2, 3))  # Random integers
normal_arr = np.random.normal(0, 1, (3, 3))   # Normal distribution
\`\`\`

## Array Operations

### Arithmetic Operations
\`\`\`python
arr1 = np.array([1, 2, 3, 4])
arr2 = np.array([5, 6, 7, 8])

# Element-wise operations
print(arr1 + arr2)    # [6 8 10 12]
print(arr1 - arr2)    # [-4 -4 -4 -4]
print(arr1 * arr2)    # [5 12 21 32]
print(arr1 / arr2)    # [0.2 0.33 0.43 0.5]
print(arr1 ** 2)      # [1 4 9 16]

# Scalar operations
print(arr1 + 10)      # [11 12 13 14]
print(arr1 * 2)       # [2 4 6 8]
\`\`\`

### Mathematical Functions
\`\`\`python
arr = np.array([1, 4, 9, 16, 25])

# Universal functions (ufuncs)
print(np.sqrt(arr))      # [1. 2. 3. 4. 5.]
print(np.log(arr))       # Natural logarithm
print(np.exp(arr))       # Exponential
print(np.sin(arr))       # Sine
print(np.cos(arr))       # Cosine

# Aggregation functions
print(np.sum(arr))       # 55
print(np.mean(arr))      # 11.0
print(np.std(arr))       # Standard deviation
print(np.min(arr))       # 1
print(np.max(arr))       # 25
\`\`\`

NumPy is the foundation that makes Python a powerful language for data science. Its efficient array operations and mathematical functions are used by virtually every data science library in Python.`
          },
          {
            id: 4,
            title: 'NumPy Fundamentals - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What is the main advantage of NumPy arrays over Python lists?',
                options: ['Easier syntax', 'Better performance', 'More features', 'Simpler installation'],
                correct: 1
              },
              {
                question: 'Which function creates a NumPy array filled with zeros?',
                options: ['np.empty()', 'np.zeros()', 'np.null()', 'np.void()'],
                correct: 1
              },
              {
                question: 'What does vectorization mean in NumPy?',
                options: ['Creating vectors', 'Operations on entire arrays without loops', 'Array direction', 'Vector graphics'],
                correct: 1
              }
            ]
          },
          {
            id: 5,
            title: 'Pandas for Data Manipulation',
            type: 'text',
            duration: '45 min',
            content: `# Pandas for Data Manipulation

Pandas is the most important library for data manipulation and analysis in Python. It provides data structures and functions needed to work with structured data seamlessly.

## Core Data Structures

### Series - 1D labeled array
\`\`\`python
import pandas as pd
import numpy as np

# Creating a Series
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)

# Series with custom index
s = pd.Series([1, 3, 5, 6, 8], index=['a', 'b', 'c', 'd', 'e'])
print(s)

# From dictionary
data = {'a': 1, 'b': 2, 'c': 3}
s = pd.Series(data)
\`\`\`

### DataFrame - 2D labeled data structure
\`\`\`python
# Creating a DataFrame
dates = pd.date_range('20240101', periods=6)
df = pd.DataFrame(np.random.randn(6, 4), index=dates, columns=list('ABCD'))
print(df)

# From dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [25, 30, 35, 28],
    'City': ['New York', 'London', 'Tokyo', 'Paris']
}
df = pd.DataFrame(data)
print(df)
\`\`\`

## Data Selection and Indexing

### Selecting Columns
\`\`\`python
# Single column
print(df['Name'])

# Multiple columns
print(df[['Name', 'Age']])

# Using dot notation
print(df.Name)
\`\`\`

### Selecting Rows
\`\`\`python
# By index position
print(df.iloc[0])  # First row
print(df.iloc[0:2])  # First two rows

# By label
print(df.loc[0])  # Row with index 0
print(df.loc[0:2])  # Rows with index 0 to 2

# Boolean indexing
print(df[df['Age'] > 30])
\`\`\`

## Data Cleaning

### Handling Missing Data
\`\`\`python
# Check for missing values
print(df.isnull())
print(df.isnull().sum())

# Drop missing values
df_clean = df.dropna()

# Fill missing values
df_filled = df.fillna(0)
df_filled = df.fillna(df.mean())  # Fill with mean
\`\`\`

### Data Types
\`\`\`python
# Check data types
print(df.dtypes)

# Convert data types
df['Age'] = df['Age'].astype('int64')
df['Name'] = df['Name'].astype('string')
\`\`\`

## Data Analysis

### Basic Statistics
\`\`\`python
# Descriptive statistics
print(df.describe())

# Specific statistics
print(df.mean())
print(df.median())
print(df.std())
print(df.min())
print(df.max())
\`\`\`

### Grouping and Aggregation
\`\`\`python
# Group by a column
grouped = df.groupby('City')
print(grouped.mean())

# Multiple aggregations
agg_result = df.groupby('City').agg({
    'Age': ['mean', 'min', 'max'],
    'Name': 'count'
})
print(agg_result)
\`\`\`

Pandas makes data manipulation intuitive and powerful, allowing you to clean, transform, and analyze data efficiently.`
          },
          {
            id: 6,
            title: 'Pandas Data Manipulation - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What is the main difference between Series and DataFrame?',
                options: ['Series is faster', 'Series is 1D, DataFrame is 2D', 'DataFrame is newer', 'No difference'],
                correct: 1
              },
              {
                question: 'Which method is used to handle missing values by removing them?',
                options: ['fillna()', 'dropna()', 'removena()', 'deletena()'],
                correct: 1
              },
              {
                question: 'What does df.groupby() do?',
                options: ['Groups rows by column values', 'Groups columns', 'Sorts data', 'Filters data'],
                correct: 0
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ['Basic Python programming', 'Mathematics fundamentals'],
    learningOutcomes: [
      'Master pandas for data manipulation',
      'Create data visualizations with matplotlib',
      'Perform statistical analysis',
      'Build machine learning models',
      'Handle real-world datasets'
    ]
  },
  {
    id: 'blockchain-development',
    title: 'Blockchain Development with Hedera',
    description: 'Learn to build decentralized applications on Hedera Hashgraph. Master smart contracts, consensus, and DApp development.',
    instructor: 'Alex Rodriguez',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'Blockchain',
    level: 'Advanced',
    duration: '20 hours',
    price: 0,
    rating: 4.7,
    studentsCount: 456,
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    tags: ['Blockchain', 'Hedera', 'Smart Contracts', 'DApps', 'Cryptocurrency'],
    modules: [
      {
        id: 1,
        title: 'Blockchain Fundamentals',
        duration: '180 min',
        lessons: [
          {
            id: 1,
            title: 'What is Blockchain?',
            type: 'text',
            duration: '30 min',
            content: `# What is Blockchain?

Blockchain is a revolutionary technology that enables secure, transparent, and decentralized record-keeping without the need for intermediaries. Understanding blockchain fundamentals is crucial for modern developers.

## Core Concepts

### Distributed Ledger Technology
A blockchain is essentially a distributed database that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography.

**Key Characteristics:**
- **Decentralized**: No single point of control
- **Immutable**: Records cannot be altered once confirmed
- **Transparent**: All transactions are visible to network participants
- **Secure**: Cryptographic hashing ensures data integrity

### How Blockchain Works

1. **Transaction Initiation**: A user initiates a transaction
2. **Broadcasting**: The transaction is broadcast to the network
3. **Validation**: Network nodes validate the transaction
4. **Block Creation**: Valid transactions are grouped into a block
5. **Consensus**: Network agrees on the new block
6. **Block Addition**: The block is added to the chain
7. **Distribution**: The updated blockchain is distributed across the network

## Blockchain Structure

### Block Components
\`\`\`javascript
// Simplified block structure
const block = {
  index: 1,
  timestamp: '2024-01-15T10:30:00Z',
  previousHash: '000abc123...',
  hash: '000def456...',
  nonce: 12345,
  transactions: [
    {
      from: 'Alice',
      to: 'Bob',
      amount: 10,
      timestamp: '2024-01-15T10:29:45Z'
    }
  ]
};
\`\`\`

### Cryptographic Hashing
Each block contains a hash of the previous block, creating an immutable chain:

\`\`\`javascript
// Example using SHA-256
const crypto = require('crypto');

function calculateHash(block) {
  const data = block.index + block.timestamp + block.previousHash + JSON.stringify(block.transactions) + block.nonce;
  return crypto.createHash('sha256').update(data).digest('hex');
}
\`\`\`

## Types of Blockchain Networks

### Public Blockchains
- **Open to everyone**
- **Fully decentralized**
- **Examples**: Bitcoin, Ethereum
- **Pros**: Maximum security, transparency
- **Cons**: Slower, energy-intensive

### Private Blockchains
- **Restricted access**
- **Controlled by organization**
- **Examples**: Enterprise solutions
- **Pros**: Faster, more control
- **Cons**: Less decentralized

### Consortium Blockchains
- **Semi-decentralized**
- **Controlled by group of organizations**
- **Examples**: Banking consortiums
- **Pros**: Balance of control and decentralization

Blockchain technology is transforming industries and creating new possibilities for decentralized applications.`
          },
          {
            id: 2,
            title: 'What is Blockchain? - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What makes blockchain immutable?',
                options: ['Encryption', 'Cryptographic hashing and linking', 'Passwords', 'Firewalls'],
                correct: 1
              },
              {
                question: 'What is a key characteristic of public blockchains?',
                options: ['Restricted access', 'Centralized control', 'Open to everyone', 'Private transactions'],
                correct: 2
              },
              {
                question: 'What is the purpose of a nonce in a block?',
                options: ['Store data', 'Link blocks', 'Mining/proof of work', 'Encrypt transactions'],
                correct: 2
              }
            ]
          },
          {
            id: 3,
            title: 'Hedera Hashgraph Overview',
            type: 'text',
            duration: '35 min',
            content: `# Hedera Hashgraph Overview

Hedera Hashgraph is a distributed ledger technology that offers a unique alternative to traditional blockchain. It uses a novel consensus algorithm called hashgraph to achieve high throughput, low latency, and fair ordering.

## What Makes Hedera Different?

### Hashgraph Consensus Algorithm
Unlike blockchain's linear chain of blocks, hashgraph uses a directed acyclic graph (DAG) structure that allows for parallel processing of transactions.

**Key Advantages:**
- **Speed**: 10,000+ transactions per second
- **Low Cost**: Predictable, low fees
- **Fair**: Fair access and fair ordering
- **Secure**: Asynchronous Byzantine Fault Tolerant (aBFT)

### Consensus Mechanism
Hedera uses a unique consensus mechanism based on:

1. **Gossip Protocol**: Nodes share information about transactions
2. **Virtual Voting**: Nodes don't actually vote, but the algorithm determines what they would have voted
3. **Hashgraph**: Creates a graph of events showing the order of transactions

## Hedera Services

### Cryptocurrency (HBAR)
\`\`\`javascript
// Transfer HBAR tokens
const transferTransaction = new TransferTransaction()
  .addHbarTransfer(senderAccountId, new Hbar(-10))
  .addHbarTransfer(receiverAccountId, new Hbar(10))
  .freezeWith(client);

const signedTransaction = await transferTransaction.sign(senderPrivateKey);
const response = await signedTransaction.execute(client);
\`\`\`

### Smart Contracts
\`\`\`solidity
// Simple smart contract example
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
\`\`\`

### Consensus Service (HCS)
\`\`\`javascript
// Create a topic for consensus
const topicCreateTransaction = new TopicCreateTransaction()
  .setTopicMemo("My Topic")
  .freezeWith(client);

const signedTransaction = await topicCreateTransaction.sign(adminPrivateKey);
const response = await signedTransaction.execute(client);
const topicId = response.getReceipt(client).topicId;

// Submit a message to the topic
const messageTransaction = new TopicMessageSubmitTransaction()
  .setTopicId(topicId)
  .setMessage("Hello, Hedera!")
  .freezeWith(client);
\`\`\`

### Token Service (HTS)
\`\`\`javascript
// Create a fungible token
const tokenCreateTransaction = new TokenCreateTransaction()
  .setTokenName("My Token")
  .setTokenSymbol("MTK")
  .setDecimals(2)
  .setInitialSupply(1000000)
  .setTreasuryAccountId(treasuryAccountId)
  .setAdminKey(adminKey)
  .freezeWith(client);
\`\`\`

## Development Environment Setup

### Prerequisites
\`\`\`bash
# Install Node.js and npm
npm install -g @hashgraph/sdk
npm install -g @hashgraph/hedera-cli
\`\`\`

### Basic Client Setup
\`\`\`javascript
const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");

// Create client for testnet
const client = Client.forTestnet();

// Set operator account
const operatorAccountId = AccountId.fromString("0.0.123456");
const operatorPrivateKey = PrivateKey.fromString("your-private-key");

client.setOperator(operatorAccountId, operatorPrivateKey);
\`\`\`

Hedera provides a robust platform for building enterprise-grade decentralized applications with predictable costs and high performance.`
          },
          {
            id: 4,
            title: 'Hedera Hashgraph Overview - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What consensus algorithm does Hedera use?',
                options: ['Proof of Work', 'Proof of Stake', 'Hashgraph', 'Delegated Proof of Stake'],
                correct: 2
              },
              {
                question: 'What is the native cryptocurrency of Hedera?',
                options: ['ETH', 'BTC', 'HBAR', 'ADA'],
                correct: 2
              },
              {
                question: 'Which Hedera service is used for consensus and ordering?',
                options: ['Smart Contracts', 'Token Service', 'Consensus Service (HCS)', 'File Service'],
                correct: 2
              }
            ]
          },
          {
            id: 5,
            title: 'Smart Contracts on Hedera',
            type: 'text',
            duration: '40 min',
            content: `# Smart Contracts on Hedera

Hedera supports Ethereum-compatible smart contracts, allowing developers to deploy Solidity contracts with the benefits of hashgraph consensus.

## Smart Contract Basics

### What are Smart Contracts?
Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met.

**Benefits on Hedera:**
- **Low, predictable fees**
- **Fast finality** (3-5 seconds)
- **High throughput**
- **Ethereum compatibility**

### Contract Development Lifecycle

1. **Write Contract** in Solidity
2. **Compile** to bytecode
3. **Deploy** to Hedera network
4. **Interact** with deployed contract

## Example: Simple Storage Contract

### Solidity Code
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;
    
    event DataStored(uint256 data, address indexed by);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    function set(uint256 x) public onlyOwner {
        storedData = x;
        emit DataStored(x, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
\`\`\`

### Deployment Script
\`\`\`javascript
const { 
    Client, 
    ContractCreateFlow, 
    ContractExecuteTransaction,
    ContractCallQuery,
    PrivateKey,
    AccountId
} = require("@hashgraph/sdk");

async function deployContract() {
    // Setup client
    const client = Client.forTestnet();
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
    client.setOperator(operatorId, operatorKey);
    
    // Contract bytecode (from compilation)
    const bytecode = "0x608060405234801561001057600080fd5b50...";
    
    // Deploy contract
    const contractCreateFlow = new ContractCreateFlow()
        .setBytecode(bytecode)
        .setGas(100000)
        .setConstructorParameters();
    
    const response = await contractCreateFlow.execute(client);
    const receipt = await response.getReceipt(client);
    const contractId = receipt.contractId;
    
    console.log(\`Contract deployed with ID: \${contractId}\`);
    return contractId;
}
\`\`\`

### Interacting with Contract
\`\`\`javascript
async function interactWithContract(contractId) {
    // Call the 'set' function
    const contractExecuteTransaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("set", new ContractFunctionParameters().addUint256(42));
    
    const response = await contractExecuteTransaction.execute(client);
    const receipt = await response.getReceipt(client);
    
    console.log("Transaction status:", receipt.status.toString());
    
    // Query the 'get' function
    const contractCallQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("get");
    
    const result = await contractCallQuery.execute(client);
    const value = result.getUint256(0);
    
    console.log("Stored value:", value.toString());
}
\`\`\`

## Advanced Contract Features

### Events and Logs
\`\`\`solidity
contract EventExample {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    function transfer(address to, uint256 amount) public {
        // Transfer logic here
        emit Transfer(msg.sender, to, amount);
    }
}
\`\`\`

### Contract-to-Contract Calls
\`\`\`solidity
interface IExternalContract {
    function externalFunction(uint256 value) external returns (bool);
}

contract CallerContract {
    function callExternal(address target, uint256 value) public {
        IExternalContract(target).externalFunction(value);
    }
}
\`\`\`

## Best Practices

### Security Considerations
1. **Use latest Solidity version**
2. **Implement proper access controls**
3. **Validate all inputs**
4. **Handle edge cases**
5. **Test thoroughly**

### Gas Optimization
\`\`\`solidity
// Efficient storage patterns
contract Optimized {
    // Pack structs to save storage slots
    struct User {
        uint128 balance;    // 16 bytes
        uint128 timestamp;  // 16 bytes
        // Total: 32 bytes (1 storage slot)
    }
    
    // Use events for data that doesn't need on-chain storage
    event UserAction(address user, uint256 action);
    
    // Batch operations when possible
    function batchTransfer(address[] memory recipients, uint256[] memory amounts) public {
        require(recipients.length == amounts.length, "Array length mismatch");
        
        for (uint i = 0; i < recipients.length; i++) {
            // Transfer logic
        }
    }
}
\`\`\`

Smart contracts on Hedera combine the power of Ethereum compatibility with the efficiency of hashgraph consensus, enabling powerful decentralized applications.`
          },
          {
            id: 6,
            title: 'Smart Contracts on Hedera - Quiz',
            type: 'quiz',
            duration: '5 min',
            questions: [
              {
                question: 'What programming language is used for Hedera smart contracts?',
                options: ['JavaScript', 'Python', 'Solidity', 'Go'],
                correct: 2
              },
              {
                question: 'What is the typical finality time for Hedera smart contracts?',
                options: ['30 seconds', '10 minutes', '3-5 seconds', '1 hour'],
                correct: 2
              },
              {
                question: 'What is the purpose of the modifier keyword in Solidity?',
                options: ['Change variable types', 'Add access control', 'Import libraries', 'Define events'],
                correct: 1
              }
            ]
          }
        ]
      }
    ],
    prerequisites: ['JavaScript programming', 'Basic cryptography knowledge'],
    learningOutcomes: [
      'Understand blockchain and Hedera architecture',
      'Build smart contracts on Hedera',
      'Create decentralized applications',
      'Implement token systems',
      'Deploy production-ready DApps'
    ]
  }
];