# 🔍 Text Token Inspector

> A Figma plugin for inspecting text tokens — built with TypeScript and NPM.
>
> ---
>
> ## 📋 Table of Contents
>
> - [Getting Started](#getting-started)
> - - [Prerequisites](#prerequisites)
>   - - [Installation](#installation)
>     - - [Development Setup](#development-setup)
>       - - [About TypeScript](#about-typescript)
>         - - [Resources](#resources)
>          
>           - ---
>
> ## 🚀 Getting Started
>
> Follow the steps below to get your plugin running. You can also find official instructions at the [Figma Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/).
>
> ---
>
> ## 🛠️ Prerequisites
>
> This plugin template uses **TypeScript** and **NPM** — two standard tools for building JavaScript applications.
>
> ### Node.js & NPM
>
> First, download **Node.js**, which comes bundled with NPM. This will allow you to install TypeScript and other libraries.
>
> 👉 [Download Node.js](https://nodejs.org/en/download/)
>
> ### TypeScript
>
> Once Node.js is installed, install TypeScript globally using:
>
> ```bash
> npm install -g typescript
> ```
>
> ---
>
> ## 📦 Installation
>
> In the directory of your plugin, install the latest Figma API type definitions by running:
>
> ```bash
> npm install --save-dev @figma/plugin-typings
> ```
>
> ---
>
> ## 💻 Development Setup
>
> We recommend writing TypeScript code using **Visual Studio Code**:
>
> 1. **Download VS Code** — if you haven't already: [https://code.visualstudio.com/](https://code.visualstudio.com/)
> 2. 2. **Open the project** — open this directory in Visual Studio Code.
>    3. 3. **Compile TypeScript to JavaScript** — run the `Terminal > Run Build Task...` menu item, then select `npm: watch`.
>       4.    > You will need to do this again every time you reopen Visual Studio Code.
>             >
>             > ✅ That's it! VS Code will automatically regenerate the JavaScript file every time you save.
>             >
>             > ---
>             >
>             > ## 📖 About TypeScript
>             >
>             > If you're familiar with JavaScript, TypeScript will feel very natural — valid JavaScript is already valid TypeScript!
>             >
>             > TypeScript adds **type annotations** to variables, which allows editors like VS Code to:
>             >
>             > - Provide real-time information about the Figma API as you write code
>             > - - Help catch bugs you might not have noticed otherwise
>             >  
>             >   - Using TypeScript requires a compiler to convert `code.ts` into `code.js` for the browser to run.
>             >  
>             >   - ---
>             >
>             > ## 🔗 Resources
>             >
>             > | Resource | Link |
>             > |---|---|
>             > | Figma Plugin Docs | [figma.com/plugin-docs](https://www.figma.com/plugin-docs/plugin-quickstart-guide/) |
>             > | TypeScript Docs | [typescriptlang.org](https://www.typescriptlang.org/) |
>             > | Node.js Download | [nodejs.org](https://nodejs.org/en/download/) |
>             > | Visual Studio Code | [code.visualstudio.com](https://code.visualstudio.com/) |
>             >
>             > ---
>             >
>             > ## 📄 License
>             >
>             > This project is licensed under the [MIT License](LICENSE).
