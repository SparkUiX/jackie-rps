export class Player {
  id: string;
  username: string;
  money: number;
  health: number;
  backpack: any[];
  position: string;
  choice: number | null;
  height: number;
  step: number;
  step_Rubbit: number;
  isDead: boolean;
  RockAnimals: string;
  HorseTimes: number;
  DogTimes: number;
  isInvisible: boolean;

  constructor(id: string,username: string, money: number ,health: number, position: string) {
    this.id = id;
    this.username = username;
    this.money = money;
    this.health = health;
    this.backpack = [];
    this.position = position;
    this.choice = null; 
    this.height = 0;
    this.step = 0;
    this.step_Rubbit = 1; //兔符咒是否增加步数
    this.isDead = false;
    this.RockAnimals='human';
    this.HorseTimes=0;
    this.DogTimes=0;
    this.isInvisible = false;
  }


  setMoney(money: number) {
    this.money = money;
  }
  addMoney(money: number) {
    this.money += money;
  }
  setHealth(health: number) {
    this.health = health;
  }
  addHealth(health: number) {
    if(this.isInvisible){
      this.isInvisible=false;
    return true
    }
    else
      this.health += health
  }
  setPosition(position: string) {
    this.position = position;
  }
  // setChoice(choice: number | null) {
  //   this._choice = choice;
  // }

  setHeight(height: number) {
    this.height = height;
  }
  addHeight(height: number) {
    this.height += height;
  }

  addToBackpack(item: any) {
    this.backpack.push(item);
  }

  removeFromBackpack(item: any) {
    const index = this.backpack.indexOf(item);
    if (index > -1) {
      this.backpack.splice(index, 1);
    }
  }
  setStep(step: number) {
    this.step = step;
  }
  addStep(step: number) {
    this.step += step;
  }

}
