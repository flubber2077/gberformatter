import { writeFile } from "fs/promises";
import hexarray from "hex-array";
import EPUBToText from "epub-to-text";
import wrap from "word-wrap";
const Iconv = require("iconv").Iconv;

type Meta = {
  id: string;
  excerpt: string;
  size: number;
  sequence_number: number;
  title: string;
};

const epubtotext = new EPUBToText();

const iconv = new Iconv("utf-8", "latin1//TRANSLIT//IGNORE");

const ROWLENGTH = 20;

const startOfFile = (input: string): string => {
  const firstPart = `#pragma once
    #pragma bank 255
    
    const unsigned char `;
  const lastPart = `[] = {
        `;

  return firstPart + input + lastPart;
};

const convertFiles = () => {
  let title = "";
  let nChapters = 0;
  let chapterFileArray = [];

    epubtotext.extract(
    "input/pg2148.epub",
    (err, txt: string, n: number, meta: Meta): void => {
      title = title === "" ? meta.title.replace(/ /g, "") : title;
      const charString: string = iconv.convert(txt).toString("hex");
        // check length and divide into appropriate sizes
      const hexArray = hexarray.fromString(charString);

      const fileName = `${title}_${n}`;
      chapterFileArray.push(fileName);
      writeFile(`output/${fileName}.c`, startOfFile(fileName) + JSON.stringify(Array.from(hexArray)).slice(1, -1)+ `};`);
      writeFile(`outputtext/${fileName}.txt`, hexArray);
    }
  );
};

convertFiles();