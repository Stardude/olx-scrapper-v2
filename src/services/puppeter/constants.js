module.exports = {
    SELECTORS: {
        usernameInput: "#userEmail",
        passwordInput: "#userPass",
        orderList: "div[data-testid=inventory-list]",
        pagination: "span.item.fleft",
        editAdvLink: "ul.myoffersnew__main-actions > li > a.editme",
        priceInput: "input#parameters\\.price\\.price",
        saveAdvBtn: "button[data-testid=submit-btn]",
        confirmWindow: "#body-container > div > div > div > div.confirm-polaroid__main",
        page404: "div[data-testid=loader]",
        cityPage404: "div.page404",
        cityAmount: "#body-container",
        categoryButton: "#posting-form > main:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > button",

        views: "div[data-cy=inventory-stats] > span > ul > li:nth-child(1)",
        phones: "div[data-cy=inventory-stats] > span > ul > li:nth-child(3)",
        chosen: "div[data-cy=inventory-stats] > span > ul > li:nth-child(2)",
        message: "strong[data-testid=inventory-message-counter]",
        city: "div.myoffersnew__row.row-elem",
        isTop: "ul.myoffersnew__data",
        isTopInner: "ul.olx-bundle-bought__items i[data-icon=circle_tick]"
    },

    URLs: {
        host: "https://olx.ua/uk",
        myHost: "https://bims.olx.ua/uk",
        mainPath: "/myaccount",
        categoryPath: "/moda-i-stil/odezhda/muzhskaya-obuv",
        cityTopQuery: "?search%5Bpaidads_listing%5D=1",
        editAdvPath: "/post-new-ad/edit/<CODE>/?bs=myaccount_edit&ref%5B0%5D%5Bpath%5D%5B0%5D=archive&ref%5B0%5D%5Baction%5D=myaccount&ref%5B0%5D%5Bmethod%5D=index",
        successEditingPath: "/adding/success/",
        xhrPageNotFound: "https://www.olx.ua/api/v1/offers/"
    },

    DELAYS: {
        priceChange: 500,
        saveBtnClick: 1000,
        closePage: 1500,
        keyboardType: 75
    }
};