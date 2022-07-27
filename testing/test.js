console.log('hi--------------------------------------------------------------------------------------------------------------------------');

const { Buffer } = require('buffer');
const { createWriteStream  } = require('fs');


function canWeBuildIt(ctor) {
    let chain = ctor.split('.');
    if(chain.reduce((previous, current) => previous?.[current], globalThis)) {
        console.log(`yes we can`);
        console.log(typeof createWriteStream);
    }
    else {
        console.log(`no, ${ctor} does not exist in this reality`);
    }
}
canWeBuildIt('Buffer.alloc');
canWeBuildIt('createWriteStream');
//let codes = Array.from('$*+?!|^[]{}()/\\');
//codes.forEach(c => console.log(`char: ${c}, code: ${c.codePointAt(0)}`));
/*[33, 36, 40, 41, 42, 43, 47, 63, 91, 92, 93, 94,123, 124, 125]
        // qlist format 
// <interval: number> <tgtName: receive>

let person = 'Mike';
let age = 28;

function myTag(interval, personExp, ageExp) {
  let str0 = strings[0]; // "That "
  let str1 = strings[1]; // " is a "
  let str2 = strings[2]; // "."
  let formattedMsg = `;`
  let ageStr;
  if (ageExp > 99){
    ageStr = 'centenarian';
  } else {
    ageStr = 'youngster';
  }

  // We can even return a string built using a template literal
  return `${str0}${personExp}${str1}${ageStr} ;`;
}

let output = myTag`That ${ person } is a ${ age }.`;

console.log(output);
*/













console.log('bye--------------------------------------------------------------------------------------------------------------------------');

