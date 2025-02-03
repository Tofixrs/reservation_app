#!/usr/bin/env bash

pnpm exec drizzle-kit generate
most_recent_file=$(ls -t ./drizzle | head -n 1)
file=$(cat ./drizzle/$most_recent_file)

./loginDB.sh <<< $file;
