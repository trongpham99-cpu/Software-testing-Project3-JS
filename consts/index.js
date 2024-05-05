const excel = require('excel4node');

const writeLog = (logs = [], path) => {
    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('Sheet 1');
    const style = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 12
        }
    });

    ws.cell(1, 1).string('ID').style(style);
    ws.cell(1, 2).string('Description').style(style);
    ws.cell(1, 3).string('Message').style(style);
    ws.cell(1, 4).string('Expected Result').style(style);
    ws.cell(1, 5).string('Actual Result').style(style);
    ws.cell(1, 6).string('Status').style(style);
    ws.cell(1, 7).string('Date Time').style(style);

    logs.forEach((log, index) => {
        const row = index + 2;
        ws.cell(row, 1).string(log.id);
        ws.cell(row, 2).string(log.description);
        ws.cell(row, 3).string(log.message);
        ws.cell(row, 4).string(log.expected_result);
        ws.cell(row, 5).string(log.actual_result);
        ws.cell(row, 6).string(log.status);
        ws.cell(row, 7).string(new Date().toLocaleString());
    });

    wb.write(path, (err, stats) => {
        if (err) {
            console.error('Error writing log to file:', err);
        } else {
            console.log('Write log success');
        }
    });
};

const writeResult = (result, path) => {
    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    const style = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 12
        }
    });

    ws.cell(1, 1).string('Total Test Case').style(style);
    ws.cell(1, 2).string('Total Pass').style(style);
    ws.cell(1, 3).string('Total Fail').style(style);

    ws.cell(2, 1).number(result.totalTestCase);
    ws.cell(2, 2).number(result.totalPass);
    ws.cell(2, 3).number(result.totalFail);

    wb.write(path);
    console.log('Write result success');
}

module.exports = {
    writeLog,
    writeResult
}