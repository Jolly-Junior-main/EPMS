const fs = require('fs');
let content = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');

if (!content.includes('where,')) {
  content = content.replace('query,', 'query,\n  where,');
}

content = content.replace('export function subscribeToPMSCollections(callbacks: {', 'export function subscribeToPMSCollections(organizationId: string | null | undefined, callbacks: {');

const collections = ['TENANTS', 'UNITS', 'INVOICES', 'PAYMENTS', 'SMS_LOGS', 'AUDIT_LOGS'];
collections.forEach(coll => {
  const oldQ = `const q = query(collection(db, COLLECTIONS.${coll}));`;
  const newQ = `let q = query(collection(db, COLLECTIONS.${coll}));\n      if (organizationId && organizationId !== 'platform_core') {\n        q = query(collection(db, COLLECTIONS.${coll}), where('organizationId', '==', organizationId));\n      }`;
  content = content.replace(oldQ, newQ);
});

fs.writeFileSync('src/lib/firestoreService.ts', content);
console.log('firestoreService patched');
