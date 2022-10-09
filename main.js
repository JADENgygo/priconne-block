import "./style.scss";
import Phaser from "phaser";
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import { Tap, Pan } from "phaser3-rex-plugins/plugins/gestures.js";
const cloneDeep = require('lodash.cloneDeep');

const theme = localStorage.getItem('theme');
if (theme === null) {
  const dark = matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) {
    document.querySelector('html').classList.add("dark");
  }
  localStorage.setItem("theme", dark ? "dark" : "light");
}
else {
  if (theme === "dark") {
    document.querySelector('html').classList.add("dark");
  }
  localStorage.setItem("theme", theme === "dark" ? "dark" : "light");
}
const themeElement = document.getElementById("theme");
themeElement.textContent = theme === "dark" ? "ダークモード: オン" : "ダークモード: オフ";

document.getElementById('theme').addEventListener('click', () => {
  const theme = localStorage.getItem('theme');
  document.querySelector('html').classList.toggle('dark');
  localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
  themeElement.textContent = theme === "dark" ? "ダークモード: オフ" : "ダークモード: オン";
});

const config = {
  parent: "game",
  type: Phaser.AUTO,
  width: 300 + 90,
  height: 600 + 30,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [{
    key: "rexGestures",
    plugin: GesturesPlugin,
    mapping: "rexGestures",
    preload: preload,
    create: create,
    update: update,
  }],
  fps: 30,
};

new Phaser.Game(config);

function preload() {
  this.load.image("block0", "img/background.webp");
  this.load.image("block1", "img/akari.webp");
  this.load.image("block2", "img/akino.webp");
  this.load.image("block3", "img/anna.webp");
  this.load.image("block4", "img/aoi.webp");
  this.load.image("block5", "img/arisa.webp");
  this.load.image("block6", "img/ayane.webp");
  this.load.image("block7", "img/ayumi.webp");
  this.load.image("block8", "img/chieru.webp");
  this.load.image("block9", "img/chika.webp");
  this.load.image("block10", "img/eriko.webp");
  this.load.image("block11", "img/hatsune.webp");
  this.load.image("block12", "img/hiyori.webp");
  this.load.image("block13", "img/homare.webp");
  this.load.image("block14", "img/inori.webp");
  this.load.image("block15", "img/io.webp");
  this.load.image("block16", "img/iriya.webp");
  this.load.image("block17", "img/jita.webp");
  this.load.image("block18", "img/jun.webp");
  this.load.image("block19", "img/kaori.webp");
  this.load.image("block20", "img/karin.webp");
  this.load.image("block21", "img/kasumi.webp");
  this.load.image("block22", "img/kaya.webp");
  this.load.image("block23", "img/kokkoro.webp");
  this.load.image("block24", "img/kurisu.webp");
  this.load.image("block25", "img/kuroe.webp");
  this.load.image("block26", "img/kurumi.webp");
  this.load.image("block27", "img/kuuka.webp");
  this.load.image("block28", "img/kyaru.webp");
  this.load.image("block29", "img/kyouka.webp");
  this.load.image("block30", "img/mahiru.webp");
  this.load.image("block31", "img/maho.webp");
  this.load.image("block32", "img/makoto.webp");
  this.load.image("block33", "img/matsuri.webp");
  this.load.image("block34", "img/mihuyu.webp");
  this.load.image("block35", "img/mimi.webp");
  this.load.image("block36", "img/misaki.webp");
  this.load.image("block37", "img/misato.webp");
  this.load.image("block38", "img/misogi.webp");
  this.load.image("block39", "img/mitsuki.webp");
  this.load.image("block40", "img/miyako.webp");
  this.load.image("block41", "img/monika.webp");
  this.load.image("block42", "img/muimi.webp");
  this.load.image("block43", "img/nanaka.webp");
  this.load.image("block44", "img/neneka.webp");
  this.load.image("block45", "img/ninon.webp");
  this.load.image("block46", "img/nozomi.webp");
  this.load.image("block47", "img/peko.webp");
  this.load.image("block48", "img/rei.webp");
  this.load.image("block49", "img/rima.webp");
  this.load.image("block50", "img/rin.webp");
  this.load.image("block51", "img/rino.webp");
  this.load.image("block52", "img/ruka.webp");
  this.load.image("block53", "img/saren.webp");
  this.load.image("block54", "img/sheffy.webp");
  this.load.image("block55", "img/shinobu.webp");
  this.load.image("block56", "img/shiori.webp");
  this.load.image("block57", "img/shizuru.webp");
  this.load.image("block58", "img/suzume.webp");
  this.load.image("block59", "img/suzuna.webp");
  this.load.image("block60", "img/tamaki.webp");
  this.load.image("block61", "img/tomo.webp");
  this.load.image("block62", "img/tsumugi.webp");
  this.load.image("block63", "img/yori.webp");
  this.load.image("block64", "img/yui.webp");
  this.load.image("block65", "img/yukari.webp");
  this.load.image("block66", "img/yuki.webp");
  this.load.image("block67", "img/yuni.webp");
  this.load.svg("pause", "img/pause-circle.svg");
}

let cursor;
let boards; // 20 x 10
let blackout;
let dialog;
let pauseDialog;
let restart;
let over = false;
let pause = false;
let resume;
let blocks = [];

const positions = [
  [[0, -1], [1, 0], [0, 1]], // 凸
  [[1, -1], [1, 0], [0, 1]], // key1
  [[0, -1], [1, 0], [1, 1]], // key2
  [[0, -1], [1, -1], [1, 0]], // squre
  [[0, -1], [1, -1], [0, 1]], // L1
  [[0, -1], [0, 1], [1, 1]], // L2
  [[0, -1], [0, 1], [0, 2]], // bar
];

let scoreText;
let score = 0;
let current;
let next;
let nextBlocks = [];
let tapState = 2; // 0: no tap, 1: tap, 2: disable
let pan;

const init = (first) => {
  tapState = 2;
  blackout.visible = first;
  dialog.visible = first;
  pauseDialog.visible = false;
  restart.y = 303;
  restart.visible = false;
  resume.visible = false;
  blocks.forEach(e => e.destroy());
  blocks = [];
  boards = [];
  for (let y = -10; y < 22; ++y) {
    boards[y] = [];
    for (let x = -2; x < 12; ++x) {
      if (x < 0 || 9 < x || 19 < y) {
        boards[y][x] = -1;
      }
      else {
        boards[y][x] = 0;
      }
    }
  }
  {
    const pi = Math.floor(Math.random() * 1000) % positions.length;
    const ii = (Math.floor(Math.random() * 1000) % 67) + 1;
    current = {
      x: 5,
      y: -3,
      positions: cloneDeep(positions[pi]),
      image: ii,
    };
  }
  {
    const pi = Math.floor(Math.random() * 1000) % positions.length;
    const ii = (Math.floor(Math.random() * 1000) % 67) + 1;
    next = {
      x: 5,
      y: -3,
      positions: cloneDeep(positions[pi]),
      image: ii
    };
  }
  nextBlocks.forEach(e => e.destroy());
  nextBlocks = [];
  over = false;
  pause = false;
  score = 0;
};

let started = false;
let background;
function create() {
  new Tap(this, {
    bounds: new Phaser.Geom.Rectangle(0, 30, 300, 600),
    tapInterval: 0
  })
  .on("tap", () => {
    if (tapState === 2) {
      tapState = 0;
      return;
    }
    tapState = 1;
  });
  pan = new Pan(this);

  cursor = this.input.keyboard.addKeys({ 
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT
  });

  // 背景の白塗り
  background = this.add.rectangle(345, 315, 90, 630, 0xffffff);

  for (let y = -10; y < 22; ++y) {
    for (let x = -2; x < 12; ++x) {
      if (0 <= x && x <= 9 && 0 <= y && y <= 19) {
        this.add.image(15 + 30 * x, 45 + 30 * y, 'block0').setScale(0.25);
      }
    }
  }
  for (let y = 0; y < 4; ++y) {
    this.add.image(15 + 30 * 11, 15 + 30 * y, 'block0').setScale(0.25);
    this.add.image(15 + 30 * 12, 15 + 30 * y, 'block0').setScale(0.25);
  }

  scoreText = this.add.text(10, 7.5, "SCORE " + score, {font: "bold 15px sans-serif", fill: "#ffffff"}).setDepth(2);

  this.add.image(360, 600, "pause").setScale(1.5).setInteractive()
    .on("pointerdown", pointer => {
      if (!started || over) {
        return;
      }
      pause = !pause;
      blackout.visible = !blackout.visible;
      pauseDialog.visible = !pauseDialog.visible;
      restart.y = pause ? 253 : 303;
      restart.visible = !restart.visible;
      resume.visible = !resume.visible;
    });

  blackout = this.add.graphics().fillStyle(0x000, 0.5).fillRect(0, 0, 390, 630).setDepth(1);
  dialog = this.add.graphics().fillStyle(0xffffff, 1).fillRoundedRect(195 - 75, 285, 150, 50, 15).setDepth(1);
  const start = this.add.text(170, 303, "START", {font: "bold 15px sans-serif", fill: "#000"}).setDepth(1).setInteractive();
  start.on("pointerdown", pointer => {
    tapState = 2;
    blackout.visible = false;
    dialog.visible = false;
    start.visible = false;
    started = true;
  });
  pauseDialog = this.add.graphics().fillStyle(0xffffff, 1).fillRoundedRect(195 - 75, 235, 150, 100, 15).setDepth(1);
  restart = this.add.text(153, 303, "NEW GAME", {font: "bold 15px sans-serif", fill: "#000"}).setDepth(1).setInteractive();
  restart.on("pointerdown", pointer => init(false));
  resume = this.add.text(163, 303, "RESUME", {font: "bold 15px sans-serif", fill: "#000"}).setDepth(1).setInteractive();
  resume.on("pointerdown", pointer => {
    tapState = 2;
    blackout.visible = false;
    pauseDialog.visible = false;
    restart.y = 303;
    restart.visible = false;
    resume.visible = false;
    pause = false;
  });

  init(true);
}

const canPutBlock = (block) => {
  if (boards[block.y][block.x] !== 0) {
    return false;
  }
  for (const e of block.positions) {
    if (boards[block.y + e[1]][block.x + e[0]] !== 0) {
      return false;
    }
  }
  return true;
};

let timer = 0;
const dropBlock = (block, down) => {
  if (down) {
    timer = 0;
  }
  const buf = cloneDeep(block);
  if (timer % 20 === 0) {
    buf.y++;
  }
  timer++;
  if (canPutBlock(buf)) {
    return [buf, true];
  }
  return [block, false];
};

const putBlock = (block) => {
  boards[block.y][block.x] = block.image;
  for (const e of block.positions) {
    boards[block.y + e[1]][block.x + e[0]] = block.image;
  }
};

const deleteBlock = block => {
  boards[block.y][block.x] = 0;
  for (const e of block.positions) {
    boards[block.y + e[1]][block.x + e[0]] = 0;
  }
};

const createBlock = () => {
  const buf = cloneDeep(next);
  if (canPutBlock(buf)) {
    const pi = Math.floor(Math.random() * 1000) % positions.length;
    const ii = (Math.floor(Math.random() * 1000) % 67) + 1;
    const block = {x: 5, y: -3, positions: cloneDeep(positions[pi]), image: ii};
    next = cloneDeep(block);
    return buf;
  }
  return null;
};

function showBoard() {
  blocks.forEach(e => e.destroy());
  blocks = [];
  for (let y = 0; y < 20; ++y) {
    for (let x = 0; x < 10; ++x) {
      if (boards[y][x] !== 0) {
        const block = this.add.image(15 + 30 * x, 45 + 30 * y, 'block' + boards[y][x]);
        block.setScale(0.25);
        blocks.push(block);
      }
    }
  }

  nextBlocks.forEach(e => e.destroy());
  nextBlocks = [];
  const block = this.add.image(15 + 11 * 30, 15 + 1 * 30, "block" + next.image)
  block.setScale(0.25);
  nextBlocks.push(block);
  for (const e of next.positions) {
    const block = this.add.image(15 + (11 + e[0]) * 30, 15 + (1 + e[1]) * 30, "block" + next.image)
    block.setScale(0.25);
    nextBlocks.push(block);
  }

  scoreText.text = "SCORE " + score;
}

let step = 0;
const processInput = (block) => {
  const buf = cloneDeep(block);
  let down = false;
  if (!pan.isPanned) {
    step = 0;
  }
  if (Phaser.Input.Keyboard.JustDown(cursor.up) || tapState === 1) {
    for (let k = 0; k < buf.positions.length; ++k) {
      const x = buf.positions[k][0];
      buf.positions[k][0] = -buf.positions[k][1];
      buf.positions[k][1] = x;
    }
    tapState = 0;
  }
  else if (Phaser.Input.Keyboard.JustDown(cursor.left)) {
    buf.x--;
  }
  else if (Phaser.Input.Keyboard.JustDown(cursor.right)) {
    buf.x++;
  }
  else if (pan.isPanned && Math.abs(pan.startY - pan.y) < Math.abs(pan.startX - pan.x)) {
    if (pan.x !== undefined && pan.x !== pan.endX) {
      const diff = Math.trunc((pan.startX - pan.x) / 30);
      buf.x -= diff - step;
      step = diff;
    }
  }
  else if (cursor.down.isDown || (pan.isPanned && 60 < Math.abs(pan.startY - pan.y) - Math.abs(pan.startX - pan.x) && pan.startY - pan.y < 0)) {
    down = true;
  }

  if (canPutBlock(buf)) {
    return [buf, down];
  }
  return [block, down];
};

const deleteLine = () => {
  let count = 0;
  for (let y = 19; 0 <= y; --y) {
    let found = true;
    for (let x = 0; x < 10; ++x) {
      if (boards[y][x] === 0) {
        found = false;
        break;
      }
    }
    if (found) {
      for (let y_ = y; 0 <= y_; --y_) {
        for (let x_ = 0; x_ < 10; ++x_) {
          boards[y_][x_] = boards[y_ - 1][x_];
        }
      }
      ++y;
      ++count;
    }
  }
  const scores = [0, 40, 100, 300, 1200];
  score += scores[count];
};

function gameOver() {
  over = true;
  blackout.visible = true;
  dialog.visible = true;
  restart.visible = true;
};

function update() {
  const theme = localStorage.getItem('theme');
  if (theme === "light") {
    background.setFillStyle(0xffffff, 1);
  }
  else {
    background.setFillStyle(0x1a1e22, 1);
  }
  if (!started || over || pause) {
    return;
  }
  deleteBlock(current);
  const [p, down] = processInput(current);

  const [d, f] = dropBlock(p, down);

  if (!f) {
    putBlock(d);
    deleteLine();
    const block = createBlock();
    if (block === null) {
      gameOver.call(this);
      return;
    }
    current = cloneDeep(block);
    putBlock(current);
    deleteLine();
    showBoard.call(this);
    return;
  }

  if (canPutBlock(d)) {
    current = cloneDeep(d);
    putBlock(current);
  }
  else {
    putBlock(current);
  }

  showBoard.call(this);
}
