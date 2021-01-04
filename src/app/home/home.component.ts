import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cube : any;
  scene : any;
  camera : any;
  geometry : any;
  material : any;
  renderer : any;
  constructor() { }

  ngOnInit(): void {

    window.addEventListener('resize', ()=>{ // responsive window
      this.renderer.setSize(window.innerWidth,window.innerHeight);
      // renderer.setClearColor("#e5e5e5");
      this.camera.aspect = window.innerWidth/window.innerHeight;

      this.camera.updateProjectionMatrix();
      //  renderer.render(scene, camera);

  })
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( this.renderer.domElement );

  this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
  this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  this.cube = new THREE.Mesh( this.geometry, this.material );
  this.scene.add( this.cube );

  this.camera.position.z = 5;
    this.animate();
  }


  animate () {
    requestAnimationFrame( this.animate.bind(this) );

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render( this.scene, this.camera );
  };


}
