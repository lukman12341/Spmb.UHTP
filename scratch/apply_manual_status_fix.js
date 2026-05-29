import fs from 'fs';

const newline = '\n';

// 1. Update backend/app/Http/Controllers/BiodataController.php
const biodataControllerPath = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\backend\\app\\Http\\Controllers\\BiodataController.php';
let biodataContent = fs.readFileSync(biodataControllerPath, 'utf8');

const targetBioSearch = `            if ($status_cbt && in_array($status_cbt, $manualStatuses)) {
                $finalStatus = $status_cbt;
            } elseif ($isHealthFailed) {
                $finalStatus = 'Tidak Lulus';
            } elseif ($status_cbt === 'Lulus' && (!$hasKesehatan || in_array($status_kesehatan, ['Sehat', 'Lulus'])) && (!$hasil_wawancara || $hasil_wawancara === 'LULUS')) {
                // If it requires interview but hasil is null, it's still 'Proses'
                if (in_array(strtolower($r->program_studi), ['profesi ners', 's1 keperawatan', 's1 kebidanan', 'profesi bidan'])) {
                    $finalStatus = $hasil_wawancara === 'LULUS' ? 'Lulus' : 'Proses';
                } else {
                    $finalStatus = 'Lulus';
                }
            } elseif ($status_cbt === 'Tidak Lulus' || $hasil_wawancara === 'TIDAK LULUS') {
                $finalStatus = 'Tidak Lulus';
            }`;

const targetBioReplacement = `            $isManualApproval = ($r->examResult->keterangan ?? '') === 'Update Status Manual oleh Admin';
            if ($status_cbt && ($isManualApproval || in_array($status_cbt, $manualStatuses))) {
                $finalStatus = $status_cbt;
            } else {
                $finalStatus = 'Proses';
            }`;

// Normalize newlines for match
const normalizedSearchBio = targetBioSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexBio = new RegExp(normalizedSearchBio);

if (regexBio.test(biodataContent)) {
  biodataContent = biodataContent.replace(regexBio, targetBioReplacement);
  fs.writeFileSync(biodataControllerPath, biodataContent, 'utf8');
  console.log('Successfully updated BiodataController.php!');
} else {
  console.error('Could not find targetBioSearch in BiodataController.php');
}


// 2. Update backend/app/Http/Controllers/AdminKesehatanController.php
const kesehatanControllerPath = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\backend\\app\\Http\\Controllers\\AdminKesehatanController.php';
let kesehatanContent = fs.readFileSync(kesehatanControllerPath, 'utf8');

const targetKesSearch = `            if ($status_cbt && in_array($status_cbt, $manualStatuses)) {
                $finalStatus = $status_cbt;
            } elseif ($isHealthFailed) {
                $finalStatus = 'Tidak Lulus';
            } elseif ($status_cbt === 'Lulus' && (!$hasKesehatan || in_array($status_kesehatan, ['Sehat', 'Lulus'])) && (!$hasil_wawancara || $hasil_wawancara === 'LULUS')) {
                // If it requires interview but hasil is null, it's still 'Proses'
                if (in_array(strtolower($reg->program_studi), ['profesi ners', 's1 keperawatan', 's1 kebidanan', 'profesi bidan'])) {
                    $finalStatus = $hasil_wawancara === 'LULUS' ? 'Lulus' : 'Proses';
                } else {
                    $finalStatus = 'Lulus';
                }
            } elseif ($status_cbt === 'Tidak Lulus' || $hasil_wawancara === 'TIDAK LULUS') {
                $finalStatus = 'Tidak Lulus';
            }`;

const targetKesReplacement = `            $isManualApproval = ($reg->examResult->keterangan ?? '') === 'Update Status Manual oleh Admin';
            if ($status_cbt && ($isManualApproval || in_array($status_cbt, $manualStatuses))) {
                $finalStatus = $status_cbt;
            } else {
                $finalStatus = 'Proses';
            }`;

const normalizedSearchKes = targetKesSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexKes = new RegExp(normalizedSearchKes);

if (regexKes.test(kesehatanContent)) {
  kesehatanContent = kesehatanContent.replace(regexKes, targetKesReplacement);
  fs.writeFileSync(kesehatanControllerPath, kesehatanContent, 'utf8');
  console.log('Successfully updated AdminKesehatanController.php!');
} else {
  console.error('Could not find targetKesSearch in AdminKesehatanController.php');
}


// 3. Update src/CbtAdminDashboard.tsx with frontend helper functions and updated rendering tables
const cbtAdminPath = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\src\\CbtAdminDashboard.tsx';
let cbtAdminContent = fs.readFileSync(cbtAdminPath, 'utf8');

// We will inject the checkHasKesehatan and checkHasWawancara helpers at the top of CbtAdminDashboard component,
// or we can just define them inside the component. Let's see: we can define them as standalone functions at the top of the file, or inside the CbtAdminDashboard component.
// Let's add them right before the first return in CbtAdminDashboard.
const helperInjectStr = `  const checkHasKesehatan = (prodi: string): boolean => {
    if (!prodi) return false;
    const lower = prodi.toLowerCase();
    const isS1Kesmas = lower.includes('s1') && (lower.includes('kesmas') || lower.includes('kesehatan masyarakat') || lower.includes('ikm'));
    const isS1Bidan = lower.includes('s1') && (lower.includes('bidan') || lower.includes('kebidanan'));
    const isS1Keperawatan = lower.includes('s1') && (lower.includes('keperawatan') || lower.includes('kperwatan') || lower.includes('kpr'));
    const isD3Rmik = lower.includes('d3') && (lower.includes('rmik') || lower.includes('rekam medis') || lower.includes('perekam medis') || lower.includes('mik'));
    const isD4Rmik = lower.includes('d4') && (lower.includes('rmik') || lower.includes('mik') || lower.includes('rekam medis') || lower.includes('perekam medis') || lower.includes('manajemen informasi kesehatan'));
    const isProfesiNers = lower.includes('profesi') && lower.includes('ners');
    const isProfesiBidan = lower.includes('profesi') && (lower.includes('bidan') || lower.includes('kebidanan'));
    return isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik || isProfesiNers || isProfesiBidan;
  };

  const checkHasWawancara = (prodi: string): boolean => {
    if (!prodi) return false;
    const lower = prodi.toLowerCase();
    const allowedWawancaraProdi = [
      's2 kesmas',
      's1 keperawatan',
      'profesi ners',
      's1 kebidanan',
      'profesi bidan'
    ];
    return allowedWawancaraProdi.some(wProdi => lower.includes(wProdi));
  };`;

// Let's inject these helpers right after 'const CbtAdminDashboard: React.FC<CbtAdminDashboardProps> = ({ onLogout, adminName = "Administrator" }) => {'
const targetInjectPoint = 'const CbtAdminDashboard: React.FC<CbtAdminDashboardProps> = ({ onLogout, adminName = "Administrator" }) => {';
if (cbtAdminContent.includes(targetInjectPoint)) {
  cbtAdminContent = cbtAdminContent.replace(targetInjectPoint, `${targetInjectPoint}\n${helperInjectStr}`);
  console.log('Successfully injected checkHasKesehatan/checkHasWawancara helpers in CbtAdminDashboard.tsx!');
} else {
  console.error('Could not find injection point in CbtAdminDashboard.tsx');
  process.exit(1);
}

// 4. Update renderWawancaraTable Kesehatan column cell
// Target 1: Kesehatan column cell in renderWawancaraTable
// Search for lines around 3349:
const targetWawancaraKesSearch = `                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {isS2Kesmas ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">N/A</span>
                        ) : mhs.status_kesehatan ? (`;

const targetWawancaraKesReplacement = `                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {!checkHasKesehatan(mhs.pilihan || wawancaraFilterProdi) ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">PRODI INI TIDAK ADA TES KESEHATAN</span>
                        ) : mhs.status_kesehatan ? (`;

const normalizedWawancaraKes = targetWawancaraKesSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexWawancaraKes = new RegExp(normalizedWawancaraKes);

if (regexWawancaraKes.test(cbtAdminContent)) {
  cbtAdminContent = cbtAdminContent.replace(regexWawancaraKes, targetWawancaraKesReplacement);
  console.log('Successfully updated Wawancara table Kesehatan cell!');
} else {
  console.error('Could not find targetWawancaraKesSearch in CbtAdminDashboard.tsx');
}

// Target 2: Wawancara column cell in renderWawancaraTable
const targetWawancaraWawSearch = `                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {isS2Kesmas ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">N/A</span>
                        ) : (mhs.status_kesehatan && !['Sehat', 'Lulus', 'Menunggu'].includes(mhs.status_kesehatan)) ? (`;

const targetWawancaraWawReplacement = `                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {!checkHasWawancara(mhs.pilihan || wawancaraFilterProdi) ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">PRODI INI TIDAK ADA TES WAWANCARA</span>
                        ) : (mhs.status_kesehatan && !['Sehat', 'Lulus', 'Menunggu'].includes(mhs.status_kesehatan)) ? (`;

const normalizedWawancaraWaw = targetWawancaraWawSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexWawancaraWaw = new RegExp(normalizedWawancaraWaw);

if (regexWawancaraWaw.test(cbtAdminContent)) {
  cbtAdminContent = cbtAdminContent.replace(regexWawancaraWaw, targetWawancaraWawReplacement);
  console.log('Successfully updated Wawancara table Wawancara cell!');
} else {
  console.error('Could not find targetWawancaraWawSearch in CbtAdminDashboard.tsx');
}


// Target 3: Kesehatan column cell in renderKelulusanTable
const targetKelulusanKesSearch = `                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {mhs.status_kesehatan ? (
                        <span className={mhs.status_kesehatan === 'Sehat' || mhs.status_kesehatan === 'Lulus' ? 'text-emerald-500' : mhs.status_kesehatan === 'Menunggu' ? 'text-amber-500' : 'text-rose-500'}>
                          {mhs.status_kesehatan === 'Menunggu' ? 'MENUNGGU KONFIRMASI' : mhs.status_kesehatan}
                        </span>
                      ) : (
                        <span className="text-rose-500">BELUM TES</span>
                      )}`;

const targetKelulusanKesReplacement = `                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {!checkHasKesehatan(mhs.pilihan || wawancaraFilterGelombang) ? (
                        <span className="text-slate-400 italic">PRODI INI TIDAK ADA TES KESEHATAN</span>
                      ) : mhs.status_kesehatan ? (
                        <span className={mhs.status_kesehatan === 'Sehat' || mhs.status_kesehatan === 'Lulus' ? 'text-emerald-500' : mhs.status_kesehatan === 'Menunggu' ? 'text-amber-500' : 'text-rose-500'}>
                          {mhs.status_kesehatan === 'Menunggu' ? 'MENUNGGU KONFIRMASI' : mhs.status_kesehatan}
                        </span>
                      ) : (
                        <span className="text-rose-500">BELUM TES</span>
                      )}`;

const normalizedKelulusanKes = targetKelulusanKesSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexKelulusanKes = new RegExp(normalizedKelulusanKes);

if (regexKelulusanKes.test(cbtAdminContent)) {
  cbtAdminContent = cbtAdminContent.replace(regexKelulusanKes, targetKelulusanKesReplacement);
  console.log('Successfully updated Kelulusan table Kesehatan cell!');
} else {
  console.error('Could not find targetKelulusanKesSearch in CbtAdminDashboard.tsx');
}


// Target 4: Wawancara column cell in renderKelulusanTable
const targetKelulusanWawSearch = `                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {mhs.hasil_wawancara === 'BELUM UJIAN' ? (
                        <span className="text-rose-500">BELUM WAWANCARA</span>
                      ) : mhs.hasil_wawancara ? (
                        <span className={mhs.hasil_wawancara === 'LULUS' ? 'text-emerald-500' : 'text-indigo-500'}>
                          {mhs.hasil_wawancara}
                        </span>
                      ) : (
                        <span className="text-indigo-500">PRODI INI TIDAK ADA TES WAWANCARA</span>
                      )}`;

const targetKelulusanWawReplacement = `                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {!checkHasWawancara(mhs.pilihan || wawancaraFilterGelombang) ? (
                        <span className="text-slate-400 italic">PRODI INI TIDAK ADA TES WAWANCARA</span>
                      ) : mhs.hasil_wawancara === 'BELUM UJIAN' ? (
                        <span className="text-rose-500">BELUM WAWANCARA</span>
                      ) : mhs.hasil_wawancara ? (
                        <span className={mhs.hasil_wawancara === 'LULUS' ? 'text-emerald-500' : 'text-indigo-500'}>
                          {mhs.hasil_wawancara}
                        </span>
                      ) : (
                        <span className="text-rose-500">BELUM WAWANCARA</span>
                      )}`;

const normalizedKelulusanWaw = targetKelulusanWawSearch.replace(/\r?\n/g, '\\r?\\n').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\s+/g, '\\s+');
const regexKelulusanWaw = new RegExp(normalizedKelulusanWaw);

if (regexKelulusanWaw.test(cbtAdminContent)) {
  cbtAdminContent = cbtAdminContent.replace(regexKelulusanWaw, targetKelulusanWawReplacement);
  console.log('Successfully updated Kelulusan table Wawancara cell!');
} else {
  console.error('Could not find targetKelulusanWawSearch in CbtAdminDashboard.tsx');
}

fs.writeFileSync(cbtAdminPath, cbtAdminContent, 'utf8');
console.log('CbtAdminDashboard.tsx successfully saved!');
