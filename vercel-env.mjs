const token = 'E3Wn4ZcJWrr9FvgEKCyYPzBh6VSo';
const projectName = 'goturkey2k2x'; // From the URL

const envs = [
  { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', value: 'AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0' },
  { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', value: 'goturkey2k2x.firebaseapp.com' },
  { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', value: 'goturkey2k2x' },
  { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', value: 'goturkey2k2x.firebasestorage.app' },
  { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', value: '87738448924' },
  { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', value: '1:87738448924:web:b2e0e57401032da0e0b3d9' },
  { key: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', value: 'G-62Y9GH2EKX' },
];

async function updateVercel() {
  console.log('Fetching project details...');
  
  // Try with 'goturkey2k2x-jlzr' if the first one fails
  let projectId = projectName;
  
  for (const pName of [projectName, 'goturkey2k2x-jlzr']) {
    const res = await fetch(`https://api.vercel.com/v9/projects/${pName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      projectId = data.id;
      console.log(`Found Project ID: ${projectId} (Name: ${pName})`);
      break;
    }
  }

  if (!projectId) {
    console.error('Failed to find Vercel project with provided token.');
    process.exit(1);
  }

  console.log('Pushing environment variables...');
  for (const env of envs) {
    const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: env.key,
        value: env.value,
        type: 'plain',
        target: ['production', 'preview', 'development']
      })
    });
    
    if (res.ok) {
      console.log(`✅ Added ${env.key}`);
    } else {
      const err = await res.json();
      if (err.error && err.error.code === 'ENV_ALREADY_EXISTS') {
        console.log(`⚠️  ${env.key} already exists (Skipping)`);
      } else {
        console.error(`❌ Failed to add ${env.key}:`, err);
      }
    }
  }
  
  console.log('\nTriggering a new deployment...');
  const deployRes = await fetch(`https://api.vercel.com/v13/deployments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'goturkey2k2x',
      target: 'production',
      gitSource: {
        type: 'github',
        repoId: 'MTalhaArif/goturkey2k2x',
        ref: 'main'
      }
    })
  });
  
  if (deployRes.ok) {
    const deployData = await deployRes.json();
    console.log(`🚀 Deployment triggered! URL: ${deployData.url}`);
  } else {
    // If we can't trigger it this way (requires more github integration details sometimes), 
    // it's fine, we added the env vars.
    console.log(`Deployment trigger returned status ${deployRes.status}. Vercel will auto-deploy on next push or manually from dashboard.`);
  }

  console.log('Done!');
}

updateVercel();
