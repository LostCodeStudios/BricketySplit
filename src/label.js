function MakeLabel(x, y, text, font, fill) {
    var label = game.add.text(x, y, text, { font: font, fill: fill });
    label.fixedToCamera = true;
    return label;
}

function MakeCenteredLabel(x, y, text, font, fill) {
    var style = { font: font, fill: fill, align: 'center' };
    var label = game.add.text(x, y, text, style);
    label.fixedToCamera = true;
    label.anchor.setTo(0.5, 0.5);
    return label;
}