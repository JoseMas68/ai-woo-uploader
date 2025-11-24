# Architecture Overview

This document describes the high-level architecture of the AI WooCommerce Uploader application.

## 🏗️ System Design

The application follows a modern web application architecture using **Next.js** as the full-stack framework. It separates concerns between the Frontend (UI) and Backend (API/Logic).

### 1. Frontend Layer (`src/app`, `src/components`)

-   **Framework**: React (Next.js App Router)
-   **Styling**: Tailwind CSS
-   **State Management**: React `useState` (Local state)
-   **Responsibilities**:
    -   Render the Chat Interface (`ChatInterface.tsx`).
    -   Manage the conversation flow and user inputs.
    -   Display the generated product results (`ProductResult.tsx`).
    -   Communicate with the Backend API.

### 2. Backend Layer (`src/app/api`, `src/lib`)

-   **Framework**: Next.js API Routes
-   **Responsibilities**:
    -   **`/api/generate`**: Handles the prompt engineering and communication with OpenAI to generate structured product data.
    -   **`/api/upload`**: Handles the communication with the WooCommerce REST API to create products.
    -   **`src/lib/woocommerce.ts`**: Encapsulates the WooCommerce API client and logic.
    -   **`src/lib/llm.ts`**: Encapsulates the OpenAI API client.
    -   **`src/lib/csv.ts`**: Handles CSV generation logic.

### 3. Data Flow

1.  **User Input**: The user interacts with the chat interface.
2.  **Prompt Generation**: The frontend collects inputs and sends a prompt to `/api/generate`.
3.  **AI Processing**: The backend sends the prompt to OpenAI and receives a JSON response.
4.  **Review**: The user reviews the generated product data.
5.  **Upload**: The user clicks "Upload", sending the data to `/api/upload`.
6.  **WooCommerce Creation**: The backend sends a POST request to the WooCommerce API to create the product.

## 📂 Directory Structure Rationale

-   **`src/app`**: Contains the page routes and API endpoints. Keeps the routing logic separate from UI components.
-   **`src/components`**: Contains reusable UI components (`Header`, `ChatInterface`, `ProductResult`) to keep the page logic clean and maintainable.
-   **`src/lib`**: Contains pure business logic and API clients. This allows the logic to be reused (e.g., in scripts) and tested independently of the UI.
-   **`scripts/`**: Contains standalone scripts for testing and maintenance, keeping the source code focused on the application itself.
