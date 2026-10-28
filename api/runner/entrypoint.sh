#!/bin/bash
set -e

echo "TaskTraceAutomator Execution Runner starting..."
if [ -f "/workspace/run_spec.json" ]; then
    echo "Running execution spec..."
fi

# Fallback echo
echo '{"status": "READY", "message": "Runner container initialized"}' > /workspace/result.json

