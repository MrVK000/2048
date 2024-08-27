import { Component, HostListener } from '@angular/core';
import { KEY_CODE, boxBackground } from '../colorData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  boxBackground = boxBackground;
  isMoved: boolean = false;
  isBlocksFull: boolean = false;
  isWin: boolean = false;
  shuffleArray: any = [];
  level: number = 5;
  score: number = 0;
  data: any = [];

  ngOnInit() {
    this.initialFunc();
    // this.data=[
    //   [0,0,0,0,0],
    //   [0,0,0,0,0],
    //   [0,0,0,0,0],
    //   [0,0,0,0,0],
    //   [16,8,4,4,0]
    // ]
  };

  initialFunc() {
    this.isMoved = false;
    this.isBlocksFull = false;
    this.data = [];
    this.shuffleArray = [];
    this.level = 5;
    this.score = 0;
    for (let i = 0; i < this.level; i++) {
      this.data[i] = [];
      this.shuffleArray.push(i);
      for (let j = 0; j < this.level; j++) {
        this.data[i][j] = 0;
      }
    }

    // this.data[0][4] = 2048;
    this.randomGenerateFunc();
    this.randomGenerateFunc();
    this.blockCheckingFunc();
  }


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.blockCheckingFunc();

    if (this.isBlocksFull === false) {
      if (event.keyCode == KEY_CODE.DOWN_ARROW) {
        this.handleRight('down');
      }
      else if (event.keyCode == KEY_CODE.UP_ARROW) {
        this.handleLeft('up');
      }
      else if (event.keyCode == KEY_CODE.LEFT_ARROW) {
        this.handleLeft('left');
      }
      else if (event.keyCode == KEY_CODE.RIGHT_ARROW) {
        this.handleRight('right');
      }
    }
    this.blockCheckingFunc();
  }

  handleLeft = (input: string) => {
    this.blockCheckingFunc();
    let dataArray: any = [];
    dataArray = input === 'up' ? this.transposeFunc(this.data) : this.data;
    const tempData: any = [];
    this.isMoved = false;

    dataArray.forEach((arr: any) => {
      let isIterationOver=true;
        let temp = arr;

      for (var i = arr.length - 1; i >= 0; i--) {
        for (var j = arr.length - 1; j >= 0; j--) {
          if (temp[j] !== 0 && temp[j - 1] === 0 && j > 0) {
            let tempVal = temp[j];
            temp[j] = temp[j - 1];
            temp[j - 1] = tempVal;
            this.isMoved = true;
          }

          if (temp[j] !== 0 && (temp[j] === temp[j - 1]) && isIterationOver===true) {
            let tempVar = temp[j] + temp[j - 1];
            this.score += tempVar;
            temp[j] = tempVar;
            temp[j - 1] = 0;
            this.isMoved = true;
          }
        }
        isIterationOver=false;
      }
      tempData.push(temp);
    });
    this.data = input === 'up' ? this.transposeFunc(tempData) : tempData;

    if (this.isMoved !== false) {
      this.randomGenerateFunc();
    }
  };

  handleRight = (input: string) => {
    this.blockCheckingFunc();
    let dataArray: any = [];
    dataArray = input === 'down' ? this.transposeFunc(this.data) : this.data;
    const tempData: any = [];
    this.isMoved = false;


    dataArray.forEach((arr: any) => {
        let isIterationOver=true;
        let temp = arr;

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (temp[j] !== 0 && temp[j + 1] === 0 && j < temp.length) {
            let tempVal = temp[j];
            temp[j] = temp[j + 1];
            temp[j + 1] = tempVal;
            this.isMoved = true;
          }
          if (temp[j] !== 0 && (temp[j] === temp[j + 1]) && isIterationOver===true) {
            let tempVar = temp[j] + temp[j + 1];
            this.score += tempVar;
            if (input === 'down') {
              temp[j] = 0;
              temp[j + 1] = tempVar;
            }
            else if (input === 'right') {
              temp[j] = tempVar;
              temp[j + 1] = 0;
            }
            this.isMoved = true;
          }
        }
        isIterationOver=false;
      }
      tempData.push(temp);
    })
    this.data = input === 'down' ? this.transposeFunc(tempData) : tempData;

    if (this.isMoved !== false) {
      this.randomGenerateFunc();
    }
  };

  transposeFunc(input: any) {
    let transposeArray = input.reduce((prev: any, next: any) => next.map((item: any, i: any) =>
      (prev[i] || []).concat(next[i])
    ), []);
    return transposeArray;
  }

  gridFunc() {
    return `grid-template-columns: repeat(${this.level}, 64px)`;
  }

  blockCheckingFunc() {
    this.isBlocksFull = true;
    for (let i = 0; i < this.level; i++) {
      for (let j = 0; j < this.level; j++) {
        if (this.data[i][j] === 0) {
          this.isBlocksFull = false;
        }
        if (this.data[i][j] === 2048) {
          this.isBlocksFull = false;
          this.isWin = true;
        }

      }
    }
  }

  randomGenerateFunc() {
    this.blockCheckingFunc();
    if(this.isBlocksFull === false && this.isWin === false)
    {
      let i = 0, j = 0;
      let shuffledOne = this.shuffleFunc(this.shuffleArray)
      i = shuffledOne[0];
      j = shuffledOne[1];
      if (this.data[i][j] === 0) {
        this.data[i][j] = 2;
      }
      else {
        this.randomGenerateFunc();
      }
    }
  }

  shuffleFunc(array: number[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

}













