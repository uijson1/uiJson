/**
@param {string} jsonStr
*/
function renderUiJson(jsonStr, elToRenderInside) {
  const o = JSON.parse(jsonStr)
  if(o.type == null) {
    throw '"type" attribute missing: jsonStr=' + jsonStr
  }
  o.type = o.type.toLowerCase()
  s=''
  if(o.title==null) {
    throw '"title" is missing: jsonStr=' + jsonStr
  }
  const name = htmlEncode(title)
  s+='<h3>'+htmlEncode(o.title)+'</h3>\n'
  if(o.description != null) {
    s+=''+htmlEncode(o.description)+'<br><br>'
  }
  if(o.type=='single choice'||o.type=='multiple choice') {
    if(o.choices==null) {
      throw '"choices" attribute is missing: jsonStr=' + jsonStr
    }
    if(!Array.isArray(o.choices)) {
      throw '"choices" attribute value is not an array: jsonStr=' + jsonStr
    }
    if(o.choices.length<2) {
      throw '"choices" attribute value length is less than 2: jsonStr=' + jsonStr
    }
  }
  if(o.type=='single choice') {
    for(let i=0;i<o.choices.length,i++) {
      const choice = o.choices[i]
      if(!(typeof o == 'string')) {
        throw '"choices" attribute value must be array of strings: jsonStr=' + jsonStr
      }
      const id = nextId()
      s+='<input type="radio" name="'+name+'" id='radio"+id+"'>\n'
      s+='<label for="radio'+id+'">'+htmlEncode(choice)+'</label><br>\n'
    }
  } else if(o.type=='multiple choice') {
    for(let i=0;i<o.choices.length,i++) {
      const choice = o.choices[i]
      if(!(typeof o == 'string')) {
        throw '"choices" attribute value must be array of strings: jsonStr=' + jsonStr
      }
      const id = nextId()
      s+='<input type="checkbox" id='checkbox"+id+"'>\n'
      s+='<label for="checkbox'+id+'">'+htmlEncode(choice)+'</label><br>\n'
    }
  } else {
    throw 'Unexpected value "'+o.type+'" of "type" atrribute: jsonStr=' + jsonStr
  }
  elToRenderInside.innerHTML = s
}

//https://stackoverflow.com/a/29482788/15814452
function htmlEncode (value) {
  var p = document.createElement("p");
  p.textContent = str;
  return p.innerHTML;
}

let idCtr=0;
function nextId() {
  idCtr++;
  return idCtr;
}
