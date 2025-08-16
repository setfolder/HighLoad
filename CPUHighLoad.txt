// Script to create 100% CPU load.
// Does not create load on browser.

const btnStart = document.createElement("button");
btnStart.innerHTML = "Start High Loading";
btnStart.onclick = "startWorkers()";
document.body.append(btnStart);

const btnStop = document.createElement("button");
btnStop.innerHTML = "Stop High Loading";
btnStop.onclick = "stopWorkers()";
document.body.append(btnStop);

let workers = [];

function startWorkers() {

    stopWorkers(); // In case of a restart

    const workerCode = `
self.onmessage = function() {
    let total = 0;
    while (true) {
    for (let i = 0; i < 1e7; i++) {
        total += Math.sqrt(i) * Math.sin(i % 360) * Math.log(i + 1);
        total += Math.random();
    }
    self.postMessage('Живой: ' + total);
    }
};
`;

    const blob = new Blob([ workerCode ], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const numCores = navigator.hardwareConcurrency || 4;
    const statusDiv = document.getElementById("status");

    for (let i = 0; i < numCores; i++) {
        const worker = new Worker(url);
        worker.onmessage = (e) => {
            const p = document.createElement("div");
            p.textContent = `Воркер ${i}: ${e.data}`;
            statusDiv.appendChild(p);
            if (statusDiv.childNodes.length > 20) {
                statusDiv.removeChild(statusDiv.firstChild);
            }
        };
        worker.postMessage(null);
        workers.push(worker);
    };

    console.log(`Started workers: ${numCores}`);
};

function stopWorkers() {
    for (const w of workers) {
        w.terminate();
    };
    workers = [];
    console.log("All the workers stoped");
};
