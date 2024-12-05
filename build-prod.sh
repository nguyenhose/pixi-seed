#!/bin/bash
## Notes : On MAC M1, if yarn not found, add : export PATH=$PATH:/opt/homebrew/bin/ to Jenkin before executing shell
echo "------------- TAPTAP BUILD PIXI  -------------"
export PATH=$PATH:/usr/local/bin/

# use custom build count instead jenkin
# function get_build_count() {
#    git rev-list HEAD --count
# }
# # build version as commit number
# BUILD_VERSION=$(get_build_count)

BUILD_NUMBER="$1";   # CHANGE IT WHEN BUILD
BUILD_DATE=$(date +'%Y.%m.%d');
BUILD_VERSION="$BUILD_DATE$BUILD_NUMBER";
ENV="prod";
echo "[+] Build number $BUILD_NUMBER ENV is $ENV"
echo "[+] Build version $BUILD_VERSION"
TEMP="${PWD}"
sed -i".bk" "s/#BUILD/$BUILD_VERSION/g" "$TEMP/build-templates/prod/index.ejs"
echo "[+] Copy build template for env-$ENV"
cp -fr "$TEMP/build-templates/prod/index.ejs"  "$TEMP/build-templates"

echo "[+] install dependences"
yarn install

echo "[+] Project Path $TEMP"
echo "[+] Build web-mobile"
yarn run clean-and-build:prod

# create web-mobile folder if it doesn't exist
sleep 1
echo "create folder web-mobile"
mkdir -p "$TEMP/web-mobile"

# copy files to created folder and overwrite files if needed
sleep 1
echo "copy files to web-mobile"
cp -fr "$TEMP/dist/"* "$TEMP/web-mobile/" 


# zip folder
sleep 1
echo "[+] Zip folder"
cd "$TEMP"
zip -r web-mobile.zip web-mobile

sleep 1
cd "$TEMP"
echo DONE
