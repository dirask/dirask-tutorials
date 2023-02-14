#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

echo ""
echo "---------------------------------------------------------------"
echo " Front-end building                                            "
echo "---------------------------------------------------------------"
echo ""

cd "$SCRIPT_DIR/frontend" && npm ci install && npm run build
cd "$SCRIPT_DIR"

echo ""
echo "---------------------------------------------------------------"
echo " Back-end building                                             "
echo "---------------------------------------------------------------"
echo ""

cd "$SCRIPT_DIR/backend" && npm ci install
cd "$SCRIPT_DIR"

echo ""
echo "---------------------------------------------------------------"
echo " Building done!                                                "
echo "---------------------------------------------------------------"
echo ""