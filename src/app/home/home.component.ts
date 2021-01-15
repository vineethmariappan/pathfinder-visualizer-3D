import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Map, Record } from 'immutable';
import { ThrowStmt } from '@angular/compiler';
import { CineonToneMapping } from 'three';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cube: any;
  scene: any;
  camera: any;
  geometry: any;
  material: any;
  renderer: any;
  plane: any;
  controls: any;
  x: any;
  matrix: any;
  row: any;
  queue: any;
  cur: any;
  dir : any;
  constructor() {}

  async ngOnInit() {
    this.cur = 0;
    this.matrix = new Array(10);
    // this.row = [];
    this.queue = [];
    this.dir = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [0, -1],
      [-1, 0]

    ];
    for (var j = 0; j < 10; j++) {
      this.matrix[j] = new Array(10);
    }
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        this.matrix[i][j] = 0;
      }
    }
    this.x = 2;
    window.addEventListener('resize', () => {
      // responsive window
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // renderer.setClearColor("#e5e5e5");
      this.camera.aspect = window.innerWidth / window.innerHeight;

      this.camera.updateProjectionMatrix();
      //  renderer.render(scene, camera);
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);


    this.geometry = new THREE.PlaneGeometry(20, 20, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
    this.camera.position.z = 15;
    // this.camera.rotation.z=2;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.animate();

    // this.bfs();
    this.matrix[7][5]=2;
    this.generateCubes(7,5,"red");
    this.dfs(3,3);

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  async dfs(x: number, y: number) {
    if (
      !(
        x >= 0 &&
        y >= 0 &&
        x < this.matrix.length &&
        y < this.matrix[x].length &&
        this.matrix[x][y] == 0
      )
    )
      return;

      this.generateCubes(x, y,"lime");
      this.matrix[x][y] = 1;
      var ok = false;
      for (let d = 0; d < 8; d++) {
        if (this.isValid(x + this.dir[d][0], y + this.dir[d][1]) == true) {
          if(this.matrix[x + this.dir[d][0]][y + this.dir[d][1]]==2){
            // alert("found!");
            this.generateCubes(x, y ,"blue");
            return new Promise(async(resolve,reject)=>{
              await this.timer(100);
              resolve(true);
            })
          }
          // this.generateCubes(x + this.dir[d][0], y + this.dir[d][1],"lime");
          await this.timer(40);
          await this.dfs(x + this.dir[d][0],y + this.dir[d][1]).then((val : any)=>{
            ok=val;
            console.log(val);

          });
          if(ok){
            this.generateCubes(x, y ,"blue");
            return new Promise(async(resolve,reject)=>{
              await this.timer(100);
              resolve(true);
            });
          }
          // this.generateCubes(x + this.dir[d][0], y + this.dir[d][1],"green");

        }
      }
      return new Promise((resolve,reject)=>{
        resolve(false);
      })
  }

  async bfs() {
    this.matrix[5][5] = 1;
    this.queue.push({ x: 5, y: 5 });
    while (this.queue.length > 0) {
      let cur_x = this.queue[0].x;
      let cur_y = this.queue[0].y;
      this.queue.shift();

      for (let d = 0; d < 8; d++) {
        if (this.isValid(cur_x + this.dir[d][0], cur_y + this.dir[d][1]) == true) {
          this.generateCubes(cur_x + this.dir[d][0], cur_y + this.dir[d][1],"lime");
          this.matrix[cur_x + this.dir[d][0]][cur_y + this.dir[d][1]] = 1;
          this.queue.push({ x: cur_x + this.dir[d][0], y: cur_y + this.dir[d][1] });
        }
        await this.timer(20);
      }
    }
    console.log('OVER');
    console.log(this.matrix);
  }
  timer(ms: any) {
    return new Promise(res => setTimeout(res, ms));
  }

  generateCubes(cur_x: number, cur_y: number, cube_color :string) {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: cube_color });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.x = cur_x-5;
    this.cube.position.y = cur_y-5;
    this.scene.add(this.cube);


    // this.x += 1;
  }
  isValid(x: number, y: number): boolean {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.matrix.length &&
      y < this.matrix[x].length &&
      this.matrix[x][y] != 1
    );
  }
}
