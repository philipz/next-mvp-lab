#!/bin/bash

# Frontend build script for Next.js application
# Purpose: Independent frontend build without Maven dependency
# Requirements: 2.1, 2.2, 2.3

set -e  # Exit on error

echo "====================================="
echo "Frontend Build Script"
echo "====================================="

# Check Node.js version (>= 18)
echo ""
echo "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    echo "Current version: $(node --version)"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Execute pnpm install with frozen lockfile
echo ""
echo "Installing dependencies..."
pnpm install --frozen-lockfile

if [ $? -ne 0 ]; then
    echo "❌ Error: pnpm install failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Execute pnpm build for Next.js static export
echo ""
echo "Building Next.js application..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Error: pnpm build failed"
    exit 1
fi

# Verify out/ directory created
echo ""
echo "Verifying build output..."

if [ ! -d "out" ]; then
    echo "❌ Error: out/ directory not found after build"
    echo "Next.js static export may have failed"
    exit 1
fi

echo "✅ Build output directory verified: out/"

# Display build statistics
echo ""
echo "====================================="
echo "Build completed successfully!"
echo "====================================="
echo ""
echo "Build artifacts location: $(pwd)/out/"
echo ""

# List contents of out/ directory
echo "Build artifacts:"
ls -lh out/

exit 0
