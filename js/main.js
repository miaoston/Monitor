// 主JavaScript文件

// 全局变量
let activityChart = null;
let trendingUpdateInterval = null;
let contributionData = null;

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子效果
    initParticles();
    
    // 页面加载时获取热榜数据
    fetchTrendingRepos();

    // 监听筛选条件变化
    document.getElementById('languageFilter').addEventListener('change', fetchTrendingRepos);
    document.getElementById('timeRange').addEventListener('change', fetchTrendingRepos);
    
    // 设置自动更新（每5分钟）
    trendingUpdateInterval = setInterval(fetchTrendingRepos, 5 * 60 * 1000);
});

// 初始化粒子效果
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#4F46E5' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#4F46E5', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// 切换高级选项显示
function toggleAdvancedOptions() {
    const advancedOptions = document.getElementById('advancedOptions');
    const icon = document.getElementById('advancedOptionsIcon');
    if (advancedOptions.classList.contains('hidden')) {
        advancedOptions.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        advancedOptions.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// 获取GitHub数据的主函数
async function fetchGitHubData() {
    const username = document.getElementById('searchInput').value;
    if (!username) return;

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();

        if (response.ok) {
            updateStats(userData);
            updateUserProfile(userData);
            await Promise.all([
                fetchRepositories(username),
                fetchPullRequests(username),
                fetchContributions(username)
            ]);
        } else {
            alert('未找到该用户或组织');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('获取数据时出错');
    }
}

// 更新统计数据
function updateStats(userData) {
    document.getElementById('repoCount').textContent = userData.public_repos || 0;
    document.getElementById('starCount').textContent = userData.followers || 0;
}