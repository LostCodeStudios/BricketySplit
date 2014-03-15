function MakeLabel(x, y, text, font, fill) {
    return game.add.text(x, y, text, { font: font, fill: fill });
}

function MakeCenteredLabel(x, y, text, font, fill) {
    var style = { font: font, fill: fill, align: 'center' };
    var label = game.add.text(x, y, text, style);
    label.anchor.setTo(0.5, 0.5);
    return label;
}