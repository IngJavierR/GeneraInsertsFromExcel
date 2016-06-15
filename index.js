(function() {
    'use strict';

    var Excel = require('exceljs');
    var fs = require('fs');

    console.log('Leyendo excel');

    var filename = "./exceldocs/productosImas.csv";
    var inserts = [];
    //insert into Productos values (2, 'RE002', 'AHUJA CARGADA'				, 'AHUJA CARGADA'				, 'AHUJA CARGADA DESC'				, '', 1);
    var workbook = new Excel.Workbook();
    workbook.csv.readFile(filename)
        .then(function(worksheet) {
            worksheet.eachRow({
                includeEmpty: true
            }, function(row, rowNumber) {
              var imagen64 = convertToBase64(row.getCell(4).value);
              var data = "insert into Productos values (" + rowNumber + ", '" + row.getCell(1).value.trim() + "', '" + row.getCell(1).value.trim() + "', '" + row.getCell(1).value.trim() + "', '"+ row.getCell(1).value.trim() + " DESC" + "', '" + imagen64 + "', 1);"
              inserts.push(data);
              console.log("Row " + data);
            });
            writeFile(inserts);
            console.log('Generacion terminada');
        });


    function convertToBase64(pathImagen){
      if(!pathImagen) return '';
      var bitmap = fs.readFileSync('./imagenes/' + pathImagen.trim());
      return new Buffer(bitmap).toString('base64');
    };

    function writeFile(content){
        var stream = fs.createWriteStream("inserts.sql");
        stream.once('open', function(fd) {
          content.map(function(dat){
            stream.write(dat + '\n');
          });
        stream.end();
      });
    }

})();
