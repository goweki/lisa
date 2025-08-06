import fs from 'fs';

export const writeToLog = async (logFile: string, message: string) => {
    try {
        // Append the message with a timestamp to a log file
        await fs.promises.appendFile(
            `logs/${logFile}`,
            `${new Date().toISOString()} - ${message}\n`
        );
    } catch (err) {
        console.error('Error writing log file:', err);
    }
}