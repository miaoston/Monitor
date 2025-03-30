// 用户资料相关功能

// 更新用户资料信息
function updateUserProfile(userData) {
    // 更新用户头像
    const avatarElement = document.getElementById('userAvatar');
    if (userData.avatar_url) {
        avatarElement.src = userData.avatar_url;
    }

    // 更新用户名称
    document.getElementById('userName').textContent = userData.name || userData.login;
    
    // 更新用户简介
    document.getElementById('userBio').textContent = userData.bio || '暂无简介';
    
    // 更新用户类型图标
    const userTypeIcon = document.getElementById('userTypeIcon');
    if (userData.type === 'Organization') {
        userTypeIcon.className = 'fas fa-building';
    } else {
        userTypeIcon.className = 'fas fa-user';
    }
    
    // 更新用户数据信息
    document.getElementById('userRepoCount').textContent = userData.public_repos || 0;
    document.getElementById('userFollowers').textContent = userData.followers || 0;
    document.getElementById('userFollowing').textContent = userData.following || 0;
    document.getElementById('userGists').textContent = userData.public_gists || 0;
    
    // 格式化并更新加入日期
    if (userData.created_at) {
        const joinDate = new Date(userData.created_at);
        document.getElementById('userJoinDate').textContent = 
            `${joinDate.getFullYear()}年${joinDate.getMonth() + 1}月${joinDate.getDate()}日`;
    }
    
    // 显示装饰区域
    document.getElementById('leftDecoration').classList.remove('hidden');
    document.getElementById('rightDecoration').classList.remove('hidden');
    
    // 随机选择一个GitHub小贴士
    const tips = [
        "GitHub Actions可以帮助你自动化工作流程。",
        "使用GitHub Pages可以免费托管静态网站。",
        "GitHub Copilot是一个AI编程助手，可以提高编码效率。",
        "使用.github/FUNDING.yml文件可以设置赞助按钮。",
        "GitHub提供了丰富的API，可以构建自己的工具。"
    ];
    document.getElementById('githubTip').textContent = tips[Math.floor(Math.random() * tips.length)];
    
    // 添加头像动画效果
    const avatarContainer = document.getElementById('userAvatarContainer');
    avatarContainer.classList.add('animate-pulse');
    setTimeout(() => {
        avatarContainer.classList.remove('animate-pulse');
    }, 1000);
}