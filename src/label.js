function Style(font, fill, centered) {
	this.font = font;
	this.fill = fill;
	this.align = centered ? 'center' : 'left';

	console.log('Alignment: ' + this.align);
}

function AddLabelShadow(label, x, y, color, blur) {
	label.setShadow(x, y, color, blur);
}

//don't use this if you need to tween the label you create!!!!
function MakeLabel(x, y, text, font, fill, fixedToCamera) {
	var label = game.add.text(x, y, text + '  ', {font: font, fill:fill});

	label.fixedToCamera = fixedToCamera;

	return label;
}

function MakeCenteredLabel(x, y, text, font, fill, fixedToCamera) {
	var label = game.add.text(x, y, text + '  ', {font: font, fill:fill, align:'center'});
	label.anchor.set(0.5, 0);

	label.fixedToCamera = fixedToCamera;

	return label;
}