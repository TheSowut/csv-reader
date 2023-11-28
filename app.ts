import { CsvRecord } from './types/CsvRecord';
import * as fs from 'fs';

class CSVReader {

    public parseCsv = (content: string): CsvRecord => {
        const lines = content.split('\n');
        const data = new Map();

        for (let i = 0; i < lines.length; i++) {
            const score = +lines[i].split(',')[1];
            if (!score) continue;

            const scoreValue = data.get(score) ?? 1;
            data.set(score, scoreValue + 1);
        }

        return Array.from(data).sort((a, b) => b[1] - a[1]);
    }

    public readCsv = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = this.parseCsv(content);
        this.exportToCsv(data);
        console.log(data);
    }

    private exportToCsv = (data: CsvRecord, outputPath: string = '/home/pgavazov/Downloads/output.csv') => {
        const writeStream = fs.createWriteStream(outputPath, { flags: 'w' });

        for (let i = 0; i < data.length; i++) {
            const writtenData = data[i][0] + ',' + data[i][1] + '\n';
            writeStream.write(writtenData);
        }

        writeStream.end();
    }
}

const reader = new CSVReader();
reader.readCsv('/home/pgavazov/Downloads/20231016082521.csv');
