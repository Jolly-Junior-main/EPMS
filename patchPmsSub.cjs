const fs = require('fs');
let content = fs.readFileSync('src/context/PMSContext.tsx', 'utf8');

// Find the subscribeToPMSCollections call which currently starts with `{` and is passed as argument
const subRegex = /const unsubscribe = subscribeToPMSCollections\(\{/m;
if (subRegex.test(content)) {
  content = content.replace(subRegex, 'const unsubscribe = subscribeToPMSCollections(currentUser.organizationId, {');
  fs.writeFileSync('src/context/PMSContext.tsx', content);
  console.log('PMSContext patched for subscribeToPMSCollections!');
} else {
  console.log('subscribeToPMSCollections call not found.');
}
