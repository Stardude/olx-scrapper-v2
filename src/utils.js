module.exports = {
    getValue: async (elHandle, property) => {
        const prHandle = await elHandle.getProperty(property);
        return prHandle.jsonValue();
    },

    getDataFeaturesAttribute: async (page, elHandle) => {
        return page.evaluate(
            elHandle => elHandle.getAttribute('data-features'),
            elHandle
        );
    }
};