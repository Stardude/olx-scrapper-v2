module.exports = serviceName => {
    return {
        info: message => console.log(`[${serviceName}] ${message}`),
        error: message => console.error(`[${serviceName}] ${message}`)
    };
};