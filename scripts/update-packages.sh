# initiate fresh project

echo "configure .nvmrc & <nvm use> command to handle node versions\n"
echo "also make sure docker-compose services' versions are ok"

node_version=$(node -v)
npm_version=$(npm -v)
echo "node -v: $node_version"
echo "npm -v: $npm_version"

# = = = =

echo && read -p "versions ok? (yes/no): " prompt

if [ "$prompt" != "yes" ]; then
echo && echo "aborting script.."
    exit 1
fi

npm install npm-check-updates@latest --save-dev
npx npm-check-updates -u

echo "\nsometimes the most actual packages versions conflict with other packages.."
echo "..in this case read the npm log and rollback package(s) version"