import { rm } from 'fs/promises';

export default async function remove(paths = ['dist']) {
    try {
        for (const path of paths) {
            await rm(path, { recursive: true, force: true });
        }
    } catch {
        console.log(`${paths}`);
    }
}
