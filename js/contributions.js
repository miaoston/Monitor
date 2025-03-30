// 贡献热力图相关功能

// 获取用户贡献数据
async function fetchContributions(username) {
    try {
        const token = document.getElementById('githubToken').value;
        if (!token) {
            // 如果没有Token，显示提示信息
            document.getElementById('contributionHeatmap').innerHTML = 
                `<div class="text-center py-8 text-gray-500">
                    <i class="fas fa-lock text-4xl mb-4 text-indigo-400 animate-bounce"></i>
                    <p>提供GitHub Token后可查看详细的贡献数据</p>
                </div>`;
            return;
        }
        const query = `query ($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                                weekday
                            }
                        }
                    }
                }
            }
        }`;

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });

        const data = await response.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        const calendar = data.data.user.contributionsCollection.contributionCalendar;
        contributionData = new Array(53).fill(null).map(() => new Array(7).fill(0));

        calendar.weeks.forEach((week, weekIndex) => {
            if (weekIndex < 53) {
                week.contributionDays.forEach(day => {
                    contributionData[weekIndex][day.weekday] = day.contributionCount;
                });
            }
        });

        renderContributionHeatmap();
    } catch (error) {
        console.error('获取贡献数据失败:', error);
        alert('获取贡献数据失败，请确保提供了有效的GitHub Token');
    }
}

// 渲染贡献热力图
function renderContributionHeatmap() {
    const container = document.getElementById('contributionHeatmap');
    container.innerHTML = '';
    
    const heatmapWrapper = document.createElement('div');
    heatmapWrapper.className = 'flex flex-col';

    // 创建月份标签
    const monthLabels = document.createElement('div');
    monthLabels.className = 'flex text-xs text-gray-400 mb-2 ml-8';
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(today);
        monthDate.setMonth(today.getMonth() - i);
        const monthLabel = document.createElement('div');
        monthLabel.className = 'mr-8';
        monthLabel.textContent = months[monthDate.getMonth()];
        monthLabels.appendChild(monthLabel);
    }
    heatmapWrapper.appendChild(monthLabels);

    const graphWrapper = document.createElement('div');
    graphWrapper.className = 'flex';
    
    // 创建星期标签
    const weekLabels = document.createElement('div');
    weekLabels.className = 'flex flex-col justify-around text-xs text-gray-400 mr-2';
    ['周日', '周一', '周三', '周五'].forEach(day => {
        const label = document.createElement('div');
        label.textContent = day;
        weekLabels.appendChild(label);
    });
    graphWrapper.appendChild(weekLabels);
    
    // 渲染热力图
    contributionData.forEach((week, weekIndex) => {
        const weekEl = document.createElement('div');
        weekEl.className = 'flex flex-col gap-1 mr-1';
        
        week.forEach((count, dayIndex) => {
            const day = document.createElement('div');
            day.className = `w-3 h-3 rounded-sm ${getColorClass(count)} transition-colors duration-200 hover:ring-2 hover:ring-blue-400`;
            const date = new Date(today);
            date.setDate(date.getDate() - (weekIndex * 7 + (6 - dayIndex)));
            day.title = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日: ${count} 个贡献`;
            weekEl.appendChild(day);
        });
        
        graphWrapper.appendChild(weekEl);
    });
    
    heatmapWrapper.appendChild(graphWrapper);
    container.appendChild(heatmapWrapper);
}

// 根据贡献数量获取颜色类名
function getColorClass(count) {
    if (count === 0) return 'bg-gray-100';
    if (count <= 3) return 'bg-green-100';
    if (count <= 6) return 'bg-green-200';
    if (count <= 9) return 'bg-green-300';
    if (count <= 12) return 'bg-green-400';
    return 'bg-green-500';
}