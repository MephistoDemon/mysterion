Code of Conduct
===============

This document describes how we collaborate developing Mysterion.

Main collaboration goals:
- Fast features delivery
- Stable product
- Well-being of teammates and contributors

Pull requests
-------------

### Branch name

Choose appropriate branch name to clarify what this PR is about.

- Select appropriate tag:
    - `hotfix` for small and/or urgent bug fixes without JIRA story
    - `bugfix` for bugfixes for JIRA story
    - `feature` for changes that change or add new functionality
    - `refactor` for changes that does not change program behaviour
- Append tag with JIRA task and description, i.e.:
    - `feature/MYS-123-favorites`
    - `bugfix/MYS-100-missing-logs`
    - `hotfix/crash-with-unknown-names`
    
### Communication

We are all humans, so have in mind that we can make mistakes, be subjective and we have a feelings.
When communicating in PRs, we should:

- Be subjective when possible - i.e. using statistics or external resources instead of yourself opinions
- Be open to different opinions - everybody have different mindset, and by merging different mindsets we can get 
- Consider talking in real life (or even pair-programming) when communication online gets tricky

### Making PR

When making a PR, make sure you've prepared it well to safe time and energy of yours and you teammates:

- Make sure CI is passing
- Before making PR, review changes as you were a reviewer - see *Reviewing PR* section
- (Optional) Add a PR description if changes are not obvious

### Getting feedback

Not many people think reviewing PR is fun, so getting a feedback is like getting a 🎁.
If you disagree with comment, try discussing it and understanding why opinions differ and how to make both sides happy.
Consider asking opinions of others.

### Reviewing PR

When reviewing PR, try focusing to most important things first. More about that in *Coding values* section.
Commenting:
- Be aware that it's very easy to misinterpret comments
If something is very unclear:
- Try checking-out PR branch and play around with it

consider talking in person
be nice and considerate
try checking-out code and trying it out yourself

Coding values
-------------

### Functionality

Code should do what it's supposed to do.
Functionality should cover all cases, including unhappy paths.
If it's a feature PR, 

### Testing:

Most of code should be covered with unit-tests.
For essential features and GUI, higher-level integration tests should be used.
Unit-tests and integration tests should be separated.


![testPyramid](https://martinfowler.com/articles/practical-test-pyramid/testPyramid.png)
- Happy, unhappy paths
    
### Maintainability

DRY
SOLID
other principles?
