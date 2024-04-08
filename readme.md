# koishi-plugin-jackie-rps

[![npm](https://img.shields.io/npm/v/koishi-plugin-jackie-rps?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-jackie-rps)

# 成龙历险记

## 背景介绍

这是我小时候在与同伴玩耍时他教我的游戏,背景基于美国动漫《成龙历险记》，其中的十二符咒传说，也是小时候消磨时光的一个非常愉快的游戏，在有能力后便尝试着把它变成一个真正的游戏。
制作初期，仅实现十二符咒的基本操作与游戏框架，后还有各大恶魔等元素等待更新
……


## 求恰饭

# <center>[![alt 爱发电](https://static.afdiancdn.com/static/img/logo/logo.png) 爱发电](https://afdian.net/a/sparkuix) </center>
<center>如果你愿意的话，请我喝杯鲜牛奶吧！</center>

## 游戏简介

这是一个基于Koishi的多人对战游戏,基于rps(即石头剪刀布),玩家可以通过在不同场景之间的切换和使用符咒等操作来获取游戏胜利

注意：本游戏的机制较为复杂，上手需要一定的时间

## 游戏开始

- **创建游戏**：输入`创建游戏`指令，开始一个新的游戏冒险。
- **加入游戏**：输入`加入游戏`指令，加入已经创建的游戏中。
- **出拳**：每位玩家通过`出拳`指令进行石头、剪刀、布的出拳决定行动。
由于这本身就是一个随机事件，所以暂不支持指定出拳
在双人游戏中，随机事件总是会分出结果
在三人及以上游戏时，游戏也不存在平局，将只会有两种结果
## 游戏规则
- 游戏不限制玩家数量，但是考虑到机制以及平衡性，一般建议2-4人游玩
- 游戏开始后，随时可以加入新玩家
---
- 游戏中有多个场景，包括**商店**、**玩家的家**、和**广场**，在商店内可以购买符咒，符咒的价格是**15**
- 玩家初始血量为**10**，金钱为**15**，初始位置在**广场**，高度为**0**
- 击败任意玩家可以获得**5**金钱奖励
- 在商店的玩家不会受到任何伤害
- 在猜拳后，每赢得一位玩家，都可以进行2步操作，在猜拳结果分出后，以发送指令的顺序来执行，直到所有玩家的步数被消耗完
- 你可以使用`敲 @目标`操作来对与你处在同一场景并且高度差不超过1的玩家造成1点伤害
- 当你与别的玩家都在商店时，你可以`踢出 @目标`来将他踢出商店，从而对其进行攻击
## 游戏操作

- 你可以在游戏开始后使用`玩家状态`来查看当前所有玩家的状态，包括金钱，位置，血量，剩余步数，背包等

### 移动
玩家可以在三个场景间移动：**商店**、**任意玩家的家**、和**广场**。
- 从玩家的家到广场：`移动 广场`
- 从广场到商店：`移动 商店`
- 从商店回到广场：`移动 广场`
- 你可以通过`移动 @某玩家` 来移动到某位玩家的家
- 你每次行动只能移动一段距离,也就是说你无法直接从家里前往商店,也无法直接前往别的玩家的家里,**除非你拥有牛符咒**
### 十二符咒
游戏中包含以下十二符咒，每个符咒都有其特殊效果：

1. **鼠符咒**
- 可以把指定的玩家变成石头，使之无法进行任何操作
- 如果你是石头状态，则在猜拳后步数将被重置为0，因为你无法进行任何操作。
- 被变成石头的玩家将会免疫除敲击外的一切伤害，但是被敲击时会受到10点伤害
- 使用`变石头 @目标`指令
2. **牛符咒**
- 可以对高度差与你在4以内的玩家造成2点伤害
- 使用`石头 @目标`指令
- 可以对与你在同一场景内(商店除外)并且高度差不超过1的玩家进行扔出操作，这将改变目标的位置，并造成3点伤害，但是扔到的位置不能是商店 使用`扔 @目标 位置`指令 此位置可以是广场，或at一位玩家，这将使目标位移至他的家里
- 使用`扔 @目标 位置`指令
- 牛符咒的被动技能，你可以无视移动场景时的距离限制，例如：你可以直接从你的家前往商店，而无需经过广场
3. **虎符咒**
- 可以使得你的生命上限增加至20
- 购买时将生命*2
4. **兔符咒**
- 可以将你每赢得一个玩家获得的行动步数*2
5. **龙符咒**
- 可以使用爆破技能，对与你在同一场景内并且高度差不超过3的所有玩家造成3点伤害
- 使用`爆破`指令
6. **蛇符咒**
- 隐身，可以抵挡一次任意伤害
- 使用`隐身`指令
7. **马符咒**
- 可以恢复一次生命至满血，在场上仅有一名玩家以前，仅能使用一次，即一个完整回合仅能使用一次
- 使用`恢复`指令
8. **羊符咒**
- 灵魂出窍，可以附身到不在商店的玩家身上，将他的灵魂挤出，并代由执行操作
- 未完成
9. **猴符咒**
- 可以将指定玩家变为小动物，小动物形态下的玩家可以主动变回，如果在小动物状态下受到敲击伤害，则会受到5点伤害
- 使用指令`动物 @目标`
10. **鸡符咒**
- 可以更改任意玩家的高度
- 使用`浮 @目标`指令可以将指定目标的高度提高一格
- 使用`降 @目标`指令可以将指定目标的高度降低一格，如果你没有鸡符咒，也可以降低自己的高度
- 使用`浮到 @目标 位置`指令可以改变高度不为0的玩家的位置，但是一次只能移动一个场景，可以移动到商店内
- 使用`摔 @目标`可以使目标摔下，目标每1高度将会额外受到3点伤害，然后高度归于0
11. **狗符咒**
- 可以复活一次,复活后血量为1，与马符咒的使用机制相同
12. **猪符咒**
- 可以使用电击眼，对于任意不在商店并且与自己高度差不大于8的玩家造成2点伤害
- 使用`电 @目标`指令



## 一些建议（小攻略？）
- 综合来说，前期最强的是牛符咒，具有的功能比较多，缺点是攻击距离较短，被鸡符咒的浮空所克制
- 一般来说，开局只会购买 牛 猪 鸡 兔 这几种符咒，因为其他的符咒限制性较大，或者说没有攻击性，一般用于赢下多个回合后的辅助，锦上添花作用





## 一些事项
- 由于用到了at玩家的功能，可能无法在QQ的官方机器人上使用
- 目前只在能力范围内做了大部分功能，还有一些功能后续会更新：
如：
缺失的羊符咒（属实是太菜还原不来）
更多游戏内容
私聊指定出拳
自定义数值
组队功能
……

- 由于游戏中的数据都保存在变量中，所以数据在Koishi实例重启后就会失效
- 你可以通过`导出游戏状态`和`导入游戏状态 <JSON>`来导入导出游戏目前所处的状态，这样就可以跨实例保存数据了
- 由于技术限制（菜）目前仅支持一个Koishi实例进行一个游戏。

- 如果你在游玩过程中遇见了bug或有意见反馈，欢迎发送邮件至thoe9008@outlook.com或者来到github的[本项目仓库地址](https://github.com/SparkUiX/jackie-rps/)提issue
- 感谢你的下载和游玩

## 许可证

MIT License © 2023