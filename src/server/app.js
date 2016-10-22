
export default class Nblog {
    async main() {
        console.log('Give me a second...'); //eslint-disable-line
        await this.timeout(1000);
        console.log('Ok I\'m here!'); //eslint-disable-line
    }
    async timeout(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}
