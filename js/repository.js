// 仓库数据相关功能

// 获取用户仓库数据
async function fetchRepositories(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
    const repos = await response.json();

    let totalForks = 0;
    repos.forEach(repo => {
        totalForks += repo.forks_count;
    });

    document.getElementById('forkCount').textContent = totalForks;

    if (activityChart) {
        activityChart.destroy();
    }

    const ctx = document.getElementById('activityChart').getContext('2d');
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: repos.slice(0, 10).map(repo => repo.name),
            datasets: [{
                label: 'Stars',
                data: repos.slice(0, 10).map(repo => repo.stargazers_count),
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }, {
                label: 'Forks',
                data: repos.slice(0, 10).map(repo => repo.forks_count),
                borderColor: 'rgb(16, 185, 129)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '最近活跃仓库数据'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 获取用户PR数据
async function fetchPullRequests(username) {
    const response = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
    const data = await response.json();
    document.getElementById('prCount').textContent = data.total_count || 0;
}