import { CodePreset } from '../types';

export const SAMPLE_PRESETS: CodePreset[] = [
  {
    id: 'async-scraper-py',
    title: 'Async Scraper (Python -> Go)',
    sourceLanguage: 'python',
    targetLanguage: 'go',
    code: `import asyncio
import aiohttp

# Asynchronous HTTP Fetcher in Python
async def fetch_url(url: str) -> str:
    """Fetch website HTML content asynchronously."""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    urls = ["https://api.github.com", "https://api.stripe.com"]
    tasks = [fetch_url(url) for url in urls]
    results = await asyncio.gather(*tasks)
    print(f"Fetched {len(results)} pages successfully.")

if __name__ == "__main__":
    asyncio.run(main())`
  },
  {
    id: 'binary-search-cpp',
    title: 'Binary Search (C++ -> Rust)',
    sourceLanguage: 'cpp',
    targetLanguage: 'rust',
    code: `#include <iostream>
#include <vector>

// Binary search implementation in C++
int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Not found
}

int main() {
    std::vector<int> nums = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int index = binarySearch(nums, 23);
    std::cout << "Index of 23: " << index << std::endl;
    return 0;
}`
  },
  {
    id: 'express-route-js',
    title: 'Express Handler (JS -> Python FastAPI)',
    sourceLanguage: 'javascript',
    targetLanguage: 'python',
    code: `const express = require('express');
const app = express();
app.use(express.json());

// User Signup Endpoint
app.post('/api/users/signup', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required credentials' });
        }
        // Simulate database insert
        const user = { id: 101, email, fullName, createdAt: new Date() };
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));`
  }
];
