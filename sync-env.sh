#!/bin/bash

set -e

# Color
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔐 Nhập GitHub Token của bạn (chế độ ẩn):${NC}"
read -s TOKEN

TEMP_DIR="temp_secrets_$$"
REPO_URL="https://$TOKEN@github.com/nhattVim/.env"

echo -e "${YELLOW}🚀 Cloning repository chứa secrets...${NC}"
if git clone "$REPO_URL" "$TEMP_DIR"; then
  echo -e "${GREEN}✅ Clone thành công!${NC}"
else
  echo -e "${RED}❌ Lỗi khi clone repo. Kiểm tra lại token hoặc quyền truy cập.${NC}"
  exit 1
fi

echo -e "${YELLOW}📂 Đang sao chép các file cấu hình...${NC}"

# Backend Node
if [ -f "$TEMP_DIR/Jobiverse/backend/.env" ]; then
  cp "$TEMP_DIR/Jobiverse/backend/.env" backend/.env
  echo -e "${GREEN}✅ Đã copy backend/.env${NC}"
else
  echo -e "${RED}⚠️ Không tìm thấy backend/.env trong repo.${NC}"
fi

# Backend .NET
if [ -f "$TEMP_DIR/Jobiverse/backend.NET/appsettings.json" ]; then
  cp "$TEMP_DIR/Jobiverse/backend.NET/appsettings.json" backend.NET/appsettings.json
  echo -e "${GREEN}✅ Đã copy backend.NET/appsettings.json${NC}"
else
  echo -e "${RED}⚠️ Không tìm thấy backend.NET/appsettings.json trong repo.${NC}"
fi

# Frontend React
if [ -f "$TEMP_DIR/Jobiverse/frontend/.env" ]; then
  cp "$TEMP_DIR/Jobiverse/frontend/.env" frontend/.env
  echo -e "${GREEN}✅ Đã copy frontend/.env${NC}"
else
  echo -e "${RED}⚠️ Không tìm thấy frontend/.env trong repo.${NC}"
fi

# Cleanup
rm -rf "$TEMP_DIR"
echo -e "${YELLOW}🧹 Đã xoá thư mục tạm.${NC}"
echo -e "${GREEN}🎉 Hoàn tất import secrets!${NC}"
