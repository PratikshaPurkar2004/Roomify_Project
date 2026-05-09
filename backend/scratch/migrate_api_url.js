const fs = require('fs');
const path = require('path');

const directory = "C:\\Users\\Shraddha\\Desktop\\Roomify_Project\\Roomify_Project\\frontend\\src";
const railwayUrl = "https://roomify-project-production.up.railway.app";

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('import.meta.env.VITE_API_URL')) {
                console.log(`Updating ${fullPath}`);
                
                // Replace usage
                content = content.replace(/import\.meta\.env\.VITE_API_URL/g, 'API_URL');
                
                // Add import if not present
                if (!content.includes("import { API_URL }")) {
                    // Find first import line or start of file
                    const lines = content.split('\n');
                    let insertIndex = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].trim().startsWith('import')) {
                            insertIndex = i;
                        }
                    }
                    // Insert after last import for better style
                    lines.splice(insertIndex + 1, 0, `import { API_URL } from "${getRelativePath(fullPath)}";`);
                    content = lines.join('\n');
                }
                
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

function getRelativePath(fullPath) {
    const dir = path.dirname(fullPath);
    const apiPath = path.join(directory, 'api.js');
    let rel = path.relative(dir, apiPath).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel.replace('.js', '');
}

processDirectory(directory);
console.log("Done!");
