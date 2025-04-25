# Jobiverse

Jobiverse is a management system for students, employers, and projects. This project includes both backend (Node.js, Express) and frontend (React, Vite).

---

## Requirements

-   Install [Node.js](https://nodejs.org/en)
-   Install Yarn: `npm install -g yarn`

---

## Usage

### Clone project

```bash
git clone https://github.com/nhattVim/Jobiverse.git
```

### Run backend

```bash
cd Jobiverse/backend
yarn install
yarn dev
```

### Run frontend

```bash
cd Jobiverse/frontend
yarn install
yarn dev
```

---

## API Documentation

### Authentication & Authorization

1. **POST** `/account/register`

    - **Description**: Register a new account
    - **Token Required**: No
    - **Request Example**:
        ```json
        {
            "accountType": "student",
            "email": "newuser@example.com",
            "password": "password123"
        }
        ```

2. **POST** `/account/login`

    - **Description**: Log in and receive a JWT token
    - **Token Required**: No
    - **Request Example**:
        ```json
        {
            "email": "user@example.com",
            "password": "password123"
        }
        ```

3. **DELETE** `/account/delete/:id`

    - **Description**: Delete an account by ID
    - **Token Required**: Yes (Admin)
    - **Request Example**:
        ```bash
        curl -X DELETE -H "Authorization: Bearer {token}" http://localhost:3000/account/delete/12345
        ```

4. **POST** `/account/restore/:id`
    - **Description**: Restore a deleted account
    - **Token Required**: Yes (Admin)
    - **Request Example**:
        ```bash
        curl -X POST -H "Authorization: Bearer {token}" http://localhost:3000/account/restore/12345
        ```

---

### Student API (Requires Token and Role: Student)

5. **GET** `/students`

    - **Description**: Retrieve a list of all students
    - **Token Required**: Yes (Student, Admin)
    - **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/students
        ```

6. **POST** `/students`

    - **Description**: Create a new student profile
    - **Token Required**: Yes (Student, Admin)
    - **Request Example**:
        ```json
        {
            "mssv": "SV001",
            "name": "Nguyen Van A",
            "major": "Computer Science",
            "university": "HCMUT",
            "interests": "Web Development, AI",
            "avatarURL": "https://example.com/avatar1.png"
        }
        ```

7. **PUT** `/students`

    - **Description**: Update a student profile
    - **Token Required**: Yes (Student, Admin)
    - **Request Example**:
        ```json
        {
            "name": "Updated Name",
            "major": "Updated Major"
        }
        ```

8. **GET** `/students/search`
    - **Description**: Search for students by MSSV or name
    - **Token Required**: Yes (Student, Admin)
    - **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/students/search?name=John
        ```

---

### Employer API (Requires Token and Role: Employer)

9. **GET** `/employers`

    - **Description**: Retrieve a list of all employers
    - **Token Required**: Yes (Employer, Admin)
    - **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/employers
        ```

10. **POST** `/employers`

    - **Description**: Create a new employer profile
    - **Token Required**: Yes (Employer, Admin)
    - **Request Example**:
        ```json
        {
            "companyName": "Tech Corp",
            "representativeName": "Tran Thi B",
            "position": "HR Manager",
            "industry": "Technology",
            "companyInfo": "We build software solutions."
        }
        ```

11. **PUT** `/employers`

    - **Description**: Update an employer profile
    - **Token Required**: Yes (Employer, Admin)
    - **Request Example**:
        ```json
        {
            "companyName": "Updated Company",
            "industry": "Updated Industry"
        }
        ```

12. **GET** `/employers/search`
    - **Description**: Search for employers by company name, representative name
    - **Token Required**: Yes (Employer, Admin)
    - **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/employers/search?companyName=Tech
        ```

---

### CV API (Requires Token and Role: Student)

13. **GET** `/cv`

    -   **Description**: Retrieve the student's CV
    -   **Token Required**: Yes (Student, Admin)
    -   **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/cv
        ```

14. **PUT** `/cv`

    -   **Description**: Create or update a student's CV
    -   **Token Required**: Yes (Student, Admin)
    -   **Request Example**:
        ```json
        {
            "content": "Updated CV content"
        }
        ```

15. **DELETE** `/cv`
    -   **Description**: Delete a student's CV
    -   **Token Required**: Yes (Student, Admin)
    -   **Request Example**:
        ```bash
        curl -X DELETE -H "Authorization: Bearer {token}" http://localhost:3000/cv
        ```

---

### Admin API (Requires Token and Role: Admin)

16. **GET** `/admin/users`

    -   **Description**: Retrieve a list of all users in the system
    -   **Token Required**: Yes
    -   **Role Required**: Admin
    -   **Request Example**:
        ```bash
        curl -H "Authorization: Bearer {token}" http://localhost:3000/admin/users
        ```

17. **DELETE** `/admin/users/{id}`
    -   **Description**: Delete a user by ID
    -   **Token Required**: Yes
    -   **Role Required**: Admin
    -   **Request Example**:
        ```bash
        curl -X DELETE -H "Authorization: Bearer {token}" http://localhost:3000/admin/users/12345
        ```

---

### Common Errors

-   **401 Unauthorized**: Invalid or missing token
-   **403 Forbidden**: Valid token but insufficient permissions
-   **404 Not Found**: Resource not found
-   **500 Internal Server Error**: Server error

---

## Project Structure

```
Jobiverse/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── ...
└── README.md
```

---

## Contact

If you have any questions, please contact us at: `nhattruong13112000@gmail.com`.
