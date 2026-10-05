const serials = [
  '2237122001618',
  '224C6T9002660',
  '22484J8001248',
  '224C6T9002681',
  '2253029000924',
  '2247262002922',
  '22434Y5001620',
  '22361A8002092',
  '2223241001201',
  '2247262002570',
  '22484J8001010',
  '2221117001438',
  '22361A8001570',
  '22361A8002100',
  '22361A8002152',
  '22361A8003013',
  '2221117001518',
  '2223241001187',
  '2247262002962',
  '22484J8000789',
  '22484J8000286',
  '2247262002913',
  '2247262002518',
  '22484J8001281',
  '22484J8000987',
  '(Air)J6682TLVBZY',
  '2247262002504'
];

async function main() {
  // Get current assets to calculate next assetTag
  const res = await fetch('http://localhost:3001/api/assets');
  const assets = await res.json();
  const currentCount = assets.length;
  
  for (let i = 0; i < serials.length; i++) {
    const num = currentCount + i + 1;
    const tag = `AST-${String(num).padStart(5, '0')}`;
    const assetData = {
      assetTag: tag,
      name: 'POE Switch Manage',
      model: 'Tp-Link',
      category: 'Managed PoE Switch',
      serial: serials[i],
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
      console.log(`Inserted ${tag} - ${serials[i]}`);
    } else {
      console.error(`Failed to insert ${serials[i]}`, await postRes.text());
    }
  }
}

main().catch(console.error);
