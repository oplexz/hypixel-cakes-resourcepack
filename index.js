const jimp = require("jimp");
const fs = require("fs");

const last_year = 300;

const output_path = "./oplexz-cakes/assets/minecraft/mcpatcher/cit/cakes";
const cake_texture = "./assets/cake-blank.png";

function getYearPostfix(year) {
    const str = year.toString();

    let postfix;

    if (str.endsWith("11") || str.endsWith("12") || str.endsWith("13")) {
        postfix = "th";
        return postfix;
    }

    switch (year % 10) {
        case 1:
            postfix = "st";
            break;

        case 2:
            postfix = "nd";
            break;

        case 3:
            postfix = "rd";
            break;

        default:
            postfix = "th";
            break;
    }

    return postfix;
}

function generateImage(year) {
    year = year.toString();

    jimp.read(cake_texture, (err, image) => {
        if (err) throw err;

        jimp.loadFont("./assets/Minecraft.ttf.fnt", (err, font) => {
            if (err) throw err;

            let w = image.bitmap.width;

            let textWidth = jimp.measureText(font, year),
                textHeight = jimp.measureTextHeight(font, year);

            image
                .print(
                    font,
                    w / 2 - textWidth / 2,
                    6,
                    {
                        text: year,
                        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                    },
                    textWidth,
                    textHeight
                )
                .write(`${output_path}/cake_${year}.png`);
        });
    });
}

function generateProperties(year) {
    let cake = `type=item\nmatchItems=minecraft:cake\nnbt.display.Lore.1=\\u00A77celebration for the %year%`;
    if (year < 10) cake += " SkyBlock";
    fs.writeFileSync(`${output_path}/cake_${year}.properties`, cake.replace("%year%", year + getYearPostfix(year)));

    // let calendar = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Lore.*=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_calendar.properties`, calendar.replace("%year%", year + getYearPostfix(year)));
    // let event = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Name=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_event.properties`, event.replace("%year%", year + getYearPostfix(year)));
}

function generatePackProperties() {
    const date = require("moment")().format("MMMM Do, YYYY");

    let mcmeta = {
        pack: {
            pack_format: 1,
            description: `Updated on ${date}\nContact: oplexz#8037`
        },
        repo: "https://github.com/oplexz/hypixel-cakes-resourcepack"
    };

    fs.writeFileSync("./oplexz-cakes/pack.mcmeta", JSON.stringify(mcmeta));
    fs.copyFileSync("./assets/pack.png", "./oplexz-cakes/pack.png");
}

if (!fs.existsSync(output_path)) fs.mkdirSync(output_path, { recursive: true });

generatePackProperties();

for (let i = 0; i <= last_year; i++) {
    generateImage(i);
    generateProperties(i);
}
