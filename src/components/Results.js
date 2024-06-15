import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, totalQuestions } = location.state;

  const wrongAnswers = totalQuestions - correctAnswers;

  const mountRef = useRef(null);

  useEffect(() => {
    // Display toast notification with the results
    toast.info(`You got ${correctAnswers} out of ${totalQuestions} questions correct.`);

    const mount = mountRef.current;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xffffff); // Set background to white
    mount.appendChild(renderer.domElement);

    // Create a group to hold the pie chart
    const pieChartGroup = new THREE.Group();

    // Calculate angles
    const total = correctAnswers + wrongAnswers;
    const correctAngle = (correctAnswers / total) * Math.PI * 2;
    const wrongAngle = (wrongAnswers / total) * Math.PI * 2;

    // Create correct answers slice
    const correctGeometry = new THREE.Shape();
    correctGeometry.moveTo(0, 0);
    correctGeometry.arc(0, 0, 2, 0, correctAngle, false);
    correctGeometry.lineTo(0, 0);

    const correctShapeGeometry = new THREE.ShapeGeometry(correctGeometry);
    const correctMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const correctMesh = new THREE.Mesh(correctShapeGeometry, correctMaterial);
    pieChartGroup.add(correctMesh);

    // Create wrong answers slice
    const wrongGeometry = new THREE.Shape();
    wrongGeometry.moveTo(0, 0);
    wrongGeometry.arc(0, 0, 2, correctAngle, correctAngle + wrongAngle, false);
    wrongGeometry.lineTo(0, 0);

    const wrongShapeGeometry = new THREE.ShapeGeometry(wrongGeometry);
    const wrongMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const wrongMesh = new THREE.Mesh(wrongShapeGeometry, wrongMaterial);
    pieChartGroup.add(wrongMesh);

    // Add labels for the correct and wrong answers
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const correctTextGeometry = new TextGeometry(`Correct: ${correctAnswers}`, {
        font: font,
        size: 0.3,
        height: 0.01,
      });
      const correctTextMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const correctTextMesh = new THREE.Mesh(correctTextGeometry, correctTextMaterial);
      correctTextMesh.position.set(-2, 2, 0);
      pieChartGroup.add(correctTextMesh);

      const wrongTextGeometry = new TextGeometry(`Wrong: ${wrongAnswers}`, {
        font: font,
        size: 0.3,
        height: 0.01,
      });
      const wrongTextMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const wrongTextMesh = new THREE.Mesh(wrongTextGeometry, wrongTextMaterial);
      wrongTextMesh.position.set(1, 2, 0);
      pieChartGroup.add(wrongTextMesh);
    });

    scene.add(pieChartGroup);

    // Set up camera position
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, [correctAnswers, wrongAnswers]);

  return (
    <div className="container">
      <ToastContainer /> {/* This is the container for all toasts */}
      <h2>Quiz Results</h2>
      <p>You got {correctAnswers} out of {totalQuestions} questions correct.</p>
      <div ref={mountRef} style={{ width: '100%', height: '400px' }}></div>
      <button onClick={() => navigate('/leaderboard')} className="btn btn-primary mt-3">
        View Leaderboard
      </button>
    </div>
  );
};

export default Results;
