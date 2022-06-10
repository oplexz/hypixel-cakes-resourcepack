const jimp = require("jimp");
const fs = require("fs");

const highres = false;

const output_path = "./oplexz-cakes/assets/minecraft/mcpatcher/cit/cakes";
const cake_texture = highres ? "./assets/cake-32x-blank.png" : "./assets/cake-blank.png";

const yearText = (n) => {
    str = n.toString();
    if (str.endsWith("11") || str.endsWith("12") || str.endsWith("13")) return n + "th";
    else if (n % 10 == 1) return n + "st";
    else if (n % 10 == 2) return n + "nd";
    else if (n % 10 == 3) return n + "rd";
    else return n + "th";
};

const generateImage = (n) => {
    jimp.read(cake_texture, (err, image) => {
        if (err) throw err;
        jimp.loadFont("./assets/Minecraft.ttf.fnt", (err, font) => {
            if (err) throw err;

            let w = image.bitmap.width,
                h = image.bitmap.height;

            let text = n.toString();
            let textWidth = jimp.measureText(font, text),
                textHeight = jimp.measureTextHeight(font, text);

            image
                .print(
                    font,
                    w / 2 - textWidth / 2,
                    6,
                    {
                        text: text,
                        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                    },
                    textWidth,
                    textHeight
                )
                .write(`${output_path}/cake_${text}.png`);
        });
    });
};

const generateProperties = (n) => {
    let cake = `type=item\nmatchItems=minecraft:cake\nnbt.display.Lore.1=\\u00A77celebration for the %year%`;
    if (n < 10) cake += " SkyBlock";
    fs.writeFileSync(`${output_path}/cake_${n}.properties`, cake.replace("%year%", yearText(n)));

    // let calendar = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Lore.*=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_calendar.properties`, calendar.replace("%year%", yearText(n)));

    // let event = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Name=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_event.properties`, event.replace("%year%", yearText(n)));
};

if (!fs.existsSync(output_path)) fs.mkdirSync(output_path, { recursive: true });

for (let i = 0; i <= 300; i++) {
    generateImage(i);
    generateProperties(i);
}
