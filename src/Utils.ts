import * as fs from "fs";
import * as request from "request";

export async function readPage(url: string) {
    return new Promise<string>((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    });
}

export async function downloadFile(url: string, path: string) {
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream(path)).on("close", resolve).on("error", reject);
    });
}