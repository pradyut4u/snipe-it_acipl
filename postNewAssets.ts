const newAssets = [
  { serial: '2227090001684' },
  { serial: '2227090001679' },
  { serial: '22264U8000314' },
  { serial: '2227090001678' },
  { serial: '2227090001681' }
];

async function main() {
  const res = await fetch('http://localhost:3001/api/assets');
  const assets = await res.json();
  const currentCount = assets.length;
  
  for (let i = 0; i < newAssets.length; i++) {
    const num = currentCount + i + 1;
    const tag = `AST-${String(num).padStart(5, '0')}`;
    const assetData = {
      assetTag: tag,
      name: 'Switch SG1016D',
      model: 'Tp-Link',
      category: 'Switch',
      serial: newAssets[i].serial,
      status: 'Ready to Deploy',
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchaseCost: 0,
      updatedAt: new Date().toISOString()
    };

    const postRes = await fetch('http://localhost:3001/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assetData)
    });
    
    if (postRes.ok) {
      console.log(`Inserted ${tag} - ${newAssets[i].serial}`);
    } else {
      console.error(`Failed to insert ${newAssets[i].serial}`, await postRes.text());
    }
  }
}

main().catch(console.error);

export {};
