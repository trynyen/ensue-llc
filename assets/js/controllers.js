//When window is ready, fetch & display all student and department data
window.onload = fetchJSON(jsonFiles.studentJSON)
  .then(studentData => displayStudents(studentData))
  .then(() => fetchJSON(jsonFiles.departmentJSON))
  .then(departmentData => displayDepartments(departmentData))


//When +/- button is clicked
viewBtn.addEventListener('click', (event) => {
  event.preventDefault();
  displayDiv();
})

//When a subject filter is selected
departmentDiv.addEventListener('click', (event) => {
  event.preventDefault();
  filterSubject(event)
})

//When showmore Btn is clicked
studentWrapper.addEventListener('click', (event) => {
  hideShowResults(event)
})