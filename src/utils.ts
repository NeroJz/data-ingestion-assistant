import csv from 'csv-parser';
import fs from 'node:fs';

type CsvRow = Record<string, string>;

type Result = {
  headers: string[];
  samples: CsvRow[];
};

/**
 * Return headers, first-n and last-n records
 * @param filePath - csv file path
 * @param n Read first and last N records
 * @returns Result
 */
export const csvToJson = async (
  filePath: string,
  n: number = 5
): Promise<Result> => {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(filePath);

    let headers: any[] = [];
    let firstNRows: any[] = [];
    let lastNRows: any[] = [];

    readStream
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = [...headerList];
      })
      .on('data', (row) => {
        if (firstNRows.length < n) {
          firstNRows.push(row);
        }

        lastNRows.push(row);
        if (lastNRows.length > n) {
          lastNRows.shift();
        }
      })
      .on('end', () => {
        resolve({
          headers,
          samples: [...firstNRows, ...lastNRows]
        });
      })
      .on('error', reject);
  });
};