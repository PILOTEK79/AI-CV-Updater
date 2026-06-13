async function uploadCV() {

    const fileInput = document.getElementById("cvFile");
    const result = document.getElementById("result");

    if (!fileInput.files.length) {
        alert("Please select a resume file");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    result.innerHTML = `
        <div class="loading-box">
            <div class="spinner"></div>
            <h2>Analyzing Resume...</h2>
            <p>AI is checking your resume</p>
        </div>
    `;

    try {

        const response = await fetch(
                "https://ai-cv-updater.onrender.com/upload",
                 {
                    method: "POST",
                    body: formData
                 })

        const data = await response.json();

        let scoreColor = "#22c55e";

        if (data.score < 80) {
            scoreColor = "#f59e0b";
        }

        if (data.score < 60) {
            scoreColor = "#ff4d4d";
        }

        result.innerHTML = `
        <div class="analysis-card">

            <div class="score-circle"
                style="
                border-color:${scoreColor};
                color:${scoreColor};
                ">
                0
            </div>

            <div class="score-text">
                Resume Score / 100
            </div>

            <h2 class="section-title">
                Strengths
            </h2>

            <div class="strengths-list">
                ${data.strengths.map(item =>
                    `<div class="strength-item">✅ ${item}</div>`
                ).join("")}
            </div>

            <h2 class="section-title">
                Suggestions
            </h2>

            <div class="suggestions-list">
                ${data.suggestions.map(item =>
                    `<div class="suggestion-item">✓ ${item}</div>`
                ).join("")}
            </div>

            <h2 class="section-title">
                Resume Content
            </h2>

            <div class="resume-content">
                ${data.message.replace(/\n/g, "<br>")}
            </div>

        </div>
        `;

        animateScore(data.score);

    } catch (error) {

        result.innerHTML = `
        <div class="error-box">
            Error: ${error}
        </div>
        `;

        console.error(error);
    }
}

function animateScore(targetScore) {

    const scoreElement =
        document.querySelector(".score-circle");

    let current = 0;

    const interval = setInterval(() => {

        current++;

        scoreElement.textContent = current;

        if (current >= targetScore) {
            clearInterval(interval);
        }

    }, 20);
}