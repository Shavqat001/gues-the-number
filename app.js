function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const form = document.querySelector('form');
const counter = document.querySelector('.counter');
const fields = document.querySelectorAll('.number-field');
const attemptsContainer = document.querySelector('.attempts-container');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');
const bgAudio = document.querySelector('.bg-audio');
const audioGame = document.querySelector('.audio-game');
const clickVoice = document.querySelector('.click');

const maxAttempts = 4;
let attemptCount = 0;
let numbers = [];

const successVoices = [
    './voices/success_1.mp3',
    './voices/success_2.mp3',
    './voices/success_3.mp3',
];

const failVoices = [
    './voices/fail_1.mp3',
    './voices/fail_2.mp3',
    './voices/fail_3.mp3',
    './voices/fail_4.mp3',
    './voices/fail_5.mp3',
];

// Генерируем уникальные случайные числа от 0 до 9
while (numbers.length < 4) {
    const num = getRandomNumber(0, 9);  // Диапазон теперь от 0 до 9
    if (!numbers.includes(num)) {
        numbers.push(num);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    attemptCount++;
    counter.textContent = `Макс число: 4. Ваши попытки: ${attemptCount}`;

    const attemptRow = document.createElement('div');
    attemptRow.classList.add('attempt-row');
    let allCorrect = true;

    fields.forEach((field, i) => {
        const userInput = Number(field.value);
        const correctNumber = numbers[i];
        const indicator = document.createElement('span');
        indicator.textContent = userInput;

        if (userInput === correctNumber) {
            field.style.color = 'yellowgreen';
            indicator.style.background = 'yellowgreen';
        } else if (numbers.includes(userInput)) {
            field.style.color = '#fff';
            indicator.style.background = 'wheat';
            allCorrect = false;
        } else {
            field.style.color = '#fff';
            indicator.style.background = 'tomato';
            allCorrect = false;
        }

        attemptRow.appendChild(indicator);
    });

    attemptsContainer.appendChild(attemptRow);
    clickVoice.src = './voices/click.mp3';
    clickVoice.play();

    if (allCorrect) {
        showModal('Вы выиграли! 🏆', true);
    } else if (attemptCount >= maxAttempts) {
        showModal(`Вы проиграли! Правильные числа были: ${numbers.join(', ')} ✅`, false);
    }
});

fields.forEach((field, index) => {
    field.addEventListener('input', () => {
        if (field.value.length > 1) {
            field.value = field.value.slice(0, 1);
        }
    });

    field.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
            fields[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < fields.length - 1) {
            fields[index + 1].focus();
        }
    });
});

document.addEventListener('click', (event) => {
    fields.forEach((field) => {
        if (event.target === field || event.target === field.nextElementSibling) {
            field.focus();
        }
    });
});

window.addEventListener('load', () => {
    fields[0].focus();
    counter.textContent = `Макс число: 4. Ваши попытки: ${attemptCount}`;
    modal.querySelector('.modal-content').innerHTML = `
        <button class="start-game">Начать</button>
    `;
    modal.style.display = 'block';

    modal.querySelector('.start-game').addEventListener('click', () => {
        bgAudio.src = './voices/background.mp3';
        bgAudio.play();
        modal.style.display = 'none';
        fields[0].focus();
    });

    const closeBtn = modal.querySelector('#modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            location.reload();
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            location.reload();
        }
    });
});

// Функция для отображения модального окна
function showModal(message, isSuccess) {
    modal.querySelector('.modal-content').innerHTML =
        `
        <p id="modal-message">${message}</p>
        <button id="modal-close-btn"></button>
        `;

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('#modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            location.reload();
        });
    }

    const randomVoice = isSuccess
        ? successVoices[getRandomNumber(0, successVoices.length - 1)]
        : failVoices[getRandomNumber(0, failVoices.length - 1)];

    audioGame.src = randomVoice;
    audioGame.play();
}
