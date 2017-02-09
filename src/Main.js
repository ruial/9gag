"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const NineGag_1 = require("./NineGag");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = Number(process.argv[2]);
        let output = process.argv[3];
        let section = process.argv[4];
        let comments = process.argv[5] === "true";
        if (pages > 0) {
            let nineGag = new NineGag_1.NineGag();
            yield nineGag.readPosts(pages, section, comments);
            yield nineGag.writePage(output);
            console.log("Files written to: " + (output || NineGag_1.NineGag.OUTPUT_FOLDER));
        }
        else {
            console.log("Invalid number of pages");
        }
    });
}
if (require.main === module) {
    main();
}
__export(require("./NineGag"));
__export(require("./Post"));
__export(require("./Comment"));
