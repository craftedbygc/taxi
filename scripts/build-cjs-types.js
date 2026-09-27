// Copies the generated declarations into types/cjs, marked as CommonJS, so `require`
// consumers get types that match dist/taxi.cjs instead of ESM ones.
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'

const out = 'types/cjs'

rmSync(out, { recursive: true, force: true })
mkdirSync(out)

for (const file of readdirSync('types')) {
	if (file.endsWith('.d.ts')) {
		cpSync(`types/${file}`, `${out}/${file}`)
	}
}

writeFileSync(`${out}/package.json`, JSON.stringify({ type: 'commonjs' }, null, '\t') + '\n')
