#!/bin/bash
# ============================================
# 自动部署脚本 - Find Yourself (CBF-PI-B)
# 上传到服务器后执行: chmod +x deploy.sh
# 使用方式: ./deploy.sh
# ============================================

set -e

# ---- 配置区（请根据实际情况修改）----
PROJECT_DIR="/home/qq/find-yourself"
REPO_URL="https://github.com/BeiLiu1/find-yourself.git"
BRANCH="main"
# Nginx root 指向构建产物目录，留空则跳过复制（直接在项目目录内使用 dist）
NGINX_WEB_ROOT=""

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
if [ -n "$NGINX_WEB_ROOT" ]; then
    log "复制构建产物到 $NGINX_WEB_ROOT ..."
    sudo mkdir -p "$NGINX_WEB_ROOT"
    sudo rm -rf "${NGINX_WEB_ROOT:?}/"*
    sudo cp -r dist/* "$NGINX_WEB_ROOT/"
    log "静态文件已复制"
    SERVE_DIR="$NGINX_WEB_ROOT"
else
    SERVE_DIR="$PROJECT_DIR/dist"
    log "构建产物位于: $SERVE_DIR"
    warn "请确保 Nginx 的 root 指向该目录"
fi

# 7. 检查并更新 Nginx 配置
if command -v nginx &> /dev/null; then
    # 查找现有配置中的 root 指向
    NGINX_CONF=$(grep -rl "find-yourself\|personal-website" /etc/nginx/conf.d/ 2>/dev/null | head -1)
    if [ -n "$NGINX_CONF" ]; then
        CURRENT_ROOT=$(grep -oP '^\s*root\s+\K[^;]+' "$NGINX_CONF" 2>/dev/null | head -1)
        if [ "$CURRENT_ROOT" != "$SERVE_DIR" ]; then
            warn "Nginx 配置 ($NGINX_CONF) 中 root=$CURRENT_ROOT"
            warn "但构建产物在 $SERVE_DIR"
            read -p "是否自动更新 Nginx root 指向? (y/N): " fix
            if [[ "$fix" =~ ^[Yy]$ ]]; then
                sudo sed -i "s|root.*$CURRENT_ROOT|root $SERVE_DIR|" "$NGINX_CONF"
                log "已更新 Nginx root -> $SERVE_DIR"
            fi
        fi
    fi
    sudo nginx -t && sudo systemctl reload nginx
    log "Nginx 已重新加载"
else
    warn "未检测到 Nginx，请手动配置 Web 服务器指向 $SERVE_DIR"
fi

echo ""
echo "=========================================="
log "部署完成！"
echo "  提交: $(git rev-parse --short HEAD)"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""
