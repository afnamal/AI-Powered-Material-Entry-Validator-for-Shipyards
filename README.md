# AI-Powered Material Entry Validator for Shipyards

![AI-Powered Material Entry Validator](https://firebasestorage.googleapis.com/v0/b/chat-api-aa04a.appspot.com/o/Screenshots%2FScreenshot%20from%202024-07-22%2009-38-49.png?alt=media&token=169a086d-81b4-4f1a-8e60-1cd81bf82d97)

The AI-Powered Material Entry Validator ensures the correct entry and storage of material records at a shipyard. The project includes a backend API for AI-based validation and data storage, and a frontend interface for user interaction. The backend is built with Node.js and Express, while the frontend uses Vue.js and Bootstrap for a responsive and user-friendly experience. The project leverages OpenAI's capabilities to validate material entries, ensuring accuracy and compliance with required formats. The project is Dockerized for easy deployment and scaling.

## Features

- **AI-Powered Validation:** Ensures material records are correctly entered based on predefined criteria.
- **Suggestion System:** Provides suggestions for material records based on existing entries in `malzemeler.json`.
- **Real-Time Data Entry:** Validates data as it is entered and lists similar existing records for comparison.
- **Responsive Interface:** Built with Vue.js and Bootstrap.
- **Dockerized Deployment:** Easy setup and scaling with Docker.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/material-save.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd material-save
    ```

3. **Create a `.env` file in the `backend` directory and add your OpenAI API key:**

    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4. **Build and run the Docker containers:**

    ```bash
    sudo docker-compose up --build
    ```

## Usage

- **Frontend Interface:** Available at `http://localhost`.
- **Backend API:** Available at `http://localhost:3000`.

### Backend Endpoints

- **/suggest:** Suggests similar material records based on query parameters.
- **/submit:** Submits a new material record after checking for duplicates.
- **/ask-ai:** Uses OpenAI to validate material records.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
