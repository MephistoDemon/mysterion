Code of Conduct
===============

This document describes how we collaborate developing Mysterion.

Main collaboration goals:
- Fast feature delivery
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

We're all people, so have in mind that we can make mistakes, be subjective and have a feelings.
When communicating in PRs, we should:

- Be **polite** and **friendly** - mis-communicating online is common, so it's very easy to mis-understand other people
- Be **objective** when possible - i.e. using statistics or external resources instead of yourself opinions
- Be **open to different opinions** - everyone can have a different mindset and by merging different mindsets we can get to a group solution
- Consider **talking in real life** (or even **pair-programming**) when communication online gets tricky

### Making PR

When making a PR, make sure you've prepared it well in order to save your own time as well as time and energy of your teammates:

- Make sure **CI passes**
- Before making a PR, **review changes as you were the reviewer** - see *Reviewing PR* section
- (Optional) Add a **PR description** if changes are not obvious

### Getting feedback

Not many people think reviewing PRs is fun, so getting feedback is like getting a 🎁.

When disagreements happen:
- Try discussing it and understanding why opinions differ and how to make all sides happy.
- Consider asking opinions of contributors outside of the discussion by tagging them.
- Try referencing topics (articles/documentations) which explains your arguments

### Reviewing PR

When reviewing PRs:
- **Focus** on the most important things first. More about that in *Coding values* section.
- **Talk in person** before reviewing if PR is very unclear
- Consider **checking-out PR branch and play around** with it to see PR in action or try applying some improvements yourself
- Use **comment markers** (see below)

#### Comment markers

Use markers to show comment intention. 
First 2 symbols in comments describes comment type:

1. Comment starts with `!!`:

    Developer should react to this comment - make code change or describe why code can't be changed
    
2. Comment starts with `??`:

    Code is hard to understand, developer should describe solution and reason
    
3. Comment starts with any other symbols:

    It's just idea shared with developer. Developer can make changes or ignore comment

Coding values
-------------

### Functionality

Code should do what it's supposed to do:
- Changes should be **aligned with Jira task** (if present) and all acceptance criteria should be covered
- All cases should be covered, including **unhappy paths** when user is not behaving as we expect him to behave

### Testing:

Most of domain classes should be covered with **unit tests**.
For essential features , higher-level **integration tests** should be used to see whether units work when joined together.
UI should be tested separately from domain logic with **UI tests** - domain logic should be tested in unit tests, not in UI.

![testPyramid](https://martinfowler.com/articles/practical-test-pyramid/testPyramid.png)
- Happy, unhappy paths
    
### Maintainability

To avoid slowing down once project gets bigger, we have to keep our code maintainable.
It's not obvious what maintainable code is, so to have some objectivity, we prefer using popular design principles instead of personal opinions.
These include:

- [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) - don't repeat yourself
- [SOLID](https://en.wikipedia.org/wiki/SOLID):
    - [SRP](https://en.wikipedia.org/wiki/Single_responsibility_principle) - single responsibility principle
    - [Open/closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
    - [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
    - [Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)
    - [Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [KISS](https://en.wikipedia.org/wiki/KISS_principle) - keep it simple, stupid 
