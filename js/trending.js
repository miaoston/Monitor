// 热榜数据相关功能

// 获取GitHub热榜数据
async function fetchTrendingRepos() {
    const language = document.getElementById('languageFilter').value;
    const timeRange = document.getElementById('timeRange').value;
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=stars:>1${language ? `+language:${language}` : ''}&sort=stars&order=desc&per_page=10`);
        const data = await response.json();
        const trendingReposContainer = document.getElementById('trendingRepos');
        trendingReposContainer.innerHTML = '';

        data.items.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'trending-repo p-4 border rounded-lg bg-white shadow-sm hover:shadow-md';
            repoElement.innerHTML = `
                <a href="${repo.html_url}" target="_blank" class="block">
                    <h3 class="text-lg font-medium text-blue-600 hover:underline">${repo.full_name}</h3>
                    <p class="text-gray-600 text-sm mt-1">${repo.description || '暂无描述'}</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span><i class="fas fa-star text-yellow-400"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span class="px-2 py-1 bg-gray-100 rounded">${repo.language || '未知语言'}</span>
                    </div>
                </a>
            `;
            trendingReposContainer.appendChild(repoElement);
        });
    } catch (error) {
        console.error('获取热榜数据失败:', error);
    }
}