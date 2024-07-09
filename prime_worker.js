const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

const min = 2;
let primes = []; //이 배열을 전역으로 선언되어 있어 스레드끼리 데이터를 공유할것 같지만 각스레드끼리 이 변수가 다 따로 있다고 생각해야된다.

function findPrimes(start, end) {
    let isPrime = true;
    for (let i = start; i <= end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
            if (i !== j && i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        isPrime = true;
    }
} //소수를 찾는 함수

if (isMainThread) {
    //메인스레드일 경우
    const max = 10_000_000;
    const threadCount = 8;
    const threads = new Set();
    const range = Math.floor((max - min) / threadCount); //천만을 8로 균등하게 분배하기 위한 변수
    let start = min;
    console.time("prime");
    for (let i = 0; i < threadCount - 1; i++) {
        const end = start + range - 1;
        threads.add(new Worker(__filename, { workerData: { start, range: end } }));
        start += range;
    } //1~7까지 반복하며 워커스레드에게 일을 분해하는 코드
    threads.add(new Worker(__filename, { workerData: { start, range: max } }));
    for (let worker of threads) {
        worker.on("error", (err) => {
            throw err;
        });
        worker.on("exit", () => {
            threads.delete(worker);
            if (threads.size === 0) {
                console.timeEnd("prime");
                console.log(primes.length);
            }
        });
        worker.on("message", (msg) => {
            primes = primes.concat(msg);
        });
    }
} else {
    findPrimes(workerData.start, workerData.range);
    parentPort.postMessage(primes);
    parentPort.close();
}

// if (isMainThread) { //new Set사용안하고 배열로만 만들기
//     // 메인 스레드일 경우
//     const max = 10_000_000;
//     const threadCount = 8;
//     const threads = []; // Set 대신 배열을 사용
//     const range = Math.floor((max - min) / threadCount); // 천만을 8로 균등하게 분배하기 위한 변수
//     let start = min;
//     console.time("prime");
//     for (let i = 0; i < threadCount - 1; i++) {
//         const end = start + range - 1;
//         threads.push(new Worker(__filename, { workerData: { start, range: end } }));
//         start += range;
//     } // 1~7까지 반복하며 워커 스레드에게 일을 분해하는 코드
//     threads.push(new Worker(__filename, { workerData: { start, range: max } }));

//     let completedThreads = 0;

//     for (let worker of threads) {
//         worker.on("error", (err) => {
//             throw err;
//         });
//         worker.on("exit", () => {
//             completedThreads++;
//             if (completedThreads === threads.length) {
//                 console.timeEnd("prime");
//                 console.log(primes.length);
//             }
//         });
//         worker.on("message", (msg) => {
//             primes = primes.concat(msg);
//         });
//     }
// } else {
//     findPrimes(workerData.start, workerData.range);
//     parentPort.postMessage(primes);
//     parentPort.close();
// }

//참고하면 좋을 링크
//https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-workerthreads-%EB%AA%A8%EB%93%88
//https://velog.io/@elon/Node.js-Worker-threads-%EC%82%AC%EC%9A%A9%EB%B2%95
