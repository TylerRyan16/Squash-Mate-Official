# SquashMate
## Table of Contents
1. Folders
2. How to run project
3. How to edit a page
4. How to make a pull request
5. React cheatsheet

# 1. FOLDERS:
## Frontend 
This is the React part of the project. This folder holds everything you need for building the visuals and functionality of the app.
#### Components
This is where all pages are stored with their respective JavaScript and .scss files.

## Backend
This is the Node.js, server, and database management area of the project.
  
# 2.  HOW TO RUN PROJECT
1. Open the project in VS Code.
2. Create **2** new terminals
3. In **Terminal 1:**
   ```
   cd backend
   npm install <- only if first time running project
   ```
4. In **Terminal 2:**
   ```
   cd frontend
   npm install <- only if first time running project
   ```
5. In **Terminal 2:**
   ```
   npm start
   ```

# 3. HOW TO EDIT ANY PAGE
1. Make CERTAIN you are in **your own branch**
2. Go to ./frontend/Components
   * The components page is where all of our pages render. The components page holds folders for each page (Home, Video, Profile, etc)
3. Edit the **RETURN STATEMENT** of any javascript file.
   * React uses JS to return HTML Code
     
### Return statement example: 
```
return (
    <div className="container">
        <h1>Home Page.</h1>
    </div>
);
```

### What if I want to run functions?
Place the function signature outside of your return statement and call it in your return statement through **{function}** <- (ES6 Syntax, google it if you need to learn more :3)
```
return (
  <div className="container>
    <h1> {DisplayPlayerName} </h1>
  </div>


const DisplayPlayerName = () => {
  return player.name;
};
```
  
# 4. HOW TO MAKE A PULL REQUEST
1. Make any change in your own branch
2. Commit and push the change to github
3. Hit "Preview Pull Request" and create it if given the option
   * this will redirect to your browser
4. Add any info that would be useful (usually just what you changed & why) and create it
5. Wait for confirmation to merge, **ESPECIALLY** if there are merge conflicts

# 5. REACT CHEATSHEET
## Components
#### What is a component?
* Components are **reusable building blocks** of react applications
* A component is a **function** or a **class** that returns JSX (JavaScript XML)

#### Component Example
```
import React from 'react';

const MyComponent = () => {
  return (
    <div>
      <h1> Hello Bro </h1>
    </div>
  );
};

export default MyComponent;
```

## JSX (JavaScript XML)
#### What is JSX?
* JSX is a syntax extension for JS that allows us to write **HTML-like code** within JavaScript
```
const element = <h1>Hello bro</h1>;
```
compiles to:
```
const element = React.createElement('h1', null, 'Hello bro'); <- _JavaScript_
 ```

## Key Functions And Hooks
### `useState`
* Manages **states** in a functional component
  
**What is state?** 
* State holds data that changes over time
```
import React, {useState} from 'react';

const Counter = () => {
  const [count, setCount] = useState(0); _<- [stateVariable, setter] = useState(defaultValue);_

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```
### `useEffect`
* Handles **side effects** (API calls, subscriptions, etc)
  
**When does it run?**
* Runs after the component renders or when the dependencies change
  
**Dependency Array**
* Determines when `useEffect` runs

```
import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);

        return () => clearInterval(interval); 
    }, []); // Empty array means it runs only once on mount

    return <p>Time: {seconds}s</p>;
};

```

### `useLocation` (React Router)
**Why?**
* To get the current route or URL path
```
import { useLocation } from 'react-router-dom';

const CurrentPage = () => {
    const location = useLocation();
    return <p>You are on: {location.pathname}</p>;
};
```

## Key Concepts
### Use <Link> over <a>
* React's link enables client side navigation, which is faster because it prevents a full page reload
* Can do everything <a> can do, so why not?

### When to Call Functions in React
**Passing a function to `onClick`**
* **Do not call the function immediately - pass a reference**
* Use an arrow function if the function has arguments!
  
**Correct:**
```
<button onClick={myFunction}>Click me</button>
<button onClick={() => myFunction(42)}>Click me</button>
```
**Incorrect:**
```
<button onClick={myFunction()}>Click me</button>; 
```
This calls the function **immediately**, which we don't want

### How to Render a List of items?
**Use a Map**
```
const ItemList = ({ items }) => {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
};
```
**users.map** iterates through items and outputs a value and index.

**index** is what we pass into the items `key` tag. This ensures each item is rendered only once

**user** is the actual item we grab from the list (can be named anything)

  
