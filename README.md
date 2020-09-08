# knollbot

Currently providing UI to play knolling. Work in progress.


## Knolling demo

https://yamaton.github.io/index.html



## Test build and run

```shell
cd knollbot

# install node packages
npm install

# patch @types/matter-js
patch node_modules/@types/matter-js/index.d.ts < index.d.ts.patch

# Assume typescript is already installed
npm run build

# Open browser
firefox index.html
```

