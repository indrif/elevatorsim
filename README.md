elevatorsim
===========

elevatorsim is an elevator simulator written in Javascript.

Why a simulator for elevators?
---
Valid question! At the place I work we have elevators, as with many workplaces. However from time to time they seem to make stupid decisions that causes frustration for people waiting. This has caused a discussion to arise regarding how hard it could be to write a decent elevator software. After many weeks of thinking about this issue I decided to put together a basic simulator to be able to try this out.

More information?
---
I will write more in this readme when I get the inspiration.

Setup
---
* Clone repo
* npm install

How to run
---
```
./main.js 
Usage: node ./main.js

Examples:
  node ./main.js --ai=simple --scenario=scenario1    Run the simulation with the default options


Options:
  -a, --ai          Select an AI to use                      [required]
  -s, --scenario    Select a scenario to run                 [required]
  -r, --randomseed  Random seed to use for seeded scenarios
```

Examples:
```
./main.js --ai=simple --scenario=scenario1 --randomseed=123
```

`--ai` must be the name of a file in the ai directory. `--scenario` must be the name of a file in the scenario directory.

License
---
MIT
