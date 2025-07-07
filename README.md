<div align="center">
    <h1>Jobiverse</h1>
    <p>Jobiverse is a platform designed to connect students and employers, enabling efficient project management and collaboration.</p>
    <h1></h1>
</div>

<div align="center">
    <table>
        <tr>
            <td><img src="https://github.com/nhattVim/assets/blob/master/Jobiverse/1.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/Jobiverse/2.png?raw=true"/></td>
        </tr>
    </table>
    <table>
        <tr>
            <td><img src="https://github.com/nhattVim/assets/blob/master/Jobiverse/3.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/Jobiverse/5.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/Jobiverse/4.png?raw=true"/></td>
        </tr>
    </table>
</div>

## Features

-   **Student Management**: Students can apply for projects, respond to invitations, and manage their applications.
-   **Employer Management**: Employers can create projects, invite students, and manage applications.
-   **Favorites**: Users can save projects to their favorites for quick access.
-   **Recommendations**: Projects and students are recommended based on matching criteria.

## Project Structure

```
Jobiverse/
├── backend/                # Node.js backend for API and business logic
│   ├── .env                # Environment variables for backend
│   ├── src/                # Source code for backend
│   ├── public/             # Public assets for backend
│   └── package.json        # Backend dependencies
├── backend.NET/            # .NET backend for for API and business logic
│   ├── appsettings.json    # Configuration for .NET backend
│   ├── Controllers/        # API controllers
│   ├── Models/             # Database models
│   └── Jobiverse.sln       # .NET solution file
├── frontend/               # React frontend for user interface
│   ├── .env                # Environment variables for frontend
│   ├── src/                # Source code for frontend
│   ├── public/             # Public assets for frontend
│   └── package.json        # Frontend dependencies
├── env.ps1                 # Script to fetch environment files (Windows)
├── env.sh                  # Script to fetch environment files (Unix)
└── README.md               # Project documentation
```

## Prerequistes

-   Repo Members: run env.ps1 (Windows) or env.sh (Unix) and use the GitHub token shared by the repo owner to fetch environment files.

-   Non-members: manually copy from example files to create .env (for backend, frontend) and appsettings.json (for backend.NET).
    ```
    backend/.env.example → backend/.env
    frontend/.env.example → frontend/.env
    backend.NET/appsettings.example.json → backend.NET/appsettings.json
    ```

## Installation & Running

> [!Important]
> You only need to set up one backend.
> Either `backend/` (Node.js) or `backend.NET/` (.NET Core) depending on your preference or stack

#### Option 1: Backend (Node.js)

```bash
cd backend
yarn
yarn dev
```

#### Option 2: Backend (.NET Core)

```sh
cd backend.NET
dotnet restore Jobiverse.sln
dotnet watch run
```

> If you use the Generate PDF feature for CV, please install Playwright by running the following commands once:
>
> ```
> dotnet tool install --global Microsoft.Playwright.CLI
> playwright install
> ```

#### Frontend (React)

```bash
cd frontend
yarn
yarn dev
```

## Contributions

![Alt](https://repobeats.axiom.co/api/embed/244d8939aacc6407fa988f1969785679994711d9.svg "Repobeats analytics image")
