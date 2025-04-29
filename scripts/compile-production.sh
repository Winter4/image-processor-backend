npx tsc
npx tsc-alias

cp ./source/api/image/image.wasm-processor/multithread/*.wasm ./compiled/source/api/image/image.wasm-processor/multithread
cp ./source/api/image/image.wasm-processor/multithread/*.js   ./compiled/source/api/image/image.wasm-processor/multithread

cp ./source/api/image/image.wasm-processor/singlethread/*.wasm ./compiled/source/api/image/image.wasm-processor/singlethread
cp ./source/api/image/image.wasm-processor/singlethread/*.js   ./compiled/source/api/image/image.wasm-processor/singlethread