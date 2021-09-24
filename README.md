# cookie-garden-helper-reloaded

Automate your garden in Cookie Clicker

This is the Steam version of cookie-garden-helper (https://github.com/yannprada/cookie-garden-helper)

## How to install

Import the CookieGardenHelper-reloaded folder in `<steam>\SteamApps\common\Cookie Clicker\resources\app\mods\local`
There should only be info.txt and main.js in that folder, no sub-folders

## How it works

To begin, click the button ***CGHR***, at the bottom of your
garden / farms. There, you can configure how you would like the mod to operate.

The mod loop through each unlocked tile, then tries to auto-harvest
or auto-plant, depending on what is activated.

### Auto-harvest

First, it will check if the tile is empty.

If not, it will check if the plant is immortal. If it is, and the **Avoid immortals** option is **ON**, ignore this tile.

If not, it will compute the plant stage. Below is a list of these stages, and
the conditions when the plant will be harvested:

- young:
  - if it is a weed, and the option **Remove weeds** is **ON**
  - if the option **Clean garden** is **ON**, the corresponding saved slot is
  empty and the plant is already unlocked
  - if the option **Clean garden** is **ON**, the corresponding saved slot is
  not empty but the young plant don't match
- mature:
  - if it is a new seed, and the option **New seeds** is **ON**
  - if the option **Check CpS Mult** is **ON**, and the current CpS multiplier
  is above or equal to the one specified at **Mini CpS multiplier**
- dying:
  - if the option **Check CpS Mult** is **ON**, and the current CpS
  multiplier is above or equal to the one specified at
**Mini CpS multiplier**
  - if the plant is dying, the last tick is 5 seconds from expiring,
  and the option **Dying plants** is **ON**

### Auto-plant

This one will work if:

- the tile is empty
- a plot has been previously saved with the button **Save plot**
- the option **Check CpS Mult** is:
  - **ON**, and the current CpS multiplier is
below or equal to the one specified at **Maxi CpS multiplier**
  - **OFF**

***Note:*** mouse over the message *Plot saved*, to see what was saved.

### Manual tools

This section is pretty obvious. Only one tool is there for now:

- **Plant selected seed**:
  - select a seed you have unlocked
  - click this button to fill all the empty tiles of your plot
  - (don't forget to deselect the seed)

### Seed List

This section displays all seeds in the game, in red if you have yet to unlock it.

**Hovering** on its name will display suggested seed mutation layout.

**Clicking** on its name will overwrite the saved plot by the suggested layout, for future use with **Auto-plant**.

## Sacrifice garden

When you sacrifice your garden, a few things will happen:

- your saved plot will be erased
- the auto-harvest will be toggled OFF
- the auto-plant will be toggled OFF

This is to prevent planting locked seeds, as well as allowing you to verify your
configuration before restarting automation.

The rest of your configuration will remain.

## Screenshot

![Screenshot - UI of the mod cookie-garden-helper](/img/cookie-garden-helper.png?raw=true "UI")

## Issues

If you have any issues, you can either create an issue in this git repo, or ping me on [Reddit](https://old.reddit.com/r/CookieClicker/comments/phxdge/garden_helper_for_steam_version/)

## FAQ

**It's loaded and there but never seems to do anything?**

    In a few words:
      1. You need to manually plant a first round of plants
      2. You press the "Save Plot" button, when hovering on the text right next to it, you should have a tooltip with your layout (or you can press a seed in the bottom list)
      3. After that, Auto-Plant ON should work

**The readme doesnt explain well what this CPS check is or if its needed at all.**

    Cps mult check is completely optional.
    Depending on the activated check:
      - Auto-Plant : It will only plant new seed if the bonus CpS is below the given value
      - Auto-Harvest : It will only harvest if the bonus Cps is above the given value
