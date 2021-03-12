# Find-Your-Hat---Codecademy JavaScript Challenge Solution

What the heck. I found this one kind of tough. 
There really isn't much to say other than I hope you find this to be helpful. The entire solution can be found in [findYourHat.js][findYourHatLink].

[findYourHatLink]: <https://github.com/Eric-Alain/Find-Your-Hat---Codecademy-solution/blob/main/findYourHat.js>
I did my best to write this in a more human-readable way to help other learners on their journey. Sorry if some variable names seem really long-winded.

## Notes
- Uses the node.js "inquirer.js" package, so make sure to install that package if you want this solution to work.
- The prompts require you to use the arrow keys to choose from a checklist, the space bar to select an option and the enter key to enter your selection.
- Not entirely certain if most of this solution follows typical JavaScript convention, but hey, it works.

## Issues I came across
- I faced the most issues with getting all my functions to communicate with each other, if you are like me, you will probably benefit from brushing up on JavaScript promises.
- You'll also want to brush up on async/await, in order to interrupt the flow of loops while awaiting certain return values.
- Collecting the user's input, to me, wasn't super evident and I spent most of my time finding ways to not only collect input, but also ensure that the terminal would register the directional arrow keys! (go figure). I found inquirer.js to be most helpful solution.

## In closing
Enjoy, you beauties! I hope that this solution can be helpful to you in some small way. 
Eric
