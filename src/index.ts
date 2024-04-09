import { Context, Schema, Session, h } from 'koishi'
export const name = 'jackie-rps'
import { Player } from './players'
export interface Config {}
export const Config: Schema<Config> = Schema.object({})

export const usage=`
# 成龙历险记   


#  [点击这里查看详细介绍](https://www.npmjs.com/package/koishi-plugin-jackie-rps)



## 背景介绍

这是我小时候在与同伴玩耍时他教我的游戏,背景基于美国动漫《成龙历险记》，其中的十二符咒传说，也是小时候消磨时光的一个非常愉快的游戏，在有能力后便尝试着把它变成一个真正的游戏。
制作初期，仅实现十二符咒的基本操作与游戏框架，后还有各大恶魔等元素等待更新
……


## 求恰饭

# <center>[![alt 爱发电](https://static.afdiancdn.com/static/img/logo/logo.png) 爱发电](https://afdian.net/a/sparkuix) </center>
<center>如果你愿意的话，请我喝杯鲜牛奶吧！</center>

## 游戏简介

这是一个基于Koishi的多人对战游戏,基于rps(即石头剪刀布),玩家可以通过在不同场景之间的切换和使用符咒等操作来获取游戏胜利

注意：本游戏的机制相对来说较为复杂，上手需要一定的时间

## 游戏开始

- **创建游戏**：输入\`创建游戏\`指令，开始一个新的游戏冒险。
- **加入游戏**：输入\`加入游戏\`指令，加入已经创建的游戏中。
- **出拳**：每位玩家通过\`出拳\`指令进行石头、剪刀、布的出拳决定行动。
由于这本身就是一个随机事件，所以暂不支持指定出拳
在双人游戏中，随机事件总是会分出结果
在三人及以上游戏时，游戏也不存在平局，将只会有两种结果
## 游戏规则
- 游戏不限制玩家数量，但是考虑到机制以及平衡性，一般建议2-4人游玩
- 游戏开始后，随时可以加入新玩家
---
- 游戏中有多个场景，包括**商店**、**玩家的家**、和**广场**，在商店内可以购买符咒，符咒的价格是**15**
- 玩家初始血量为**10**，金钱为**15**，第一局的初始位置在**广场**，高度为**0**
- 击败任意玩家可以获得**5**金钱奖励
- 在商店的玩家不会受到任何伤害
- 在猜拳后，每赢得一位玩家，都可以进行2步操作，在猜拳结果分出后，以发送指令的顺序来执行，直到所有玩家的步数被消耗完
- 当你处在商店时，你可以使用\`购买 xx\`来购买物品，此处xx为一个符咒名，例如 \`购买 牛\`
- 同样的，你可以在商店使用\`卖出 xx\`来原价卖出物品，需要注意的是，在卖出物品后，所带的被动效果将会失效
- 你可以使用\`敲 @目标\`操作来对与你处在同一场景并且高度差不超过1的玩家造成1点伤害
- 当你与别的玩家都在商店时，你可以\`踢出 @目标\`来将他踢出商店，从而对其进行攻击
## 游戏操作

- 你可以在游戏开始后使用\`玩家状态\`来查看当前所有玩家的状态，包括金钱，位置，血量，剩余步数，背包等

### 移动
玩家可以在三个场景间移动：**商店**、**任意玩家的家**、和**广场**。
- 从玩家的家到广场：\`移动 广场\`
- 从广场到商店：\`移动 商店\`
- 从商店回到广场：\`移动 广场\`
- 你可以通过\`移动 @某玩家\` 来移动到某位玩家的家
- 你每次行动只能移动一段距离,也就是说你无法直接从家里前往商店,也无法直接前往别的玩家的家里,**除非你拥有牛符咒**
- 如果你拥有牛符咒或者身处广场，你可以直接发送\`商店\`来快速抵达商店
- 如果你不在广场，你可以发送\`出门\`来快速抵达广场

## 游戏流程
- 一般来说，玩家的第一局开局的位置在广场，在赢得一一局之后可以使用\`商店\`或\`移动 商店\`来移动到商店，然后使用指令\`购买 符咒名\`
- 例如，赢下2局胜利后，进行以下流程：
-- 商店
-- 购买 牛
-- 石头 @敌人
-- 石头 @敌人
- 四步流程后，敌人的位置在广场，剩余6血量，他如果想要攻击你，需要进行以下流程
-- 商店
-- 购买 猪
-- 踢出 @你
-- 电 @你
### 十二符咒
游戏中包含以下十二符咒，每个符咒都有其特殊效果：

1. **鼠符咒** 
- [x] 完成
- 可以把指定的玩家石化，使之无法进行任何操作
- 如果你是石头状态，则在猜拳后步数将被重置为0，因为你无法进行任何操作。
- 被石化的玩家将会免疫除敲击外的一切伤害，但是被敲击时会受到10点伤害
- 使用\`石化 @目标\`指令
2. **牛符咒**
- [x] 完成
- 可以对高度差与你在4以内的玩家造成2点伤害
- 使用\`石头 @目标\`指令
- 可以对与你在同一场景内(商店除外)并且高度差不超过1的玩家进行扔出操作，这将改变目标的位置，并造成3点伤害，但是扔到的位置不能是商店 使用\`扔 @目标 位置\`指令 此位置可以是广场，或at一位玩家，这将使目标位移至他的家里
- 使用\`扔 @目标 位置\`指令
- 牛符咒的被动技能，你可以无视移动场景时的距离限制，例如：你可以直接从你的家前往商店，而无需经过广场
3. **虎符咒**
- [x] 完成
- 可以使得你的生命上限增加至20
- 使用\`阴阳分隔\`将你的血量*2
4. **兔符咒**
- [x] 完成
- 可以将你每赢得一个玩家获得的行动步数*2
- 被动技能
5. **龙符咒**
- [x] 完成
- 可以使用爆破技能，对与你在同一场景内并且高度差不超过3的所有玩家造成3点伤害
- 使用\`爆破\`指令
6. **蛇符咒**
- [x] 完成
- 隐身，可以抵挡一次任意伤害
- 使用\`隐身\`指令
7. **马符咒**
- [x] 完成
- 可以恢复一次生命至满血，在场上仅有一名玩家以前，仅能使用一次，即一个完整回合仅能使用一次
- 使用\`恢复\`指令
8. **羊符咒**
- [ ] 未完成
- 灵魂出窍，可以附身到不在商店的玩家身上，将他的灵魂挤出，并代由执行操作
- 未完成
9. **猴符咒**
- [x] 完成
- 可以将指定玩家变为小动物，小动物形态下的玩家可以主动变回，如果在小动物状态下受到敲击伤害，则会受到5点伤害
- 使用指令\`动物 @目标\`
- 使用指令\`变回\`
10. **鸡符咒**
- [x] 完成
- 可以更改任意玩家的高度
- 使用\`浮 @目标\`指令可以将指定目标的高度提高一格
- 使用\`降 @目标\`指令可以将指定目标的高度降低一格，如果你没有鸡符咒，也可以降低自己的高度
- 使用\`浮到 @目标 位置\`指令可以改变高度不为0的玩家的位置，但是一次只能移动一个场景，可以移动到商店内，位置处可以直接at某位玩家，将目标位移至at的玩家家中
- 使用\`摔 @目标\`可以使目标摔下，目标每1高度将会额外受到3点伤害，然后高度归于0
11. **狗符咒**
- [x] 完成
- 可以复活一次,复活后血量为1，与马符咒的使用机制相同
- 被动技能
12. **猪符咒**
- [x] 完成
- 可以使用电击眼，对于任意不在商店并且与自己高度差不大于8的玩家造成2点伤害
- 使用\`电 @目标\`指令

`





export function apply(ctx: Context,players:Player[]) {

  //初始命令区
  ctx.command('jackie-rps','成龙历险记游戏相关指令')
  // let players: Player[] = []
  let gameStarted = false;
  let playersWhoPlayed = [];
  function getAllPlayersInfo(): string {
    return players.map(player => {
      return `ID: ${player.username}, 金钱: ${player.money}, 血量: ${player.health}, 位置: ${player.position}, 高度: ${player.height}, 背包: ${player.backpack},剩余步数：${player.step}`;
    }).join('\n');
  }

  // 创建游戏房间指令
  ctx.command('jackie-rps/创建游戏', '创建游戏房间')
    .action(() => {
      if (gameStarted) return '游戏已经被创建了。';
      gameStarted = true;
      players = [];
      return '游戏房间创建成功，请使用 “加入游戏” ';
    });
    ctx.command('jackie-rps/加入游戏', '加入游戏')
    .action(({ session }) => {
      if (!gameStarted) return '游戏尚未创建，请先创建房间。';
      const existingPlayer = players.find(p => p.id === session.userId);
      if (existingPlayer) return '你已经加入游戏了。';
      // 创建新的Player对象
      const HomePosition = session.username+'的家';//此处使用用户id作为位置名，在之后还有商店，广场两种位置，用字符串代替
      const newPlayer = new Player(session.userId,session.username,15, 10, '广场');
      players.push(newPlayer);
      return `玩家[${session.username}](${session.userId})加入游戏成功。`;
    });
    
    // ctx.command('开始游戏', '开始游戏')
    // .action(async ({ session }) => {
    //   if (!gameStarted || players.length < 2) {
    //     return '游戏尚未创建或玩家人数不足。';
    //   }
    //   gameStarted = true;
    //   session.send('游戏已开始');
    //   //此处暂时不用私聊消息，判断胜负逻辑设置为随机群聊出拳
    //   // // 向所有玩家发送私聊消息，开始第一回合
    //   // for (const player of players) {
    //   //   await session.bot.sendPrivateMessage(player.id, '游戏开始了，你的第一回合，请选择石头、剪刀或布：');
    //   // }
    // });
    ctx.command('jackie-rps/玩家状态','列出当前所有玩家的状态')
    .action(({ session }) => {
      return getAllPlayersInfo();
    })
    ctx.command('jackie-rps/重置游戏', '将游戏恢复至未创建的初始状态')
    .action(() => {
      gameStarted = false;
      players = [];
      playersWhoPlayed = [];
      return '游戏已重置。';
    })// 假设这是一个全局变量，用于追踪当前回合的出拳选择
    let currentRoundChoices = []; // 用于存储当前回合允许的两种出拳动作

// 在游戏开始或新回合开始时调用这个函数来随机确定两种出拳动作
function initializeRoundChoices() {
  const allChoices = [0, 1, 2]; // 分别代表石头、剪刀、布
  while (currentRoundChoices.length < 2) {
    const randomChoice = allChoices[Math.floor(Math.random() * allChoices.length)];
    if (!currentRoundChoices.includes(randomChoice)) {
      currentRoundChoices.push(randomChoice);
    }
  }
}

// 模拟玩家出拳的函数，现在只从currentRoundChoices中选择
function RandomChoice() {
  return currentRoundChoices[Math.floor(Math.random() * currentRoundChoices.length)];
}
initializeRoundChoices();
    ctx.command('jackie-rps/出拳', '玩家出拳')
      .action(({ session }) => {

        if (!gameStarted) return '游戏尚未开始，请等待房间创建。';

// 查找当前session用户的索引
const playerIndex = players.findIndex(p => p.id === session.userId);
// 如果玩家未找到，即playerIndex为-1
if(playerIndex === -1) return '你尚未加入游戏。';

// 获取当前玩家
const player = players[playerIndex];

// 检查玩家是否已死
if(player.isDead) return '你已经出局，不能出拳。';

// 检查是否有玩家尚未完成操作
if(players.find(p => p.step > 0 && !p.isDead)) return '有玩家未结束操作，请等待';

// 检查当前玩家是否已出拳
if (playersWhoPlayed.includes(session.userId)) {
  return '你已经出拳了。';
}

        let cq = ['石头', '剪刀', '布'];
        // 动态调整可选的出拳动作
        let availableChoices = currentRoundChoices.filter(cq => !players.some(p => p.choice === cq));
        if (availableChoices.length === 0 || availableChoices.length === currentRoundChoices.length) {
            // 如果所有选项都已被选择或者还未有选择，则所有选项都可用
            availableChoices = currentRoundChoices;
        }
        let choice = RandomChoice();
        player.choice = choice
        playersWhoPlayed.push(session.userId);
        session.send(`${player.username}出了：${cq[choice]}`);
    
        // // 确保后续玩家的选择受限于已选的动作
        // if (currentRoundChoices.includes(choice) && availableChoices.length === currentRoundChoices.length) {
        //     currentRoundChoices = [choice].concat(currentRoundChoices.filter(c => c !== choice));
        // }
    
        // 检查是否所有玩家都已出拳
        // 计算存活的玩家数量
const alivePlayersCount = players.filter(p => !p.isDead).length;

// 检查是否所有存活的玩家都已出拳
if (playersWhoPlayed.length === alivePlayersCount) {
  session.send(judgeWinners());
  // 重置为下一回合做准备
  currentRoundChoices = [0, 1, 2];
  playersWhoPlayed = []; // 根据需要重置已出拳玩家列表
}

      });
    
  ctx.command('jackie-rps/导出游戏状态','导出游戏状态')
  .alias('导出玩家状态')
  .action(() => {
    return exportGameState();
  });
  ctx.command('jackie-rps/导入游戏状态 <gameStateJSON:string>','导入游戏状态')
  .action((_,gameStateJSON) => {
    
    players = importGameState(gameStateJSON);
    return '游戏状态已导入。';
  });

  //方法函数区



  //判断胜负的逻辑
  function judgeWinners() {
    // 统计每种选择的玩家数
    let counts = [0, 0, 0]; // 分别对应石头(0), 剪刀(1), 布(2)
    let winners = [];
    let losers = [];
  
    // 获取玩家的出拳选择并统计
    players.forEach(player => {
      const choice = player.choice;
      counts[choice]++;
    });
  
    // 检查出拳种类的数量
    const choiceTypes = counts.filter(count => count > 0).length;
  
    // 当有三种或一种选择时，此回合无效
    if (choiceTypes !== 2) {
      // 重置出拳状态
      playersWhoPlayed = [];
      players.forEach(player => player.choice=null); 
      return '此回合无效，所有玩家请重新出拳。';
    }
  
    // 计算胜负
    // 假设规则是：0 > 1, 1 > 2, 2 > 0
    // 找到玩家选择的两种出拳
let choices = [];
for (let i = 0; i < counts.length; i++) {
  if (counts[i] > 0) {
    choices.push(i);
  }
}

// 假定第一个选择是赢家的选择
let winningChoice = choices[0];
let losingChoice = choices[1];

// 根据石头剪刀布的规则确定胜负
if (winningChoice === 0 && losingChoice === 1) { // 石头赢剪刀
  // winningChoice和losingChoice已正确设置
} else if (winningChoice === 1 && losingChoice === 2) { // 剪刀赢布
  // winningChoice和losingChoice已正确设置
} else if (winningChoice === 2 && losingChoice === 0) { // 布赢石头
  // winningChoice和losingChoice已正确设置
} else {
  // 如果上述条件不满足，则说明当前的winningChoice其实是输家，需要交换
  let temp = winningChoice;
  winningChoice = losingChoice;
  losingChoice = temp;
}

// 然后使用这个winningChoice和losingChoice来决定谁是赢家和输家

    players.forEach(player => {
      if (player.choice === winningChoice) {
        winners.push(player);
      } else if (player.choice === losingChoice) {
        losers.push(player);
      }
    });
  
    // 更新获胜玩家的状态
    winners.forEach(winner => {
      const stepIncrease = 2 * winner.step_Rubbit * losers.length; //兔符咒的倍数步数
      if(winner.RockAnimals=='Rock'){
        winner.setStep(0)
      }
      else
      winner.setStep(stepIncrease);
    });
  
    // 重置状态并准备下一轮
    playersWhoPlayed = [];
    players.forEach(player => player.choice=null); 
  
    // 进入下一状态
    StartAction(winners);
  
    // 返回胜负结果
    const winnerNames = winners.map(winner => winner.username).join(', ');
    currentRoundChoices = [];
initializeRoundChoices();
    return `此回合获胜的玩家：${winnerNames}，请胜者进行操作。\n\n当前玩家状态：\n${getAllPlayersInfo()}`;
  }
  
  function StartAction(winners: Player[]) {
    // 这里是游戏的下一状态
    //在此处，玩家需要进行操作了

  }
//导出玩家游戏状态
  function exportGameState() {
    // 创建一个包含所有玩家状态的数组
    const playersState = players.map(player => ({
      id: player.id,
      username: player.username,
      health: player.health,
      money: player.money,
      position: player.position,
      choice: player.choice,
      step_Rubbit: player.step_Rubbit, 
      backPack:player.backpack,
      step: player.step,
      isDead: player.isDead,
      RockAnimals:player.RockAnimals,
      isInVisible:player.isInvisible
    }));
  
    // 创建游戏状态对象
    const gameState = {
      gameStarted,
      players: playersState
    };
  
    // 将游戏状态对象转换为JSON字符串
    const gameStateJSON = JSON.stringify(gameState)
  
    // 返回JSON字符串
    return gameStateJSON;
  }
  //导入玩家游戏状态
  function importGameState(gameStateJSON: string) {
    // 将JSON字符串解析为游戏状态对象
    const gameState = JSON.parse(gameStateJSON);
  
    // 恢复游戏是否开始的状态
    gameStarted = gameState.gameStarted;
  
    // 恢复玩家状态
    players = gameState.players.map((playerState: {
      isInVisible: boolean
      RockAnimals: string
      isDead: boolean
      step: number;
      backPack: any[];
      id: string;
      username: string; 
      money: number;
      health: number; 
      position: string; 
      choice: number; 
      step_Rubbit: number 
}) => {
      const player = new Player(playerState.id, playerState.username,playerState.money, playerState.health, playerState.position);
      player.choice = playerState.choice;
      player.step_Rubbit = playerState.step_Rubbit;
      player.backpack = playerState.backPack;
      player.step = playerState.step;
      player.isDead = playerState.isDead;
      player.RockAnimals = playerState.RockAnimals;
      player.isInvisible = playerState.isInVisible;
      return player;
    });
    return players
    //预留位置
  }
  
  function CheckPlayers(){//检查是否只有最后一个玩家存活
    return players.filter(p => !p.isDead).length==1
  }
  function isWinner(session: Session<never, never, Context>){//重置游戏状态
    if(CheckPlayers()){
      players.forEach(p => {
        p.position=p.username+'的家'
        p.isDead=false
        p.health=10
        p.step=0
        p.HorseTimes=p.backpack.find(p=>p=='马符咒')?1:0
        p.DogTimes=p.backpack.find(p=>p=='狗符咒')?1:0
        p.RockAnimals='human'
      })
      session.send('场上仅剩一名玩家，回合重新开始')
      session.send(getAllPlayersInfo())
    }
  }
  








  //游戏逻辑操作区

  //通用操作
  ctx.command('jackie-rps/移动 [position:string]','移动到指定位置')
  .action(({ session },position) => {
    const self = players.find(p => p.id === session.userId);
    const athowid=players.find(p => p.id ===h.select(session.elements,'at')?.[0]?.attrs.id)?.username
    let zzposition=position 
    if(athowid) 
      zzposition=athowid+'的家'
    if (!self) return `你还没有加入游戏。`;
    if(self.isDead) return '你已经死亡'
    if(!(self.step>0)) return '你的当前步数不足'
    if(self.backpack.find(p=>p=='牛符咒')||self.position=='广场'){//牛符咒可以无视距离，以及广场可以去向任意地方
      self.setPosition(zzposition);
      self.step--;
      return `${self.username} 已经移动到 ${zzposition}`;
    }
    else{
      if((self.position.endsWith('的家')||self.position=='商店')&&zzposition!='广场') return '你不能一次跨越两个地方'
    }
    self.setPosition(zzposition);
    self.step--;
    return `${self.username} 已经移动到 ${zzposition}`;
  });

  ctx.command('jackie-rps/出门','移动到广场')
  .action(({ session }) => {
    const self = players.find(p => p.id === session.userId);
    if (!self) return `你还没有加入游戏。`;
    if(self.isDead) return '你已经死亡'
    if(!(self.step>0)) return '你的当前步数不足'

    if(self.position=='广场') return '你已经在广场'
    self.setPosition('广场');
    self.step--;
    return `${self.username} 已经移动到广场`;
  });

  ctx.command('jackie-rps/商店','移动到商店')
  .action(({ session }) => {
    const self = players.find(p => p.id === session.userId);
    if (!self) return `你还没有加入游戏。`;
    if(self.isDead) return '你已经死亡'
    if(!(self.step>0)) return '你的当前步数不足'
    if(self.position=='商店') return '你已经在商店'
    if(self.backpack.find(p=>p=='牛符咒')||self.position=='广场'){//牛符咒可以无视距离，以及广场可以去向任意地方
      self.setPosition('商店');
      self.step--;
      return `${self.username} 已经移动到商店`;
    }else{
      return '你不能直接从家里到商店'
    }
  });

    ctx.command('jackie-rps/购买 <item:string>','购买指定物品')
    .alias('买')
    .action(({ session },item) => {
      const items=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
      if(!items.includes(item)) return '购买的物品不存在'
        const self = players.find(p => p.id === session.userId);
        if (!self) {
            return `你还没有加入游戏。`;
        }
        if (self.money < 15) return '金钱不足，无法购买。';
        if(players.find(p=>p.backpack.find(p=>p==item+'符咒'))) return '该符咒已经被购买'
        if(!(self.step>0)) return '你的当前步数不足'
        if(self.isDead) return '你已经死亡'
        self.addToBackpack(item+'符咒');
        self.addMoney(-15);
        self.step--;
        switch(item){
          case '兔':
            self.step_Rubbit=2
          break
          case '马':
            self.HorseTimes=1
          break
          case '狗':
            self.DogTimes=1
          break
        }
        return `${self.username} 购买了 ${item}符咒。`;
    })
    ctx.command('jackie-rps/卖出 <item:string>','购买指定物品')
    .alias('卖')
    .alias('当')
    .action(({ session },item) => {
      const items=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
      if(!items.includes(item)) return '卖出的物品不存在'
      
        const self = players.find(p => p.id === session.userId);
        if (!self) {
          return `你还没有加入游戏。`;
      }
        if(!self.backpack.find(p=>p==item+'符咒')) return '你没有该物品'
        // if (self.money < 15) return '金钱不足，无法购买。';
        // if(players.find(p=>p.backpack.find(p=>p==item+'符咒'))) return '该符咒已经被购买'
        if(!(self.step>0)) return '你的当前步数不足'
        if(self.isDead) return '你已经死亡'
        self.removeFromBackpack(item+'符咒');
        self.addMoney(+15);
        self.step--;
        switch(item){
          case '兔':
            self.step_Rubbit=1
          break
          case '马':
            self.HorseTimes=0
          break
          case '狗':
            self.DogTimes=0
          break
        }
        return `${self.username} 卖出了 ${item}符咒。`;
    })

    ctx.command('jackie-rps/踢出 <target:user>','将指定目标踢出商店')
    .alias('踢')
    .action(({ session }) => {
      const athowid=h.select(session.elements,'at')?.[0]?.attrs.id//获取@的用户id
        const self =players.find(p => p.id === session.userId);//获取自己
        
        if (!self) {
            return '你还没有加入游戏。';
        }
          const target = players.find(p => p.id === athowid);//获取@的用户目标
            if (!target) {
                return '目标不存在';
            }
            if(!(self.step>0)) return '你的当前步数不足'
            if(target.position!='商店') return '目标不在商店'
            if(self.isDead) return '你已经死亡'
            if(self.position!='商店') return '你不在商店'
            self.step--;
            target.setPosition('广场');
            return `将 ${target.username} 踢出了商店。`;
          });


        ctx.command('jackie-rps/敲 <target:user>','对指定目标造成1伤害')
        .action(({ session }) => {
          const athowid=h.select(session.elements,'at')?.[0]?.attrs.id//获取@的用户id
            const self =players.find(p => p.id === session.userId);//获取自己
            
            if (!self) {
                return '你还没有加入游戏。';
            }

              const target = players.find(p => p.id === athowid);//获取@的用户目标
                if (!target) {
                    return '目标不存在';
                }
                if(Math.abs(self.height-target.height)>1||self.position!=target.position) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法攻击'
                if(self.isDead) return '你已经死亡'
                
                if(target.isDead) return '目标已经死亡'
                if(target.RockAnimals=='Rock'){
                
                target.RockAnimals='human'
                if(target.addHealth(-10)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用敲击，对其造成10点伤害`);
                }else if(target.RockAnimals=='Animal'){
                  
                  target.RockAnimals='human'
                  if(target.addHealth(-5)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用敲击，对其造成5点伤害`);
                }else{
                  if(target.addHealth(-1)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用敲击，对其造成1点伤害`);
                }
                self.step--;
                
                
                if(target.health<=0) {
                  if(target.DogTimes>0){
                    target.DogTimes--
                    target.setHealth(1)
                    return `${target.username}拥有狗符咒，复活一次`
                  }
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            
        });

        //鼠
        ctx.command('jackie-rps/石化 <target:user>','使用鼠符咒将目标变为石头')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='鼠符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法进行操作'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                self.step--;
                target.RockAnimals='Rock'
                session.send(`对${target.username}使用鼠符咒-石化，将其石化，无法进行操作`);
            }else{
                return '你没有鼠符咒';
            }
        });

        //牛
        ctx.command('jackie-rps/石头 <target:user>','使用牛符咒对指定目标造成伤害')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='牛符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法攻击'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                
                self.step--;
                if(target.addHealth(-2)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用牛符咒-石头，对其造成2点伤害`);
                if(target.health<=0) {
                  if(target.DogTimes>0){
                    target.DogTimes--
                    target.setHealth(1)
                    return `${target.username}拥有狗符咒，复活一次`
                  }
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            }else{
                return '你没有牛符咒';
            }
        });
        ctx.command('jackie-rps/扔 <target:user> [position:string]','使用牛符咒扔出指定目标')
        .action(({ session },_,position) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const athow2id=players.find(p => p.id ===h.select(session.elements,'at')?.[1]?.attrs.id)?.username
            const self = players.find(p => p.id === session.userId);
            let zzposition=position
            if(athow2id) 
            zzposition=athow2id+'的家'
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='牛符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                if(Math.abs(self.height-target.height)>1||self.position!=target.position) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                
                target.setPosition(zzposition);
                self.step--;
                if(target.addHealth(-3)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用牛符咒-扔，对其造成3点伤害，并位移至${zzposition}`);
                if(target.health<=0) {
                  if(target.DogTimes>0){
                    target.DogTimes--
                    target.setHealth(1)
                    return `${target.username}拥有狗符咒，复活一次`
                  }
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            }else{
                return '你没有牛符咒';
            }
        });

        //虎
        ctx.command('jackie-rps/阴阳分隔','使用虎符咒使血量*2')
        .alias('分隔')
        .alias('分身')
        .action(({ session }) => {
            
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='虎符咒')){
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                if(self.health>10) return '你只能在血量低于等于10的时候使用阴阳分隔'
                self.step--;
                self.setHealth(self.health*2);
                return '你的血量已经翻倍至'+self.health;
            }else{
                return '你没有虎符咒';
            }
        });

        //兔 （被动）
        //龙
        ctx.command('jackie-rps/爆破 <target:user> ','使用龙符咒对范围内玩家造成伤害')
        .action(({ session }) => {
          const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='龙符咒')){
                const target = players.find(p => p.id === athowid);
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                  if (target.position === self.position && Math.abs(target.height - self.height) < 4) {
                    if(target.addHealth(-3)) 
                      
                      return `${target.username}已经隐身，抵挡此次伤害`
                    session.send(`对${target.username}使用龙符咒-爆破，对其造成3点伤害`);
                  
                    if(target.health<=0) {
                      if(target.DogTimes>0){
                        target.DogTimes--
                        target.setHealth(1)
                        return `${target.username}拥有狗符咒，复活一次`
                      }
                      target.isDead=true
                      self.addMoney(5);
                      isWinner(session)
                      return `${self.username}击败了${target.username},金钱+5`
                    };
                  }


                self.step--;
                
            }else{
                return '你没有龙符咒';
            }
        });

        //蛇
        ctx.command('jackie-rps/隐身','使用蛇符咒隐身')
        .action(({ session }) => {
            
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='蛇符咒')){
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                self.step--;
                self.isInvisible=true;
                return '你已经隐身';
            }else{
                return '你没有蛇符咒';
            }
        });
        //马
        ctx.command('jackie-rps/恢复','使用马符咒恢复血量')
        .alias('回复')
        .action(({ session }) => {
            
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='马符咒')){
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                if(self.HorseTimes<=0) return '你本回合已经使用过马符咒'
                self.step--;
                self.setHealth(self.backpack.find(p=>p=='虎符咒')?20:10);
                return '你已经恢复血量至'+self.health;
            }else{
                return '你没有马符咒';
            }
        });
        //羊 不会做
        // 猴
        ctx.command('jackie-rps/动物 <target:user>','使用猴符咒将目标变为小动物')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='猴符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法进行操作'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                self.step--;
                target.RockAnimals='Animal'
                session.send(`对${target.username}使用猴符咒-动物，将其变为动物`);
            }else{
                return '你没有猴符咒';
            }
        });
        ctx.command('jackie-rps/变回','将自己变回人类')
        .action(({ session }) => {
            
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                self.step--;
                self.RockAnimals='human'
                return '你已经变回人类'
            
        });


        //鸡
        //byd重头戏终于来了,这个b和牛一样都是大工程
        ctx.command('jackie-rps/浮空 <target:user>','使用鸡符咒将目标浮空')
        .alias('浮')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='鸡符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                // if(target.position=='商店') return '目标在商店，无法进行操作'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                self.step--;
                target.addHeight(1)
                session.send(`对${target.username}使用鸡符咒-浮空，将其浮空至${target.height}层`);
            }else{
                return '你没有鸡符咒';
            }
        });
        ctx.command('jackie-rps/下降 [target:user]','使用鸡符咒将目标下降或者自己下降')
        .alias('降')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            
            if(athowid){
            if (self.backpack.find(p=>p=='鸡符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                // if(target.position=='商店') return '目标在商店，无法进行操作'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                if(target.height==0) return '目标已经在地面'
                self.step--;
                target.addHeight(-1)
                session.send(`对${target.username}使用鸡符咒-下降，将其下降至${target.height}层`);
            }else{
                return '你没有鸡符咒';
            }}else{
              if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                if(self.height==0) return '目标已经在地面'
                self.step--;
                self.addHeight(-1)
                return `你已经下降至${self.height}层`
            }
        });
        ctx.command('jackie-rps/摔 <target:user>','使用鸡符咒将目标摔下')
        .alias('摔下')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const self = players.find(p => p.id === session.userId);
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='鸡符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>4) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法进行操作'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                self.step--;
                
                if(target.addHealth(-target.height*3)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用鸡符咒-摔，将其摔落至地面，造成${target.height*3}点伤害`);
                target.setHeight(0)
                if(target.health<=0) {
                  if(target.DogTimes>0){
                    target.DogTimes--
                    target.setHealth(1)
                    return `${target.username}拥有狗符咒，复活一次`
                  }
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            }else{
                return '你没有鸡符咒';
            }
        });
        ctx.command('jackie-rps/浮到 <target:user> [position:string]','使用鸡符咒更改目标位置')
        .action(({ session },_,position) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id
            const athow2id=players.find(p => p.id ===h.select(session.elements,'at')?.[1]?.attrs.id)?.username
            const self = players.find(p => p.id === session.userId);
            let zzposition=position
            if(athow2id) 
            zzposition=athow2id+'的家'
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='鸡符咒')){
                const target = players.find(p => p.id === athowid);
                if (!target) {
                    return '目标不存在';
                }
                // if(Math.abs(self.height-target.height)>1||self.position!=target.position) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                if(target.height==0) return '目标在地面，无法使用 浮到 位移操作'
                // target.addHealth(-3);
                // target.setPosition(zzposition);
                if(target.position=='广场'){
                  target.setPosition(zzposition);
                  self.step--;
                  return `对${target.username}使用鸡符咒-浮到，位移至${zzposition}`
                }else if((target.position.endsWith('的家')||target.position=='商店')&&zzposition!='广场'){
                  // self.step--;
                  return '你不能使用鸡符咒一次将目标跨越两个地方'
                }
                target.setPosition(zzposition);
                self.step--;
                return `${target.username} 已经移动到 ${zzposition}`;

                
            }else{
                return '你没有鸡符咒';
            }
        });


        //猪
        ctx.command('jackie-rps/电 <target:user>','使用猪符咒对指定目标造成伤害')
        .alias('diu')
        .action(({ session }) => {
            const athowid=h.select(session.elements,'at')?.[0]?.attrs.id//获取@的用户id
            const self =players.find(p => p.id === session.userId);//获取自己
            
            if (!self) {
                return '你还没有加入游戏。';
            }
            if (self.backpack.find(p=>p=='猪符咒')){
              const target = players.find(p => p.id === athowid);//获取@的用户目标
                if (!target) {
                    return '目标不存在';
                }
                if(Math.abs(self.height-target.height)>8) return '与目标距离过远';
                if(!(self.step>0)) return '你的当前步数不足'
                if(target.position=='商店') return '目标在商店，无法攻击'
                if(self.isDead) return '你已经死亡'
                if(target.isDead) return '目标已经死亡'
                
                self.step--;
                if(target.addHealth(-2)) return '目标已经隐身，抵挡此次伤害'
                session.send(`对${target.username}使用猪符咒-电击眼，对其造成2点伤害`);
                if(target.health<=0) {
                  if(target.DogTimes>0){
                    target.DogTimes--
                    target.setHealth(1)
                    return `${target.username}拥有狗符咒，复活一次`
                  }
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
              }else{
                return '你没有猪符咒'
              }
            
        });

}
