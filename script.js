// ===================================
// FONCTION GLOBALE D'AFFICHAGE D'ALERTE
// ===================================

/**
 * Affiche un message d'alerte temporaire sur la page.
 * Nécessite un div <div id="alert-message"></div> dans le HTML.
 * @param {string} message - Le texte de l'alerte.
 * @param {number} duration - La durée d'affichage en millisecondes (par défaut 3000ms).
 */
function displayAlert(message, duration = 3000) {
  const alertDiv = document.getElementById("alert-message");

  // Si l'élément n'existe pas, on log l'erreur pour le développeur
  if (!alertDiv) {
    console.error(
      "L'élément #alert-message n'existe pas. Veuillez l'ajouter au HTML."
    );
    return;
  }

  // Assurez-vous que le message est visible
  alertDiv.textContent = message;
  alertDiv.style.opacity = 1;
  alertDiv.style.visibility = "visible";

  // Masquer le message après la durée spécifiée
  setTimeout(() => {
    alertDiv.style.opacity = 0;
    // On attend la fin de la transition CSS pour cacher complètement
    setTimeout(() => {
      alertDiv.style.visibility = "hidden";
      alertDiv.textContent = "";
    }, 500);
  }, duration);
}

// ===================================
// PARTIE 1 : Horloge actuelle
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

setInterval(startTime, 500);

// ===================================
// FONCTIONS UTILITAIRES (Chrono/Minuteur)
// ===================================

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

function timeToMs(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  }
  if (parts.length === 2) {
    // Si HH:MM est entré, on suppose 0 secondes
    return (parts[0] * 3600 + parts[1] * 60) * 1000;
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
// PARTIE 3 : Minuteur
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
    timerInput.style.visibility = "visible"; // Remplacement de alert()
    displayAlert("⌛ TEMPS ÉCOULÉ !", 5000);
    return;
  }

  timerDisplay.textContent = formatTime(remainingMs);
}

function toggleTimer() {
  const newDurationMs = timeToMs(timerInput.value);
  if (newDurationMs > 0 && newDurationMs !== defaultDurationMs) {
    defaultDurationMs = newDurationMs;
    durationMs = newDurationMs;
    remainingMs = durationMs;
    timerDisplay.textContent = formatTime(durationMs);
  }
  if (remainingMs <= 0 && !isTimerRunning) {
    // Remplacement de alert()
    displayAlert("⚠️ Veuillez définir un temps supérieur à zéro.");
    return;
  }

  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    durationMs = remainingMs;
    toggleTimerBtn.innerHTML = '<i class="fa fa-play"></i> Reprendre Minuteur';
    timerInput.style.visibility = "visible";
  } else {
    startTimeTimer = Date.now() - (defaultDurationMs - remainingMs);
    timerInterval = setInterval(updateTimer, 10);
    isTimerRunning = true;
    toggleTimerBtn.innerHTML = '<i class="fa fa-pause"></i> Pause Minuteur';
    timerInput.style.visibility = "hidden";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  const initialMs = timeToMs(timerInput.value);
  durationMs = initialMs;
  remainingMs = durationMs;

  timerDisplay.textContent = formatTime(durationMs); // Affiche la valeur initiale
  toggleTimerBtn.innerHTML = '<i class="fa fa-play"></i> Démarrer Minuteur';
  timerInput.style.visibility = "visible";
}

toggleTimerBtn.addEventListener("click", toggleTimer);
resetTimerBtn.addEventListener("click", resetTimer);
timerDisplay.textContent = timerInput.value;

// ===================================
// PARTIE 4 : Alarmes
// ===================================

const setAlarmBtn = document.getElementById("set-alarm-btn");
const upcomingAlarmsList = document.getElementById("upcoming-alarms-list");
const passedAlarmsList = document.getElementById("passed-alarms-list");

const alarmTimeInput = document.getElementById("alarm-time-input");
const alarmMessageInput = document.getElementById("alarm-message-input");

let alarms = [];
let alarmCheckInterval;

function calculateTimeRemaining(alarmTimeStr) {
  const now = new Date();
  const [alarmHour, alarmMinute] = alarmTimeStr.split(":").map(Number); // Crée la date de l'alarme pour AUJOURD'HUI
  let alarmDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    alarmHour,
    alarmMinute,
    0,
    0
  );
  let diffMs = alarmDate.getTime() - now.getTime(); // === DÉCISION DU STATUT ===
  if (diffMs < 0) {
    return { status: "passed", text: "Passée" };
  } // === CALCUL DU TEMPS RESTANT (UPCOMING) ===

  const diffHours = Math.floor(diffMs / 3600000);
  const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);

  let timeStr = "dans ";
  if (diffHours > 0) {
    timeStr += `${diffHours}h `;
  }
  timeStr += `${diffMinutes}min ${diffSeconds}s`;

  return { status: "upcoming", text: timeStr.trim() };
}

function setAlarm() {
  const time = alarmTimeInput.value.trim();
  const message = alarmMessageInput.value.trim(); // Validation du format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;

  if (!time || !message) {
    // Remplacement de alert()
    displayAlert(
      "🛑 Veuillez entrer une heure (HH:MM) ET un message pour l'alarme."
    );
    return;
  }
  const match = time.match(timeRegex);
  if (!match) {
    // Remplacement de alert()
    displayAlert(
      "❌ Format d'heure invalide. Veuillez utiliser HH:MM (ex: 10:30)."
    );
    return;
  } // Normalise l'heure en HH:MM (ex: 8:00 -> 08:00)
  const normalizedTime = `${match[1]}:${match[2]}`;

  const newAlarm = {
    time: normalizedTime,
    message: message,
    id: Date.now(),
  };
  alarms.push(newAlarm);
  alarms.sort((a, b) => a.time.localeCompare(b.time));

  renderAlarms();
  alarmTimeInput.value = "08:00";
  alarmMessageInput.value = "";
  if (!alarmCheckInterval) {
    startAlarmChecker();
  }
}

function renderAlarms() {
  upcomingAlarmsList.innerHTML = "";
  passedAlarmsList.innerHTML = "";
  const upcoming = [];
  const passed = [];

  alarms.forEach((alarm) => {
    const timeData = calculateTimeRemaining(alarm.time);
    alarm.timeStatus = timeData.text;

    if (timeData.status === "upcoming") {
      upcoming.push(alarm);
    } else {
      passed.push(alarm);
    }
  });

  if (upcoming.length === 0) {
    upcomingAlarmsList.innerHTML = "<li>(Aucune alarme planifiée)</li>";
  } else {
    upcoming.forEach((alarm) => {
      const listItem = createAlarmListItem(alarm, "upcoming");
      upcomingAlarmsList.appendChild(listItem);
    });
  }

  if (passed.length === 0) {
    passedAlarmsList.innerHTML = "<li>(Aucune alarme passée aujourd'hui)</li>";
  } else {
    // Affiche les alarmes passées du plus récent au plus ancien
    passed.reverse().forEach((alarm) => {
      const listItem = createAlarmListItem(alarm, "passed");
      passedAlarmsList.appendChild(listItem);
    });
  }
}

function createAlarmListItem(alarm, type) {
  const listItem = document.createElement("li");
  listItem.classList.add(`alarm-${type}`);

  listItem.innerHTML = `
 <div>
 <strong>${alarm.time}</strong> 
 <span class="alarm-msg">(${alarm.message})</span>
 </div>
 <div class="alarm-controls">
 <span class="alarm-time-status status-${type}">
 ${alarm.timeStatus}
 </span>
 <button data-id="${alarm.id}" class="delete-alarm-btn">Supprimer</button>
 </div>
 `;
  const deleteBtn = listItem.querySelector(".delete-alarm-btn");
  deleteBtn.addEventListener("click", deleteAlarm);
  return listItem;
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
  ).padStart(2, "0")}`; // Vérification de sonnerie
  alarms.forEach((alarm) => {
    // L'alarme sonne si l'heure correspond et si les secondes sont zéro (pour sonner une seule fois par minute)
    if (alarm.time === currentTime && now.getSeconds() === 0) {
      // Remplacement de alert()
      displayAlert(`🚨 RÉVEIL SONNE : ${alarm.message}`, 10000);
    }
  }); // Mettre à jour l'affichage du temps restant toutes les secondes

  renderAlarms();
}

function startAlarmChecker() {
  if (!alarmCheckInterval) {
    // L'intervalle doit être de 1000ms pour synchroniser avec l'heure exacte et checkAlarms()
    alarmCheckInterval = setInterval(checkAlarms, 1000);
  }
}

setAlarmBtn.addEventListener("click", setAlarm);
renderAlarms();
startAlarmChecker();
