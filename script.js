let message = ''; // Variable für die Benutzereingabe
let animationComplete = false; // Flag, um zu überprüfen, ob die Animation abgeschlossen ist
let timerStarted = false; // Flag, um zu überprüfen, ob der Timer gestartet wurde
let timerDuration = 60000; // Dauer = 1 Min
let startTime; // Startzeit für Timer

/* die Animation von dem Ampel-Logo */

// Farbwerte
const y = "rgb(255,199,69)"; // Gelb
const g = "rgb(0,142,62)";   // Grün
const r = "rgb(214,54,62)";  // Rot

// Funktion, um die Farben des Ampels zu animieren
function animatePoints() {
  let dot1 = document.getElementById('dot1');
  let yellowline = document.getElementById('line');
  let dot3 = document.getElementById('dot3');

  // Animation von den Farben
  setTimeout(() => { 
    dot1.style.backgroundColor = r; 
    setTimeout(() => { 
      yellowline.style.backgroundColor = y;
      setTimeout(() => { 
        dot3.style.backgroundColor = g;
        // Nach der Animation zur Eingabeseite wechseln
        setTimeout(() => { goToInput();}, 2000); // 2sec Wartezeit
      }, 2000);
    }, 1000);
  }, 1000);
}

// Funktion zum Wechseln zur Eingabeseite
function goToInput() {
  setTimeout(() => {
    document.getElementById('pointsScreen').classList.add('hidden');
    document.getElementById('inputScreen').classList.remove('hidden');
  }, 1000); // 1sec Wartezeit
}

// Startet die Punkteanimation
window.onload = animatePoints;

// Event-Listener für die Benutzereingabe
document.getElementById('customInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    message = event.target.value; // Speichert die Eingabe des Benutzers
    event.target.disabled = true; // Deaktiviert das Eingabefeld nach Eingabe
    
    document.getElementById('inputScreen').classList.add('fade-out');

    // Setzt das Flag & Startet den Timer
    animationComplete = true; 

    // Wechselt nach 5 Sekunden zur letzten Seite
    setTimeout(() => {
      document.getElementById('inputScreen').classList.add('hidden');
      document.getElementById('finalScreen').classList.remove('hidden');
      
      // Aktualisiert das angezeigte Wort für das p5.js Canvas
      updateWord(message);
    }, 5000);

    startTimer();
  }
});

// Timer
function startTimer() {
  timerStarted = true; // Setzt das Flag, dass der Timer gestartet wurde
  startTime = Date.now(); // Speichert die Startzeit des Timers

    // Dispatcher event für die farbwechseln in sketch.js
    window.dispatchEvent(new Event('timerStarted'));

  // Löst ein Event aus, wenn der Timer nach 1 Minute abläuft
  setTimeout(() => {
    window.dispatchEvent(new Event('timerComplete'));
  }, timerDuration);
}
