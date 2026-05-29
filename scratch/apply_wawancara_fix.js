import fs from 'fs';

const filePath = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\src\\CbtAdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newline = content.includes('\r\n') ? '\r\n' : '\n';

// 1. Update renderProsesKelulusan
const prosesKelulusanStartIdx = content.indexOf('const renderProsesKelulusan = () => {');
if (prosesKelulusanStartIdx === -1) {
  console.error('Could not find renderProsesKelulusan');
  process.exit(1);
}

let subContent1 = content.slice(prosesKelulusanStartIdx);
const searchStr1 = `setWawancaraCurrentPage(1);`;
const idx1 = subContent1.indexOf(searchStr1);
if (idx1 === -1) {
  console.error('Could not find setWawancaraCurrentPage(1) in renderProsesKelulusan');
} else {
  // Replace only the first occurrence after the function start
  subContent1 = subContent1.slice(0, idx1) + 
    `setWawancaraCurrentPage(1);${newline}                  setHasSearchedWawancara(false);` + 
    subContent1.slice(idx1 + searchStr1.length);
  content = content.slice(0, prosesKelulusanStartIdx) + subContent1;
  console.log('Successfully updated renderProsesKelulusan!');
}

// 2. Update renderRekapKelulusan
const rekapKelulusanStartIdx = content.indexOf('const renderRekapKelulusan = () => {');
if (rekapKelulusanStartIdx === -1) {
  console.error('Could not find renderRekapKelulusan');
  process.exit(1);
}

let subContent2 = content.slice(rekapKelulusanStartIdx);

// First target: setWawancaraCurrentPage(1)
const idx2 = subContent2.indexOf(searchStr1);
if (idx2 === -1) {
  console.error('Could not find setWawancaraCurrentPage(1) in renderRekapKelulusan');
} else {
  subContent2 = subContent2.slice(0, idx2) + 
    `setWawancaraCurrentPage(1);${newline}                  setHasSearchedWawancara(false);` + 
    subContent2.slice(idx2 + searchStr1.length);
}

// Second target: if (data.status === 'success') setWawancaraData(data.data);
const searchStr2 = `if (data.status === 'success') setWawancaraData(data.data);`;
const idx3 = subContent2.indexOf(searchStr2);
if (idx3 === -1) {
  console.error('Could not find setWawancaraData success handler in renderRekapKelulusan');
} else {
  subContent2 = subContent2.slice(0, idx3) + 
    `if (data.status === 'success') {${newline}                          setWawancaraData(data.data);${newline}                        } else {${newline}                          setWawancaraData([]);${newline}                        }${newline}                        setHasSearchedWawancara(true);` + 
    subContent2.slice(idx3 + searchStr2.length);
}

// Third target: catch block
const searchStr3 = `.catch(() => setWawancaraLoading(false));`;
const idx4 = subContent2.indexOf(searchStr3);
if (idx4 === -1) {
  console.error('Could not find catch block in renderRekapKelulusan');
} else {
  subContent2 = subContent2.slice(0, idx4) + 
    `.catch(() => {${newline}                        setWawancaraLoading(false);${newline}                        setHasSearchedWawancara(true);${newline}                      });` + 
    subContent2.slice(idx4 + searchStr3.length);
}

content = content.slice(0, rekapKelulusanStartIdx) + subContent2;
console.log('Successfully updated renderRekapKelulusan!');

fs.writeFileSync(filePath, content, 'utf8');
console.log('File successfully saved!');
