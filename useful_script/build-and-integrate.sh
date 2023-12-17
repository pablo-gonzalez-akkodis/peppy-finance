#!/bin/bash
cd ./apps/ 

for folder in */ ; do
    echo "Processing $folder..."

    # Navigate into the folder
    cd "$folder"

    echo "removed .next"

    rm -rf .next

    yarn build

    cd ..

    echo "$folder processing complete."
done

cd ../ 

node ./useful_script/pre_build.js

cd ./packages/core

yalc publish

cd ../../apps

for folder in */ ; do
    echo "Processing $folder..."

    cd "$folder"

    rm -rf .next

    echo "removed .next"
    
    yalc add @symmio/frontend-sdk
    yarn build

    cd ..

    echo "$folder processing complete."
done

echo "All folders processed."

cd ../

node ./useful_script/post_build.js
