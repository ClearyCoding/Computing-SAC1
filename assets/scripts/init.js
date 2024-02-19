const questionList = [
    {
        question: 'What year level are you in school?',
        answers: ['9 or lower', '10', '11', '12', 'Finished School' , 'Prefer Not To Say'],
    },
    {
        question: 'Were the government\'s restrictions appropriate?',
        answers: ['Very Inappropriate', 'Somewhat Inappropriate', 'Neutral', 'Somewhat Appropriate', 'Very Appropriate', 'Prefer Not To Say'],
    },
    {
        question: 'The restrictions applied were not strict enough.',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'How often do you wear a mask when not required?',
        answers: ['Never', 'Occasionally', 'Sometimes', 'Usually','Always', 'Prefer Not To Say'],
    },
    {
        question: 'How many times have you been diagnosed with COVID-19?',
        answers: ['Never', 'Once', 'Twice', 'Thrice', 'Four Times or More', 'Unsure', 'Prefer Not To Say'],
    },
    {
        question: 'If you\'ve had COVID-19, how severe were your symptoms?',
        answers: ['Not Applicable', 'Asymptomatic', 'Mild', 'Moderate', 'Severe', 'Life-Threatening', 'Prefer Not To Say'],
    },
    {
        question: 'Lockdowns negatively impacted my performance in school/work.',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'COVID-19 negatively affected my mental health?',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'How many shots of the COVID-19 vaccination have you had?',
        answers: ['None', 'One', 'Two', 'Three', 'Four Or More', 'Prefer Not To Say'],
    }
]
const answerData = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
]

function displayNextQuestion(question = null) {
        // Checks if there is another question to display, if not, end the survey
    if (question === null) {
        currentQuestion = isComplete(0, "i");
        if (currentQuestion === true) {
            displayConclusion();
            return;
        }
    } else {
        currentQuestion = question;
    }

    clearInterval(countTick);
    countTick = setInterval(() => {
        countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
    }, 30);

    let questionAnswers = ``;
    let questionAnswersOdd = ``;
    for (let i = 0; i < questionList[currentQuestion].answers.length; i++) {
        if (questionList[currentQuestion].answers.length % 2 !== 0 && i === questionList[currentQuestion].answers.length - 1){
            questionAnswersOdd = `
            <button id="answer${i}">${questionList[currentQuestion].answers[i]}</button>
        `
        } else {
            questionAnswers += `
            <button id="answer${i}">${questionList[currentQuestion].answers[i]}</button>
        `
        }
    }
    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <div class="question-answers">
        ${questionAnswers}
    </div>
    ${questionAnswersOdd}
    `

    // Sets up answer buttons to store and display results
    for (let i = 0; i < questionList[currentQuestion].answers.length; i++) {
        document.querySelector(`#answer${i}`).addEventListener('click', function() {
            fetchData(`UPDATE ${userUUID.replace(/-/g, "_")} SET q${currentQuestion} = '${i}';`)
            if (getCookie(`q${currentQuestion}`) !== undefined) {
                answerData[currentQuestion][getCookie(`q${currentQuestion}`)] -= 1;
            }
            answerData[currentQuestion][i] += 1;
            document.cookie = `q${currentQuestion}=${i}`;

            if (question === null) {
                displayResults();
            } else {
                displayAnswers(currentQuestion);
            }
        });
    }
}
function displayResults(question=null) {
    if (question !== null) {
        currentQuestion = question;
    }

    clearInterval(countTick);
    countTick = setInterval(() => {
        countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
    }, 30);

    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">${question !== null ? 'Back' : isComplete() ? 'Finish Survey' : 'Next Question'}</button>
    `

    // Create the pie chart using chart.js
    new Chart("pie", {
        type: "doughnut",
        data: {
            labels: questionList[currentQuestion].answers.slice(0, -1),
            datasets: [{
                backgroundColor: [
                    "#3e41ff",
                    "#33a9f1",
                    "#035bbb",
                    "#6fc1f1",
                    "#5970ff",
                    "#6caee5",
                    "#7676ff",
                ],
                data: answerData[currentQuestion].slice(0, -1),
                borderColor: 'white',
                borderWidth: 2,
            }]
        },
        options: {
            title: {
                display: false,
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: window.innerWidth < 400 ? 14 : 18,
                    font: 'Roboto',
                }
            }
        }
    });

    // Create button to continue to next question
    document.querySelector(`#next`).addEventListener('click', function() {
        if (question !== null) {
            displayAnswers(question);
        } else {
            currentQuestion += 1;
            displayNextQuestion()
        }
    });
}
function displayConclusion() {
    mainElement.innerHTML = `
    <h2>Conclusion</h2>
    <p>Conclusion coming soon!</p>
    `
    clearInterval(countTick);
    countElement.innerHTML = `Your Answers`;
}
function displayAnswers(question=null) {
    clearInterval(countTick);
    countElement.innerHTML = `Your Answers`;

    let prevButtonsHTML = ``;
    for (let i = 0; i < questionList.length; i++) {
        prevButtonsHTML += `
            <button id="prevButton${i}" class="previous-question-button">Q${i + 1}</button>
        `
    }

    mainElement.innerHTML = `
    <h2>Edit Answers:</h2>
    <div>
        <div id="prevAnswersContainer">
        </div>
        <div class="previous-questions">
            <div class="previous-questions-grid">
                ${prevButtonsHTML}
            </div>
        </div>
    </div>
    <button id="back">Back</button>
    `

    if (question !== null) {
        document.querySelector('#prevAnswersContainer').outerHTML = `
            <div class="previous-answers-container" id="prevAnswersContainer">
                <div id="prevAnswerEdit${question}" class="previous-answer-edit"></div>
                <div class="previous-answer-title" id="prevAnswer${question}">
                    <h3>Q${question + 1}: ${questionList[question].question}</h3>
                    <h4>${getCookie(`q${question}`) ? ` ${questionList[question].answers[getCookie(`q${question}`)]}` : 'Not Answered'}</h4>
                </div>
                <div id="prevAnswerResults${question}" class="previous-answer-results"></div>
            </div>
            `

        document.querySelector(`#prevAnswerEdit${question}`).addEventListener('click', function () {
            displayNextQuestion(question)
        });
        document.querySelector(`#prevAnswerResults${question}`).addEventListener('click', function () {
            displayResults(question)
        });
    }

    for (let i = 0; i < questionList.length; i++) {
        document.querySelector(`#prevButton${i}`).addEventListener('click', function() {
            document.querySelector('#prevAnswersContainer').outerHTML = `
            <div class="previous-answers-container" id="prevAnswersContainer">
                <div id="prevAnswerEdit${i}" class="previous-answer-edit"></div>
                <div class="previous-answer-title" id="prevAnswer${i}">
                    <h3>Q${i + 1}: ${questionList[i].question}</h3>
                    <h4>${getCookie(`q${i}`) ? ` ${questionList[i].answers[getCookie(`q${i}`)]}` : 'Not Answered'}</h4>
                </div>
                <div id="prevAnswerResults${i}" class="previous-answer-results"></div>
            </div>
            `

            document.querySelector(`#prevAnswerEdit${i}`).addEventListener('click', function () {
                displayNextQuestion(i)
            });
            document.querySelector(`#prevAnswerResults${i}`).addEventListener('click', function () {
                displayResults(i)
            });
        });
    }

    // Create button to leave
    document.querySelector('#back').addEventListener('click', function() {
        if (isComplete()) {
            displayConclusion()
        } else {
            if (isComplete(0, "i") === 0)
            displayStart()
            else {
                displayNextQuestion()
            }
        }
    });

}
function displayStart() {
    const commonStartElements = `
        <h1>Attitudes To COVID-19</h1>
    `
    if (isComplete()) {
        mainElement.innerHTML = `
    ${commonStartElements}
    <p>You have already completed this survey. To see the conclusion, press the "See Conclusion" button.</p>
    <button id="start">See Conclusion</button>
    `
    } else {
        mainElement.innerHTML = `
    ${commonStartElements}
    <p>By clicking "Start Survey!", you agree to share your answers for this survey <strong>anonymously</strong> for use in this study. Particpant data cannot be traced back to any individual user, and will be deleted after the study concludes.</p>
    <button id="start">${isComplete(0, "i") === 0 ? 'Start Survey!' : 'Continue Survey'}</button>
    `
    }

    // Create a button to start the survey
    document.querySelector('#start').addEventListener('click', function() {
        displayNextQuestion();
    });

}
function isComplete(start=0, mode=`boolean`) {
    for (let i = start; i <= questionList.length; i++) {
        if (i >= questionList.length ) {
            return true;
        } else if (getCookie(`q${i}`) === undefined) {
            if (mode === `boolean`) {
                return false;
            } else if (mode === 'i') {
                return i;
            }
        }
    }
}

// Assign UUID to users without one
let userUUID;
if (document.cookie) {
    userUUID = getCookie('uuid')
} else {
    userUUID = UUIDv4();
    document.cookie = `uuid=${userUUID};`

    let answerDefinitions = ``;
    for (let i = 0; i < questionList.length; i++) {
        answerDefinitions += `q${i} int, `;
    }
    answerDefinitions = answerDefinitions.slice(0,-2);
    fetchData(`CREATE TABLE ${userUUID.replace(/-/g, "_")} (${answerDefinitions});`);
}

// TEST PLEASE DELETE ME WHEN BACKEND IS WORKING
const command = `SELECT * FROM ${userUUID.replace(/-/g, "_")}`
console.log(command)
fetchData(command).then(data => console.log(data))

// Initiate Common Variables
const mainElement = document.querySelector('main');
const countElement = document.querySelector('#question-count');
let currentQuestion = 0;
let countTick;
countElement.innerHTML = `${questionList.length} Questions`;

// Create button to see your current answers
countElement.addEventListener('click', function() {
    displayAnswers();
});

// Display the welcome screen
displayStart()



// Utility Functions
function UUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



async function fetchData(command) {
    const data = { query: command };

    try {
        let response = await fetch("https://redesigned-dollop-q6p5grvrpvvf95q7-8080.app.github.dev/", {
            method:"POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Random-Value-No-Actual-Use": "haha-funny-number",
                "Origin": "http://localhost:63342",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
        }

        const responseData = await response.text();

        try {
            return JSON.parse(responseData);
        } catch (e) {
            console.error('This does not look like valid JSON: ', responseData);
            return null;
        }
    } catch (e) {
        console.error('Fetch failed: ', e);
        return null;
    }
}