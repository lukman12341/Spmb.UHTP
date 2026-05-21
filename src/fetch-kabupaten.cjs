const fs = require('fs');
const https = require('https');

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
};

async function main() {
  try {
    const provinces = await fetchJson('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
    let allKabupaten = [];
    
    for (const prov of provinces) {
      const regencies = await fetchJson(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`);
      for (const reg of regencies) {
        allKabupaten.push(reg.name);
      }
    }
    
    allKabupaten.sort();
    fs.writeFileSync('kabupaten.json', JSON.stringify(allKabupaten, null, 2));
    console.log(`Saved ${allKabupaten.length} kabupaten`);
  } catch (error) {
    console.error(error);
  }
}

main();
