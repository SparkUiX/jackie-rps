import { Context, Random, Schema, Session, h } from 'koishi'
export const name = 'jackie-rps'
import { Player } from './players'
export interface Config {}
export const Config: Schema<Config> = Schema.object({})



export function apply(ctx: Context,players:Player[]) {

  //初始命令区
  ctx.command('jackie-rps')
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
        const playerIndex = players.findIndex(p => p.id === session.userId);
        const player = players[playerIndex];
        if(playerIndex === -1) return '你尚未加入游戏。';
        if(players.find(p => p.step > 0)) return '有玩家未结束操作，请等待';
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
        if (playersWhoPlayed.length === players.length) {
          session.send(judgeWinners());
          // 重置为下一回合做准备
          currentRoundChoices = [0,1,2];
          playersWhoPlayed = []; // 根据需要重置已出拳玩家列表
        }
      });
    
  ctx.command('jackie-rps/导出游戏状态','导出游戏状态')
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
        p.health=p.backpack.find(p=>p=='虎符咒')?20:10
        p.step=0
        p.HorseTimes=p.backpack.find(p=>p=='马符咒')?1:0
        p.DogTimes=p.backpack.find(p=>p=='狗符咒')?1:0
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

    ctx.command('jackie-rps/购买 <item:string>','购买指定物品')
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
          case '虎':
            self.health*=2
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
                target.addHealth(-1);
                self.step--;
                
                session.send(`对${target.username}使用敲击，对其造成1点伤害`);
                if(target.health<=0) {
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            
        });




        //符咒操作
        ctx.command('jackie-rps/电 <target:user>','使用猪符咒对指定目标造成2点伤害')
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
                target.addHealth(-2);
                self.step--;
                
                session.send(`对${target.username}使用猪符咒-电击眼，对其造成2点伤害`);
                if(target.health<=0) {
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
              }else{
                return '你没有猪符咒'
              }
            
        });

        ctx.command('jackie-rps/石头 <target:user>','使用牛符咒对指定目标造成2点伤害')
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
                target.addHealth(-2);
                self.step--;
                session.send(`对${target.username}使用牛符咒-石头，对其造成2点伤害`);
                if(target.health<=0) {
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
                target.addHealth(-3);
                target.setPosition(zzposition);
                self.step--;
                session.send(`对${target.username}使用牛符咒-扔，对其造成3点伤害，并位移至${zzposition}`);
                if(target.health<=0) {
                  target.isDead=true
                  self.addMoney(5);
                  isWinner(session)
                  return `${self.username}击败了${target.username},金钱+5`
                };
            }else{
                return '你没有牛符咒';
            }
        });
}
