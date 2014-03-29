function MakeLabel(x, y, text, font, fill, fixedToCamera) {
    var label = game.add.text(x, y, text + ' ', { font: font, fill: fill });
    label.fixedToCamera = typeof fixedToCamera !== 'undefined' ? fixedToCamera : true;
    return label;
}

function MakeCenteredLabel(x, y, text, font, fill, fixedToCamera) {
    var style = { font: font, fill: fill, align: 'center' };
    var label = game.add.text(x, y, text + ' ', style);
    label.fixedToCamera = typeof fixedToCamera !== 'undefined' ? fixedToCamera : true;
    label.anchor.setTo(0.5, 0.5);
    return label;
}

function AddLabelShadow(label, x, y, color, blur) {
	label.setShadow(x, y, color, blur);
}