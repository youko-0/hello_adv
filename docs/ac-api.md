# 易次元 (AVG163) `ac` API 参考文档

> **自动生成**：由 `generate_api_docs.py` 从 `game.deobfuscated.js` 逆向提取，
> 所有参数均直接来自源码中各命令类的 `dealArgs` 默认 `config` 对象，无手动补充。
>
> 调用方式：`await ac.methodName({ ... })`

## 目录

- **🏗️ 创建控件**
  - [createAdOption](#createadoption)
  - [createAutoRunOption](#createautorunoption)
  - [createBuyOption](#createbuyoption)
  - [createChat](#createchat)
  - [createCheatDetect](#createcheatdetect)
  - [createDownloadAppOption](#createdownloadappoption)
  - [createDrawNode](#createdrawnode)
  - [createExitOption](#createexitoption)
  - [createImage](#createimage)
  - [createInputBoxGroup](#createinputboxgroup)
  - [createLayer](#createlayer)
  - [createLock](#createlock)
  - [createMessage](#createmessage)
  - [createOption](#createoption)
  - [createOptionGroup](#createoptiongroup)
  - [createParticle](#createparticle)
  - [createPercentage](#createpercentage)
  - [createPicDisplay](#createpicdisplay)
  - [createPieChart](#createpiechart)
  - [createPlayBackTextView](#createplaybacktextview)
  - [createPrepayOption](#createprepayoption)
  - [createProfilePageView](#createprofilepageview)
  - [createRadarChart](#createradarchart)
  - [createRadioButton](#createradiobutton)
  - [createRadioGroup](#createradiogroup)
  - [createRedeemBox](#createredeembox)
  - [createScrollView](#createscrollview)
  - [createSequence](#createsequence)
  - [createShareOption](#createshareoption)
  - [createSlider](#createslider)
  - [createSpine](#createspine)
  - [createStyle](#createstyle)
  - [createText](#createtext)
  - [createTextDisplay](#createtextdisplay)
  - [createVarDisplay](#createvardisplay)
  - [createVarGroupDisplay](#createvargroupdisplay)
- **🎬 动画 / 变换**
  - [changeIndex](#changeindex)
  - [changeMaskBy](#changemaskby)
  - [changeMaskTo](#changemaskto)
  - [clearDrawNode](#cleardrawnode)
  - [drawPoly](#drawpoly)
  - [drawSegment](#drawsegment)
  - [fadeTo](#fadeto)
  - [filter](#filter)
  - [flicker](#flicker)
  - [flip](#flip)
  - [hide](#hide)
  - [moveBy](#moveby)
  - [moveTo](#moveto)
  - [remove](#remove)
  - [rotateBy](#rotateby)
  - [rotateTo](#rotateto)
  - [scaleBy](#scaleby)
  - [scaleTo](#scaleto)
  - [shakeScreen](#shakescreen)
  - [show](#show)
  - [trans](#trans)
  - [update](#update)
- **🔊 媒体播放**
  - [globalVolBy](#globalvolby)
  - [globalVolTo](#globalvolto)
  - [pauseAudio](#pauseaudio)
  - [playAudio](#playaudio)
  - [playBGM](#playbgm)
  - [playVideo](#playvideo)
  - [resumeAudio](#resumeaudio)
  - [stopAudio](#stopaudio)
  - [stopBGM](#stopbgm)
  - [volBy](#volby)
  - [volTo](#volto)
- **🔍 查询**
  - [getAutoPlay](#getautoplay)
  - [getBadgeNum](#getbadgenum)
  - [getBuyCount](#getbuycount)
  - [getCanvasHeight](#getcanvasheight)
  - [getCanvasWidth](#getcanvaswidth)
  - [getCardNum](#getcardnum)
  - [getGameSetting](#getgamesetting)
  - [getGuardNum](#getguardnum)
  - [getPos](#getpos)
  - [getRoleLevel](#getrolelevel)
  - [getTime](#gettime)
- **⚙️ 控制流**
  - [callUI](#callui)
  - [delay](#delay)
  - [removeCurrentUI](#removecurrentui)
  - [replaceUI](#replaceui)
  - [saveGameSettingToServer](#savegamesettingtoserver)
  - [sceneFinish](#scenefinish)
  - [setAutoPlay](#setautoplay)
  - [setGameSetting](#setgamesetting)
  - [startGame](#startgame)
- **📦 其他**
  - [chatClear](#chatclear)
  - [chatOff](#chatoff)
  - [chatOn](#chaton)
  - [dialogContent](#dialogcontent)
  - [dialogOff](#dialogoff)
  - [dialogOn](#dialogon)
  - [messageClear](#messageclear)
  - [sysDialogOff](#sysdialogoff)
  - [sysDialogOn](#sysdialogon)
  - [videoSprite](#videosprite)

---

## 通用说明

### 坐标系
- 原点 `(0,0)` 位于屏幕**左下角**（Cocos2d 坐标系）
- X 轴向右为正，Y 轴向上为正，单位：像素（px）

### 锚点（anchor）
- `{x:0, y:0}` — 左下角（`createLayer` 默认）
- `{x:0.5, y:0.5}` — 中心点（`createImage` 默认）
- ⚠️ **锚点只能在创建时设置**，后续无法修改

### duration
- 单位：**毫秒（ms）**；`0` 表示立即执行

### 沙箱限制
- `cc`、`window`、`document` 在脚本环境中均为 `null`
- 必须通过 `ac` API 操作所有控件

---

## 🏗️ 创建控件

### createAdOption

```javascript
await ac.createAdOption({ name, index, inlayer, visible, nResId, sResId, pos, anchor, viewSuccessFunc });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `viewSuccessFunc` | `void 0` |

---

### createAutoRunOption

```javascript
await ac.createAutoRunOption({ name, index, inlayer, visible, nResId, sResId, switch, pos, anchor });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `switch` | `false` |
| `pos` | `{ 'x': 360, 'y': 640 }` |
| `anchor` | `{ 'x': 50, 'y': 50 }` |

---

### createBuyOption

```javascript
await ac.createBuyOption({ name, index, inlayer, visible, nResId, sResId, bResId, pos, anchor, opacity, scale, productId });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `bResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `opacity` | `100` |
| `scale` | `100` |
| `productId` | `''` |

---

### createChat

```javascript
await ac.createChat({ name, index, inlayer, visible, size, anchor, pos, sort });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `size` | `{ 'width': 634, 'height': 680 }` |
| `anchor` | `{ 'x': 50, 'y': 50 }` |
| `pos` | `{ 'x': 640, 'y': 360 }` |
| `sort` | `'bottom'` |

---

### createCheatDetect

```javascript
await ac.createCheatDetect({ conditionId });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `conditionId` | `—` |

---

### createDownloadAppOption

```javascript
await ac.createDownloadAppOption({ name, index, inlayer, visible, nResId, sResId, pos, anchor });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 640, 'y': 360 }` |
| `anchor` | `{ 'x': 50, 'y': 50 }` |

---

### createDrawNode

```javascript
await ac.createDrawNode({ name, index, inlayer, pos, anchor, size, verticalFlip, horizontalFlip, visible, onTouchBegan, onTouchMoved, onTouchEnded });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `verticalFlip` | `false` |
| `horizontalFlip` | `false` |
| `visible` | `true` |
| `onTouchBegan` | `void 0` |
| `onTouchMoved` | `void 0` |
| `onTouchEnded` | `void 0` |

---

### createExitOption

```javascript
await ac.createExitOption({ name, index, inlayer, visible, nResId, sResId, pos, anchor });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |

---

### createImage

```javascript
await ac.createImage({ name, index, inlayer, resId, pos, anchor, scale, opacity, verticalFlip, horizontalFlip, visible, maskColor, maskOpacity, onTouchBegan, onTouchMoved, onTouchEnded, onTouchEntered, onTouchLeft, onDragEnded, dragDirection, dragRange, body });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `resId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `scale` | `100` |
| `opacity` | `100` |
| `verticalFlip` | `false` |
| `horizontalFlip` | `false` |
| `visible` | `true` |
| `maskColor` | `'#000000'` |
| `maskOpacity` | `0` |
| `onTouchBegan` | `void 0` |
| `onTouchMoved` | `void 0` |
| `onTouchEnded` | `void 0` |
| `onTouchEntered` | `void 0` |
| `onTouchLeft` | `void 0` |
| `onDragEnded` | `void 0` |
| `dragDirection` | `void 0` |
| `dragRange` | `0` |
| `body` | `''` |

---

### createInputBoxGroup

```javascript
await ac.createInputBoxGroup({ name, index, inlayer, visible, pos, size, anchor, reactStyle, inputBoxGroup, buttonNResId, buttonSResId, btnPos, onTouchBegan, onTouchEnded });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': cc.winSize.width, 'height': cc.winSize.height }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `reactStyle` | `''` |
| `inputBoxGroup` | `[]` |
| `buttonNResId` | `''` |
| `buttonSResId` | `''` |
| `btnPos` | `{ 'x': 0, 'y': 0 }` |
| `onTouchBegan` | `function () { }` |
| `onTouchEnded` | `function () { }` |

---

### createLayer

```javascript
await ac.createLayer({ name, index, inlayer, visible, pos, anchor, size, clipMode, onTouchBegan, onTouchEnded, scalable, initialScale, minScale, maxScale, zoomSpeed, zoomAnimationDuration, onZoomStart, onZoomEnd, onZoomChange });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `clipMode` | `false` |
| `onTouchBegan` | `void 0` |
| `onTouchEnded` | `void 0` |
| `scalable` | `false` |
| `initialScale` | `1` |
| `minScale` | `1` |
| `maxScale` | `2` |
| `zoomSpeed` | `0.1` |
| `zoomAnimationDuration` | `0.2` |
| `onZoomStart` | `void 0` |
| `onZoomEnd` | `void 0` |
| `onZoomChange` | `void 0` |

---

### createLock

```javascript
await ac.createLock({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### createMessage

```javascript
await ac.createMessage({ chatRoleId, chatId, id, mode, effect, duration, hasRoleName, roleName, roleNameStyle, hasRoleAvatar, roleAvatarResId, type, bgOpacity, content, picResId, picScale, canBlock, onTouchBegan, onTouchEnded, resList });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `chatRoleId` | `0` |
| `chatId` | `''` |
| `id` | `''` |
| `mode` | `_0x2dadac.left` |
| `effect` | `_0x123b8d.normal` |
| `duration` | `0` |
| `hasRoleName` | `true` |
| `roleName` | `''` |
| `roleNameStyle` | `''` |
| `hasRoleAvatar` | `true` |
| `roleAvatarResId` | `_0x2b7cfc.getDefaultChatAvatarResId()` |
| `type` | `_0x3fe3cc.text` |
| `bgOpacity` | `100` |
| `content` | `''` |
| `picResId` | `_0x2b7cfc.getDefaultChatPicResId()` |
| `picScale` | `100` |
| `canBlock` | `true` |
| `onTouchBegan` | `void 0` |
| `onTouchEnded` | `void 0` |
| `resList` | `[]` |

---

### createOption

```javascript
await ac.createOption({ name, index, inlayer, visible, nResId, sResId, content, pos, anchor, opacity, scale, style, onTouchBegan, onTouchMoved, onTouchEnded, clickAudio });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `content` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `opacity` | `100` |
| `scale` | `100` |
| `style` | `''` |
| `onTouchBegan` | `void 0` |
| `onTouchMoved` | `void 0` |
| `onTouchEnded` | `void 0` |
| `clickAudio` | `void 0` |

---

### createOptionGroup

```javascript
await ac.createOptionGroup({ name, defaultComposition, spacing, index, inlayer, optionGroup, timer, clickAudio });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `defaultComposition` | `true` |
| `spacing` | `-1` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `optionGroup` | `[]` |
| `timer` | `{ 'time': 5 }` |
| `clickAudio` | `null` |

---

### createParticle

```javascript
await ac.createParticle({ life, shootAngle, moveSpeed, parpos });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `life` | `—` |
| `shootAngle` | `—` |
| `moveSpeed` | `—` |
| `parpos` | `—` |

---

### createPercentage

```javascript
await ac.createPercentage({ name, index, inlayer, visible, minNum, maxNum, num, resId, pos, anchor, scale, opacity });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `minNum` | `0` |
| `maxNum` | `100` |
| `num` | `0` |
| `resId` | `0` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `scale` | `100` |
| `opacity` | `100` |

---

### createPicDisplay

```javascript
await ac.createPicDisplay({ name, index, inlayer, picGroup, pos, size, anchor, opacity, scale, visible });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `''` |
| `inlayer` | `'window'` |
| `picGroup` | `[]` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `opacity` | `100` |
| `scale` | `100` |
| `visible` | `true` |

---

### createPieChart

```javascript
await ac.createPieChart({ name, index, inlayer, pos, anchor, sectors, radius, width, height, lineColor, lineWidth, visible, legend });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 50, 'y': 50 }` |
| `sectors` | `[ { 'value': 50, 'color': '#FF0000', 'text': '' }, { 'value': 50, 'color': '#...` |
| `radius` | `100` |
| `width` | `void 0` |
| `height` | `void 0` |
| `lineColor` | `'#FFFFFF'` |
| `lineWidth` | `1` |
| `visible` | `true` |
| `legend` | `{ 'visible': false, 'distance': 100, 'style': {} }` |

---

### createPlayBackTextView

```javascript
await ac.createPlayBackTextView({ name, index, inlayer, visible, content, pos, size, anchor, spacing, style, scrollConfig });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `'playBackTextView'` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `content` | `''` |
| `pos` | `{ 'x': 242, 'y': 188 }` |
| `size` | `{ 'width': 830, 'height': 355 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `spacing` | `1.1` |
| `style` | `''` |
| `scrollConfig` | `null` |

---

### createPrepayOption

```javascript
await ac.createPrepayOption({ name, index, inlayer, visible, nResId, sResId, pos, anchor, opacity, scale });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `opacity` | `100` |
| `scale` | `100` |

---

### createProfilePageView

```javascript
await ac.createProfilePageView({ name, index, inlayer, visible, nResId, sResId, itemDefault, anchor, pos, size, scale, opacity, pageViewSize, pageViewPos, itemSize, itemImgRect, itemTitleRect, itemDateRect, itemTimeRect, itemTitleStyle, itemTimeStyle, pageNum, items, row, col, isCustom, saveOrLoad });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `'setting'` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `itemDefault` | `''` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `pos` | `{ 'x': 189, 'y': 37 }` |
| `size` | `{ 'width': 1021, 'height': 610 }` |
| `scale` | `100` |
| `opacity` | `100` |
| `pageViewSize` | `{ 'width': 1021, 'height': 530 }` |
| `pageViewPos` | `{ 'x': 189, 'y': 117 }` |
| `itemSize` | `{ 'width': 290, 'height': 240 }` |
| `itemImgRect` | `{ 'x': 23, 'y': 78, 'width': 250, 'height': 141 }` |
| `itemTitleRect` | `{ 'x': 23, 'y': 40, 'width': 250 }` |
| `itemDateRect` | `{ 'x': 23, 'y': 15, 'width': 104 }` |
| `itemTimeRect` | `{ 'x': 127, 'y': 15, 'width': 100 }` |
| `itemTitleStyle` | `''` |
| `itemTimeStyle` | `''` |
| `pageNum` | `{ 'normal': 8234, 'press': 8235, 'x': 541, 'y': 37 }` |
| `items` | `[ { 'x': 214, 'y': 407 }, { 'x': 554, 'y': 407 }, { 'x': 895, 'y': 407 }, { '...` |
| `row` | `2` |
| `col` | `3` |
| `isCustom` | `true` |
| `saveOrLoad` | `1` |

---

### createRadarChart

```javascript
await ac.createRadarChart({ name, index, inlayer, pos, anchor, axisCount, maxValue, radius, width, height, data, axisWidth, axisColor, lineColor, lineWidth, fillColor, fillOpacity, visible });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 50, 'y': 50 }` |
| `axisCount` | `3` |
| `maxValue` | `100` |
| `radius` | `100` |
| `width` | `void 0` |
| `height` | `void 0` |
| `data` | `[]` |
| `axisWidth` | `1` |
| `axisColor` | `'#FFFFFF'` |
| `lineColor` | `'#FF0000'` |
| `lineWidth` | `1` |
| `fillColor` | `'#FF0000'` |
| `fillOpacity` | `100` |
| `visible` | `true` |

---

### createRadioButton

```javascript
await ac.createRadioButton({ name, index, inlayer, visible, nResId, sResId, pos, anchor, scale, onSelected, onCancelled });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `scale` | `100` |
| `onSelected` | `null` |
| `onCancelled` | `null` |

---

### createRadioGroup

```javascript
await ac.createRadioGroup({ name, index, inlayer, visible, pos, anchor, size, opacity, scale, radios, onTouchBegan, onTouchEnded });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `'radioGroup'` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 80, 'height': 242 }` |
| `opacity` | `100` |
| `scale` | `100` |
| `radios` | `[ { 'pos': { 'x': 0, 'y': 0 }, 'size': { 'width': 80, 'height': 118 }, 'nResI...` |
| `onTouchBegan` | `null` |
| `onTouchEnded` | `null` |

---

### createRedeemBox

```javascript
await ac.createRedeemBox({ name, redeemTypeCode, index, inlayer, visible, pos, size, anchor, inputBox, buttonNResId, buttonSResId, btnPos });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `redeemTypeCode` | `0` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `pos` | `{ 'x': 476, 'y': 333 }` |
| `size` | `{ 'width': 328, 'height': 54 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `inputBox` | `{ 'textStyle': '', 'placeHolder': '请输入兑换码', 'max': 20, 'min': 9, 'inputWidth'...` |
| `buttonNResId` | `''` |
| `buttonSResId` | `''` |
| `btnPos` | `{ 'x': 684, 'y': 333 }` |

---

### createScrollView

```javascript
await ac.createScrollView({ name, index, inlayer, pos, size, innerSize, anchor, visible, verticalScroll, horizontalScroll });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `''` |
| `inlayer` | `'window'` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `innerSize` | `{ 'width': 0, 'height': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `visible` | `true` |
| `verticalScroll` | `true` |
| `horizontalScroll` | `false` |

---

### createSequence

```javascript
await ac.createSequence({ pixId, name, index, inlayer, resGroup, loop, pos, anchor, horizontalFlip, verticalFlip, opacity, scale, visible, onTouchBegan, onTouchMoved, onTouchEnded, onTouchEntered, onTouchLeft, onDragEnded, dragDirection, dragRange });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `pixId` | `''` |
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `resGroup` | `[]` |
| `loop` | `false` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `horizontalFlip` | `false` |
| `verticalFlip` | `false` |
| `opacity` | `100` |
| `scale` | `100` |
| `visible` | `true` |
| `onTouchBegan` | `null` |
| `onTouchMoved` | `null` |
| `onTouchEnded` | `null` |
| `onTouchEntered` | `null` |
| `onTouchLeft` | `null` |
| `onDragEnded` | `null` |
| `dragDirection` | `null` |
| `dragRange` | `'horizontal'` |

---

### createShareOption

```javascript
await ac.createShareOption({ name, index, inlayer, visible, nResId, sResId, pos, anchor, shareSuccessFunc });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `nResId` | `''` |
| `sResId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `shareSuccessFunc` | `null` |

---

### createSlider

```javascript
await ac.createSlider({ name, index, inlayer, visible, slidebg, slidefg, slideBarN, slideBarS, pos, anchor, scale, minValue, maxValue, step, direction, bindFunc, initValue });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `'setting'` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `slidebg` | `''` |
| `slidefg` | `''` |
| `slideBarN` | `''` |
| `slideBarS` | `''` |
| `pos` | `{ 'x': 457, 'y': 488 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `scale` | `100` |
| `minValue` | `0` |
| `maxValue` | `100` |
| `step` | `1` |
| `direction` | `'horizontal'` |
| `bindFunc` | `function (_0x404ebd) { _0x400afd.log('[SliderCommand] default setter function...` |
| `initValue` | `100` |

---

### createSpine

```javascript
await ac.createSpine({ name, index, inlayer, spineId, pos, anchor, speed, skin, animation, scale, loop, opacity, verticalFlip, horizontalFlip, visible, onTouchBegan, onTouchMoved, onTouchEnded, onTouchEntered, onTouchLeft, onDragEnded, dragDirection, dragRange });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `spineId` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `speed` | `1` |
| `skin` | `'default'` |
| `animation` | `'default'` |
| `scale` | `100` |
| `loop` | `false` |
| `opacity` | `100` |
| `verticalFlip` | `false` |
| `horizontalFlip` | `false` |
| `visible` | `true` |
| `onTouchBegan` | `void 0` |
| `onTouchMoved` | `void 0` |
| `onTouchEnded` | `void 0` |
| `onTouchEntered` | `void 0` |
| `onTouchLeft` | `void 0` |
| `onDragEnded` | `void 0` |
| `dragDirection` | `void 0` |
| `dragRange` | `0` |

---

### createStyle

```javascript
await ac.createStyle({ name, font, bold, italic, fontSize, color, speed, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `font` | `''` |
| `bold` | `false` |
| `italic` | `false` |
| `fontSize` | `26` |
| `color` | `'#000000'` |
| `speed` | `5` |
| `canskip` | `true` |

---

### createText

```javascript
await ac.createText({ name, index, inlayer, visible, content, pos, size, direction, halign, valign, anchor, style, opacity, onTouchBegan, onTouchMoved, onTouchEnded, onTouchEntered, onTouchLeft, onDragEnded, dragDirection, dragRange, spacing });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `content` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `direction` | `_0x3f32a5.horizontal` |
| `halign` | `_0x2dadac.left` |
| `valign` | `_0x2c5347.center` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `style` | `''` |
| `opacity` | `100` |
| `onTouchBegan` | `null` |
| `onTouchMoved` | `null` |
| `onTouchEnded` | `null` |
| `onTouchEntered` | `null` |
| `onTouchLeft` | `null` |
| `onDragEnded` | `null` |
| `dragDirection` | `null` |
| `dragRange` | `null` |
| `spacing` | `_0x34ad20.getDefaultFontSetting('text').spacing` |

---

### createTextDisplay

```javascript
await ac.createTextDisplay({ name, index, inlayer, visible, textGroup, pos, size, direction, halign, valign, anchor, spacing });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `textGroup` | `[]` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `direction` | `_0x3f32a5.horizontal` |
| `halign` | `_0x2dadac.middle` |
| `valign` | `_0x2c5347.center` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `spacing` | `_0x34ad20.getDefaultFontSetting('text').spacing` |

---

### createVarDisplay

```javascript
await ac.createVarDisplay({ name, index, inlayer, visible, style, pos, size, direction, halign, valign, anchor, bindFunc, clickFunc, spacing });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `style` | `''` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `direction` | `_0x3f32a5.horizontal` |
| `halign` | `_0x2dadac.middle` |
| `valign` | `_0x2c5347.center` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |
| `bindFunc` | `function () { }` |
| `clickFunc` | `function () { }` |
| `spacing` | `_0x34ad20.getDefaultFontSetting('text').spacing` |

---

### createVarGroupDisplay

```javascript
await ac.createVarGroupDisplay({ name, index, inlayer, visible, varGroup, pos, size, direction, halign, valign, anchor });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |
| `inlayer` | `'window'` |
| `visible` | `true` |
| `varGroup` | `[]` |
| `pos` | `{ 'x': 0, 'y': 0 }` |
| `size` | `{ 'width': 0, 'height': 0 }` |
| `direction` | `_0x3f32a5.horizontal` |
| `halign` | `_0x2dadac.middle` |
| `valign` | `_0x2c5347.center` |
| `anchor` | `{ 'x': 0, 'y': 0 }` |

---

## 🎬 动画 / 变换

### changeIndex

```javascript
await ac.changeIndex({ name, index });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `index` | `0` |

---

### changeMaskBy

```javascript
await ac.changeMaskBy({ name, r, g, b, opacity, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `r` | `0` |
| `g` | `0` |
| `b` | `0` |
| `opacity` | `100` |
| `duration` | `0` |
| `canskip` | `false` |

---

### changeMaskTo

```javascript
await ac.changeMaskTo({ name, r, g, b, opacity, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `r` | `0` |
| `g` | `0` |
| `b` | `0` |
| `opacity` | `100` |
| `duration` | `0` |
| `canskip` | `false` |

---

### clearDrawNode

```javascript
await ac.clearDrawNode({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### drawPoly

```javascript
await ac.drawPoly({ verts, fillColor, lineWidth, lineColor });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `verts` | `[]` |
| `fillColor` | `null` |
| `lineWidth` | `0` |
| `lineColor` | `null` |

---

### drawSegment

```javascript
await ac.drawSegment({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### fadeTo

```javascript
await ac.fadeTo({ name, opacity, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `opacity` | `100` |
| `duration` | `0` |
| `canskip` | `true` |
| `ease` | `''` |

---

### filter

```javascript
await ac.filter({ name, type, args, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `type` | `'gaussianblur'` |
| `args` | `1` |
| `duration` | `0` |
| `canskip` | `false` |

---

### flicker

```javascript
await ac.flicker({ r, g, b, opacity, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `r` | `0` |
| `g` | `0` |
| `b` | `0` |
| `opacity` | `100` |
| `duration` | `0` |
| `canskip` | `false` |

---

### flip

```javascript
await ac.flip({ name, horizontalFlip, verticalFlip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `horizontalFlip` | `false` |
| `verticalFlip` | `false` |

---

### hide

```javascript
await ac.hide({ name, effect, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `'normal'` |
| `duration` | `0` |
| `canskip` | `false` |

---

### moveBy

```javascript
await ac.moveBy({ name, x, y, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `x` | `0` |
| `y` | `0` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### moveTo

```javascript
await ac.moveTo({ name, x, y, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `x` | `0` |
| `y` | `0` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### remove

```javascript
await ac.remove({ name, effect, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `'normal'` |
| `duration` | `0` |
| `canskip` | `false` |

---

### rotateBy

```javascript
await ac.rotateBy({ name, angle1, angle2, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `angle1` | `0` |
| `angle2` | `void 0` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### rotateTo

```javascript
await ac.rotateTo({ name, angle1, angle2, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `angle1` | `0` |
| `angle2` | `void 0` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### scaleBy

```javascript
await ac.scaleBy({ name, x, y, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `x` | `0` |
| `y` | `0` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### scaleTo

```javascript
await ac.scaleTo({ name, x, y, duration, canskip, ease });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `x` | `100` |
| `y` | `100` |
| `duration` | `0` |
| `canskip` | `false` |
| `ease` | `_0x2d060a.normal` |

---

### shakeScreen

```javascript
await ac.shakeScreen({ strength, speed, angle, duration, canskip, loop });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `strength` | `0` |
| `speed` | `1` |
| `angle` | `45` |
| `duration` | `0` |
| `canskip` | `false` |
| `loop` | `false` |

---

### show

```javascript
await ac.show({ name, effect, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `'normal'` |
| `duration` | `0` |
| `canskip` | `false` |

---

### trans

```javascript
await ac.trans({ group, rule, duration, canskip });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `group` | `[]` |
| `rule` | `''` |
| `duration` | `0` |
| `canskip` | `false` |

---

### update

```javascript
await ac.update({ updateCb });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `updateCb` | `_0x4b3aea` |

---

## 🔊 媒体播放

### globalVolBy

```javascript
await ac.globalVolBy({ vol, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `vol` | `0` |
| `duration` | `0` |

---

### globalVolTo

```javascript
await ac.globalVolTo({ vol, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `vol` | `0` |
| `duration` | `0` |

---

### pauseAudio

```javascript
await ac.pauseAudio({ name });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |

---

### playAudio

```javascript
await ac.playAudio({ name, resId, vol, effect, duration, loop });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `resId` | `''` |
| `vol` | `100` |
| `effect` | `'normal'` |
| `duration` | `0` |
| `loop` | `false` |

---

### playBGM

```javascript
await ac.playBGM({ resId, vol, effect, duration, loop });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `resId` | `''` |
| `vol` | `100` |
| `effect` | `'normal'` |
| `duration` | `0` |
| `loop` | `true` |

---

### playVideo

```javascript
await ac.playVideo({ canskip, name, resId, vol, showControls });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `canskip` | `true` |
| `name` | `''` |
| `resId` | `''` |
| `vol` | `100` |
| `showControls` | `false` |

---

### resumeAudio

```javascript
await ac.resumeAudio({ name });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |

---

### stopAudio

```javascript
await ac.stopAudio({ name, effect, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `'normal'` |
| `duration` | `0` |

---

### stopBGM

```javascript
await ac.stopBGM({ effect, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `effect` | `'normal'` |
| `duration` | `0` |

---

### volBy

```javascript
await ac.volBy({ name, vol, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `vol` | `0` |
| `duration` | `0` |

---

### volTo

```javascript
await ac.volTo({ name, vol, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `vol` | `0` |
| `duration` | `0` |

---

## 🔍 查询

### getAutoPlay

```javascript
await ac.getAutoPlay({ key });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `key` | `—` |

---

### getBadgeNum

```javascript
await ac.getBadgeNum({ badgeId });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `badgeId` | `—` |

---

### getBuyCount

```javascript
await ac.getBuyCount({ productId });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `productId` | `—` |

---

### getCanvasHeight

```javascript
await ac.getCanvasHeight({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### getCanvasWidth

```javascript
await ac.getCanvasWidth({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### getCardNum

```javascript
await ac.getCardNum({ cardId });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `cardId` | `—` |

---

### getGameSetting

```javascript
await ac.getGameSetting({ key });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `key` | `—` |

---

### getGuardNum

```javascript
await ac.getGuardNum({ guardNumType, roleID });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `guardNumType` | `—` |
| `roleID` | `—` |

---

### getPos

```javascript
await ac.getPos({ name, 对象名 });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `—` |
| `对象名` | `—` |

---

### getRoleLevel

```javascript
await ac.getRoleLevel({ roleId });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `roleId` | `—` |

---

### getTime

```javascript
await ac.getTime({ timeType, isReturnLocal });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `timeType` | `—` |
| `isReturnLocal` | `—` |

---

## ⚙️ 控制流

### callUI

```javascript
await ac.callUI({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### delay

```javascript
await ac.delay({ time });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `time` | `—` |

---

### removeCurrentUI

```javascript
await ac.removeCurrentUI({ time });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `time` | `—` |

---

### replaceUI

```javascript
await ac.replaceUI({ time });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `time` | `—` |

---

### saveGameSettingToServer

```javascript
await ac.saveGameSettingToServer({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### sceneFinish

```javascript
await ac.sceneFinish({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### setAutoPlay

```javascript
await ac.setAutoPlay({ switch });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `switch` | `—` |

---

### setGameSetting

```javascript
await ac.setGameSetting({ key, value });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `key` | `—` |
| `value` | `—` |

---

### startGame

```javascript
await ac.startGame({ updateCb });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `updateCb` | `_0x4b3aea` |

---

## 📦 其他

### chatClear

```javascript
await ac.chatClear({ chatRoleId, chatId, id, mode, effect, duration, hasRoleName, roleName, roleNameStyle, hasRoleAvatar, roleAvatarResId, type, bgOpacity, content, picResId, picScale, canBlock, onTouchBegan, onTouchEnded, resList });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `chatRoleId` | `0` |
| `chatId` | `''` |
| `id` | `''` |
| `mode` | `_0x2dadac.left` |
| `effect` | `_0x123b8d.normal` |
| `duration` | `0` |
| `hasRoleName` | `true` |
| `roleName` | `''` |
| `roleNameStyle` | `''` |
| `hasRoleAvatar` | `true` |
| `roleAvatarResId` | `_0x2b7cfc.getDefaultChatAvatarResId()` |
| `type` | `_0x3fe3cc.text` |
| `bgOpacity` | `100` |
| `content` | `''` |
| `picResId` | `_0x2b7cfc.getDefaultChatPicResId()` |
| `picScale` | `100` |
| `canBlock` | `true` |
| `onTouchBegan` | `void 0` |
| `onTouchEnded` | `void 0` |
| `resList` | `[]` |

---

### chatOff

```javascript
await ac.chatOff({ name, effect, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `_0x123b8d.normal` |
| `duration` | `0` |

---

### chatOn

```javascript
await ac.chatOn({ name, effect, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `effect` | `_0x123b8d.normal` |
| `duration` | `0` |

---

### dialogContent

```javascript
await ac.dialogContent({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### dialogOff

```javascript
await ac.dialogOff({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### dialogOn

```javascript
await ac.dialogOn({ /* 参数见源码 */ });
```

> ⚠️ 未能从源码中提取到参数信息，请查阅源码。

---

### messageClear

```javascript
await ac.messageClear({ name, vol, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `vol` | `0` |
| `duration` | `0` |

---

### sysDialogOff

```javascript
await ac.sysDialogOff({ effect, duration });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `effect` | `'normal'` |
| `duration` | `0` |

---

### sysDialogOn

```javascript
await ac.sysDialogOn({ content, id });
```

**参数（来源：从实现体推断，仅列出字段名，无默认值）：**

| 参数 | 默认值 |
|---|---|
| `content` | `—` |
| `id` | `—` |

---

### videoSprite

```javascript
await ac.videoSprite({ name, resId, vol, canskip, index, loop, onEnded });
```

**参数（来源：`dealArgs` 完整默认值）：**

| 参数 | 默认值 |
|---|---|
| `name` | `''` |
| `resId` | `''` |
| `vol` | `100` |
| `canskip` | `true` |
| `index` | `0` |
| `loop` | `false` |
| `onEnded` | `null` |

---

## 统计

| 分类 | 数量 |
|---|---|
| 🏗️ 创建控件 | 36 |
| 🎬 动画 / 变换 | 22 |
| 🔊 媒体播放 | 11 |
| 🔍 查询 | 11 |
| ⚙️ 控制流 | 9 |
| 📦 其他 | 10 |
| **合计** | **99** |

*配置可提取：88 / 99*
