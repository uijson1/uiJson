/**
@param {string} jsonStr
*/
function renderUiJson(jsonStr, elToRenderInside) {
  const o = JSON.parse(jsonStr);
  if (o.type == null) {
    throw new Error('"type" attribute missing: jsonStr=' + jsonStr);
  }
  o.type = o.type.toLowerCase();
  let s = "";
  if (o.title == null) {
    throw new Error('"title" is missing: jsonStr=' + jsonStr);
  }
  const name = htmlEncode(o.title);
  s += "<h3>" + htmlEncode(o.title) + "</h3>\n";
  if (o.description != null) {
    s += "" + htmlEncode(o.description) + "<br><br>";
  }
  if (o.type == "single choice" || o.type == "multiple choice") {
    if (o.choices == null) {
      throw new Error('"choices" attribute is missing: jsonStr=' + jsonStr);
    }
    if (!Array.isArray(o.choices)) {
      throw new Error(
        '"choices" attribute value is not an array: jsonStr=' + jsonStr
      );
    }
    if (o.choices.length < 2) {
      throw new Error(
        '"choices" attribute value length is less than 2: jsonStr=' + jsonStr
      );
    }
  }
  if (o.type == "single choice") {
    for (const element of o.choices) {
      const choice = element;
      if (typeof choice != "string") {
        throw new Error(
          '"choices" attribute value must be array of strings: jsonStr=' +
            jsonStr
        );
      }
      const id = nextId();
      s += '<input type="radio" name="' + name + '" id="radio' + id + '">\n';
      s +=
        '<label for="radio' + id + '">' + htmlEncode(choice) + "</label><br>\n";
    }
  } else if (o.type == "multiple choice") {
    for (const element of o.choices) {
      const choice = element;
      if (typeof choice != "string") {
        throw new Error(
          '"choices" attribute value must be array of strings: jsonStr=' +
            jsonStr
        );
      }
      const id = nextId();
      s += '<input type="checkbox" id="checkbox' + id + '">\n';
      s +=
        '<label for="checkbox' +
        id +
        '">' +
        htmlEncode(choice) +
        "</label><br>\n";
    }
  } else {
    throw new Error(
      'Unexpected value "' +
        o.type +
        '" of "type" atrribute: jsonStr=' +
        jsonStr
    );
  }
  console.log("s=" + s);
  console.log('elToRenderInside==null=',elToRenderInside==null)
  console.log("innerHTML 1=" + elToRenderInside.innerHTML);
  elToRenderInside.innerHTML = s;
  console.log("innerHTML 2=" + elToRenderInside.innerHTML);
}

//https://stackoverflow.com/a/29482788/15814452
function htmlEncode(value) {
  var p = document.createElement("p");
  p.textContent = value;
  return p.innerHTML;
}

let idCtr = 0;
function nextId() {
  idCtr++;
  return idCtr;
}
