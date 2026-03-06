// Test the poe.ninja API endpoint
async function testApi() {
  console.log('Testing poe.ninja API...');

  try {
    const res = await fetch('https://poe.ninja/api/data/currencyoverview?league=Mercenaries&type=Currency');
    console.log('Status:', res.status);
    console.log('Redirected:', res.redirected);
    console.log('URL:', res.url);

    if (!res.ok) {
      console.log('Response not OK');
      const text = await res.text();
      console.log('Response:', text.substring(0, 200));
      return;
    }

    const data = await res.json();
    console.log('Lines count:', data.lines?.length || 0);
    console.log('First item:', data.lines?.[0]?.currencyTypeName || 'N/A');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApi();
