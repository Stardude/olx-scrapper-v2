module.exports = {
    getValue: async (elHandle, property) => {
        const prHandle = await elHandle.getProperty(property);
        return await prHandle.jsonValue();
    }
};