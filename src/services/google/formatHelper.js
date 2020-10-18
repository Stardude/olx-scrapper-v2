const lastColumnId = 10000;

module.exports = {
    borders: (sheetId, productRowPosition, height) => ([
        {
            updateBorders: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + height - 1,
                    startColumnIndex: 0,
                    endColumnIndex: lastColumnId
                },
                top: {
                    style: "SOLID",
                    width: 2
                },
                bottom: {
                    style: "SOLID",
                    width: 2
                }
            }
        },
        {
            updateBorders: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + 3,
                    startColumnIndex: 0,
                    endColumnIndex: lastColumnId
                },
                bottom: {
                    style: "SOLID",
                    width: 2
                }
            }
        },
        {
            updateBorders: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + height - 1,
                    startColumnIndex: 1,
                    endColumnIndex: 2
                },
                left: {
                    style: "SOLID",
                    width: 2
                },
                right: {
                    style: "SOLID",
                    width: 2
                }
            }
        },
        {
            updateBorders: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + 1,
                    startColumnIndex: 0,
                    endColumnIndex: 1
                },
                bottom: {
                    style: "SOLID",
                    width: 2
                }
            }
        }
    ]),

    cells: (sheetId, productRowPosition, height) => ([
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + height + 1,
                    startColumnIndex: 0,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: "CENTER",
                        textFormat: { bold: true, fontFamily: "Roboto" }
                    }
                },
                fields: "userEnteredFormat(textFormat,horizontalAlignment)"
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + 1,
                    startColumnIndex: 0,
                    endColumnIndex: 1
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 1 }
                    }
                },
                fields: "userEnteredFormat(backgroundColor)"
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 1,
                    endRowIndex: productRowPosition + 3,
                    startColumnIndex: 0,
                    endColumnIndex: 1
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.24, green: 0.52, blue: 0.78 }
                    }
                },
                fields: "userEnteredFormat(backgroundColor)"
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition + height + 1,
                    startColumnIndex: 1,
                    endColumnIndex: 2
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: "LEFT"
                    }
                },
                fields: "userEnteredFormat(horizontalAlignment)"
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition - 1,
                    endRowIndex: productRowPosition,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 1, green: 0.6, blue: 0 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition,
                    endRowIndex: productRowPosition + 1,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.96, green: 0.7, blue: 0.42 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 1,
                    endRowIndex: productRowPosition + 2,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 1, green: 1, blue: 0 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 2,
                    endRowIndex: productRowPosition + 3,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.42, green: 0.66, blue: 0.31 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 3,
                    endRowIndex: productRowPosition + 4,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.85, green: 0.92, blue: 0.83 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 5,
                    endRowIndex: productRowPosition + 6,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.85, green: 0.92, blue: 0.83 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 7,
                    endRowIndex: productRowPosition + 8,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.85, green: 0.92, blue: 0.83 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 9,
                    endRowIndex: productRowPosition + 10,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.85, green: 0.92, blue: 0.83 }
                    }
                },
                fields: 'userEnteredFormat(backgroundColor)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 4,
                    endRowIndex: productRowPosition + 5,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: 'RIGHT'
                    }
                },
                fields: 'userEnteredFormat(horizontalAlignment)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 6,
                    endRowIndex: productRowPosition + 7,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: 'RIGHT'
                    }
                },
                fields: 'userEnteredFormat(horizontalAlignment)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 8,
                    endRowIndex: productRowPosition + 9,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: 'RIGHT'
                    }
                },
                fields: 'userEnteredFormat(horizontalAlignment)'
            }
        },
        {
            repeatCell: {
                range: {
                    sheetId: sheetId,
                    startRowIndex: productRowPosition + 10,
                    endRowIndex: productRowPosition + 11,
                    startColumnIndex: 1,
                    endColumnIndex: lastColumnId
                },
                cell: {
                    userEnteredFormat: {
                        horizontalAlignment: 'RIGHT'
                    }
                },
                fields: 'userEnteredFormat(horizontalAlignment)'
            }
        }
    ])
};