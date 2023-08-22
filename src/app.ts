import { readFile, writeFile } from "fs/promises";
import { convert } from "html-to-text";
import { Buffer } from "buffer";
import hexarray from "hex-array";
const Iconv = require('iconv').Iconv;

const ROWLENGTH = 20;

const iconv = new Iconv('utf-8', 'latin1//TRANSLIT');

const options = {
  wordwrap: ROWLENGTH,
  preserveNewLines: true
};

const convertFiles = async () => {
  try {
    // read file
    const buffer = await readFile(
      "input/2745488000012318890_2148-h-20.htm.html"
    );
    // convert file buffer to string TODO: check file type to see if necessary
    const htmlString = buffer.toString();
    // convert html to txt
    const text = convert(htmlString, options);
    //convert utf-8 to latin1 TODO: generalize conversion
    const charString = iconv.convert(text).toString('hex');

    const hexArray = hexarray.fromString(charString);
    writeFile("converted/test.txt", JSON.stringify(Array.from(hexArray)));
  } catch (error) {
    console.log(error);
  }
};

convertFiles();
