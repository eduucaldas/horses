# Project spec for "horses"

## Objective
Surprise my girlfriend with a marriage proposal.

### Context about the project
I promised I would propose in the presence of a horse. However my girlfriend is vegan and the only consensual horse is the one made of bits.

### Context about me
I'm a software engineer at Google, don't shy away about explaining stuff technically. Although I have experience with Web dev I use internal frameworks to Google.

### Idea
Create a publicly available website with a little (easy) game, where the main theme is 'horses". And when she beats the game a ring appears.
The horses game could be a mimic of "snake" but with a horse. And whenever the horse eats apples there's a new horse that appears.

## Approach
1. Plan first, then implement milestone by milestone.
2. Ask clarifying questions when unsure.
3. Write tests - readable, behaviour-driven, fast.
4. Minimize dependencies.
5. Prioritize simplicity.
6. Avoid financial costs - free hosting only.

## Technology Stack
- **VCS**: jj with git backend
- **Language**: TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest (switched from Jasmine/Karma for Vite compatibility)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Design Decisions
- **Win condition**: Collect 10 apples (grow herd to 10 horses)
- **Difficulty**: No game over - impossible to lose, guaranteed proposal
- **Visual style**: Emoji-based (🐴🍎💍)
- **Controls**: Arrow keys + WASD
- **Grid**: 20x15 cells with checkerboard grass pattern

## Milestones Completed
1. Project Setup - Vite + TypeScript + Tailwind + Vitest
2. Game Rendering - CSS Grid with emoji rendering
3. Movement & Controls - Arrow keys, WASD, game loop
4. Core Game Logic - Apple collection, herd growth
5. Win Condition & Proposal - Victory screen with bouncing ring

## Live Site
https://eduucaldas.github.io/horses/
