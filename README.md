# knollbot
Let a robot knoll



## Test build and run

```shell
cd knollbot

# install node packages
npm install

# patch @types/matter-js
patch node_modules/@types/matter-js/index.d.ts < index.d.ts.patch

# Assume typescript is already installed
tsc --build --verbose

# View HTML file
firefox view.html
```

