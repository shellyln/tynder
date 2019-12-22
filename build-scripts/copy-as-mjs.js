
const fs = require('fs');
const path = require('path');



function copyAsMjs(srcDir, destDir, options) {
    const opts = Object.assign({}, {
        srcExt: '.js',
        destExt: '.mjs',
    }, options || {});

    if (! fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.lstatSync(srcDir).isDirectory()) {
        const files = fs.readdirSync(srcDir);
        for (const entry of files) {
            const srcEntryPath = path.join(srcDir, entry);
            if (fs.lstatSync(srcEntryPath).isDirectory()) {
                copyAsMjs(srcEntryPath, path.join(destDir, entry));
            } else {
                if (entry.toLowerCase().endsWith(opts.srcExt)) {
                    fs.copyFileSync(srcEntryPath, path.join(destDir, entry.slice(0, -(opts.srcExt.length)) + opts.destExt));
                }
            }
        }
    }
}

exports.copyAsMjs = copyAsMjs;
