import { CsvRecord } from './types/CsvRecord';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

class CSVReader {

    constructor() {
        dotenv.config();
        this.validateInputFile(process.env.INPUT_PATH!);
    }

    public parseCsv = (content: string): CsvRecord => {
        const lines = content.split('\n');
        console.log(`${lines.length} lines of data loaded.\n`);

        const data = new Map();

        for (let i = 0; i < lines.length; i++) {
            const score = +lines[i].split(',')[1];
            if (!score) continue;

            const scoreValue = data.get(score) ?? 0;
            data.set(score, scoreValue + 1);
        }

        return Array.from(data).sort((a, b) => b[1] - a[1]);
    }

    public readCsv = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = this.parseCsv(content);
        console.log(data);
        this.exportToCsv(data);
    }

    private exportToCsv = (data: CsvRecord, outputPath: string = process.env.OUTPUT_PATH!) => {
        const writeStream = fs.createWriteStream(outputPath, { flags: 'w' });

        for (let i = 0; i < data.length; i++) {
            const writtenData = data[i][0] + ',' + data[i][1] + '\n';
            writeStream.write(writtenData);
        }

        writeStream.end();
        console.log(`\nData successfully written to ${process.env.OUTPUT_PATH!}`);
    }

    private validateInputFile(inputPath: string) {
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input File ${inputPath} does not exist.`);
        }
    }
}

const reader = new CSVReader();
reader.readCsv(process.env.INPUT_PATH!);
