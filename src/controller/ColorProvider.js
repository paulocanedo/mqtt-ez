class ColorChooser {
  static COLORS_AVAILABLE = [
    "#000000",
    "#40E0D0",
    "#FFA07A",
    "#800080",
    "#708090",
    "#DDA0DD",
    "#FF8C00",
    "#8FBC8F",
    "#0000CD",
    "#556B2F",
    "#00008B",
    "#696969",
    "#4B0082",
    "#FFE4B5",
    "#DAA520",
    "#A0522D",
    "#006400",
    "#FF4500"
  ];

  control = new Map();

  leastUsed(context) {
    const colorsContext = ColorChooser.COLORS_AVAILABLE.map(color => ({
      context: context,
      color: color
    }));
    const min = this.minOccurrences(context);

    return colorsContext.filter(contextColor => {
      let count =
        this.control.get(contextColor.context + contextColor.color) || 0;
      return count === min;
    });
  }

  minOccurrences(context = "") {
    const colors = ColorChooser.COLORS_AVAILABLE;
    let min = colors.length === 0 ? 0 : Number.MAX_SAFE_INTEGER;
    for (let color of colors) {
      let contextColor = context + color;
      let count = this.control.get(contextColor);
      if (count === undefined) {
        count = 0;
        this.control.set(contextColor, count);
      }

      if (count < min) min = count;
    }
    return min;
  }

  selectColor(context = "", color) {
    let count = this.control.get(context + color) || 0;
    this.control.set(context + color, ++count);
  }

  nextRandomColor(context = "") {
    let leastUsed = this.leastUsed(context);
    let index = Math.floor(Math.random() * leastUsed.length);

    let color = leastUsed[index].color;
    this.selectColor(context, color);
    return color;
  }
}

const colorChooser = new ColorChooser();

class ColorProvider {
  static nextRandomColor(context) {
    return colorChooser.nextRandomColor(context);
  }
}

export default ColorProvider;
