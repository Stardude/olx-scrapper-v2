module.exports.computeDiff = (original, updated) => {
    const diff = {};
    for (const prop in original) {
        if (original.hasOwnProperty(prop) && updated.hasOwnProperty(prop)) {
            if (original[prop] !== updated[prop]) {
                diff[prop] = updated[prop];
            }
        }
    }
    return diff;
};