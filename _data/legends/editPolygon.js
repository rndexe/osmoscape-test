const args = process.argv.slice(2)
const filename = args[0];
const xvalue = args[1];
const yvalue = args[2];
const jsonFile = require("./"+filename);
const fs = require('fs');

const shapeArray = jsonFile.shapes;
console.log(jsonFile.shapes)
shapeArray.forEach((element,index) => {
    let pointArray = element.shape;
    //console.log(pointArray)
    pointArray.forEach((element,index) => {
        if (index%2===0) {
             element -= xvalue;
        } else {
             element -= yvalue;
        }
        pointArray[index] = element;
    });
    shapeArray[index].shape = pointArray
//    console.log(shapeArray)
});

jsonFile.shapes = shapeArray;
    console.log(jsonFile)

fs.writeFile(filename+"_new", JSON.stringify(jsonFile,null,2), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(jsonFile));
  console.log('writing to ' + filename+"_new");
});
