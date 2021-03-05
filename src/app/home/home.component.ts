import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
  q1:any;
  q2:any;
  v1:any;
  v2:any;
  cur1:any;
  cur2:any;
  cur: any;
  dir: any;
  rayCaster: any;
  mousePosition: any;
  intersected_object: any;
  x_limit: any;
  y_limit: any;
  block_flag: any;
  orbitControl: any;
  visited:any;
  constructor() {}
  // ngOnChanges(intersected_object: any, block_flag:any){
  //   // console.log("ONCHANGE")
  //   if(this.block_flag){
  //     this.placeNewBlock();
  //   }
  // }
  async ngOnInit() {
    this.cur = 0;
    this.block_flag = false;
    this.matrix = new Array(10);
    this.visited = new Array(10);
    // this.row = [];
    this.queue = [];
    this.q1=[];
    this.q2=[];
    this.v1=[];
    this.v2=[];
    this.dir = [
      [0, 1],
      [1, 0],
      // [1, 1],
      // [-1, -1],
      // [-1, 1],
      // [1, -1],
      [0, -1],
      [-1, 0]
    ];
    this.x_limit = 30;
    this.y_limit = 30;
    for (var j = 0; j < this.x_limit; j++) {
      this.matrix[j] = new Array(this.y_limit);
      this.visited[j]=new Array(this.y_limit);
    }
    for (var i = 0; i < this.x_limit; i++) {
      for (var j = 0; j < this.y_limit; j++) {
        this.matrix[i][j] = 0;
        this.visited[i][j]={};
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.background = new THREE.Color('white');
    this.rayCaster = new THREE.Raycaster();
    this.mousePosition = new THREE.Vector2();
    // this.controls = new THREE.OrbitControls( this.camera );
    document.body.appendChild(this.renderer.domElement);

    this.geometry = new THREE.PlaneGeometry(200, 200, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 'yellow',
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
    this.camera.position.z = 15;
    // this.camera.rotation.z=2;
    this.orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    // this.orbitControl.ena=false;
    window.addEventListener('mousemove', this.onmousemove, false);
    window.addEventListener('pointerdown', this.onmousedown, false);
    window.addEventListener('pointerup', this.onmouseup, false);
    this.matrix[15][15] = 2;
    this.generateCubes(15, 15, 'red');
    this.animate();
    // this.bfs(2,1);
  }

  animate() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.scene.children);

    // for (let i = 0; i < intersects.length; i++) {
    // intersects[i].object.material.color.set(0xff0000);
    // console.log(intersects[0].point);
    this.intersected_object = intersects[0].point;
    // }
    // console.log(this.intersected_object);
    this.onPointerChange();
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  async dfs(x: number, y: number, start: boolean) {
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
    if (start) this.generateCubes(x, y, 'blue');
    else this.generateCubes(x, y, 'lime');
    this.matrix[x][y] = 1;
    var ok = false;
    for (let d = 0; d < 4; d++) {
      if (this.isValid(x + this.dir[d][0], y + this.dir[d][1]) == true) {
        if (this.matrix[x + this.dir[d][0]][y + this.dir[d][1]] == 2) {
          // alert("found!");
          this.generateCubes(x, y, 'blue');
          return new Promise(async (resolve, reject) => {
            await this.timer(100);
            resolve(true);
          });
        }
        // this.generateCubes(x + this.dir[d][0], y + this.dir[d][1],"lime");
        await this.timer(40);
        await this.dfs(x + this.dir[d][0], y + this.dir[d][1], false).then(
          (val: any) => {
            ok = val;
            console.log(val);
          }
        );
        if (ok) {
          if (!start) this.generateCubes(x, y, 'blue');
          return new Promise(async (resolve, reject) => {
            await this.timer(100);
            resolve(true);
          });
        }
        // this.generateCubes(x + this.dir[d][0], y + this.dir[d][1],"green");
      }
    }
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }

  async bfs(start_x: number, start_y: number) {
    this.matrix[start_x][start_y] = 1;
    this.generateCubes(start_x, start_y, 'blue');
    this.queue.push([{ x: start_x, y: start_y }]);
    while (this.queue.length > 0) {
      let cur = this.queue[0];
      this.queue.shift();
      for (let d = 0; d < 4; d++) {
        if (
          this.isValid(
            cur[cur.length - 1].x + this.dir[d][0],
            cur[cur.length - 1].y + this.dir[d][1]
          ) == true
        ) {
          if (
            this.matrix[cur[cur.length - 1].x + this.dir[d][0]][
              cur[cur.length - 1].y + this.dir[d][1]
            ] == 2
          ) {
            for (var i = 1; i < cur.length; i++) {
              this.generateCubes(cur[i].x, cur[i].y, 'blue');
              await this.timer(100);
            }
            return;
          }
          this.generateCubes(
            cur[cur.length - 1].x + this.dir[d][0],
            cur[cur.length - 1].y + this.dir[d][1],
            'lime'
          );
          this.matrix[cur[cur.length - 1].x + this.dir[d][0]][
            cur[cur.length - 1].y + this.dir[d][1]
          ] = 1;
          cur.push({
            x: cur[cur.length - 1].x + this.dir[d][0],
            y: cur[cur.length - 1].y + this.dir[d][1]
          });
          this.queue.push(cur.slice());
          cur.pop();
        }
      }
      await this.timer(10);
    }
    // console.log('OVER');
    // console.log(this.matrix);
    // console.log(this.queue);
  }
  async bi_bfs(start_x: number, start_y: number) {
    this.matrix[start_x][start_y] = 1;
    this.v1.push({x:start_x,y:start_y});
    this.v2.push({x:15,y:15});
    this.generateCubes(start_x, start_y, 'blue');
    this.q1.push([{ x: start_x, y: start_y }]);
    this.q2.push([{x:15,y:15}]);
    while (this.q1.length > 0 && this.q2.length>0) {
      if(this.q1.length>this.q2.length){
        this.queue=this.q1;
        this.q1=this.q2;
        this.q2=this.queue;
        this.v1=this.queue;
        this.v1=this.v2;
        this.v2=this.queue;
      }
      this.queue=[];
      let cur = this.q1[0];
      // console.log(this.q1);

      this.q1.shift();
      for (let d = 0; d < 4; d++) {
        // problem over here
        if (
          this.isValid(
            cur[cur.length - 1].x + this.dir[d][0],
            cur[cur.length - 1].y + this.dir[d][1]
          ) == true
        ) {
          if (this.v2.find((obj:any)=>{ return obj.x==cur[cur.length - 1].x + this.dir[d][0] && obj.y==cur[cur.length - 1].y + this.dir[d][1]})) {
            for (var i = 1; i < cur.length; i++) {
              this.generateCubes(cur[i].x, cur[i].y, 'blue');
              await this.timer(100);
            }
            cur=this.visited[cur[cur.length - 1].x + this.dir[d][0]][cur[cur.length - 1].y + this.dir[d][1]];
            for (var i = 1; i < cur.length; i++) {
              this.generateCubes(cur[i].x, cur[i].y, 'blue');
              await this.timer(100);
            }
            console.log("BI DONE")
    console.log(this.matrix);

            return;
          }
          console.log("going on")
          this.generateCubes(
            cur[cur.length - 1].x + this.dir[d][0],
            cur[cur.length - 1].y + this.dir[d][1],
            'lime'
          );
          this.matrix[cur[cur.length - 1].x + this.dir[d][0]][
            cur[cur.length - 1].y + this.dir[d][1]
          ] = 1;
          this.v1.push({x:cur[cur.length - 1].x + this.dir[d][0],y:cur[cur.length - 1].y + this.dir[d][1]});
          cur.push({
            x: cur[cur.length - 1].x + this.dir[d][0],
            y: cur[cur.length - 1].y + this.dir[d][1]
          });
          this.visited[cur[cur.length - 1].x][cur[cur.length - 1].y]=cur.slice();
          this.q1.push(cur.slice());
          cur.pop();
        }
      }

      await this.timer(10);
    }
    // console.log('OVER');
    // console.log(this.queue);
  }
  timer(ms: any) {
    return new Promise(res => setTimeout(res, ms));
  }

  generateCubes(cur_x: number, cur_y: number, cube_color: string) {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: cube_color });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.x = cur_x;
    this.cube.position.y = cur_y;
    this.scene.add(this.cube);

    // this.x += 1;
  }
  isValid(x: number, y: number): boolean {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.matrix.length &&
      y < this.matrix[x].length &&
      this.matrix[x][y] != 1 &&
      this.matrix[x][y] != 3
    );
  }

  // ON MOUSE MOVEMENT FUNCTION FOR THE RAY CASTER
  onmousemove = (event: MouseEvent) => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    event.preventDefault();
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  onmousedown = (event: MouseEvent) => {
    event.preventDefault();
    if (event.ctrlKey) {
      this.orbitControl.enabled = false;
      this.block_flag = true;
      // console.log(this.block_flag);
      // console.log(this.orbitControl)
    }
  };
  onmouseup = (event: MouseEvent) => {
    event.preventDefault();
    this.block_flag = false;
    this.orbitControl.enabled = true;
    console.log(this.orbitControl);
    // console.log(this.block_flag);
  };
  placeNewBlock() {
    this.intersected_object.x = Math.round(this.intersected_object.x);
    this.intersected_object.y = Math.round(this.intersected_object.y);
    if (
      this.validateGrid(this.intersected_object.x, this.intersected_object.y)
    ) {
      this.placeBlock(this.intersected_object.x, this.intersected_object.y);
      console.log(this.intersected_object.x);
      console.log(this.intersected_object.y);
    }
  }
  validateGrid(x: number, y: number) {
    return x < this.x_limit && y < this.y_limit && x >= 0 && y >= 0;
  }
  // 3 -> block
  placeBlock(x: number, y: number) {
    this.matrix[x][y] = 3;
    this.generateCubes(x, y, 'black');
  }
  start() {
    // this.bfs(10, 10);
    this.bi_bfs(10, 10);
    // this.dfs(10,10,true);
  }
  onPointerChange() {
    if (this.block_flag) {
      console.log('OK');
      this.placeNewBlock();
    }
  }
}
