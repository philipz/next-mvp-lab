#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Next.js Frontend Development Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if backend is running (health check on port 8080)
echo -e "${YELLOW}[1/3]${NC} Checking if backend is running on port 8080..."
if curl -s -f http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${YELLOW}⚠ Backend not detected on port 8080${NC}"
    echo -e "${YELLOW}  You can still run the frontend, but API calls will fail.${NC}"
    echo -e "${YELLOW}  To start the backend, run: ./mvnw spring-boot:run${NC}"
    echo ""
fi

# Check if node_modules exists
echo -e "${YELLOW}[2/3]${NC} Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ node_modules not found${NC}"
    echo -e "${BLUE}Installing dependencies with pnpm...${NC}"
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies found${NC}"
fi

# Start Next.js dev server on port 3000
echo -e "${YELLOW}[3/3]${NC} Starting Next.js dev server on port 3000..."
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Frontend dev server starting...${NC}"
echo -e "${GREEN}  URL: http://localhost:3000${NC}"
echo -e "${GREEN}  Press Ctrl+C to stop${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Execute pnpm dev
pnpm dev
