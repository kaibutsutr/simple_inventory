exports.objectToExcelRows = (ws, row, items)=>{
    for(let i in items) {
        key = Object.keys(items[i])[0];
        switch(key) {
            case 'string':
                ws.cell(row, i)
                    .string(''+items[i][key]);
                break;
            case 'number':
                ws.cell(row, i)
                    .number(parseInt(items[i][key]+0));
                break;
        }
    }
    return ws;
}

exports.getStyle = (wb, fontColor, fontSize, isBold=false)=>{
    let style = wb.createStyle({
        font: {
            color: fontColor,
            size: fontSize,
            bold: isBold
        }
    });
    return style;
}