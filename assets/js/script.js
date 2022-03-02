const filteredStudent = document.querySelector('.filtered-student');
const departmentDiv = document.querySelector('.department-list');
const viewBtn = document.querySelector('.viewBtn');
const studentWrapper = document.querySelector('.data-wrapper');

let jsonFiles = {
  studentJSON: '../json/students.json',
  departmentJSON: '../json/departments.json'
}

//***********************************************
//get student data from students.json
const fetchJSON = async (jsonFile) => {
  let response = await fetch(jsonFile);
  let data = await response.json();
  return data;
}

//***********************************************
//display all students
const displayStudents = (studentData) => {
  let students = studentData.body.studentData.students;
  filteredStudent.textContent = '';

  students.map(student => {
    studentHTML(student);
  });
}

//***********************************************
//display all departments
const displayDepartments = (deptData) => {
  const departments = deptData.departments;
  departments.map(department => {
    departmentHTML(department);
  })
}

//***********************************************
//show & hide subject filter list
const displayDiv = () => {
  if (departmentDiv.style.display !== 'none' && departmentDiv.style.display !== '') {
    departmentDiv.style.display = 'none';
  }
  else {
    departmentDiv.style.display = 'block';
  }
  //Toggle between +/- when viewBtn is clicked
  viewBtn.textContent === '+' ? viewBtn.textContent = '-' : viewBtn.textContent = '+';
}

//***********************************************
//hide student cards when it exceed 1 line & add show more or less button
const hideStudents = () => {
  //if hide/show button for student card is available, select it. Otherwise, create new button
  let showMoreBtn = document.querySelector('.hideShowBtn') || document.createElement('button');
  //sellect all filtered student cards, measure the size of the card
  //if cardwidth excceds screen size, then set the total card allowed per row
  const liStudents = [...filteredStudent.children]
  const baseOffset = liStudents[0].offsetTop;
  const breakIndex = liStudents.findIndex(item => item.offsetTop > baseOffset);
  const numPerRow = (breakIndex === -1 ? liStudents.length : breakIndex);

  const resultLeft = liStudents.length - numPerRow
  //Hidden results will be counted and show more button will be added
  if (resultLeft !== 0) {
    showMoreBtn.textContent = `+${resultLeft} more`;
    showMoreBtn.classList.add('hideShowBtn');
    studentWrapper.append(showMoreBtn);
  }

  //hide cards which screen can't fit
  //If number of children is more than number of cards allowed per row
  //hide the rest of children
  if (liStudents.length > numPerRow) {
    let hiddenStudents = liStudents.slice(numPerRow);
    hiddenStudents.map(student => {
      student.classList.add('hide');
    })
    showMoreBtn.style.display = 'block';
  } //if all cards fit one line, show more button will be hidden
  else {
    showMoreBtn.style.display = 'none';
  }

}

//***********************************************
//display filtered students by subject
const filterStudents = async (subject) => {
  let studentJSON = await fetchJSON(jsonFiles.studentJSON);
  let students = studentJSON.body.studentData.students;

  //Use selected subject as filter condition and return all matching results
  let filteredStudents = await students.filter(student => {
    return student.subject === subject || student.department === subject
  })

  filteredStudent.textContent = '';

  //If no data available, show 'No data available'
  if (filteredStudents.length === 0) {
    studentHTML404()
  }

  //If there's data available, map through data and display students
  await filteredStudents.map((student) => {
    studentHTML(student)
  });

  //hide cards exceed one line
  hideStudents();
  //close filter list
  displayDiv();
}

//***********************************************
//add query param to url
const queryParam = (chosenBtn, chosenBtnContent, chosenBtnParent) => {
  let departmentName = chosenBtnParent.previousElementSibling.textContent;
  //let departmentName = chosenBtn;
  console.log(departmentName)
  let param = chosenBtnContent === 'All Departments' || chosenBtnContent === 'All Subjects' 
  ? ''
  : chosenBtn.className.includes('dept-name') 
  ? `department=${departmentName.replace(/\s+/g, "")}` 
  : `?department=${departmentName.replace(/\s+/g, "")}&subject=${chosenBtnContent.replace(/\s+/g, "")}`;
  let currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname + param
  window.history.pushState({ path: currentURL }, '', currentURL);
}

//***********************************************
//when a subject is chosen, tasks need to happen
const filterSubject = async (event) => {
  let chosenBtn = event.target;
  let chosenBtnContent = chosenBtn.textContent
  let chosenBtnParent = chosenBtn.parentElement;

  //Select all elements with class name 'active'
  var activeEl = document.querySelectorAll('.active') || null;

  //remove 'active' class from previously chosen subject & department
  await activeEl.forEach(el => {
    el.classList.remove('active')
    console.log(el)
  })

  //add 'active' class from newly chosen subject & department
  chosenBtn.classList.add('active');
  chosenBtn.className.includes('subject-name')
    ? chosenBtnParent.previousElementSibling.classList.add('active')
    : console.log('Not a subject');

  //move chosen filter to first in line before other subjects
  chosenBtnParent.prepend(chosenBtn)

  //add query param to url
  queryParam(chosenBtn, chosenBtnContent, chosenBtnParent)

  //filter students based on subject
  filterStudents(chosenBtnContent);

  //If all Department or All Subjects button is selected
  if (chosenBtnContent === 'All Departments' || chosenBtnContent === 'All Subjects') {
    let studentJSON = await fetchJSON(jsonFiles.studentJSON)
    displayStudents(studentJSON);
  }
}

//***********************************************
//Expand & collapse result cards
const hideShowResults = (event) => {
  let clickedBtn = event.target;
  if (clickedBtn.className === 'hideShowBtn') {
    const liStudents = [...filteredStudent.children]
    let resultLeft = 0;

    //Whenever student card class is "show", append to student container
    liStudents.map(student => {
      student.classList.toggle('show');
      filteredStudent.append(student)

      //calculate number of hidden results
      student.className.includes('hide')
        ? resultLeft++
        : resultLeft;

      //When all students are shown, change "Show More" button to "Collapse"
      student.className.includes('show')
        ? clickedBtn.textContent = 'Collapse'
        : clickedBtn.textContent = `+${resultLeft} more`;
    })
  }
}




