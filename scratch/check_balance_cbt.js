
import fs from 'fs';

const content = fs.readFileSync('c:/Users/LENOVO/Documents/kerja praktik/spmb-landing/src/CbtAdminDashboard.tsx', 'utf8');

let openBraces = 0;
let openParens = 0;
let openJSX = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '(') openParens++;
    if (char === ')') openParens--;
    if (char === '<' && content[i+1] !== '/' && content[i+1] !== ' ' && content[i+1] !== '!') {
        let j = i + 1;
        while (j < content.length && content[j] !== '>') j++;
        if (content[j-1] !== '/') openJSX++;
    }
    if (char === '<' && content[i+1] === '/') {
        openJSX--;
    }
}

console.log({ openBraces, openParens, openJSX });
