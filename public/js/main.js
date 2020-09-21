const pollBody = document.querySelector('.pollBody');
const socket = io();

const pollIdParams = new URLSearchParams(window.location.search);
const pollId = pollIdParams.get('p');

const submitForm = () => {
  let emptyFields = 0;
  const answers = document.getElementsByName('pollAnswer');
  answers.forEach((item) => {
    if(item.checked) {
      socket.emit('pollVote', {
        answer: item.value,
        pollId
      });
      pollForm.parentNode.removeChild(pollForm);
    } else {
      emptyFields++;
    }
  });
  if(emptyFields > 0) {
    alert('Please select answer!');
  }
};
const addField = () => {
  const buttonField = document.getElementById('addField');
  const countAnswerField = document.querySelectorAll('.answer');
  if(countAnswerField.length < 10) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('form-group');
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.classList.add('form-control', 'answer');
    inputField.setAttribute('placeholder', `Answer ${countAnswerField.length+1}`);
    inputField.setAttribute('required', '');
    inputDiv.appendChild(inputField);
    buttonField.parentNode.insertBefore(inputDiv,buttonField);
    if(countAnswerField.length == 9) {
      buttonField.remove();
    }
  }
}

const createForm = () => {
  let emptyInputs = 0;
  let answers = [];
  const question = document.getElementById('question').value;
  if(question == '') {
    emptyInputs++;
  }
  const answersInputs = document.querySelectorAll('.answer');
  for(let i = 0; i < answersInputs.length; i++) {
    if(!answersInputs[i].value == '') {
      answers.push({answer: answersInputs[i].value});
    } else {
      emptyInputs++;
    }
  }
  if(emptyInputs > 0) {
    alert('You have empty fields, please fill them up!');
  } else {
    const submitObj = {
      question,
      answers
    };
    socket.emit('createPoll', submitObj);
  }
};

if (pollId) {
  socket.emit('joinRoom', pollId);
} else {
  const pollBuildForm = document.createElement('form');
  //Poll Question
  const pollQuestionDiv = document.createElement('div');
  pollQuestionDiv.classList.add('form-group');
  const pollQuestionLabel = document.createElement('label');
  pollQuestionLabel.setAttribute('for', 'question');
  pollQuestionLabel.innerText = 'Question:'
  const pollQuestionInput = document.createElement('input');
  pollQuestionInput.setAttribute('type', 'text');
  pollQuestionInput.classList.add('form-control');
  pollQuestionInput.setAttribute('placeholder', 'Enter the Question');
  pollQuestionInput.setAttribute('id', 'question');
  pollQuestionInput.setAttribute('required', '');
  pollQuestionDiv.appendChild(pollQuestionLabel);
  pollQuestionDiv.appendChild(pollQuestionInput);
  pollBody.appendChild(pollQuestionDiv);
  const pollAnswersHeader = document.createElement('div');
  pollAnswersHeader.classList.add('form-group');
  const pollAnswersHeaderLabel = document.createElement('label');
  pollAnswersHeaderLabel.innerText = 'Answers:'
  pollAnswersHeader.appendChild(pollAnswersHeaderLabel);
  pollBody.appendChild(pollAnswersHeader);
  //Poll Answers
  for(let i = 0; i < 2; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('form-group');
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.classList.add('form-control', 'answer');
    inputField.setAttribute('placeholder', `Answer ${i+1}`);
    inputField.setAttribute('required', '');
    inputDiv.appendChild(inputField);
    pollBody.appendChild(inputDiv);
  }
  const addAnswerFieldButton = document.createElement('button');
  addAnswerFieldButton.setAttribute('onclick', 'addField()');
  addAnswerFieldButton.setAttribute('id', 'addField');
  addAnswerFieldButton.classList.add('btn', 'btn-info', 'btn-block');
  addAnswerFieldButton.innerText = 'Add Answer';
  pollBody.appendChild(addAnswerFieldButton);
  const addSubmitButton = document.createElement('button');
  addSubmitButton.setAttribute('onclick', 'createForm(event);');
  addSubmitButton.classList.add('btn', 'btn-success', 'btn-block');
  addSubmitButton.innerText = 'Create Poll';
  pollBody.appendChild(addSubmitButton);
}

socket.on('pollSet', (poll) => {
  console.log(poll);
  // Poll Form
  const pollForm = document.createElement('form');
  pollForm.setAttribute('id', 'pollForm');
 
  //Poll Question
  const pollQuestion = document.createElement('h1');
  pollQuestion.classList.add('text-center', 'poll-question');
  pollQuestion.innerText = poll.info.question;
  pollForm.appendChild(pollQuestion);
  //Poll Answers
  const pollAnswers = document.createElement('div');
  pollAnswers.classList.add('poll-answers');

  for(let i = 0; i < poll.answers.length; i++) {
    const customControlDiv = document.createElement('div');
    customControlDiv.classList.add('custom-control', 'custom-radio');
    const inputRadio = document.createElement('input');
    inputRadio.classList.add('custom-control-input');
    inputRadio.setAttribute('value', i);
    inputRadio.setAttribute('id', `pollInput_${i}`);
    inputRadio.setAttribute('name', 'pollAnswer');
    inputRadio.setAttribute('required', '');
    inputRadio.setAttribute('type', 'radio');
    const inputLabel = document.createElement('label');
    inputLabel.classList.add('custom-control-label');
    inputLabel.setAttribute('for', `pollInput_${i}`);
    inputLabel.innerText = poll.answers[i].answer;
    customControlDiv.appendChild(inputRadio);
    customControlDiv.appendChild(inputLabel);
    pollAnswers.appendChild(customControlDiv);
    pollQuestion.appendChild(pollAnswers);
  }
  pollForm.appendChild(pollAnswers);
  // Poll Vote button
  const formButtonBody = document.createElement('div');
  formButtonBody.classList.add('text-center');
  const formButton = document.createElement('button');
  formButton.setAttribute('onclick', 'submitForm();');
  formButton.innerText = 'Vote';
  formButton.classList.add('btn', 'btn-info');
  formButtonBody.appendChild(formButton);
  pollForm.appendChild(formButtonBody);

  //Form Assembly
  pollBody.appendChild(pollForm);
});
socket.on('createPoll', (res) => {
  window.location.href = `?p=${res}`;
});
socket.on('pollStats', (stats) => {
  console.log(stats);
  const bars = document.querySelectorAll('.progress-bar');
  if(bars) {
    for(let i = 0; i < stats.allAnswers; i++) {
      const percentage = (stats.answers[i].votes/stats.allvotes)*100;
      bars[i].style.width = `${percentage}%`;
      bars[i].innerText = `${stats.answers[i].answer} ( ${stats.answers[i].votes} )`;
    }
  }
});
socket.on('pollSetStats', (stats) => {
  const pollStatsDiv = document.createElement('div');
  pollStatsDiv.setAttribute('id', 'poll-statistics');
  const questionHeader = document.createElement('h1');
  questionHeader.classList.add('text-center');
  questionHeader.innerText = stats.question;
  pollStatsDiv.appendChild(questionHeader);
  pollBody.appendChild(pollStatsDiv);
  for( let i = 0; i < stats.allAnswers; i++) {
    const percentage = (stats.answers[i].votes/stats.allvotes)*100;
    const progressDiv = document.createElement('div');
    progressDiv.classList.add('progress');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.setAttribute('id', `progressbar_${i}`);
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', stats.answers[i].votes);
    progressBar.innerText = `${stats.answers[i].answer} ( ${stats.answers[i].votes} )`;
    progressDiv.appendChild(progressBar);
    pollStatsDiv.appendChild(progressDiv);
    progressBar.style.width = `${percentage}%`;
  }
});

