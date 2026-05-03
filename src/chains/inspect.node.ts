import csv from 'csv-parser';
import fs from 'fs';
import { State } from './graph';

type CsvRow = Record<string, string>;

type Result = {
  headers: string[];
  samples: CsvRow[];
};

const inspect_node = async (state: State) => {
  return new Promise((resolve) => {
    let readStream = fs.createReadStream(state.filePath);
    let headers: any[] = [];
    let firstN: any[] = [];
    let lastN: any[] = [];

    readStream
      .pipe(csv())
      .on('headers', (columns) => {
        headers = [...columns];
      })
      .on('data', (row) => {
        if (firstN.length < 5) {
          firstN.push(row);
        }

        lastN.push(row);
        if (lastN.length > 5) {
          lastN.shift();
        }
      })
      .on('end', () => {
        resolve({
          csv_sample: {
            headers,
            samples: [...firstN, lastN]
          }
        });
      });
  });
}


export default inspect_node;


