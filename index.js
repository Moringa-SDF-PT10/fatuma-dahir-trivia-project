
fetch("https://opentdb.com/api.php?amount=4&type=multiple") // makes a GET request to the URL i.e fetches questions from the API
.then ((res) => res.json()) // converts the response to JSON
.then ((data) => {
    questions = data.results // stores questions from the API 
})


function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const scoreboard = document.getElementById("scoreboard");
const scoreElement = document.getElementById("score");
const totalQuestionsElement = document.getElementById("total-questions");

let score = 0; // to keep track of the score
let questions = []; // to store the questions
let currentQuestionIndex = 0; // to keep track of the questions
let incorrectQuestions = []; // Track incorrect questions and their correct answers

startBtn.addEventListener("click", () => { //arrow function to hide the start screen and show the question screen when start button is clicked
    startScreen.classList.add("hidden"); // hides the start screen 
    questionScreen.classList.remove("hidden"); // shows the question screen
    showQuestion();
   }
)

// makes the order of the answers random i.e correct answer is not always in the same place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function showNotification(message, isCorrect) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification show ${isCorrect ? "correct" : "wrong"}`;

    // Hide it shortly before moving to next question
    setTimeout(() => {
        notification.classList.remove("show");
    }, 1000);
}


  
  
function showQuestion (){
    const questionData = questions[currentQuestionIndex]; // Gets the current question object from the array
    const questionText = decodeHTML(questionData.question); // helper function that turns encoded string into normal text
    questionScreen.innerHTML = `<h2>${questionText}</h2>` // displays question on the screen

    const form = document.createElement("form"); // creates form which will hold radiobutton for answers. 
    form.id = "answer-form"; // assigns id 

    const answers = [...questionData.incorrect_answers, questionData.correct_answer]; // combines the correct and incorrect answers using spread operator
   
    shuffleArray(answers); 

    // the forEach loops through the answers to create a radiobutton for each answer
    answers .forEach ((answer, index) =>  {
        const radio = document.createElement("input");
        radio.type = "radio"; // sets input type to radio so that only one answer is selected
        radio.name = "answer"; // groups all the radiobuttons under one name
        radio.value = answer; // sets the value of the radiobutton to the answer i.e correct or incorrect
        radio.id = `answer-${index}`; // assigns unique id to each radio button for labelling

        const label = document.createElement("label"); // creates label
        label.setAttribute ("for", radio.id); // links the label to the radio button via the for attribute
        label.textContent = decodeHTML(answer); // makes it human-readable

        // this eventlistener listens for change event when user clicks on a radio button
        radio.addEventListener("change", () => {

            const isCorrect = radio.value === questionData.correct_answer; // checks if the selected answer matches the correct answer
            showNotification(isCorrect ? "✅ Correct!" : "❌ Wrong!", isCorrect);

            if (!isCorrect) {
                incorrectQuestions.push({ question: questionText, correctAnswer: questionData.correct_answer });
            } // tracks the incorrect answers and stores their correct answers
      

            if (isCorrect) score++; // Updates score if correct

            currentQuestionIndex++; // Moves to the next question

            // Show notification first, wait, THEN move to next question
            setTimeout(() => {
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showScore();
                }
            }, 1100); // Give notification time to display
        }); // Waits before proceeding
     

        const container = document.createElement("div"); // creates a div to group the radio button and the label together
        container.appendChild(radio); // adds radio to the container 
        container.appendChild(label); // adds label to the container
        form.appendChild(container); // adds container to the form
    } 
);

        questionScreen.appendChild(form);

    }

 
function showScore() {
    questionScreen.classList.add("hidden");
    scoreboard.classList.remove("hidden");
  
    scoreElement.textContent = score; // Displays score
    totalQuestionsElement.textContent = questions.length; // Displays total questions

    // Removes old list
    const oldList = document.getElementById("incorrect-answers");
    if (oldList) oldList.remove();


    // checks for incorrect answers, lists the incorrect questions and shows the correct answer
    if (incorrectQuestions.length > 0) {
        const incorrectAnswersList = document.createElement("div");
        incorrectAnswersList.id = "incorrect-answers";
        incorrectAnswersList.innerHTML = "<h3>Incorrect Answers:</h3>";

        incorrectQuestions.forEach(incorrect => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `<p><strong>Question:</strong> ${decodeHTML(incorrect.question)}<br><strong>Correct Answer:</strong> ${decodeHTML(incorrect.correctAnswer)}</p>`;
            incorrectAnswersList.appendChild(questionDiv);
        });
        
        scoreboard.appendChild(incorrectAnswersList);

        const restartBtn = document.getElementById("restart-btn");
        scoreboard.insertBefore(incorrectAnswersList, restartBtn);

    }
  }

  // Restart quiz event button
  document.getElementById("restart-btn").addEventListener("click", () => {
    score = 0; // Reset score
    currentQuestionIndex = 0; // Resets question index
    incorrectQuestions = []; // Resets incorrect answers
    scoreboard.classList.add("hidden"); // Hides the scoreboard
    startScreen.classList.remove("hidden"); // Shows the start screen again
  });



  