//***********************************************
//return when there's no data available
const studentHTML404 = () => {
  const li = document.createElement('li');

  li.innerHTML = `
    <span>No Data Available</span>
  `
  filteredStudent.appendChild(li);
}

//***********************************************
//return student cards
const studentHTML = (student) => {
  //date format options
  let options = {
  dobDate: {month: 'numeric', day: 'numeric', year: 'numeric'},
  admitDate: {month: 'short', day: 'numeric', year: 'numeric'},
  anticipatedDate: {month: 'short', year: 'numeric'},
  }

  //assign date format to each data
  let dob = new Date(student.dob).toLocaleDateString('en-us', options.dobDate)
  let admitDate = new Date(student.admitDate).toLocaleDateString('en-us', options.admitDate)
  let anticipatedDate = new Date(student.anticipatedGraduationDate).toLocaleDateString('en-us', options.anticipatedDate)
 
  const li = document.createElement('li');

  li.innerHTML = `
      <span class='name'>${student.familyName}, ${student.givenName}</span>
      <span class='dob'>DOB: <span class='value'>${dob}</span></span>
      <span class='admit-date'>Admitted: <span class='value'>${admitDate}</span></span>
      <span class='grad-date'>Anticipated Graduation: <span class='value'>${anticipatedDate}</span></span>
      <span class='mentor'>Mentor: <span class='value'>${student.mentor.familyName}, ${student.mentor.givenName}</span></span>
    `
  //add completed li to student area 
  filteredStudent.appendChild(li);

}

//***********************************************
//return department list
const departmentHTML = (department) => {
  const div = document.createElement('div');
  div.classList.add('department');
  div.innerHTML = `
  <div class='dept-name'>${department.name}</div>
    <div class='subjects-wrapper'>
    ${department.subjects.map(subject => {
    return `<div class='subject-name'>${subject}</div>`
  })}
  </div>
  `
  departmentDiv.prepend(div)
}