# documentation-drafter

An application that uses configurable presets to help you build powerful, structured prompts for generating high-quality project documentation drafts with LLMs.

# How to Run the Documentation Drafter Project

To run this application, you must use a local web server because web browsers block `fetch` requests on local `file:///` paths for security reasons. Choose one of the methods below.

---

## Method 1: Using Python

**Best for:** A quick, universal method if you have Python installed.

1.  Open a terminal or command prompt.
2.  Navigate to the project folder containing `index.html`.
3.  Run the following command:
    ```bash
    # For Python 3
    python -m http.server
    ```
4.  Open your browser and navigate to `http://localhost:8000`.

---

## Method 2: Using the VS Code "Live Server" Extension

**Best for:** Users who are developing in Visual Studio Code.

1.  Install the **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** extension from the VS Code Marketplace.
2.  Open your project folder in VS Code.
3.  Open the `index.html` file.
4.  Click the **"Go Live"** button in the bottom-right status bar. A browser window will open automatically.

---

## Method 3: Using Node.js and `npx`

**Best for:** Users who have Node.js and npm installed.

1.  Open a terminal or command prompt.
2.  Navigate to the project folder.
3.  Run the following command, which uses `npx` to execute the `serve` package without a permanent installation:
    ```bash
    npx serve
    ```
4.  The terminal will display the local address. Open it in your browser (usually `http://localhost:3000`).
