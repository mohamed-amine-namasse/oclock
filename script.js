// ===================================
// PARTIE 1 : Horloge actuelle (Votre code de base)
// ===================================

function startTime() {
  var today = new Date();
  var hr = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  var ap = hr < 12 ? "<span>AM</span>" : "<span>PM</span>";
  hr = hr == 0 ? 12 : hr;
  hr = hr > 12 ? hr - 12 : hr;

  hr = checkTime(hr);
  min = checkTime(min);
  sec = checkTime(sec);

  document.getElementById("clock").innerHTML =
    hr + ":" + min + ":" + sec + " " + ap;

  var months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];
  var days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  var curWeekDay = days[today.getDay()];
  var curDay = today.getDate();
  var curMonth = months[today.getMonth()];
  var curYear = today.getFullYear();
  var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
  document.getElementById("date").innerHTML = date;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Lancement de l'horloge
setInterval(startTime, 500);

// ===================================
// FONCTION UTILITAIRE (Chrono/Minuteur)
// ===================================

// Formate les millisecondes en HH:MM:SS
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

// Convertit HH:MM:SS en millisecondes pour le minuteur
function timeToMs(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  }
  return 0;
}

// ===================================
// PARTIE 2 : Chronomètre
// ===================================

const stopwatchDisplay = document.getElementById("stopwatch-display");
const toggleStopwatchBtn = document.getElementById("toggle-stopwatch-btn");
const resetStopwatchBtn = document.getElementById("reset-stopwatch-btn");

let stopwatchInterval;
let startTimeValue;
let elapsedTime = 0;
let isRunning = false;

function updateStopwatch() {
  elapsedTime = Date.now() - startTimeValue;
  stopwatchDisplay.textContent = formatTime(elapsedTime);
}

function toggleStopwatch() {
  if (isRunning) {
    clearInterval(stopwatchInterval);
    isRunning = false;
    toggleStopwatchBtn.innerHTML =
      '<i class="fa fa-clock-o"></i> Lancer le chrono';
  } else {
    startTimeValue = Date.now() - elapsedTime;
    stopwatchInterval = setInterval(updateStopwatch, 10);
    isRunning = true;
    toggleStopwatchBtn.innerHTML =
      '<i class="fa fa-pause"></i> Arrêter le chrono';
  }
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  isRunning = false;
  elapsedTime = 0;
  stopwatchDisplay.textContent = "00:00:00";
  toggleStopwatchBtn.innerHTML =
    '<i class="fa fa-clock-o"></i> Lancer le chrono';
}

toggleStopwatchBtn.addEventListener("click", toggleStopwatch);
resetStopwatchBtn.addEventListener("click", resetStopwatch);

// ===================================
// PARTIE 3 : Minuteur (NOUVELLE FONCTIONNALITÉ)
// ===================================

const timerInput = document.getElementById("timer-input");
const timerDisplay = document.getElementById("timer-display");
const toggleTimerBtn = document.getElementById("toggle-timer-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");

let timerInterval;
let defaultDurationMs = timeToMs(timerInput.value || "00:05:00");
let durationMs = defaultDurationMs;
let remainingMs = durationMs;
let isTimerRunning = false;
let startTimeTimer;

function updateTimer() {
  const elapsedSinceStart = Date.now() - startTimeTimer;
  remainingMs = durationMs - elapsedSinceStart;

  if (remainingMs <= 0) {
    remainingMs = 0;
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerDisplay.textContent = formatTime(0);
    toggleTimerBtn.innerHTML = '<i class="fa fa-play"></i> Démarrer Minuteur';
    timerInput.style.display = "block";
    alert("TEMPS ÉCOULÉ !");
    return;
  }

  timerDisplay.textContent = formatTime(remainingMs);
}

function toggleTimer() {
  // 1. Mettre à jour la durée si l'input a changé
  const newDurationMs = timeToMs(timerInput.value);
  if (newDurationMs > 0 && newDurationMs !== defaultDurationMs) {
    defaultDurationMs = newDurationMs;
    durationMs = newDurationMs;
    remainingMs = durationMs;
    timerDisplay.textContent = formatTime(durationMs);
  }

  if (remainingMs <= 0 && !isTimerRunning) {
    alert("Veuillez définir un temps supérieur à zéro.");
    return;
  }

  if (isTimerRunning) {
    // Pause
    clearInterval(timerInterval);
    isTimerRunning = false;
    durationMs = remainingMs;
    toggleTimerBtn.innerHTML = '<i class="fa fa-play"></i> Reprendre Minuteur';
    timerInput.style.display = "block";
  } else {
    // Démarrer/Reprendre
    startTimeTimer = Date.now() - (defaultDurationMs - remainingMs);
    timerInterval = setInterval(updateTimer, 10);
    isTimerRunning = true;
    toggleTimerBtn.innerHTML = '<i class="fa fa-pause"></i> Pause Minuteur';
    timerInput.style.display = "none";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;

  // Réinitialise avec la valeur actuelle de l'input
  const initialMs = timeToMs(timerInput.value);
  durationMs = initialMs;
  remainingMs = durationMs;

  timerDisplay.textContent = formatTime(durationMs);
  toggleTimerBtn.innerHTML = '<i class="fa fa-play"></i> Démarrer Minuteur';
  timerInput.style.display = "block";
}

toggleTimerBtn.addEventListener("click", toggleTimer);
resetTimerBtn.addEventListener("click", resetTimer);
// Affichage initial
timerDisplay.textContent = timerInput.value;

// ===================================
// PARTIE 4 : Alarmes
// ===================================

const setAlarmBtn = document.getElementById("set-alarm-btn");
const alarmsList = document.getElementById("alarms-list");
let alarms = [];
let alarmCheckInterval;

function setAlarm() {
  const alarmTimeInput = prompt(
    "Entrez l'heure de l'alarme (HH:MM format 24h) :",
    "08:00"
  );

  if (alarmTimeInput) {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (timeRegex.test(alarmTimeInput)) {
      const newAlarm = { time: alarmTimeInput, id: Date.now() };

      alarms.push(newAlarm);
      renderAlarms();

      if (!alarmCheckInterval) {
        startAlarmChecker();
      }
    } else {
      alert("Format d'heure invalide. Veuillez utiliser HH:MM (ex: 10:30).");
    }
  }
}

function renderAlarms() {
  alarmsList.innerHTML = "";

  if (alarms.length === 0) {
    alarmsList.innerHTML = "<li>Aucune alarme définie.</li>";
    return;
  }

  alarms.forEach((alarm) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${alarm.time}</span>
      <button data-id="${alarm.id}" class="delete-alarm-btn">Supprimer</button>
    `;

    const deleteBtn = listItem.querySelector(".delete-alarm-btn");
    deleteBtn.addEventListener("click", deleteAlarm);

    alarmsList.appendChild(listItem);
  });
}

function deleteAlarm(event) {
  const alarmId = parseInt(event.target.dataset.id);

  alarms = alarms.filter((alarm) => alarm.id !== alarmId);

  renderAlarms();

  if (alarms.length === 0 && alarmCheckInterval) {
    clearInterval(alarmCheckInterval);
    alarmCheckInterval = null;
  }
}

function checkAlarms() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  alarms.forEach((alarm) => {
    if (alarm.time === currentTime && now.getSeconds() < 10) {
      alert(`🔔 ALARME : Il est ${alarm.time} !`);
    }
  });
}

function startAlarmChecker() {
  alarmCheckInterval = setInterval(checkAlarms, 60000);
}

setAlarmBtn.addEventListener("click", setAlarm);
renderAlarms();
