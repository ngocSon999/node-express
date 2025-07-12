/**
 * catchAsync function use to resolve try-catch in promises
 * catchAsync function receives async function
 * catchAsync function help not to write try-catch many times
 * @param {function} fn
 * @return {function}
 */
export function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
