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
  -l, --logger      Select a logger to use                   [required]
  -r, --randomseed  Random seed to use for seeded scenarios
```

Examples:
```
./main.js --ai=ai/simple.js --scenario=scenario/scenario1.js --logger=logger/console.js --randomseed=123
```

How to run tests
---
```
npm test
```

Implementing scenarios
---

Scenario files are placed in `scenario/`. See `scenario/scenario1.js` for a simple example.

## Reference values

1 tick = 3 seconds of real time

| Action               | Real-time  | Ticks |
| -------------------- |:----------:| -----:|
| Open and close doors | 9s         | 3     |
| Move one floor       | 9s         | 3     |
| One hour             | 1h         | 1200  |

License
---
MIT
