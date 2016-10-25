
export default function promisify(f) {
    return (... args) => new Promise((resolve, reject) => {
        f(... args, (err, ... resArgs) => {
            if (err) {
                reject(err);
            } else {
                resolve(... resArgs);
            }
        })
    })
}
