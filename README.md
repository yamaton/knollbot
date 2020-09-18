![Node.js CI](https://github.com/yamaton/knollbot/workflows/Node.js%20CI/badge.svg)

# knollbot

Currently providing UI to play knolling. Work in progress.


## Knolling demo

https://yamaton.github.io/index.html



## Test build and run

```shell
cd knollbot

# install node packages
npm install

# apply a patch to @types/matter-js 0.14.5
./apply_patch.sh

# Run webpack dev server
npm run start:dev

# Open browser
firefox http://localhost:9000
```

