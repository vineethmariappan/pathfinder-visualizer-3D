import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThrowStmt } from '@angular/compiler';
import { CineonToneMapping, CylinderBufferGeometry } from 'three';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import Heap from 'heap-js';
// import { SpriteText2D, textAlign } from 'three-text2d';
// import { AnyTxtRecord } from 'dns';
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
  bfs_flag:any;
  dfs_flag:any;
  bibfs_flag:any;
  selected_algo:any;
  set_target:any;
  set_source:any;
  prev_target_x:any;
  prev_target_y:any;
  src_x:any;
  src_y:any;
  closedList:any;
  openedList:any;
  cellDetails:any;
  astar_flag:any;
  constructor() {}
  // ngOnChanges(intersected_object: any, block_flag:any){
  //   // console.log("ONCHANGE")
  //   if(this.block_flag){
  //     this.placeNewBlock();
  //   }
  // }
  customPriorityComparator = (a:any, b:any) => {
    if(parseFloat(a.cost) > parseFloat(b.cost)) return 1;
    else if(parseFloat(a.cost) < parseFloat(b.cost)) return -1;
    return 0;
  };

  async ngOnInit() {
    this.cur = 0;
    this.block_flag = false;
    this.bfs_flag=false;
    this.dfs_flag=false;
    this.bibfs_flag=false;
    // this.row = [];
    this.queue = [];
    this.q1=[];
    this.q2=[];
    this.v1=[];
    this.v2=[];
    // this.closedSet=[];
    this.selected_algo="Depth First Search";
    this.set_target=false;
    this.set_source=false;
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

    this.x_limit = 101;
    this.y_limit = 51;
    this.matrix = new Array(this.x_limit);
    this.cellDetails = new Array(this.x_limit);
    this.visited = new Array(this.x_limit);
    this.closedList = new Array(this.x_limit);
    this.openedList=new Heap(this.customPriorityComparator);
    for (var j = 0; j < this.x_limit; j++) {
      this.matrix[j] = new Array(this.y_limit);
      this.visited[j]=new Array(this.y_limit);
      this.cellDetails[j]=new Array(this.y_limit);
      this.closedList[j]=new Array(this.y_limit);
    }
    for (var i = 0; i < this.x_limit; i++) {
      for (var j = 0; j < this.y_limit; j++) {
        this.matrix[i][j] = 0;
        this.visited[i][j]={};
        this.cellDetails[i][j]={f:1000000.0,g:1000000.0,h:1000000.0,parent_x:-1,parent_y:-1};
        this.cellDetails[i][j].visited=false;
        this.cellDetails[i][j].top_wall = true;
        this.cellDetails[i][j].bot_wall = true;
        this.cellDetails[i][j].left_wall = true;
        this.cellDetails[i][j].right_wall = true;
        this.closedList[i][j]=false;
      }
    }
    for(var i=1; i<this.x_limit-1; i++) {
      for(var j=1; j<this.y_limit-1; j++) {
          this.cellDetails[1][j].top_wall = false;
          this.cellDetails[this.x_limit-2][j].bot_wall = false;
          this.cellDetails[i][1].left_wall = false;
          this.cellDetails[i][this.y_limit-2].right_wall = false;
      }
  }

    this.src_x=1;
    this.src_y=1;

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
    const loader = new THREE.TextureLoader();
    this.geometry = new THREE.PlaneGeometry(101, 51, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 'yellow',
      side: THREE.DoubleSide,
    //   map: loader.load('assets/yellow.png', function ( texture ) {

    //     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //     texture.offset.set( 7, 13 );
    //     texture.repeat.set( 100, 50 );

    // }

      // )
    });
    // var sprite = new SpriteText2D("SPRITE", { align: textAlign.center,  font: '40px Arial', fillStyle: '#000000' , antialias: false })
    // this.scene.add(sprite)
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.set(50,25,0);

    this.scene.add(this.plane);
    this.camera.position.z = 15;
    // this.camera.rotation.z=2;
    this.orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.dfs_flag=true;
    // this.generateMaze();
 //   console.log(this.matrix);
    for(var i = 0;i<this.x_limit;i++){
      this.matrix[0][i]=3;
      this.matrix[i][0]=3;
      this.matrix[this.x_limit-1][i]=3;
      this.matrix[i][this.y_limit-1]=3;
      // this.matrix[i][0]=3;
    }
    for(var i=0;i<this.x_limit;i++){
      for(var j=0;j<this.y_limit;j++){
        if(this.matrix[i][j]==3){
          this.placeBlock(i, j);
        }
      }
    }
    // this.orbitControl.ena=false;
    window.addEventListener('mousemove', this.onmousemove, false);
    window.addEventListener('pointerdown', this.onmousedown, false);
    window.addEventListener('pointerup', this.onmouseup, false);
    this.matrix[98][48] = 2;
    this.prev_target_x=98;
    this.prev_target_y=48;
    this.placeTarget(98,48);
    this.placeSource(this.src_x,this.src_y);
    // this.generateCubes(15, 15, 'red');
    this.animate();

    // this.bfs(2,1);
  }

  animate() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.scene.children);

    // for (let i = 0; i < intersects.length; i++) {
    // intersects[i].object.material.color.set(0xff0000);
    // console.log(intersects[0].point);
    if(intersects.length>0)
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
            // console.log(val);
          }
        );
        if (ok) {
          if (!start) this.generateCubes(x, y, 'blue');
          return new Promise(async (resolve, reject) => {
            await this.timer(10);
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
      await this.timer(2);
    }
    // console.log('OVER');
    // console.log(this.matrix);
    // console.log(this.queue);
  }
  async bi_bfs(start_x: number, start_y: number) {
    this.matrix[start_x][start_y] = 1;
    this.v1.push({x:start_x,y:start_y});
    this.v2.push({x:this.prev_target_x,y:this.prev_target_y});
    this.generateCubes(start_x, start_y, 'blue');
    this.q1.push([{ x: start_x, y: start_y }]);
    this.q2.push([{x:this.prev_target_x,y:this.prev_target_y}]);
    while (this.q1.length > 0 && this.q2.length>0) {
      if(this.q1.length>this.q2.length){
        this.queue=this.q1;
        this.q1=this.q2;
        this.q2=this.queue;
        this.queue=this.v1;
        this.v1=this.v2;
        this.v2=this.queue;
      }
      this.queue=[];
      let cur = this.q1[0];

      this.q1.shift();
      for (let d = 0; d < 4; d++) {
        var x=cur[cur.length - 1].x + this.dir[d][0];
        var y=cur[cur.length - 1].y + this.dir[d][1];
        if (x >= 0 &&
          y >= 0 &&
          x < this.matrix.length &&
          y < this.matrix[x].length && this.matrix[x][y]!=3 && this.matrix[x][y]!=2) {
          let val=false;
          for(let o of this.v2){
            if(JSON.stringify(o)==JSON.stringify({x:cur[cur.length - 1].x + this.dir[d][0],y:cur[cur.length - 1].y + this.dir[d][1]})){
               val=true;
            }
          }
          if (val) {
            for (var i = 1; i < cur.length; i++) {
              this.generateCubes(cur[i].x, cur[i].y, 'blue');
              await this.timer(10);
            }
            cur=this.visited[cur[cur.length - 1].x][cur[cur.length - 1].y];
            for (var i = cur.length-1; i >=1; i--) {
              this.generateCubes(cur[i].x, cur[i].y, 'blue');
              await this.timer(10);
            }

            return;
          }
          if(this.matrix[x][y]==1) continue;

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
          if(cur[cur.length - 1].x + this.dir[d][0]<this.x_limit &&cur[cur.length - 1].y + this.dir[d][1]<this.y_limit && cur[cur.length - 1].x + this.dir[d][0]>=0 && cur[cur.length - 1].y + this.dir[d][1]>=0)
            this.visited[cur[cur.length - 1].x+ this.dir[d][0]][cur[cur.length - 1].y+this.dir[d][1]]=cur.slice();
          this.q1.push(cur.slice());
          cur.pop();
        }
      }

      await this.timer(2);
    }
    // console.log('OVER');
    // console.log(this.queue);
  }
  async AStar(start_x: number, start_y: number){
    // this.closedSet=[];
  // const customPriorityComparator = (a:any, b:any) => a.priority - b.priority;

    this.openedList.push({cost:this.calculateHValue(start_x,start_y),x:start_x,y:start_y});
    this.cellDetails[start_x][start_y].f=this.calculateHValue(start_x,start_y);
    this.cellDetails[start_x][start_y].g=0.0;
    this.cellDetails[start_x][start_y].h=this.calculateHValue(start_x,start_y);
    this.cellDetails[start_x][start_y].parent_x=start_x;
    this.cellDetails[start_x][start_y].parent_y=start_y;
    while(this.openedList.length>0){
      // console.log(this.openedList);
      const p=this.openedList.peek();
      // console.log(p.cost);
      this.openedList.pop();
      const x=p.x;
      const y=p.y;
      // remove first element
      this.closedList[x][y]=true;
      const dir = [-1, 0, 1, 0, -1]; // [-1,0][0,1][1,0][0,-1]
      for(var k=0;k<dir.length-1;k++){
        if(this.isValid(x+dir[k],y+dir[k+1])){
          if(x+dir[k]==this.prev_target_x && y+dir[k+1]==this.prev_target_y){
            this.cellDetails[x+dir[k]][y+dir[k+1]].parent_x=x;
            this.cellDetails[x+dir[k]][y+dir[k+1]].parent_y=y;
            // trace the path
            var child_x=x+dir[k],child_y=y+dir[k+1];
            var par_x=this.cellDetails[child_x][child_y].parent_x;
            var par_y = this.cellDetails[child_x][child_y].parent_y;
            while(!(child_x==start_x && child_y==start_y)){
              par_x=this.cellDetails[child_x][child_y].parent_x;
              par_y=this.cellDetails[child_x][child_y].parent_y;
              this.generateCubes(par_x,par_y,"blue");
              await this.timer(10);
              child_x=par_x;
              child_y=par_y;
            }
            // console.log(this.openedList);
            return;
          }
          else if(this.closedList[x+dir[k]][y+dir[k+1]]==false && this.matrix[x+dir[k]][y+dir[k+1]]==0){
            var gNew=this.cellDetails[x][y].g+1.0;
            var hNew = this.calculateHValue(x+dir[k],y+dir[k+1]);
            var fNew = gNew + hNew;
            if(Math.floor(this.cellDetails[x+dir[k]][y+dir[k+1]].f)===1000000.0 || this.cellDetails[x+dir[k]][y+dir[k+1]].f>fNew){
              this.openedList.push({cost:fNew,x:x+dir[k],y:y+dir[k+1]});
              this.generateCubes(x+dir[k],y+dir[k+1],"lime");

              this.cellDetails[x+dir[k]][y+dir[k+1]].f = fNew;
					    this.cellDetails[x+dir[k]][y+dir[k+1]].g = gNew;
					    this.cellDetails[x+dir[k]][y+dir[k+1]].h = hNew;
					    this.cellDetails[x+dir[k]][y+dir[k+1]].parent_x = x;
					    this.cellDetails[x+dir[k]][y+dir[k+1]].parent_y = y;
            }
          }
        }
        // console.log(this.openedList);

      }
      await this.timer(0.01);

    }
  }

 generateMaze(){
  //  var total_cells = this.x_limit*this.y_limit;
  var total_cells=((this.x_limit-2)/2)*((this.y_limit-2)/2);;
   var visitedCells=0;
   var randomX=this.src_y;
   var randomY =this.src_x;
   var back_trackX = [];
   var back_trackY = [];
   var random;
   this.cellDetails[this.src_x][this.src_y].visited=true;
   while(visitedCells<total_cells){
    if(((randomY > 1 && this.cellDetails[randomY-2][randomX].visited == false) && (this.cellDetails[randomY][randomX].top_wall == true && this.cellDetails[randomY-2][randomX].bot_wall == true)) ||
    ((randomY <this.x_limit-2 && this.cellDetails[randomY+2][randomX].visited == false) && (this.cellDetails[randomY][randomX].bot_wall == true && this.cellDetails[randomY+2][randomX].top_wall == true)) ||
    ((randomX > 1 && this.cellDetails[randomY][randomX-2].visited == false) && (this.cellDetails[randomY][randomX].left_wall == true && this.cellDetails[randomY][randomX-2].right_wall == true)) ||
    ((randomX <this.y_limit-2 && this.cellDetails[randomY][randomX+2].visited == false) && (this.cellDetails[randomY][randomX].right_wall == true && this.cellDetails[randomY][randomX+2].left_wall == true)))
    {
      random = Math.floor((Math.random()*4))+1;
      console.log("MAZEE "+random)
      // console.log(this.matrix);
        if((random == 1) && (randomY > 1)) {
          if(this.cellDetails[randomY-2][randomX].visited == false) {      // If not visited
            // this.cellDetails[randomY-1][randomX].display = ' ';    // Delete display
            this.cellDetails[randomY-1][randomX].visited = true;   // Mark cell as visited
            this.cellDetails[randomY][randomX].top_wall = false;   // Knock down wall
            this.matrix[randomY-1][randomX]=0;
            // console.log(this.matrix[randomY][randomX])
              back_trackX.push(randomX);          // Push X for back track
              back_trackY.push(randomY);          // Push Y for back track

              randomY -= 2;                   // Move to next cell
              this.cellDetails[randomY][randomX].visited = true;     // Mark cell moved to as visited
              this.matrix[randomY][randomX] = 0;      // Update path
              this.cellDetails[randomY][randomX].bot_wall = false;   // Knock down wall
              visitedCells+=1;                 // Increase visitedCells counter
          }
          else
              continue;
      }
      else if((random == 2) && (randomY < this.x_limit-2)) {
        if(this.cellDetails[randomY+2][randomX].visited == false) {    // If not visited
          this.cellDetails[randomY+1][randomX].visited = true;   // Mark cell as visited
          this.cellDetails[randomY][randomX].bot_wall = false;   // Knock down wall

            back_trackX.push(randomX);          // Push X for back track
            back_trackY.push(randomY);          // Push Y for back track
            this.matrix[randomY+1][randomX]=0;

            randomY += 2;                   // Move to next cell
            this.cellDetails[randomY][randomX].visited = true;     // Mark cell moved to as visited
            this.matrix[randomY][randomX] = 0;      // Update path
            this.cellDetails[randomY][randomX].top_wall = false;   // Knock down wall
            visitedCells++;                 // Increase visitedCells counter
        }
        else
            continue;
    }

    // GO LEFT
    else if((random == 3) && (randomX > 1)) {
        if(this.cellDetails[randomY][randomX-2].visited == false) {    // If not visited
          // this.cellDetails[randomY][randomX-1].display = ' ';    // Delete display
          this.cellDetails[randomY][randomX-1].visited = true;   // Mark cell as visited
          this.cellDetails[randomY][randomX].left_wall = false;  // Knock down wall
          this.matrix[randomY][randomX-1]=0;
            back_trackX.push(randomX);          // Push X for back track
            back_trackY.push(randomY);          // Push Y for back track

            randomX -= 2;                   // Move to next cell
            this.cellDetails[randomY][randomX].visited = true;     // Mark cell moved to as visited
            this.matrix[randomY][randomX] =0;      // Update path
            this.cellDetails[randomY][randomX].right_wall = false; // Knock down wall
            visitedCells++;                 // Increase visitedCells counter
        }
        else
            continue;
    }

    // GO RIGHT
    else if((random == 4) && (randomX < this.y_limit-2)) {
        if(this.cellDetails[randomY][randomX+2].visited == false) {    // If not visited
          // this.cellDetails[randomY][randomX+1].display = ' ';    // Delete display
          this.cellDetails[randomY][randomX+1].visited = true;   // Mark cell as visited
          this.cellDetails[randomY][randomX].right_wall = false; // Knock down wall
          this.matrix[randomY][randomX+1]=0;
            back_trackX.push(randomX);          // Push X for back track
            back_trackY.push(randomY);          // Push Y for back track

            randomX += 2;                   // Move to next cell
            this.cellDetails[randomY][randomX].visited = true;     // Mark cell moved to as visited
            this.matrix[randomY][randomX] = 0;      // Update path
            this.cellDetails[randomY][randomX].left_wall = false;  // Knock down wall
            visitedCells++;                 // Increase visitedCells counter
        }
        else
            continue;
    }
    }
    else{
        randomX = back_trackX[back_trackX.length-1];
        back_trackX.pop();
        randomY = back_trackY[back_trackY.length-1];
        back_trackY.pop();
    }
    // visitedCells++;

   }
   console.log(this.matrix);
 }


  calculateHValue(x:any,y:any){
    // console.log(Math.sqrt((x-this.prev_target_x)*(x-this.prev_target_x)+(y-this.prev_target_y)*(y-this.prev_target_y)));
    // return Math.sqrt((x-this.prev_target_x)*(x-this.prev_target_x)+(y-this.prev_target_y)*(y-this.prev_target_y));
    return Math.abs(x-this.prev_target_x)+Math.abs(y-this.prev_target_y);
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
      // write code for set target and source
    }
  };
  onmouseup = (event: MouseEvent) => {
    event.preventDefault();
    this.block_flag = false;
    this.orbitControl.enabled = true;
    // console.log(this.orbitControl);
    // console.log(this.block_flag);
    // write code for set target and source
  };
  placeNewTarget() {
    this.intersected_object.x = Math.round(this.intersected_object.x);
    this.intersected_object.y = Math.round(this.intersected_object.y);
    if (
      this.validateGrid(this.intersected_object.x, this.intersected_object.y)
    ) {
      this.placeTarget(this.intersected_object.x, this.intersected_object.y);
      console.log(this.intersected_object.x);
      console.log(this.intersected_object.y);
    }
  }
  placeNewBlock() {
    this.intersected_object.x = Math.round(this.intersected_object.x);
    this.intersected_object.y = Math.round(this.intersected_object.y);
    if (
      this.validateGrid(this.intersected_object.x, this.intersected_object.y)
    ) {
      this.placeBlock(this.intersected_object.x, this.intersected_object.y);
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
  placeTarget(x: number, y: number) {
    console.log(x,y);
    this.matrix[this.prev_target_x][this.prev_target_y]=0;
    this.matrix[x][y] = 2;
    this.prev_target_x=x;
    this.prev_target_y=y;
    this.generateCubes(x, y, 'red');
  }
  placeSource(x: number, y: number){
    this.matrix[x][y]=0;
    this.generateCubes(x, y, 'blue');
  }
  start() {
    if(this.bfs_flag)
      this.bfs(this.src_x, this.src_y);
    if(this.bibfs_flag)
      this.bi_bfs(this.src_x, this.src_y);
    if(this.dfs_flag)
      this.dfs(this.src_x,this.src_y,true);
    if(this.astar_flag)
      this.AStar(this.src_x,this.src_y);
  }
  onPointerChange() {
    if (this.block_flag) {
      this.placeNewBlock();
    }
    if(this.set_target){
      this.placeNewTarget();
    }
    if(this.set_source){
      this.placeNewSource(this.src_x,this.src_y);
    }
  }
  placeNewSource(x: number, y: number){

  }
  setDFS(){
    this.dfs_flag=true;
    this.bfs_flag=this.bibfs_flag=this.astar_flag=false;
    this.selected_algo="Depth First Search";
  }
  setBFS(){
    this.dfs_flag=this.bibfs_flag=this.astar_flag=false;
    this.bfs_flag=true;
    this.selected_algo="Breadth First Search";
  }
  setBiBFS(){
    this.bibfs_flag=true;
    this.astar_flag=this.dfs_flag=this.bfs_flag=false;
    this.selected_algo="Bi-Directional Breadth First Search";
  }
  setAStar(){
    this.astar_flag=true;
    this.bibfs_flag=this.dfs_flag=this.bfs_flag=false;
    this.selected_algo="A* Shorest Path Algorithm";
  }
  reset(){
    this.ngOnInit();
  }
  setTarget(){
    this.set_source=this.block_flag=false;
    this.set_target=true;
  }
  setSource(){
    this.set_target=this.block_flag=false;
    this.set_source=true;
  }
  setBlock(){
    this.set_target=this.set_source=false;
    this.block_flag=true;
  }
}
