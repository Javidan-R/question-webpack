import { initStepper } from "./view/stepper.js";
import { initalizeSubjects } from "./view/subject.js";
import { initalizeQuestion } from "./view/question.js";

const onLoad = () => {
    initStepper();
    initalizeSubjects()
    initalizeQuestion()
}

document.addEventListener('DOMContentLoaded', onLoad)