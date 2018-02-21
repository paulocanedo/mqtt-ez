const table_util = (() => {
  let createColumnColor = (args = {}) => {
    let column = document.createElement('td');
    let color_link = document.createElement('a');
    let colorEl = document.createElement('i');

    color_link.title = "Choose a color";
    colorEl.classList.add('fas', 'fa-square', 'fa-lg');

    // color_link.appendChild(colorEl);
    // column.appendChild(color_link);
    column.appendChild(colorEl);
    colorEl.style.color = args.color;

    return {
      setColor(color) {
        colorEl.style.color = color;
      },
      root() {
        return column;
      }
    };
  };
  let createColumnText = (args = {}) => {
    let column = document.createElement('td');
    let textNode = document.createTextNode(args.text || '');
    column.className = args.alignment || '';
    column.appendChild(textNode);

    return {
      setText(text) {
        textNode.textContent = text;
      },
      setAlignment(alignment) {
        column.className = alignment;
      },
      root() {
        return column;
      }
    };
  };

  let createColumnControls = (args = {}) => {
    let column = document.createElement('td');
    column.className = 'has-text-right';

    let createButton = () => {
      let a = document.createElement('a');
      a.href = '#';
      a.className = 'button';

      return a;
    };
    let createIcon = (icon_code) => {
      let icon = document.createElement('i');
      icon.classList.add('fas', icon_code);

      return icon;
    };
    let wrapIcon = (icon) => {
      let wrapper = document.createElement('span');
      wrapper.className = 'icon';
      wrapper.appendChild(icon);
      return wrapper;
    };

    let editButton = createButton();
    let editIcon = createIcon('fa-edit');

    let deleteButton = createButton();
    let deleteIcon = createIcon('fa-trash');

    editButton.appendChild(wrapIcon(editIcon));
    deleteButton.appendChild(wrapIcon(deleteIcon));

    column.appendChild(editButton);
    column.appendChild(document.createTextNode(' '));
    column.appendChild(deleteButton);

    return {
      setAlignment(alignment) {
        column.className = alignment;
      },
      root() {
        return column;
      }
    };
  };
  return {
    COLUMN_COLOR: 0,
    COLUMN_TEXT: 1,
    COLUMN_CONTROLS: 2,
    createColumn(type, args) {
      switch (type) {
        case table_util.COLUMN_COLOR:
          return createColumnColor(args);
          break;
        case table_util.COLUMN_TEXT:
          return createColumnText(args);
          break;
        case table_util.COLUMN_CONTROLS:
          return createColumnControls(args);
          break;
        default:

      }
    }
  };
})();

module.exports = table_util;
