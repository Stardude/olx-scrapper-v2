module.exports = {
    SELECTORS: {
        usernameInput: "#userEmail",
        passwordInput: "#userPass",
        pagination: "span.item.fleft",
        editAdvLink: "ul.myoffersnew__main-actions > li > a.editme",
        priceInput: "#parameter-div-price > div.area.clr > div > div.fleft.rel.dynamic-param-price.dynamic-param.x-normal.light.br3 > div > div.dynamic-param-price__input > input",
        saveAdvBtn: "#save",
        confirmWindow: "#body-container > div > div > div > div.confirm-polaroid__main",
        page404: "#body-container > div > div > div.page404",
        cityAmount: "#body-container",

        views: "#adsTable > div.tbody > div > div.myoffersnew__item > div.myoffersnew__cell.myoffersnew__cell--content > div.myoffersnew__details > ul > li:nth-child(2) > span",
        phones: "#adsTable > div.tbody > div > div.myoffersnew__item > div.myoffersnew__cell.myoffersnew__cell--content > div.myoffersnew__details > ul > li:nth-child(3) > span",
        chosen: "#adsTable > div.tbody > div > div.myoffersnew__item > div.myoffersnew__cell.myoffersnew__cell--content > div.myoffersnew__details > ul > li:nth-child(4) > span",
        message: "#adsTable > div.tbody > div > div.myoffersnew__item > div.myoffersnew__cell.myoffersnew__cell--content > div.myoffersnew__details > div.myoffersnew__messages span.inlblk",
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
        editAdvPath: "/post-new-ad/edit/<CODE>/?bs=myaccount_edit&ref%5B0%5D%5Bpath%5D%5B0%5D=archive&ref%5B0%5D%5Baction%5D=myaccount&ref%5B0%5D%5Bmethod%5D=index"
    },

    DELAYS: {
        priceChange: 500,
        saveBtnClick: 1000,
        closePage: 1500,
        keyboardType: 75
    }
};