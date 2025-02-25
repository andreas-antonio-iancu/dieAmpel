const space = " ";
let word = ""; // Variable, die die Benutzereingabe speichert
let myFont, textBox; // myFont speichert die Schriftart, textBox speichert die Textgrenzen
const fSize = 220; // Schriftgröße
let dotSize = 4; // Größe der Punkte, die das Wort darstellen
const hoverDistance = 6; // Abstand, in der Punkte auf Hover reagieren
const forceStrength = 1.5; // Stärke der Verschiebung der Punkte bei Hover
const colorChangeInterval = 20000; // Zeitintervall (in Millisekunden) für den Farbwechsel
let colorCycleStarted = false; // überprüfen ob die aktion von farbwechseln erlaubt ist

// die Farbwerte für Gelb, Grün und Rot
const yellow = { r: 255, g: 199, b: 69 };
const green = { r: 0, g: 142, b: 62 };
const red = { r: 214, g: 54, b: 62 };

let points = []; // Array, das alle Punkte speichert, die das Wort darstellen
let affectedPoints = []; // Array, das alle verschobenen Punkte speichert
let targetColor = { ...yellow }; // die erste Farbe
let lastColorChangeTime = 0; // Zeitpunkt der letzten Farbänderung
let doubleClickMode = false; // Flag, um den Doppelklickmodus zu aktivieren/deaktivieren

// Preload-Funktion für das Typeface
function preload() {
  myFont = loadFont("assets/fonts/DIN-Schrift-1451-Mittelschrift-Alt.otf");
}

function setup() {
  // Erstellt das Zeichenfenster in der Größe des Browserfensters
  createCanvas(windowWidth, windowHeight);
  // Setzt den Zeilenabstand für den Text auf die Schriftgröße
  textLeading(fSize);
  // Aktualisiert das anzuzeigende Wort und erstellt die Punkte
  updateWord(word);

  // beim 'timerComplete'-Event wird das Canvas als Bild gespeichert
  window.addEventListener('timerComplete', () => {
    save('meinAmpel.png');
  });
}

// Funktion, um das angezeigte Wort zu aktualisieren und die Punkte neu zu generieren
function updateWord(newMessage) {
  word = space + newMessage + space;
  textBox = myFont.textBounds(word, 0, 0, fSize);
  points = [];
  generatePoints();
}

// Zeichnet den Canvas-Inhalt in jedem Frame neu
function draw() {
  background(30);
  noStroke();
  updateColor();

  // Zentriert den Text mittig im Fenster
  translate(width / 2 - textBox.w / 2, height / 2 - textBox.h / 2);

  // Zeichnet alle Punkte auf das Canvas
  drawPoints();
}

// Generiert Punkte, die das Wort darstellen
function generatePoints() {

  // Erstellt ein Grafikobjekt, um das Wort als Bild zu zeichnen
  let graphic = createGraphics(textBox.w, textBox.h + fSize);
  graphic.textFont(myFont);
  graphic.textSize(fSize);
  graphic.text(word, 0, textBox.h);

  // Grid effect - geht durch jeden Pixel des Grafikobjekts und erstellt Punkte dort, wo Text ist
  for (let x = 0; x < textBox.w * 2; x += 4) {
    for (let y = 0; y < textBox.h * 2 + fSize * 0.1; y += 6) {
      let c = graphic.get(x, y);
      if (c[3] > 0) {
        points.push({
          x,
          y,
          color: { ...yellow }
        });
      }
    }
  }
}

function drawPoints() {
  points.forEach(pt => {
    let { x, y, color } = pt;
    let mouseDist = dist(mouseX - (width / 2 - textBox.w / 2), mouseY - (height / 2 - textBox.h / 2), x, y); // Berechnet die Distanz zwischen Mauszeiger und Punkt

    // Speichert die ursprüngliche Position für die temporäre Verschiebung
    let originalX = pt.x;
    let originalY = pt.y;

    // Bei Mausklick: Ändert die Farbe und verschiebt die Punkte dauerhaft
    if (mouseIsPressed && mouseDist < hoverDistance) {
      let angle = atan2(y - (mouseY - height / 2 + textBox.h / 2), x - (mouseX - width / 2 + textBox.w / 2));
      pt.x += cos(angle) * forceStrength;
      pt.y += sin(angle) * forceStrength;
      if (!affectedPoints.includes(pt)) {
        affectedPoints.push(pt);
        pt.color = { ...color };
        pt.targetColor = { ...targetColor };
      }
    }

    // Bei Hover: Ändert die Farbe und verschiebt die Punkte temporär
    if (mouseDist < hoverDistance) {
      if (!affectedPoints.includes(pt)) {
        affectedPoints.push(pt);
        pt.color = { ...color };
        pt.targetColor = { ...targetColor };
      }
      // Temporäre Verschiebung beim Hover
      let hoverAngle = atan2(y - (mouseY - height / 2 + textBox.h / 2), x - (mouseX - width / 2 + textBox.w / 2));
      x += cos(hoverAngle) * (forceStrength*2);
      y += sin(hoverAngle) * (forceStrength*2);
    } else {
      // Reset die Punkte auf ihre ursprüngliche Position, wenn nicht mehr gehovt wird
      x = originalX;
      y = originalY;
    }

    // Zeichnet den Punkt
    fill(color.r, color.g, color.b);
    rect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize);

    // Aktualisiert die Position, wenn geklickt wurde
    pt.x = mouseIsPressed ? pt.x : originalX;
    pt.y = mouseIsPressed ? pt.y : originalY;
  });

  // Fügt Punkten an der Mausposition hinzu, wenn der Doppelklickmodus aktiv ist
  if (doubleClickMode) {
    points.push({
      x: mouseX - (width / 2 - textBox.w / 2),
      y: mouseY - (height / 2 - textBox.h / 2),
      color: { ...yellow }
    });
  }
}

// Aktualisiert die Farben der betroffenen Punkte
function updateColor() {
  // flag check
  if (!colorCycleStarted) return;

  let currentTime = millis();

  // ändern die hover farbe jeder 20sec
  if (currentTime - lastColorChangeTime > colorChangeInterval) {
    lastColorChangeTime = currentTime;

    // Cycle through the colors in the specified order: yellow → red → green
    if (targetColor.r === yellow.r && targetColor.g === yellow.g && targetColor.b === yellow.b) {
      targetColor = { ...red };
    } else if (targetColor.r === red.r && targetColor.g === red.g && targetColor.b === red.b) {
      targetColor = { ...green };
    } else {
      targetColor = { ...yellow };
    }
  }

  // Gradually blend the color of the points to the target color
  affectedPoints.forEach(pt => {
    pt.color.r = lerp(pt.color.r, pt.targetColor.r, 0.04);
    pt.color.g = lerp(pt.color.g, pt.targetColor.g, 0.04);
    pt.color.b = lerp(pt.color.b, pt.targetColor.b, 0.04);
  });
}

// erlauben farbwechseln () der timer von script.js ist gestartet)
window.addEventListener('timerStarted', () => {
  colorCycleStarted = true; // flag change
  lastColorChangeTime = millis();
});


function windowResized() { resizeCanvas(windowWidth, windowHeight); }
function doubleClicked() { doubleClickMode = !doubleClickMode; }