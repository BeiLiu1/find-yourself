#!/bin/bash
# ============================================
# 自动部署脚本 - Find Yourself (CBF-PI-B)
# 上传到服务器后执行: chmod +x deploy.sh
# 使用方式: ./deploy.sh
# ============================================

set -e

# ---- 配置区 ----
PROJECT_DIR="/opt/find-yourself"
REPO_URL="https://github.com/BeiLiu1/find-yourself.git"
BRANCH="main"
NGINX_WEB_ROOT="/usr/share/nginx/html/find-yourself"

# ---- 颜色输出 ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "=========================================="
echo "  Find Yourself 自动部署脚本"
echo "=========================================="
echo ""

# 1. 检查 Node.js
if ! command -v node &> /dev/null; then
    err "未检测到 Node.js，请先安装: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs"
fi
log "Node.js 版本: $(node -v)"

# 2. 检查 npm
if ! command -v npm &> /dev/null; then
    err "未检测到 npm"
fi
log "npm 版本: $(npm -v)"

# 3. 拉取/更新代码
if [ -d "$PROJECT_DIR/.git" ]; then
    log "项目已存在，拉取最新代码..."
    cd "$PROJECT_DIR"
    git fetch origin "$BRANCH"
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse "origin/$BRANCH")
    if [ "$LOCAL" = "$REMOTE" ]; then
        warn "代码已是最新版本 ($LOCAL)"
        read -p "是否强制重新构建? (y/N): " force
        if [[ ! "$force" =~ ^[Yy]$ ]]; then
            log "无需更新，退出。"
            exit 0
        fi
    fi
    git reset --hard "origin/$BRANCH"
    log "代码已更新到: $(git rev-parse --short HEAD)"
else
    log "首次部署，克隆仓库..."
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown "$(whoami):$(whoami)" "$PROJECT_DIR"
    git clone -b "$BRANCH" "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    log "仓库克隆完成"
fi

# 4. 安装依赖
log "安装依赖..."
npm install --production=false
log "依赖安装完成"

# 5. 构建项目
log "构建项目..."
npm run build
log "构建完成"

# 6. 部署到 Nginx
log "部署到 Nginx..."
sudo mkdir -p "$NGINX_WEB_ROOT"
sudo rm -rf "${NGINX_WEB_ROOT:?}/"*
sudo cp -r dist/* "$NGINX_WEB_ROOT/"
log "静态文件已复制到 $NGINX_WEB_ROOT"

# 7. 重启 Nginx
if command -v nginx &> /dev/null; then
    sudo nginx -t && sudo systemctl reload nginx
    log "Nginx 已重新加载"
else
    warn "未检测到 Nginx，请手动配置 Web 服务器"
fi

echo ""
echo "=========================================="
log "部署完成！"
echo "  提交: $(git rev-parse --short HEAD)"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""
