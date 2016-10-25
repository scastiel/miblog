
export default async function promiseSeq(promisesFunctions) {
    if (promisesFunctions.length === 0) {
        return Promise.resolve([]);
    } else {
        // recursively and iteratively executes the given functions when the promise they return is resolved
        const [firstPromiseFunction, ... otherPromisesFunctions] = promisesFunctions;
        return [
            await firstPromiseFunction(),
            ... await promiseSeq(otherPromisesFunctions)
        ];
    }
}
