#!/bin/bash
cd ./apps/ 

for folder in */ ; do
    echo "Processing $folder..."

    # Navigate into the folder
    cd "$folder"

    # Execute your commands
    yarn build

    # Navigate back to the 'apps' directory
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

    # Navigate into the folder
    cd "$folder"

    # Execute your commands
    yalc add @symmio/frontend-sdk
    yarn build

    # Navigate back to the 'apps' directory
    cd ..

    echo "$folder processing complete."
done

echo "All folders processed."

cd ../

node ./useful_script/post_build.js
