// ===================================
// PARTIE 1 : Horloge actuelle (Votre code existant)
// ===================================

function startTime() {
  var today = new Date();
  var hr = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  // Modification : 'ap' n'est pas utilisé dans le format 24h,
  // mais je le garde car il était dans votre code (format 12h)
  var ap = hr < 12 ? "<span>AM</span>" : "<span>PM</span>";
  // Conversion en format 12h
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

  // Utilisation de setInterval au lieu de setTimeout récursif
  // var time = setTimeout(function () { startTime(); }, 500);
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
// PARTIE 2 : Fonctionnalité du Chronomètre
// ===================================

const stopwatchDisplay = document.getElementById("stopwatch-display");
const toggleStopwatchBtn = document.getElementById("toggle-stopwatch-btn");

let stopwatchInterval;
let startTimeValue;
let elapsedTime = 0; // Le temps écoulé en millisecondes
let isRunning = false;

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

// Met à jour l'affichage du chronomètre
function updateStopwatch() {
  elapsedTime = Date.now() - startTimeValue;
  stopwatchDisplay.textContent = formatTime(elapsedTime);
}

// Gère le démarrage et l'arrêt du chronomètre
function toggleStopwatch() {
  if (isRunning) {
    // Arrêter
    clearInterval(stopwatchInterval);
    isRunning = false;
    toggleStopwatchBtn.innerHTML =
      '<i class="fa fa-clock-o"></i> Lancer le chrono';
  } else {
    // Lancer (ou reprendre)
    // On reprend à partir du temps écoulé (elapsedTime)
    startTimeValue = Date.now() - elapsedTime;
    // Met à jour plus fréquemment pour un affichage plus fluide
    stopwatchInterval = setInterval(updateStopwatch, 10);
    isRunning = true;
    toggleStopwatchBtn.innerHTML =
      '<i class="fa fa-pause"></i> Arrêter le chrono';
  }
}

// Ajout de l'écouteur d'événement au bouton
toggleStopwatchBtn.addEventListener("click", toggleStopwatch);

// ... (code existant de la partie 2)

const resetStopwatchBtn = document.getElementById("reset-stopwatch-btn");

// ... (fonctions formatTime, updateStopwatch, toggleStopwatch)

//  Fonction de réinitialisation du chronomètre
function resetStopwatch() {
  // 1. Arrêter le chronomètre s'il est en cours
  clearInterval(stopwatchInterval);
  isRunning = false;

  // 2. Réinitialiser les variables de temps
  elapsedTime = 0;

  // 3. Mettre à jour l'affichage
  stopwatchDisplay.textContent = "00:00:00";

  // 4. Mettre à jour le texte du bouton Lancer/Arrêter
  toggleStopwatchBtn.innerHTML =
    '<i class="fa fa-clock-o"></i> Lancer le chrono';
}

// Ajout de l'écouteur d'événement pour le bouton Reset
resetStopwatchBtn.addEventListener("click", resetStopwatch);

// ===================================
// PARTIE 3 : Gestion des Alarmes
// ===================================

const setAlarmBtn = document.getElementById("set-alarm-btn");
const alarmsList = document.getElementById("alarms-list");
let alarms = [];
let alarmCheckInterval;

// Fonction pour ajouter une alarme via un popup
function setAlarm() {
  // Ouvre une boîte de dialogue pour saisir l'heure (format HH:MM)
  // Utiliser le format 24h pour simplifier la comparaison
  const alarmTimeInput = prompt(
    "Entrez l'heure de l'alarme (HH:MM format 24h) :",
    "08:00"
  );

  if (alarmTimeInput) {
    // Vérification simple du format HH:MM
    const timeRegex = /^\d{2}:\d{2}$/;
    if (timeRegex.test(alarmTimeInput)) {
      const newAlarm = {
        time: alarmTimeInput,
        id: Date.now(), // ID unique
      };

      alarms.push(newAlarm);
      renderAlarms(); // Met à jour l'affichage

      // S'assure que la vérification des alarmes est lancée
      if (!alarmCheckInterval) {
        startAlarmChecker();
      }
    } else {
      alert("Format d'heure invalide. Veuillez utiliser HH:MM (ex: 10:30).");
    }
  }
}

// Fonction pour afficher la liste des alarmes
function renderAlarms() {
  alarmsList.innerHTML = ""; // Vide la liste actuelle

  // Si le tableau est vide, affiche un message
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

    // Attache l'événement de suppression
    const deleteBtn = listItem.querySelector(".delete-alarm-btn");
    deleteBtn.addEventListener("click", deleteAlarm);

    alarmsList.appendChild(listItem);
  });
}

// Fonction pour supprimer une alarme
function deleteAlarm(event) {
  // Récupère l'ID à partir de l'attribut data-id du bouton cliqué
  const alarmId = parseInt(event.target.dataset.id);

  // Filtre le tableau pour supprimer l'alarme
  alarms = alarms.filter((alarm) => alarm.id !== alarmId);

  renderAlarms(); // Met à jour l'affichage

  // Arrête la vérification si plus d'alarmes
  if (alarms.length === 0 && alarmCheckInterval) {
    clearInterval(alarmCheckInterval);
    alarmCheckInterval = null;
  }
}

// Fonction de vérification des alarmes
function checkAlarms() {
  const now = new Date();
  // Formate l'heure actuelle en HH:MM (format 24h) pour la comparaison
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  alarms.forEach((alarm) => {
    // Compare uniquement HH:MM
    if (alarm.time === currentTime && now.getSeconds() < 10) {
      // La vérification se fait une fois par minute,
      // on utilise now.getSeconds() < 10 pour s'assurer que l'alerte n'est montrée qu'une seule fois
      alert(`🔔 ALARME : Il est ${alarm.time} !`);
    }
  });
}

// Démarre la vérification des alarmes toutes les minutes
function startAlarmChecker() {
  // Vérification toutes les 60 secondes (60000ms)
  alarmCheckInterval = setInterval(checkAlarms, 60000);
}

// Événement pour le bouton Définir une alarme
setAlarmBtn.addEventListener("click", setAlarm);

// Initialisation de l'affichage des alarmes au chargement
renderAlarms();
