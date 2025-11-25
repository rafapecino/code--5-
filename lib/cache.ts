import { promises as fs } from "fs"
import path from "path"

const CACHE_FILE = path.join(process.cwd(), ".youtube-cache.json")

export interface CacheData {
  timestamp: number
  data: any
}

export async function readCache(): Promise<CacheData | null> {
  try {
    const content = await fs.readFile(CACHE_FILE, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

export async function writeCache(data: any): Promise<void> {
  const cacheData: CacheData = {
    timestamp: Date.now(),
    data,
  }
  await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2))
}
