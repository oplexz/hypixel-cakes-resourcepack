const Jimp = require("jimp");
const fs = require("fs");

const output_path = "../resourcepacks/oplexz cakes/assets/minecraft/mcpatcher/cit/cakes"

const generateImage = (n) => {
    Jimp.read("cake.png", (err, image) => {
        if (err) throw err;
        Jimp.loadFont("Minecraft.ttf.fnt", (err, font) => {
            var w = image.bitmap.width;
            var h = image.bitmap.height;

            let text = n.toString();
            var textWidth = Jimp.measureText(font, text);
            var textHeight = Jimp.measureTextHeight(font, text);

            image
                .print(font, w / 2 - textWidth / 2, 6,
                    {
                        text: text,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                    }, textWidth, textHeight)
                .write(`${output_path}/cake_${text}.png`);
        });
    });
}

const yearText = (n) => {
    str = n.toString();
    if (str.endsWith("11") || str.endsWith("12") || str.endsWith("13"))
        return n + "th";
    else if (n % 10 == 1)
        return n + "st";
    else if (n % 10 == 2)
        return n + "nd";
    else if (n % 10 == 3)
        return n + "rd";
    else
        return n + "th";
}

const generateProperties = (n) => {
    let cake = `type=item\nmatchItems=minecraft:cake\nnbt.display.Lore.1=\\u00A77celebration for the %year%`;
    if (n < 10) cake += " SkyBlock";
    fs.writeFileSync(`${output_path}/cake_${n}.properties`, cake.replace("%year%", yearText(n)));

    // let calendar = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Lore.*=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_calendar.properties`, calendar.replace("%year%", yearText(n)));

    // let event = `type=item\nitems=minecraft:cake\ntexture=cake_${n}.png\nnbt.display.Name=ipattern:*%year% new year celebration*`;
    // fs.writeFileSync(`${output_path}/cake_${n}_event.properties`, event.replace("%year%", yearText(n)));
}

for (let i = 0; i <= 300; i++) {
    generateImage(i);
    generateProperties(i);
}
