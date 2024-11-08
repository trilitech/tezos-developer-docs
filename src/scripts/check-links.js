const checkLinks = require('check-links')

// results['https://foo.com'] // { status: 'alive', statusCode: 200 }
// results['https://404.com'] // { status: 'dead', statusCode: 404 }

// example using a custom concurrency, timeout, and retry count
// const results2 = await checkLinks(['https://foo.com', 'https://404.com'], {
//   concurrency: 1,
//   timeout: { request: 30000 },
//   retry: { limit: 1 }
// })

async function check() {

  const results = await checkLinks(['https://docs.tezos.com'])

  console.log(JSON.stringify(results, null, 2))
}

check()