function defaultLayout(cards, cols, config) {
  function shortestCol() {
    // Find the shortest column or the first one less than min_height
    let i = 0;
    for(let j=0; j<cols.length; j++){
      if(cols[j].length < config.min_height)
        return j;
      if(cols[j].length < cols[i].length)
        i = j;
    }
    return i;
  }

  cards.forEach((c) => {
    if(!c) return; // Gap. Skip
    const col = cols[shortestCol()];
    col.appendChild(c);
    col.length += c.getCardSize ? c.getCardSize() : 1;
  });
}

function horizontalLayout(cards, cols, config) {
  let i = 0;
  cards.forEach((c) => {
    i += 1;
    if(!c) return; // Gap. Skip
    const col = cols[(i-1)%cols.length];
    col.appendChild(c);
    col.length += c.getCardSize ? c.getCardSize() : 1;
  })
}

function verticalLayout(cards, cols, config) {
  let i = 0;
  cards.forEach((c) => {
    if(!c) { // Gap. Skip to next column
      i += 1;
      return;
    }
    const col = cols[(i)%cols.length];
    col.appendChild(c);
    col.length += c.getCardSize ? c.getCardSize() : 1;
  })
}

export function buildLayout(cards, width, config) {

  const parseValue = (val) => {
    // Accepts e.g. `5` , `5px` or `50%`.
    if(typeof(val) === "string")
      if(val.endsWith("%"))
        return Math.floor(width*parseInt(val)/100);
    return parseInt(val)
  }

  let colnum = 0;
  if(typeof(config.column_width) === "object") {
    // If many widths are given, keep adding collumns as long as there is any
    // horizontal space left
    let calcWidth = width;
    while(calcWidth > 0) {
      // If there are not enough values, use the last one
      let w = config.column_width[colnum];
      if(w === undefined) w = config.column_width.slice(-1)[0];

      calcWidth -= parseValue(w);
      colnum += 1;
    }

    colnum = Math.max(colnum-1, 1);

  } else {
    colnum = Math.floor(width / parseValue(config.column_width));
  }
  colnum = Math.max(colnum, config.min_columns);
  colnum = Math.min(colnum, config.max_columns);
  colnum = Math.max(colnum,1);

  let cols = [];
  for (let i = 0; i < colnum; i++) {
    const newCol = document.createElement("div");
    newCol.classList.add("column");
    newCol.classList.add("cards");
    newCol.length = 0;
    cols.push(newCol);
  }

  switch(config.layout) {
    case 'horizontal':
      horizontalLayout(cards, cols, config);
      break;
    case 'vertical':
      verticalLayout(cards, cols, config);
      break;
    case 'auto':
    default:
      defaultLayout(cards, cols, config);
  }

  // Remove empty columns
  cols = cols.filter((c) => c.childElementCount > 0);

  return cols;
}
