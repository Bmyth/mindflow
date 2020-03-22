function HeadingText() {
	var startText = new PointText({
        name: 'startText',
        content: "What's in your mind?",
        point: view.center,
        justification: 'center',
        fontSize: 24,
        fillColor: 'white'
    });
    return startText;
}