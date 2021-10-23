# cookie-garden-helper-reloaded

Automate your garden in Cookie Clicker

This is the Steam version of cookie-garden-helper (https://github.com/yannprada/cookie-garden-helper)

## How to install

Import the CookieGardenHelper-reloaded folder to `<steam>\SteamApps\common\Cookie Clicker\resources\app\mods\local`
There should only be info.txt and main.js in that folder, no sub-folders

## How it works

To begin, click the button ***CGHR*** at the bottom of your
garden / farms. There, you can configure how you would like the mod to operate.

The mod loops through each unlocked tile, then tries to auto-harvest
or auto-plant, depending on what is activated.

### Auto-harvest

First, it will check if the tile is empty.

If not, it will check if the plant is immortal. If it is, and the **Avoid immortals** option 
is **ON**, it will ignore this tile.

If not, it will compute the plant stage. Below is a list of these stages 
and the conditions when the plant will be harvested:

- young:
  - if it is a weed, and the option **Remove weeds** is **ON**. 
  This option does not prevent fungi from spreading.
  - if the option **Clean garden** is **ON** and the seed is not new, 
  or a different plant is on the tile in the saved plot.
  
- mature:
  - if it is a new seed and the option **New seeds** is **ON**.
  - if the option **Check CpS Mult** is **ON**, the plant gives bonus CpS on harvest, 
  and the current CpS multiplier is above or equal to the one specified at **Mini CpS multiplier**.
  - if the option **Matured seeds** is **ON**, all plants will be harvested as soon as they are mature
  
  ***Note:*** Auto-harvesting all mature seeds prevents getting the CpS bonus from letting plants like 
  Crumbspore explode!
  
- dying:
  - if the plant is dying, the option **Check CpS Mult** is **ON**, the plant gives bonus CpS on harvest, 
  and the current CpS multiplier is above or equal to   the one specified at **Mini CpS multiplier**.
  - if the plant is dying, the last tick is 5 seconds from expiring, and the option **Dying plants** is **ON**.

### Auto-plant

This will plant the saved plot if:

- the tile is empty
- a plot has been previously saved with the button **Save plot**
- the option **Avoid Buffs** is:
  - **ON**, and there is no CpS multiplier from a buff.
  - **OFF**.
- the option **Check CpS Mult** is:
  - **ON**, and the current CpS multiplier in the Garden is
below or equal to the one specified at **Maxi CpS multiplier**.
  - **OFF**.

***Note:*** mouse over the message *Plot saved* to see what was saved.

The option **Rotate Soil** :
  - **ON** - The soil is automatically changed to clay or wood chips if there are more mature seeds than young, 
  or to fertilizer if there are more young seeds.
  - **OFF** - The soil will not change on its own.

***Note:*** Rotate Soil does not require **Auto-plant** to be **ON**.

### Manual tools

- **Plant selected seed**:
  1) select a seed you have unlocked.
  2) click this button to fill all the empty tiles of your plot, if you can afford it.
  3) don't forget to deselect the seed.

### Garden upgrades

This section displays all garden upgrades, shows which ones were bought, or unlocked. 
The tooltip shows how to unlock the upgrade.

### Seed List

This section displays all seeds in the game. Orange if not unlocked yet, but possible, 
Red if you cannot unlock it yet (one or both parents are not unlocked).

**Hovering** on a seed's name will display a suggested seed mutation layout.

**Clicking** on its name will overwrite the saved plot by the suggested layout, for use with **Auto-plant**.

## Sacrifice garden

When you sacrifice your garden, a few things will happen:

- your saved plot will be erased.
- the auto-harvest will be toggled **OFF**.
- the auto-plant will be toggled **OFF**.

This is to prevent planting locked seeds, as well as allowing you to verify your
configuration before restarting automation.

The rest of your configuration will remain.

## Screenshot

![Screenshot - UI of the mod cookie-garden-helper](/img/cookie-garden-helper.png?raw=true "UI")

## Changelog

### 1.0

>`First version of the mod`

### 1.1

>`New "Seed List" section for mutation`
>
>`Added an explodable category, skipping harvest`
>
>1.1.1: `Fixed recipes with wrong parents or wrong layouts`
>
>1.1.1: `Improved recipe for Golden Clover`

### 1.2

>`New "Avoid Buffs" button to save some cookies when planting`

### 1.3

>`New "Rotate Soil" button`
>
>`New "Garden upgrades" section`
>
>`A fix to prevent planting not unlocked seeds`

### 1.4

>`New "Matured seeds" button`
>
>1.4.1: `Fixed blocking issue starting 1.3`
>
>1.4.2: `Fixed blocking issue at loading`
>
>1.4.3: `Fixed few wrong parents, even if the tooltip was ok`
>
>1.4.4: `Issue of parent seed selection for Farm levels 3 and 4`
>
>1.4.5: `Improved the golden clover layout`
>
>1.4.6: `Fixed a conflict when CCSE was installed`
>
>1.4.7: `Added a combo selection for soil rotation, and fixed an issue with the rotation`

### Edits
>
>`Add CpS Bonus category so that only plants with bonus CpS are harvested early`
>
>`Clarified some things in this readme`

## Issues

If you have any issues, you can either create an issue in this git repo, or ping Chakaa on [Reddit](https://old.reddit.com/r/CookieClicker/comments/phxdge/garden_helper_for_steam_version/)

## FAQ

> It's loaded and the CGHR button is there, but it never seems to do anything?

Auto-plant does nothing if it doesn't have a saved plot.
In other words:  
1. You need to manually plant a first round of plants
2. You need to press the **Save Plot** button. When hovering on the text right next to it, 
you should have a tooltip with your layout
4. Alternatively, you can directly select a seed from the Seed List.
5. After that, **Auto-Plant: ON** should work  

> The readme doesn't explain well what the CpS check is, or if it's needed at all

The CpS mult check is completely optional.  
Depending on the activated check:  
- **Auto-plant** : It will only plant a new seed if the bonus CpS is *below* the given value. 
A value of **0** is identical to the **Avoid Buffs** check, no bonus CpS, a value of **0.5** means 
only planting during a Clot, a value of **1** means only planting when there is no buff, etc.
- **Auto-harvest** : It will only harvest if the bonus CpS is *above* the given value. 
A value of **1** means never harvest during a Clot or other malus, a value **7** means only harvest 
during a Frenzy, etc.

***Note:*** Auto-harvest CpS will only harvest plants that provide a harvesting CpS bonus.

> The tooltip showing the saved plot is all shuffled around

You might have changed from the default zoom. Press Ctrl + 0 to revert to the normal zoom.

> Clean garden is removing new seeds

Make sure you're not switching to a saved plot from the seed list that contains a plant at 
the spot your new seed is growing. If you want to safely swap, disable clean garden, allow 
auto-plant to fill the remaining slots with plants, and then save the plot with the new seed included.