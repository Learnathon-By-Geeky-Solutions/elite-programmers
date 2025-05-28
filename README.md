<div align="center">
  <img src="assets/banner.png" alt="TrueTest Banner">
  <h2>Your Secure Platform for Technical Assessments!</h2>
<b>TrueTest</b> is an all-in-one online proctoring system designed to simplify and secure the process of conducting technical assessments. It provides a reliable environment for creating, managing, and taking exams, with support for diverse question types and intelligent AI-powered tools to ensure integrity and fairness. Whether for education, recruitment, or certification, TrueTest delivers a seamless experience that prioritizes security, efficiency, and user accessibility.
</div>

## ⚡ **Project Resources**

📚 **Documentation**: [truetest.gitbook.io](https://truetest.gitbook.io) or [docs.truetest.tech](https://docs.truetest.tech) <br>
🚀 **Live Demo:** [truetest.tech](https://truetest.tech) <br>
🧪 **Dev Environment:** [dev.truetest.tech](https://dev.truetest.tech) <br>
📡 **API Docs:** [api.truetest.tech/swagger](https://api.truetest.tech/swagger) or [Scalar](https://api.truetest.tech/scalar) <br>
🎨 **Figma UI/UX Design:** [figma.rawfin.net/TrueTest](https://figma.rawfin.net/TrueTest) <br>
🗂️ **Project Management:** [ClickUp Board](https://sharing.clickup.com/9018748645/b/h/6-901804967032-2/87cfea55e909e2c) and [WBS Document](https://docs.google.com/spreadsheets/d/1W8B64OiUsHmxep4WSxsuw9yIJhcLsX7WFnyozvuyhJo/edit?usp=sharing) <br>
💯 **Code Quality:** [SonarCloud Analysis](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers&branch=main) <br>
💻 **GitHub Repository:** [Learnathon-By-Geeky-Solutions/elite-programmers](https://github.com/Learnathon-By-Geeky-Solutions/elite-programmers) <br>
🔥 **Latest Version:** [github.com/Raofin/TrueTest](https://github.com/Raofin/TrueTest) <br>

## 🔑 **Admin Account Credentials**

**Username**: `admin` <br>
**Password**: `P@ss9999`

## 🩺 Project Status

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
[![Analyzed Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Learnathon-By-Geeky-Solutions_elite-programmers&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Learnathon-By-Geeky-Solutions_elite-programmers)
![Total Lines of Code](https://tokei.rs/b1/github/Learnathon-By-Geeky-Solutions/elite-programmers?category=code)
![Total Files](https://tokei.rs/b1/github/Learnathon-By-Geeky-Solutions/elite-programmers?category=files)


## 🛠️ How to Run

### 🔐 API Keys

To generate the required API keys, please follow the instructions from gitbook. We've provided a detailed guide on how to obtain the necessary API keys for the project. You can find the instructions [here](https://truetest.gitbook.io/docs/how-to-run#api-keys).

### 💻 Run Locally

1. Clone the repository

    ```bash
    git clone https://github.com/Raofin/TrueTest.git
    cd TrueTest
    ```

2. Configure

    #### Backend

    Use the following commands to store the credentials in user secrets 👇

    ```bash
    cd src/api/ops.api
    dotnet user-secrets set "EmailSettings:Email" ""
    dotnet user-secrets set "EmailSettings:Password" ""
    dotnet user-secrets set "OneCompilerSettings:ApiKey" ""
    dotnet user-secrets set "GoogleCloudSettings:FolderId" ""
    dotnet user-secrets set "GeminiSettings:ApiKey" ""
    ```

    ✅ The project is configured to automatically apply migrations with some seed data on its first run using the default connection string.

    #### Frontend

    ```bash
    cd ../../client
    cp .env.example .env.local
    ```

3. 🏗️ Build & Run

    #### Backend

    ```bash
    dotnet restore
    dotnet run
    ```

    #### Frontend

    ```bash
    cd src/client
    npm run build
    npm start
    ```

### 🐳 Run with Docker

Open the `docker-compose.yml` and fill in the required values under the `environment` section.

1. Build & start containers

    ```bash
    docker-compose up --build
    ```

2. Access the application

   - Frontend: https://localhost:9999
   - Backend: https://localhost:9998
   - Database: http://localhost:6666

## 🏆 Team Elite Programmers

### 👨‍🏫 Mentor: Mahbubur Rahman [@mahbub23](https://github.com/mahbub23)

| Team Member          | GitHub Username                            | Role(s)                                |
| -------------------- | ------------------------------------------ | -------------------------------------- |
| Zaid Amin Rawfin     | [@raofin](https://github.com/raofin)       | Backend, UI/UX, PM, DevOps, **Leader** |
| Kohinoor Akther Akhi | [@akhi005](https://github.com/Akhi005)     | Frontend Development                   |
| Md Nahid Chowdhury   | [@mdnahid20](https://github.com/mdnahid20) | Backend Development                    |

## 🪪 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
