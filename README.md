# FileTree Explorer

FileTree Explorer is a small React application for visualizing a directory tree from JSON input.
The user can paste JSON or upload a `.json` file, browse the tree structure, open file or folder details and search nodes by name.

## Tech stack

- React
- TypeScript
- React Router
- Vite
- Tailwind CSS
- Vitest
- Docker

## Run locally

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:5173
```

## Run with Docker

Build image:

```bash
docker build -t filetree-explorer .
```

Run container:

```bash
docker run -p 5173:5173 filetree-explorer
```

Then open:

```bash
http://localhost:5173
```

## Features

- Paste JSON input
- Upload `.json` file
- Recursive tree view
- Expand and collapse folders
- File details view
- Folder details view
- Search by file or folder name
- Search query persisted in URL
- Tree data persisted in localStorage

## Routing

- `/` – home page with JSON input
- `/tree` – file tree view
- `/tree/:nodePath` – node details view

## Architecture decisions

The implementation was intentionally kept simple and focused on readability.

### 1. React Context for shared tree data

React Context is used to store the loaded tree and make it available across pages without passing props through multiple levels.

### 2. Recursive tree rendering

The file tree is rendered recursively with a `TreeNode` component.
This is a natural and simple approach for nested folder/file structures.

### 3. Search stored in URL

Search state is stored in query params (`?q=`), which makes search results resistant to page refresh and easy to share.

### 4. Tree persistence with localStorage

The loaded tree is persisted in `localStorage`, so refreshing the page does not clear the loaded data.

### 5. Keep the solution minimal

The goal of this project was to keep the code as small, readable, and practical as possible.  
I intentionally avoided unnecessary abstractions and overengineering.

### 6. No Atomic Design for a small project

I intentionally did not use Atomic Design in the final structure.  
The application is small, most UI parts are used only once and adding more layers would make the project harder to explain without giving a real benefit.

## What I would improve with more time

- Persist expanded/collapsed folder state
- Improve tree keyboard accessibility
- Add stronger schema validation for uploaded JSON
- Add better empty states and error states
- Add more complete unit and integration tests
- Improve visual polish and responsive spacing
- Add support for larger trees with performance optimizations
- i18n

## Known limitations

- Expanded/collapsed folder state is not persisted after refresh
- Search matches only node names, not file size or other metadata
- Path resolution assumes unique child names inside the same folder
- JSON validation is basic and checks only the expected shape
- Very large trees may need optimization

## CI/CD

The project includes GitHub Actions workflows for continuous integration and Docker image verification.

### CI

On every push and pull request, the pipeline:

- installs dependencies
- runs tests
- builds the application

### Docker

A separate workflow verifies that the Docker image can be built successfully.
