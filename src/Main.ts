import { NineGag } from "./NineGag";

async function main() {
    let pages = Number(process.argv[2]);
    let output = process.argv[3];
    let section = process.argv[4];
    let comments = Boolean(process.argv[5]);
    if (pages > 0) {
        let nineGag = new NineGag();
        await nineGag.readPosts(pages, section, comments);
        await nineGag.writePage(output);
        console.log("Files written to: " + (output || NineGag.OUTPUT_FOLDER));
    }
    else {
        console.log("Invalid number of pages");
    }
}

if (require.main === module) {
    main();
}

export * from "./NineGag";
export * from "./Post";
export * from "./Comment";