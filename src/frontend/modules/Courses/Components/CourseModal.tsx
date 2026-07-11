// This code was created by a human and debugged by AI
"use client";
interface CourseModalProps{isOpen:boolean;onClose:()=>void;course:{title:string;color?:string;description?:string}|null;}
const CourseModal=({isOpen,onClose,course}:CourseModalProps)=>isOpen&&course?<div role="dialog"><h2>{course.title}</h2><p>Course enquiries are available through our contact page.</p><button onClick={onClose}>Close</button></div>:null;export default CourseModal;
