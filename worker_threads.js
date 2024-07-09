const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
//isMainThread 현재 코드가 메인스레드에서 실행되는지 워커 스레드에서 실행하는지 확인하는 방법
if (isMainThread) {
    // 부모일 때
    // 메인스레드는 워커스레드에게 일을 분배하고 워커스레드가 일이 끝나면 해당 결과를 메인스레드에서 취합
    const threads = new Set(); //배열이필요하지만 중복되지 않는 배열이 필요하기 때문에 new Set으로 생성
    threads.add(
        new Worker(__filename, {
            //워커에 대한 정보 기입 __filename은 워커에 할당할 파일이름을 적는 곳인데 __filename은 현재파일을 뜻한다.
            workerData: { start: 1 },
        })
    );
    threads.add(
        new Worker(__filename, {
            workerData: { start: 2 },
        })
    );
    for (let worker of threads) {
        worker.on("message", (message) => console.log("from worker", message)); //워커스레드에게 받은 메세지
        worker.on("exit", () => {
            //워커가 끝났을때
            threads.delete(worker);
            if (threads.size === 0) {
                console.log("job done");
            }
        });
    }
} else {
    // 워커일 때
    const data = workerData;
    parentPort.postMessage(data.start + 100);
    parentPort.close();
}
