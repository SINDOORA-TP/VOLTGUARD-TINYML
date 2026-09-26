// ==========================================
// VOLTGUARD SIMULATION ENGINE
// ==========================================

let mode = "normal";

let voltage = 3.72;
let current = 0.84;
let temperature = 31.6;

let previousTemperature = temperature;

let abnormalProgress = 0;


// ==========================================
// BUTTONS
// ==========================================

document.getElementById("normalBtn").addEventListener("click", function () {

    mode = "normal";
    abnormalProgress = 0;

    document.getElementById("simulationMode").textContent =
        "Current Mode: Normal Simulation";

    resetNormalValues();
});


document.getElementById("abnormalBtn").addEventListener("click", function () {

    mode = "abnormal";
    abnormalProgress = 0;

    document.getElementById("simulationMode").textContent =
        "Current Mode: Abnormal Condition Simulation";
});


// ==========================================
// NORMAL VALUES
// ==========================================

function resetNormalValues() {

    voltage = 3.72;
    current = 0.84;
    temperature = 31.6;

    previousTemperature = temperature;

    updateDashboard(
        voltage,
        current,
        voltage * current,
        temperature,
        0,
        5
    );
}


// ==========================================
// SENSOR SIMULATION
// ==========================================

function updateSensors() {

    if (mode === "normal") {

        simulateNormal();

    } else {

        simulateAbnormal();

    }
}


// ==========================================
// NORMAL SIMULATION
// ==========================================

function simulateNormal() {

    voltage += (Math.random() - 0.5) * 0.025;

    current += (Math.random() - 0.5) * 0.08;

    temperature += (Math.random() - 0.45) * 0.04;


    // Keep normal values in reasonable range

    voltage = Math.max(3.65, Math.min(3.85, voltage));

    current = Math.max(0.60, Math.min(1.10, current));

    temperature = Math.max(29, Math.min(34, temperature));


    const power = voltage * current;

    const tempRise = temperature - previousTemperature;

    previousTemperature = temperature;


    const risk = calculateRisk(
        voltage,
        current,
        temperature,
        tempRise
    );


    updateDashboard(
        voltage,
        current,
        power,
        temperature,
        tempRise,
        risk
    );
}


// ==========================================
// ABNORMAL SIMULATION
// ==========================================

function simulateAbnormal() {

    abnormalProgress += 1;


    // Current gradually becomes abnormal

    current =
        0.85 +
        abnormalProgress * 0.09 +
        (Math.random() - 0.5) * 0.25;


    // Voltage becomes increasingly unstable

    voltage =
        3.72 -
        abnormalProgress * 0.015 +
        (Math.random() - 0.5) * 0.12;


    // Temperature gradually rises

    temperature =
        31.6 +
        abnormalProgress * 0.55 +
        (Math.random() - 0.3) * 0.25;


    // Prevent unrealistic values

    voltage = Math.max(3.20, Math.min(4.10, voltage));

    current = Math.max(0.5, Math.min(3.5, current));

    temperature = Math.max(30, Math.min(50, temperature));


    const power = voltage * current;

    const tempRise = temperature - previousTemperature;

    previousTemperature = temperature;


    const risk = calculateRisk(
        voltage,
        current,
        temperature,
        tempRise
    );


    updateDashboard(
        voltage,
        current,
        power,
        temperature,
        tempRise,
        risk
    );
}


// ==========================================
// RISK CALCULATION
// ==========================================

function calculateRisk(
    voltage,
    current,
    temperature,
    tempRise
) {

    let risk = 0;


    // Temperature

    if (temperature > 34) {
        risk += 15;
    }

    if (temperature > 38) {
        risk += 20;
    }

    if (temperature > 43) {
        risk += 25;
    }


    // Temperature rise

    if (tempRise > 0.15) {
        risk += 15;
    }

    if (tempRise > 0.30) {
        risk += 10;
    }


    // Current

    if (current > 1.5) {
        risk += 15;
    }

    if (current > 2.2) {
        risk += 15;
    }


    // Voltage abnormality

    if (voltage < 3.50) {
        risk += 15;
    }


    return Math.min(100, Math.round(risk));
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard(
    voltage,
    current,
    power,
    temperature,
    tempRise,
    risk
) {

    document.getElementById("voltage").textContent =
        voltage.toFixed(2) + " V";

    document.getElementById("current").textContent =
        current.toFixed(2) + " A";

    document.getElementById("power").textContent =
        power.toFixed(2) + " W";

    document.getElementById("temperature").textContent =
        temperature.toFixed(1) + " °C";

    document.getElementById("tempRise").textContent =
        tempRise.toFixed(2) + " °C/s";

    document.getElementById("riskScore").textContent =
        risk + "%";


    updateStatus(risk);
}


// ==========================================
// STATUS UPDATE
// ==========================================

function updateStatus(risk) {

    const status =
        document.getElementById("systemStatus");

    const message =
        document.getElementById("statusMessage");

    const alertMessage =
        document.getElementById("alertMessage");

    const indicator =
        document.getElementById("alertIndicator");


    if (risk <= 30) {

        status.textContent = "NORMAL";

        status.style.color = "#4ade80";

        message.textContent =
            "Battery operating within normal conditions";

        alertMessage.textContent =
            "No abnormal conditions detected.";

        indicator.style.color = "#22c55e";
    }


    else if (risk <= 60) {

        status.textContent = "WARNING";

        status.style.color = "#facc15";

        message.textContent =
            "Unusual battery behavior detected";

        alertMessage.textContent =
            "Warning: unusual electrical or thermal behavior detected.";

        indicator.style.color = "#facc15";
    }


    else if (risk <= 80) {

        status.textContent = "HIGH RISK";

        status.style.color = "#fb923c";

        message.textContent =
            "Abnormal battery behavior detected";

        alertMessage.textContent =
            "High-risk condition detected. Inspection recommended.";

        indicator.style.color = "#fb923c";
    }


    else {

        status.textContent = "CRITICAL";

        status.style.color = "#ef4444";

        message.textContent =
            "Critical abnormal condition detected";

        alertMessage.textContent =
            "Critical condition detected. Immediate inspection required.";

        indicator.style.color = "#ef4444";
    }
}


// ==========================================
// START SIMULATION
// ==========================================

resetNormalValues();

setInterval(updateSensors, 1000);
// ==========================================
// REAL-TIME RISK TREND GRAPH
// ==========================================

const canvas = document.getElementById("trendCanvas");
const ctx = canvas.getContext("2d");

let riskHistory = [];

// Start with a few normal readings
for (let i = 0; i < 10; i++) {
    riskHistory.push(5);
}


// Resize canvas correctly
function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// Draw the line
function drawGraph() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);


    // Get current risk
    const riskElement =
        document.getElementById("riskScore");

    const currentRisk =
        parseInt(riskElement.textContent) || 0;


    // Add new value
    riskHistory.push(currentRisk);


    // Keep only last 40 readings
    if (riskHistory.length > 40) {
        riskHistory.shift();
    }


    // Draw line
    ctx.beginPath();

    riskHistory.forEach((risk, index) => {

        const x =
            (index / Math.max(1, riskHistory.length - 1))
            * width;

        const y =
            height - 15 -
            (risk / 100) * (height - 30);


        if (index === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);

        }
    });


    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.stroke();


    // Draw current value point

    const lastRisk =
        riskHistory[riskHistory.length - 1];

    const lastX = width;

    const lastY =
        height - 15 -
        (lastRisk / 100) * (height - 30);


    ctx.beginPath();

    ctx.arc(
        lastX,
        lastY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#22c55e";

    ctx.fill();
}


// Update every second
setInterval(drawGraph, 1000);

// Draw immediately
drawGraph();