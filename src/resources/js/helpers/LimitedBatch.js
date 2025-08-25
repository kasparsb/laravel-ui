/**
 * Limitējam vienlaicīgos requests
 */
function LimitedBatch(maxConcurrent = 5) {

    this.maxConcurrent = maxConcurrent;
    this.currentlyRunning = 0;
    this.queue = [];

}

LimitedBatch.prototype = {
    add(promiseToRun) {
        this.queue.push(promiseToRun);
        this.processQueue();
    },

    processQueue() {
        if (this.currentlyRunning >= this.maxConcurrent || !this.queue.length) {
            return;
        }

        this.currentlyRunning++;
        let promiseToRun = this.queue.shift();


        promiseToRun()
            /**
             * apstrādājam visus catch, lai nemetas errors
             * !!! bet vai tiešām tā vajag?
             * ja ir server error, tad tas tā pat parādīsies consolē
             */
            .catch(err => {
                //console.error(err);
            })
            .finally(() => {
                this.currentlyRunning--;
                this.processQueue();
            })
    }
}

export default LimitedBatch