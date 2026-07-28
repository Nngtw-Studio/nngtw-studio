const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let changed = 0;
walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace bg-brand-black ONLY in section classNames
    content = content.replace(/(<section[^>]*?className=[\"\'\`][^\"\'\`]*?)\bbg-brand-black\b([^\"\'\`]*?[\"\'\`])/g, '\$1\$2');
    
    // Some components might have a main or div wrapper acting as a section with bg-brand-black.
    // e.g. GamesHero uses <div className="... bg-brand-black"> but maybe it's fine.
    if (filePath.includes('GamesHero.tsx')) {
        content = content.replace(/className=\"relative snap-start flex min-h-svh flex-col overflow-hidden bg-brand-black\"/, 'className="relative snap-start flex min-h-svh flex-col overflow-hidden"');
    }

    if (original !== content) {
      // Clean up double spaces created by removal of class
      let cleaned = content.replace(/(<section[^>]*?className=[\"\'\`][^\"\'\`]*?)\s{2,}([^\"\'\`]*?[\"\'\`])/g, '\$1 \$2');
      fs.writeFileSync(filePath, cleaned);
      console.log('Modified section in', filePath);
      changed++;
    }
  }
});
console.log('Done, modified', changed, 'files.');
