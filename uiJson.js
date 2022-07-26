/**
 * @param {string} jsonStr
 * @param {any} elToRenderInside
 */
export async function renderUiJson(jsonStr, elToRenderInside) {
  const o = JSON.parse(jsonStr);
  await renderUi(o, elToRenderInside);
}

/**
 * @param {object} o
 * @param {HTMLElement} elToRenderInside
 */
async function renderUi(o, elToRenderInside) {
  assert(elToRenderInside != null);
  assert(o != null);
  if (o.type == null) {
    throw new Error('"type" attribute missing: jsonStr=' + str(o));
  }
  o.type = o.type.toLowerCase();
  // every component must have a title. It can also have an optional description.
  if (o.title == null) {
    throw new Error(
      'Attribute "title" is missing for the following component: ' + str(o)
    );
  }
  const name = htmlEncode(o.title);
  if (o.id == null) {
    o.id = nextId();
  }

  appendHtml(
    '<div id="' + o.id + '" style="border-style:inset;padding:5px"></div>',
    elToRenderInside
  );

  const divEl = await waitForEl(o.id);
  if (o.type === "button") {
    appendHtml(
      /*html*/ `<button type="button" id="${o.id}">${name}</button>`,
      divEl
    );
  } else {
    appendHtml(inTag(name, "h3"), divEl);
  }
  if (o.description != null) {
    appendHtml(htmlEncode(o.description) + "<br><br>", divEl);
  }
  if (o.type === "button") {
    return;
  }
  if (o.type == "single choice" || o.type == "multiple choice") {
    if (o.choices == null) {
      throw new Error('"choices" attribute is missing: jsonStr=' + str(o));
    }
    if (!Array.isArray(o.choices)) {
      throw new Error(
        '"choices" attribute value is not an array: jsonStr=' + str(o)
      );
    }
    if (o.choices.length < 2) {
      throw new Error(
        '"choices" attribute value length is less than 2: jsonStr=' + str(o)
      );
    }
  }
  if (o.type == "single choice") {
    for (const element of o.choices) {
      const choice = element;
      if (typeof choice != "string") {
        throw new Error(
          '"choices" attribute value must be array of strings: jsonStr=' +
            str(o)
        );
      }
      const id = nextId();
      appendHtml(
        '<input type="radio" name="' + name + '" id="radio' + id + '">',
        divEl
      );
      appendHtml(
        '<label for="radio' + id + '">' + htmlEncode(choice) + "</label><br>",
        divEl
      );
    }
  } else if (o.type == "multiple choice") {
    for (const element of o.choices) {
      const choice = element;
      if (typeof choice != "string") {
        throw new Error(
          '"choices" attribute value must be array of strings: jsonStr=' +
            str(o)
        );
      }
      const id = nextId();
      appendHtml('<input type="checkbox" id="checkbox' + id + '">', divEl);
      appendHtml(
        '<label for="checkbox' +
          id +
          '">' +
          htmlEncode(choice) +
          "</label><br>",
        divEl
      );
    }
  } else if (o.type == "components on separate lines") {
    let ctr = 0;
    for (const component of o.components) {
      ctr++;
      renderUi(component, divEl);
      if (ctr != o.components.length) {
        appendHtml("<hr>", divEl);
      }
    }
  } else {
    throw new Error(
      'Unexpected value "' +
        o.type +
        '" of "type" attribute: o=' +
        JSON.stringify(o)
    );
  }
}

//https://stackoverflow.com/a/29482788/15814452
/**
 * @param {string} value
 */
function htmlEncode(value) {
  var p = document.createElement("p");
  p.textContent = value;
  return p.innerHTML;
}

let idCtr = 0;
function nextId() {
  idCtr++;
  return idCtr + "";
}

const el = (/** @type {string} */ id) => document.getElementById(id);

/**
 * @param {number} ms
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} id
 */
async function waitForEl(id) {
  while (true) {
    let output = el(id);
    if (output != null) {
      return output;
    }
    await sleep(500);
  }
}

const inTag = (/** @type {string} */ html, /** @type {string} */ tag) =>
  "<" + tag + ">" + html + "</" + tag + ">";

const appendHtml = (
  /** @type {string} */ html,
  /** @type {HTMLElement} */ elToRenderInside
) => {
  assertNoneAreNull(html, elToRenderInside);
  elToRenderInside.insertAdjacentHTML("beforeend", html + "\n");
};

const str = (/** @type {any} */ o) => JSON.stringify(o);

const assert = (
  /** @type {boolean} */ condition,
  /** @type {(() => string ) | undefined} */ messageFn
) => {
  if (!condition)
    throw new Error("ASSERTION FAILED" + (messageFn ? ": " + messageFn() : ""));
};

function assertNoneAreNull() {
  let idx = -1;
  for (const obj of arguments) {
    idx++;
    assert(obj != null, () => "arg idx = " + idx);
  }
}
