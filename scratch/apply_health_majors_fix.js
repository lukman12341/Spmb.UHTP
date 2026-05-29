import fs from 'fs';

const newline = '\n';

// 1. Update src/CbtAdminDashboard.tsx
const adminDashboardPath = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\src\\CbtAdminDashboard.tsx';
let adminContent = fs.readFileSync(adminDashboardPath, 'utf8');

const searchStr1 = `      const isD4Rmik = pilihanLower.includes('d4') && (pilihanLower.includes('rmik') || pilihanLower.includes('mik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('manajemen informasi kesehatan'));`;
const replacementStr1 = `      const isD4Rmik = pilihanLower.includes('d4') && (pilihanLower.includes('rmik') || pilihanLower.includes('mik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('manajemen informasi kesehatan'));
      const isProfesiNers = pilihanLower.includes('profesi') && pilihanLower.includes('ners');
      const isProfesiBidan = pilihanLower.includes('profesi') && (pilihanLower.includes('bidan') || pilihanLower.includes('kebidanan'));`;

if (adminContent.includes(searchStr1)) {
  adminContent = adminContent.replace(searchStr1, replacementStr1);
  adminContent = adminContent.replace(
    `      const hasHealthTest = isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik;`,
    `      const hasHealthTest = isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik || isProfesiNers || isProfesiBidan;`
  );
  fs.writeFileSync(adminDashboardPath, adminContent, 'utf8');
  console.log('Successfully updated src/CbtAdminDashboard.tsx!');
} else {
  console.error('Could not find searchStr1 in src/CbtAdminDashboard.tsx');
}

// 2. Update src/AdminDashboard.tsx
const adminDashboard2Path = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\src\\AdminDashboard.tsx';
let admin2Content = fs.readFileSync(adminDashboard2Path, 'utf8');

const searchStr2 = `                        const isD4Rmik = pilihanLower.includes('d4') && (pilihanLower.includes('rmik') || pilihanLower.includes('mik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('manajemen informasi kesehatan'));`;
const replacementStr2 = `                        const isD4Rmik = pilihanLower.includes('d4') && (pilihanLower.includes('rmik') || pilihanLower.includes('mik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('manajemen informasi kesehatan'));
                        const isProfesiNers = pilihanLower.includes('profesi') && pilihanLower.includes('ners');
                        const isProfesiBidan = pilihanLower.includes('profesi') && (pilihanLower.includes('bidan') || pilihanLower.includes('kebidanan'));`;

if (admin2Content.includes(searchStr2)) {
  admin2Content = admin2Content.replace(searchStr2, replacementStr2);
  admin2Content = admin2Content.replace(
    `                        const hasHealthTest = isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik;`,
    `                        const hasHealthTest = isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik || isProfesiNers || isProfesiBidan;`
  );
  fs.writeFileSync(adminDashboard2Path, admin2Content, 'utf8');
  console.log('Successfully updated src/AdminDashboard.tsx!');
} else {
  console.error('Could not find searchStr2 in src/AdminDashboard.tsx');
}
