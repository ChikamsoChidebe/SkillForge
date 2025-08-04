import { supabase, supabaseService } from './supabaseClient'
import { COMPREHENSIVE_COURSES } from './courseContent'

// Use comprehensive course data with fallback
const SAMPLE_COURSES = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Master the basics of React including components, state, props, and hooks. Build real-world applications from scratch.',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    category: 'Frontend',
    level: 'Beginner',
    duration: '12 hours',
    price: 0,
    rating: 4.8,
    studentsCount: 1247,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    tags: ['React', 'JavaScript', 'Frontend', 'Components'],
    modules: [
      {
        id: 1,
        title: 'Introduction to React',
        duration: '90 min',
        lessons: [
          { 
            id: 1, 
            title: 'What is React?', 
            type: 'text', 
            duration: '15 min', 
            content: `# What is React?\n\nReact is a powerful JavaScript library for building user interfaces, particularly web applications. Created by Facebook (now Meta) in 2013, React has revolutionized how developers think about building interactive UIs.\n\n## Key Concepts\n\n### Component-Based Architecture\nReact applications are built using components - reusable pieces of code that represent parts of a user interface. Think of components as custom HTML elements that you can create and reuse throughout your application.\n\n### Virtual DOM\nReact uses a Virtual DOM, which is a JavaScript representation of the actual DOM. This allows React to:\n- Efficiently update only the parts of the page that have changed\n- Provide better performance compared to traditional DOM manipulation\n- Make applications more predictable and easier to debug\n\n### Declarative Programming\nWith React, you describe what the UI should look like for any given state, and React takes care of updating the DOM when the state changes. This is different from imperative programming where you manually manipulate the DOM.\n\n## Why Choose React?\n\n1. **Reusability**: Components can be reused across different parts of your application\n2. **Maintainability**: Clear component structure makes code easier to maintain\n3. **Performance**: Virtual DOM ensures efficient updates\n4. **Community**: Large ecosystem with extensive third-party libraries\n5. **Job Market**: High demand for React developers\n\n## React Ecosystem\n\n- **React Router**: For handling navigation in single-page applications\n- **Redux/Zustand**: For state management in complex applications\n- **Next.js**: Full-stack React framework\n- **React Native**: For building mobile applications\n- **Testing Library**: For testing React components\n\n## Real-World Applications\n\nReact is used by major companies including:\n- Facebook/Meta\n- Netflix\n- Airbnb\n- Uber\n- WhatsApp\n- Instagram\n\nIn the next lesson, we'll set up your development environment and create your first React application.`
          },
          { 
            id: 2, 
            title: 'Setting up Development Environment', 
            type: 'text', 
            duration: '20 min', 
            content: `# Setting up Your React Development Environment\n\nBefore we start building React applications, we need to set up our development environment with the necessary tools.\n\n## Prerequisites\n\n### Node.js and npm\nNode.js is a JavaScript runtime that allows us to run JavaScript outside the browser. npm (Node Package Manager) comes bundled with Node.js and helps us manage project dependencies.\n\n**Installation Steps:**\n1. Visit [nodejs.org](https://nodejs.org)\n2. Download the LTS (Long Term Support) version\n3. Run the installer and follow the setup wizard\n4. Verify installation by opening terminal/command prompt and running:\n   \\\`\\\`\\\`bash\n   node --version\n   npm --version\n   \\\`\\\`\\\`\n\n### Code Editor\nWhile you can use any text editor, we recommend **Visual Studio Code** for its excellent React support:\n\n**Recommended VS Code Extensions:**\n- ES7+ React/Redux/React-Native snippets\n- Bracket Pair Colorizer\n- Auto Rename Tag\n- Prettier - Code formatter\n- ESLint\n\n## Creating Your First React App\n\n### Using Create React App\nCreate React App is the official tool for setting up new React projects with zero configuration.\n\n\\\`\\\`\\\`bash\n# Install Create React App globally (optional)\nnpm install -g create-react-app\n\n# Create a new React application\nnpx create-react-app my-first-react-app\n\n# Navigate to the project directory\ncd my-first-react-app\n\n# Start the development server\nnpm start\n\\\`\\\`\\\`\n\n### Project Structure\nAfter creating your React app, you'll see this folder structure:\n\n\\\`\\\`\\\`\nmy-first-react-app/\n├── public/\n│   ├── index.html\n│   └── favicon.ico\n├── src/\n│   ├── App.js\n│   ├── App.css\n│   ├── index.js\n│   └── index.css\n├── package.json\n└── README.md\n\\\`\\\`\\\`\n\n**Key Files:**\n- **public/index.html**: The HTML template\n- **src/index.js**: Entry point of your React application\n- **src/App.js**: Main App component\n- **package.json**: Project configuration and dependencies\n\n### Development Server\nWhen you run \\\`npm start\\\`, React starts a development server with:\n- Hot reloading (automatic page refresh on code changes)\n- Error overlay for debugging\n- Built-in build tools\n\n## Browser Developer Tools\n\n### React Developer Tools\nInstall the React Developer Tools browser extension:\n- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)\n- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)\n\nThis extension adds React-specific debugging capabilities to your browser's developer tools.\n\n## Alternative Setup Methods\n\n### Vite (Faster Alternative)\n\\\`\\\`\\\`bash\nnpm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev\n\\\`\\\`\\\`\n\n### Online Development\nFor quick experimentation, you can use online editors:\n- CodeSandbox\n- StackBlitz\n- CodePen\n\n## Troubleshooting Common Issues\n\n1. **Port 3000 already in use**: Use \\\`npm start -- --port 3001\\\`\n2. **Permission errors**: Use \\\`sudo\\\` on Mac/Linux or run as administrator on Windows\n3. **Node version conflicts**: Use Node Version Manager (nvm)\n\nYour development environment is now ready! In the next lesson, we'll explore JSX syntax.`
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
            duration: '40 min',
            content: `# Python Data Types and Structures for Data Science\n\nPython provides powerful built-in data structures that are essential for data science work. Understanding these structures is crucial for effective data manipulation and analysis.\n\n## Core Data Types\n\n### Numbers\n\`\`\`python\n# Integers\nage = 25\ncount = 1000\n\n# Floats\ntemperature = 98.6\npi = 3.14159\n\n# Complex numbers (useful in signal processing)\ncomplex_num = 3 + 4j\n\`\`\`\n\n### Strings\n\`\`\`python\n# String creation\nname = "Data Science"\ndescription = 'Python for analysis'\nmultiline = """\nThis is a\nmultiline string\n"""\n\n# String methods for data cleaning\ntext = "  Data Science  "\nclean_text = text.strip().lower()\nwords = text.split()\n\`\`\`\n\n### Booleans\n\`\`\`python\n# Boolean values\nis_valid = True\nhas_data = False\n\n# Boolean operations\nresult = (age > 18) and (count > 0)\n\`\`\`\n\n## Essential Data Structures\n\n### Lists - Ordered Collections\n\`\`\`python\n# Creating lists\nnumbers = [1, 2, 3, 4, 5]\nnames = ["Alice", "Bob", "Charlie"]\nmixed = [1, "hello", 3.14, True]\n\n# List operations\nnumbers.append(6)  # Add element\nnumbers.extend([7, 8])  # Add multiple elements\nfirst_three = numbers[:3]  # Slicing\n\n# List comprehensions (powerful for data processing)\nsquares = [x**2 for x in range(10)]\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\n\`\`\`\n\n### Dictionaries - Key-Value Pairs\n\`\`\`python\n# Creating dictionaries\nstudent = {\n    "name": "John",\n    "age": 22,\n    "grades": [85, 90, 78]\n}\n\n# Dictionary operations\nstudent["email"] = "john@email.com"  # Add new key\nage = student.get("age", 0)  # Safe access\n\n# Dictionary comprehensions\nsquare_dict = {x: x**2 for x in range(5)}\n\`\`\`\n\n### Tuples - Immutable Sequences\n\`\`\`python\n# Creating tuples\ncoordinates = (10.5, 20.3)\nrgb_color = (255, 128, 0)\n\n# Tuple unpacking\nx, y = coordinates\nr, g, b = rgb_color\n\n# Named tuples for structured data\nfrom collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\npoint = Point(10, 20)\nprint(point.x, point.y)\n\`\`\`\n\n### Sets - Unique Collections\n\`\`\`python\n# Creating sets\nunique_numbers = {1, 2, 3, 4, 5}\nfrom_list = set([1, 2, 2, 3, 3, 4])  # Removes duplicates\n\n# Set operations\nset1 = {1, 2, 3}\nset2 = {3, 4, 5}\nintersection = set1 & set2  # {3}\nunion = set1 | set2  # {1, 2, 3, 4, 5}\ndifference = set1 - set2  # {1, 2}\n\`\`\`\n\n## Advanced Data Structures\n\n### Collections Module\n\`\`\`python\nfrom collections import Counter, defaultdict, deque\n\n# Counter - count occurrences\ntext = "hello world"\nletter_counts = Counter(text)\nprint(letter_counts)  # Counter({'l': 3, 'o': 2, ...})\n\n# defaultdict - default values\nword_lists = defaultdict(list)\nword_lists['fruits'].append('apple')\n\n# deque - double-ended queue\nqueue = deque([1, 2, 3])\nqueue.appendleft(0)  # Add to beginning\nqueue.append(4)      # Add to end\n\`\`\`\n\n## Data Structure Selection Guide\n\n| Use Case | Best Structure | Why |\n|----------|---------------|-----|\n| Ordered data with duplicates | List | Maintains order, allows duplicates |\n| Key-value mapping | Dictionary | Fast lookups, flexible keys |\n| Unique items | Set | Automatic deduplication |\n| Immutable sequence | Tuple | Cannot be changed, hashable |\n| Counting items | Counter | Built-in counting functionality |\n\n## Practical Examples\n\n### Data Cleaning with Lists\n\`\`\`python\n# Clean and process survey responses\nresponses = ["Yes", "yes", "YES", "No", "no", "Maybe", ""]\n\n# Normalize responses\nclean_responses = []\nfor response in responses:\n    if response.strip():  # Skip empty responses\n        clean_responses.append(response.strip().lower())\n\n# Using list comprehension\nclean_responses = [r.strip().lower() for r in responses if r.strip()]\n\`\`\`\n\n### Data Aggregation with Dictionaries\n\`\`\`python\n# Sales data aggregation\nsales_data = [\n    {"product": "laptop", "amount": 1200, "region": "north"},\n    {"product": "mouse", "amount": 25, "region": "north"},\n    {"product": "laptop", "amount": 1200, "region": "south"},\n]\n\n# Aggregate by region\nregion_totals = {}\nfor sale in sales_data:\n    region = sale["region"]\n    amount = sale["amount"]\n    region_totals[region] = region_totals.get(region, 0) + amount\n\nprint(region_totals)  # {'north': 1225, 'south': 1200}\n\`\`\`\n\n### Finding Unique Values with Sets\n\`\`\`python\n# Find unique customers\ncustomer_orders = [\n    "alice@email.com",\n    "bob@email.com",\n    "alice@email.com",\n    "charlie@email.com",\n    "bob@email.com"\n]\n\nunique_customers = set(customer_orders)\nprint(f"Total unique customers: {len(unique_customers)}")\n\`\`\`\n\n## Performance Considerations\n\n### Time Complexity\n- **List**: Access O(1), Search O(n), Insert/Delete O(n)\n- **Dictionary**: Access O(1), Search O(1), Insert/Delete O(1)\n- **Set**: Search O(1), Insert/Delete O(1)\n- **Tuple**: Access O(1), Search O(n)\n\n### Memory Usage\n\`\`\`python\nimport sys\n\n# Compare memory usage\nlist_data = [1, 2, 3, 4, 5]\ntuple_data = (1, 2, 3, 4, 5)\n\nprint(f"List size: {sys.getsizeof(list_data)} bytes")\nprint(f"Tuple size: {sys.getsizeof(tuple_data)} bytes")\n\`\`\`\n\n## Best Practices\n\n1. **Choose the right structure** for your use case\n2. **Use list comprehensions** for simple transformations\n3. **Leverage dictionary methods** like get() for safe access\n4. **Use sets for uniqueness** operations\n5. **Consider named tuples** for structured data\n\n## Common Patterns in Data Science\n\n### Data Transformation Pipeline\n\`\`\`python\n# Raw data\nraw_data = ["1,John,25", "2,Jane,30", "3,Bob,35"]\n\n# Transform to structured format\nstructured_data = []\nfor line in raw_data:\n    parts = line.split(",")\n    record = {\n        "id": int(parts[0]),\n        "name": parts[1],\n        "age": int(parts[2])\n    }\n    structured_data.append(record)\n\n# Using list comprehension\nstructured_data = [\n    {"id": int(parts[0]), "name": parts[1], "age": int(parts[2])}\n    for line in raw_data\n    for parts in [line.split(",")]\n]\n\`\`\`\n\nMastering these fundamental data structures is essential for effective data science work in Python. In the next lesson, we'll explore NumPy arrays, which provide the foundation for numerical computing in Python.`
          },
          {
            id: 2,
            title: 'NumPy Fundamentals',
            type: 'text',
            duration: '50 min',
            content: `# NumPy Fundamentals for Data Science\n\nNumPy (Numerical Python) is the foundation of the Python data science ecosystem. It provides support for large, multi-dimensional arrays and matrices, along with mathematical functions to operate on these arrays.\n\n## Why NumPy?\n\n### Performance Benefits\n- **Speed**: NumPy operations are implemented in C, making them much faster than pure Python\n- **Memory Efficiency**: Arrays use less memory than Python lists\n- **Vectorization**: Perform operations on entire arrays without explicit loops\n\n### Comparison: Python Lists vs NumPy Arrays\n\`\`\`python\nimport numpy as np\nimport time\n\n# Python list operation\npython_list = list(range(1000000))\nstart_time = time.time()\nsquared_list = [x**2 for x in python_list]\nlist_time = time.time() - start_time\n\n# NumPy array operation\nnumpy_array = np.arange(1000000)\nstart_time = time.time()\nsquared_array = numpy_array**2\nnumpy_time = time.time() - start_time\n\nprint(f"List time: {list_time:.4f} seconds")\nprint(f"NumPy time: {numpy_time:.4f} seconds")\nprint(f"NumPy is {list_time/numpy_time:.1f}x faster")\n\`\`\`\n\n## Creating NumPy Arrays\n\n### From Python Lists\n\`\`\`python\nimport numpy as np\n\n# 1D array\narr1d = np.array([1, 2, 3, 4, 5])\nprint(arr1d)  # [1 2 3 4 5]\n\n# 2D array\narr2d = np.array([[1, 2, 3], [4, 5, 6]])\nprint(arr2d)\n# [[1 2 3]\n#  [4 5 6]]\n\n# 3D array\narr3d = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])\n\`\`\`\n\n### Using NumPy Functions\n\`\`\`python\n# Create arrays with specific values\nzeros = np.zeros((3, 4))          # 3x4 array of zeros\nones = np.ones((2, 3))            # 2x3 array of ones\nfull = np.full((2, 2), 7)         # 2x2 array filled with 7\neye = np.eye(3)                   # 3x3 identity matrix\n\n# Create arrays with ranges\narange_arr = np.arange(0, 10, 2)  # [0 2 4 6 8]\nlinspace_arr = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]\n\n# Random arrays\nrandom_arr = np.random.random((3, 3))     # Random values [0, 1)\nrandom_int = np.random.randint(1, 10, (2, 3))  # Random integers\nnormal_arr = np.random.normal(0, 1, (3, 3))   # Normal distribution\n\`\`\`\n\n## Array Properties\n\n\`\`\`python\narr = np.array([[1, 2, 3, 4], [5, 6, 7, 8]])\n\nprint(f"Shape: {arr.shape}")        # (2, 4)\nprint(f"Size: {arr.size}")          # 8\nprint(f"Dimensions: {arr.ndim}")    # 2\nprint(f"Data type: {arr.dtype}")    # int64\nprint(f"Item size: {arr.itemsize}") # 8 bytes\n\`\`\`\n\n## Data Types in NumPy\n\n\`\`\`python\n# Specify data types\nint_arr = np.array([1, 2, 3], dtype=np.int32)\nfloat_arr = np.array([1, 2, 3], dtype=np.float64)\nbool_arr = np.array([True, False, True], dtype=np.bool_)\n\n# Convert data types\nfloat_to_int = float_arr.astype(np.int32)\n\n# Common data types\n# np.int8, np.int16, np.int32, np.int64\n# np.float16, np.float32, np.float64\n# np.bool_, np.string_, np.unicode_\n\`\`\`\n\n## Array Indexing and Slicing\n\n### 1D Arrays\n\`\`\`python\narr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])\n\n# Basic indexing\nprint(arr[0])      # 0 (first element)\nprint(arr[-1])     # 9 (last element)\n\n# Slicing\nprint(arr[2:5])    # [2 3 4]\nprint(arr[:3])     # [0 1 2]\nprint(arr[7:])     # [7 8 9]\nprint(arr[::2])    # [0 2 4 6 8] (every 2nd element)\n\`\`\`\n\n### 2D Arrays\n\`\`\`python\narr2d = np.array([[1, 2, 3, 4],\n                   [5, 6, 7, 8],\n                   [9, 10, 11, 12]])\n\n# Access elements\nprint(arr2d[0, 1])     # 2 (row 0, column 1)\nprint(arr2d[1][2])     # 7 (alternative syntax)\n\n# Slicing rows and columns\nprint(arr2d[0, :])     # [1 2 3 4] (first row)\nprint(arr2d[:, 1])     # [2 6 10] (second column)\nprint(arr2d[1:, 2:])   # [[7 8] [11 12]] (subarray)\n\`\`\`\n\n### Boolean Indexing\n\`\`\`python\narr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])\n\n# Create boolean mask\nmask = arr > 5\nprint(mask)        # [False False False False False True True True True]\n\n# Apply mask\nfiltered = arr[mask]\nprint(filtered)    # [6 7 8 9]\n\n# One-liner\nfiltered = arr[arr > 5]\n\n# Multiple conditions\nfiltered = arr[(arr > 3) & (arr < 8)]  # [4 5 6 7]\n\`\`\`\n\n## Array Operations\n\n### Arithmetic Operations\n\`\`\`python\narr1 = np.array([1, 2, 3, 4])\narr2 = np.array([5, 6, 7, 8])\n\n# Element-wise operations\nprint(arr1 + arr2)    # [6 8 10 12]\nprint(arr1 - arr2)    # [-4 -4 -4 -4]\nprint(arr1 * arr2)    # [5 12 21 32]\nprint(arr1 / arr2)    # [0.2 0.33 0.43 0.5]\nprint(arr1 ** 2)      # [1 4 9 16]\n\n# Scalar operations\nprint(arr1 + 10)      # [11 12 13 14]\nprint(arr1 * 2)       # [2 4 6 8]\n\`\`\`\n\n### Mathematical Functions\n\`\`\`python\narr = np.array([1, 4, 9, 16, 25])\n\n# Universal functions (ufuncs)\nprint(np.sqrt(arr))      # [1. 2. 3. 4. 5.]\nprint(np.log(arr))       # Natural logarithm\nprint(np.exp(arr))       # Exponential\nprint(np.sin(arr))       # Sine\nprint(np.cos(arr))       # Cosine\n\n# Aggregation functions\nprint(np.sum(arr))       # 55\nprint(np.mean(arr))      # 11.0\nprint(np.std(arr))       # Standard deviation\nprint(np.min(arr))       # 1\nprint(np.max(arr))       # 25\n\`\`\`\n\n## Array Reshaping\n\n\`\`\`python\narr = np.arange(12)  # [0 1 2 3 4 5 6 7 8 9 10 11]\n\n# Reshape to 2D\nreshaped = arr.reshape(3, 4)\nprint(reshaped)\n# [[ 0  1  2  3]\n#  [ 4  5  6  7]\n#  [ 8  9 10 11]]\n\n# Reshape to 3D\nreshaped_3d = arr.reshape(2, 2, 3)\n\n# Flatten array\nflattened = reshaped.flatten()  # Back to 1D\n\n# Transpose\ntransposed = reshaped.T\nprint(transposed)\n# [[ 0  4  8]\n#  [ 1  5  9]\n#  [ 2  6 10]\n#  [ 3  7 11]]\n\`\`\`\n\n## Broadcasting\n\nBroadcasting allows NumPy to perform operations on arrays with different shapes:\n\n\`\`\`python\n# Scalar and array\narr = np.array([[1, 2, 3], [4, 5, 6]])\nresult = arr + 10  # Adds 10 to each element\n\n# 1D array and 2D array\narr_2d = np.array([[1, 2, 3], [4, 5, 6]])\narr_1d = np.array([10, 20, 30])\nresult = arr_2d + arr_1d  # Adds [10, 20, 30] to each row\n\n# Broadcasting rules:\n# 1. Arrays are aligned from the rightmost dimension\n# 2. Dimensions of size 1 are stretched\n# 3. Missing dimensions are assumed to be 1\n\`\`\`\n\n## Practical Data Science Examples\n\n### Data Normalization\n\`\`\`python\n# Sample data: student scores\nscores = np.array([[85, 90, 78, 92],\n                   [88, 85, 80, 95],\n                   [92, 88, 85, 90]])\n\n# Z-score normalization\nmean_scores = np.mean(scores, axis=0)\nstd_scores = np.std(scores, axis=0)\nnormalized_scores = (scores - mean_scores) / std_scores\n\nprint("Original scores:")\nprint(scores)\nprint("\\nNormalized scores:")\nprint(normalized_scores)\n\`\`\`\n\n### Statistical Analysis\n\`\`\`python\n# Sales data analysis\nsales_data = np.random.normal(1000, 200, (12, 4))  # 12 months, 4 regions\n\n# Monthly totals\nmonthly_totals = np.sum(sales_data, axis=1)\n\n# Regional averages\nregional_averages = np.mean(sales_data, axis=0)\n\n# Find best performing month\nbest_month = np.argmax(monthly_totals)\n\n# Correlation between regions\ncorrelation_matrix = np.corrcoef(sales_data.T)\n\nprint(f"Best month: {best_month + 1}")\nprint(f"Regional averages: {regional_averages}")\n\`\`\`\n\n### Data Filtering and Cleaning\n\`\`\`python\n# Temperature data with some invalid readings\ntemperatures = np.array([20.5, 22.1, -999, 21.8, 23.2, -999, 19.9])\n\n# Remove invalid readings (assuming -999 is error code)\nvalid_mask = temperatures != -999\nclean_temperatures = temperatures[valid_mask]\n\n# Replace invalid readings with mean\nmean_temp = np.mean(clean_temperatures)\ntemperatures_filled = np.where(temperatures == -999, mean_temp, temperatures)\n\nprint(f"Original: {temperatures}")\nprint(f"Cleaned: {clean_temperatures}")\nprint(f"Filled: {temperatures_filled}")\n\`\`\`\n\n## Performance Tips\n\n1. **Use vectorized operations** instead of loops\n2. **Avoid creating unnecessary copies** of arrays\n3. **Use appropriate data types** to save memory\n4. **Leverage broadcasting** for efficient computations\n5. **Use views instead of copies** when possible\n\n\`\`\`python\n# Good: Vectorized operation\narr = np.arange(1000000)\nresult = arr * 2 + 1\n\n# Avoid: Python loop\n# result = np.array([x * 2 + 1 for x in arr])\n\`\`\`\n\nNumPy is the foundation that makes Python a powerful language for data science. Its efficient array operations and mathematical functions are used by virtually every data science library in Python. In the next lesson, we'll explore Pandas, which builds on NumPy to provide high-level data manipulation tools.`
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
            duration: '35 min',
            content: `# What is Blockchain?\n\nBlockchain is a revolutionary technology that enables secure, transparent, and decentralized record-keeping without the need for intermediaries. Understanding blockchain fundamentals is crucial for modern developers.\n\n## Core Concepts\n\n### Distributed Ledger Technology\nA blockchain is essentially a distributed database that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography.\n\n**Key Characteristics:**\n- **Decentralized**: No single point of control\n- **Immutable**: Records cannot be altered once confirmed\n- **Transparent**: All transactions are visible to network participants\n- **Secure**: Cryptographic hashing ensures data integrity\n\n### How Blockchain Works\n\n1. **Transaction Initiation**: A user initiates a transaction\n2. **Broadcasting**: The transaction is broadcast to the network\n3. **Validation**: Network nodes validate the transaction\n4. **Block Creation**: Valid transactions are grouped into a block\n5. **Consensus**: Network agrees on the new block\n6. **Block Addition**: The block is added to the chain\n7. **Distribution**: The updated blockchain is distributed across the network\n\n## Blockchain Structure\n\n### Block Components\n\`\`\`javascript\n// Simplified block structure\nconst block = {\n  index: 1,\n  timestamp: '2024-01-15T10:30:00Z',\n  previousHash: '000abc123...',\n  hash: '000def456...',\n  nonce: 12345,\n  transactions: [\n    {\n      from: 'Alice',\n      to: 'Bob',\n      amount: 10,\n      timestamp: '2024-01-15T10:29:45Z'\n    }\n  ]\n};\n\`\`\`\n\n### Cryptographic Hashing\nEach block contains a hash of the previous block, creating an immutable chain:\n\n\`\`\`javascript\n// Example using SHA-256\nconst crypto = require('crypto');\n\nfunction calculateHash(block) {\n  const data = block.index + block.timestamp + block.previousHash + JSON.stringify(block.transactions) + block.nonce;\n  return crypto.createHash('sha256').update(data).digest('hex');\n}\n\`\`\`\n\n## Types of Blockchain Networks\n\n### Public Blockchains\n- **Open to everyone**\n- **Fully decentralized**\n- **Examples**: Bitcoin, Ethereum\n- **Pros**: Maximum security, transparency\n- **Cons**: Slower, energy-intensive\n\n### Private Blockchains\n- **Restricted access**\n- **Controlled by organization**\n- **Examples**: Enterprise solutions\n- **Pros**: Faster, more control\n- **Cons**: Less decentralized\n\n### Consortium Blockchains\n- **Semi-decentralized**\n- **Controlled by group of organizations**\n- **Examples**: Banking consortiums\n- **Pros**: Balance of control and decentralization\n\n### Hybrid Blockchains\n- **Combination of public and private**\n- **Selective transparency**\n- **Examples**: Supply chain solutions\n\n## Consensus Mechanisms\n\n### Proof of Work (PoW)\n- **Used by**: Bitcoin\n- **Process**: Miners compete to solve computational puzzles\n- **Pros**: Highly secure, battle-tested\n- **Cons**: Energy-intensive, slow\n\n\`\`\`javascript\n// Simplified PoW mining\nfunction mineBlock(block, difficulty) {\n  const target = '0'.repeat(difficulty);\n  \n  while (block.hash.substring(0, difficulty) !== target) {\n    block.nonce++;\n    block.hash = calculateHash(block);\n  }\n  \n  console.log('Block mined:', block.hash);\n}\n\`\`\`\n\n### Proof of Stake (PoS)\n- **Used by**: Ethereum 2.0, Cardano\n- **Process**: Validators are chosen based on stake\n- **Pros**: Energy-efficient, faster\n- **Cons**: Potential centralization\n\n### Hashgraph Consensus\n- **Used by**: Hedera\n- **Process**: Gossip protocol + virtual voting\n- **Pros**: Fast, fair, secure\n- **Cons**: Patented technology\n\nBlockchain technology is transforming industries and creating new possibilities for decentralized applications. In the next lesson, we'll explore Hedera Hashgraph specifically.`
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
]

class CourseService {
  // Get all courses with filtering and search
  async getAllCourses(filters = {}) {
    try {
      // Use comprehensive courses if available, fallback to sample courses
      let courses = COMPREHENSIVE_COURSES.length > 0 ? [...COMPREHENSIVE_COURSES] : [...SAMPLE_COURSES]
      
      // Apply filters
      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category)
      }
      
      if (filters.level) {
        courses = courses.filter(course => course.level === filters.level)
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }
      
      // Sort by rating by default
      courses.sort((a, b) => b.rating - a.rating)
      
      return courses
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  }

  // Get single course by ID
  async getCourseById(courseId) {
    try {
      // Use comprehensive courses if available, fallback to sample courses
      const courses = COMPREHENSIVE_COURSES.length > 0 ? COMPREHENSIVE_COURSES : SAMPLE_COURSES
      const course = courses.find(c => c.id === courseId)
      if (!course) {
        throw new Error('Course not found')
      }
      return course
    } catch (error) {
      console.error('Error fetching course:', error)
      throw error
    }
  }

  // Enroll user in course
  async enrollInCourse(userId, courseId) {
    try {
      // Always use localStorage for demo mode
      const enrollments = JSON.parse(localStorage.getItem('course_enrollments') || '[]')
      const existing = enrollments.find(e => e.user_id === userId && e.course_id === courseId)
      
      if (existing) {
        return { success: false, message: 'Already enrolled in this course' }
      }
      
      const newEnrollment = {
        id: Date.now().toString(),
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        progress: 0,
        status: 'active'
      }
      
      enrollments.push(newEnrollment)
      localStorage.setItem('course_enrollments', JSON.stringify(enrollments))
      
      return { success: true, enrollment: newEnrollment }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  }

  // Get user's enrolled courses
  async getUserEnrollments(userId) {
    try {
      // Always use localStorage for demo mode
      const enrollments = JSON.parse(localStorage.getItem('course_enrollments') || '[]')
        .filter(e => e.user_id === userId)

      // Enrich with course data
      const courses = COMPREHENSIVE_COURSES.length > 0 ? COMPREHENSIVE_COURSES : SAMPLE_COURSES
      const enrichedEnrollments = enrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.course_id)
        return {
          ...enrollment,
          course: course || null
        }
      })

      return enrichedEnrollments
    } catch (error) {
      console.error('Error fetching user enrollments:', error)
      return []
    }
  }

  // Update lesson progress
  async updateLessonProgress(userId, courseId, moduleId, lessonId, completed = true) {
    try {
      const progress = JSON.parse(localStorage.getItem('lesson_progress') || '[]')
      const existingIndex = progress.findIndex(p => 
        p.user_id === userId && 
        p.course_id === courseId && 
        p.module_id === moduleId && 
        p.lesson_id === lessonId
      )

      const progressData = {
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        lesson_id: lessonId,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      }

      if (existingIndex >= 0) {
        progress[existingIndex] = progressData
      } else {
        progress.push(progressData)
      }

      localStorage.setItem('lesson_progress', JSON.stringify(progress))
      return progressData
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      throw error
    }
  }

  // Calculate and update course progress
  async updateCourseProgress(userId, courseId) {
    try {
      const course = await this.getCourseById(courseId)
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)

      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('completed', true)

      const progress = Math.round((completedLessons.length / totalLessons) * 100)

      // Update enrollment progress
      const { error } = await supabase
        .from('course_enrollments')
        .update({ 
          progress,
          status: progress === 100 ? 'completed' : 'active',
          completed_at: progress === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)

      if (error) throw error

      return progress
    } catch (error) {
      console.error('Error updating course progress:', error)
      throw error
    }
  }

  // Get user's lesson progress for a course
  async getUserProgress(userId, courseId) {
    try {
      const progress = JSON.parse(localStorage.getItem('lesson_progress') || '[]')
      return progress.filter(p => p.user_id === userId && p.course_id === courseId)
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return []
    }
  }

  // Submit quiz answers
  async submitQuiz(userId, courseId, moduleId, lessonId, answers, score) {
    try {
      const quizSubmissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]')
      
      const submission = {
        id: Date.now().toString(),
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        lesson_id: lessonId,
        answers,
        score,
        submitted_at: new Date().toISOString(),
        passed: score >= 70
      }

      quizSubmissions.push(submission)
      localStorage.setItem('quiz_submissions', JSON.stringify(quizSubmissions))

      // Mark lesson as completed if score >= 70%
      if (score >= 70) {
        await this.updateLessonProgress(userId, courseId, moduleId, lessonId, true)
        // Check for course completion and award badges
        await this.checkCourseCompletion(userId, courseId)
      }

      return submission
    } catch (error) {
      console.error('Error submitting quiz:', error)
      throw error
    }
  }

  // Get course categories
  getCourseCategories() {
    return ['Frontend', 'Backend', 'Data Science', 'Blockchain', 'Mobile', 'DevOps', 'AI/ML']
  }

  // Get course levels
  getCourseLevels() {
    return ['Beginner', 'Intermediate', 'Advanced']
  }

  // Check course completion and award badges
  async checkCourseCompletion(userId, courseId) {
    try {
      const course = await this.getCourseById(courseId)
      const progress = await this.getUserProgress(userId, courseId)
      
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
      const completedLessons = progress.filter(p => p.completed).length
      
      if (completedLessons === totalLessons) {
        // Course completed - award badge
        await this.awardCourseBadge(userId, courseId, course.title)
        
        // Update enrollment status
        const enrollments = JSON.parse(localStorage.getItem('course_enrollments') || '[]')
        const enrollmentIndex = enrollments.findIndex(e => e.user_id === userId && e.course_id === courseId)
        
        if (enrollmentIndex >= 0) {
          enrollments[enrollmentIndex].status = 'completed'
          enrollments[enrollmentIndex].completed_at = new Date().toISOString()
          enrollments[enrollmentIndex].progress = 100
          localStorage.setItem('course_enrollments', JSON.stringify(enrollments))
        }
      }
    } catch (error) {
      console.error('Error checking course completion:', error)
    }
  }

  // Award course completion badge
  async awardCourseBadge(userId, courseId, courseTitle) {
    try {
      const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
      
      const badge = {
        id: Date.now().toString(),
        user_id: userId,
        type: 'course_completion',
        title: `${courseTitle} Graduate`,
        description: `Successfully completed the ${courseTitle} course`,
        icon: '🎓',
        rarity: 'common',
        earned_at: new Date().toISOString(),
        metadata: {
          course_id: courseId,
          course_title: courseTitle
        }
      }
      
      badges.push(badge)
      localStorage.setItem('user_badges', JSON.stringify(badges))
      
      // Check for milestone badges
      await this.checkMilestoneBadges(userId)
      
      // Trigger badge notification
      window.dispatchEvent(new CustomEvent('badgeEarned', { 
        detail: { userId, courseId, type: 'course_completion' } 
      }))
      
      return badge
    } catch (error) {
      console.error('Error awarding course badge:', error)
    }
  }

  // Check and award milestone badges
  async checkMilestoneBadges(userId) {
    try {
      const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
      const userBadges = badges.filter(b => b.user_id === userId)
      const courseBadges = userBadges.filter(b => b.type === 'course_completion')
      
      const milestones = [
        { count: 1, title: 'First Graduate', description: 'Completed your first course', icon: '🌟', rarity: 'common' },
        { count: 3, title: 'Learning Enthusiast', description: 'Completed 3 courses', icon: '📚', rarity: 'uncommon' },
        { count: 5, title: 'Knowledge Seeker', description: 'Completed 5 courses', icon: '🔍', rarity: 'rare' },
        { count: 10, title: 'Master Learner', description: 'Completed 10 courses', icon: '👑', rarity: 'legendary' }
      ]
      
      for (const milestone of milestones) {
        if (courseBadges.length >= milestone.count) {
          const existingMilestone = userBadges.find(b => b.title === milestone.title)
          if (!existingMilestone) {
            const milestoneBadge = {
              id: Date.now().toString() + Math.random(),
              user_id: userId,
              type: 'milestone',
              title: milestone.title,
              description: milestone.description,
              icon: milestone.icon,
              rarity: milestone.rarity,
              earned_at: new Date().toISOString(),
              metadata: {
                courses_completed: courseBadges.length
              }
            }
            
            badges.push(milestoneBadge)
          }
        }
      }
      
      localStorage.setItem('user_badges', JSON.stringify(badges))
      
      // Trigger milestone badge notifications
      window.dispatchEvent(new CustomEvent('badgeEarned', { 
        detail: { userId, type: 'milestone' } 
      }))
    } catch (error) {
      console.error('Error checking milestone badges:', error)
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      const enrollments = JSON.parse(localStorage.getItem('course_enrollments') || '[]')
        .filter(e => e.user_id === userId)
      
      const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
        .filter(b => b.user_id === userId)
      
      const quizSubmissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]')
        .filter(q => q.user_id === userId)
      
      const completedCourses = enrollments.filter(e => e.status === 'completed')
      const activeCourses = enrollments.filter(e => e.status === 'active')
      
      const totalQuizzes = quizSubmissions.length
      const passedQuizzes = quizSubmissions.filter(q => q.passed).length
      const averageScore = totalQuizzes > 0 ? 
        Math.round(quizSubmissions.reduce((sum, q) => sum + q.score, 0) / totalQuizzes) : 0
      
      return {
        coursesEnrolled: enrollments.length,
        coursesCompleted: completedCourses.length,
        coursesActive: activeCourses.length,
        badgesEarned: badges.length,
        quizzesTaken: totalQuizzes,
        quizzesPassed: passedQuizzes,
        averageQuizScore: averageScore,
        completionRate: enrollments.length > 0 ? 
          Math.round((completedCourses.length / enrollments.length) * 100) : 0
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      return {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        coursesActive: 0,
        badgesEarned: 0,
        quizzesTaken: 0,
        quizzesPassed: 0,
        averageQuizScore: 0,
        completionRate: 0
      }
    }
  }

  // Get user badges
  async getUserBadges(userId) {
    try {
      const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
      return badges.filter(b => b.user_id === userId).sort((a, b) => new Date(b.earned_at) - new Date(a.earned_at))
    } catch (error) {
      console.error('Error getting user badges:', error)
      return []
    }
  }
}

export const courseService = new CourseService()