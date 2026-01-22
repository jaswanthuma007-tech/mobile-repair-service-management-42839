#!/bin/bash
cd /home/kavia/workspace/code-generation/mobile-repair-service-management-42839/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

