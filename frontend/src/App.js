import React, { Component } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';

const apiUrl = "http://localhost:8000/api";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      groups: [],
      students: [],
      isLoaded: false,
      project_name: '',
      number_of_groups: 0,
      students_per_group: 0,
      showForm: false,
      student_fullname: '',
    }
  }

  refreshPage() {
    window.location.reload(false);
  }

  componentDidMount() {
    this.getData();
    this.interval = setInterval(() => this.getData(), 10000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  getData() {
    Promise.all([
      fetch(apiUrl + '/project/read.php'),
      fetch(apiUrl + '/group/read.php'),
      fetch(apiUrl + '/student/read.php')
    ])
      .then(([resProject, resGroup, resStudent]) => {
        return Promise.all([resProject.json(), resGroup.json(), resStudent.json()])
      })
      .then(([resProject, resGroup, resStudent]) => {
        this.setState({
          isLoaded: true,
          projects: resProject.data,
          groups: resGroup.data,
          students: resStudent.data,
        })
      })
  }

  createProjectHandler = e => {
    e.preventDefault();
    try {
      fetch(apiUrl + '/project/create.php', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: this.state.project_name,
          number_of_groups: this.state.number_of_groups,
          students_per_group: this.state.students_per_group,
        })
      }).then(this.refreshPage());
    } catch (error) {
      console.log(error);
    }
  }

  getProjectID = () => {
    let project_id;
    this.state.projects.map(project => project_id = project.project_id);
    return project_id;
  }

  addStudentHandler = e => {
    e.preventDefault();
    try {
      fetch(apiUrl + '/student/create.php', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: this.getProjectID(),
          student_fullname: this.state.student_fullname,
        })
      }).then(this.refreshPage());
    } catch (error) {
      console.log(error);
    }
    this.setState({ showForm: false, student_fullname: '' });
  }

  deleteStudentHandler = e => {
    e.preventDefault();
    try {
      fetch(apiUrl + '/student/delete.php', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: e.target.id,
        })
      }).then(this.refreshPage());
    } catch (error) {
      console.log(error);
    }
  }

  showNewStudentForm = () => {
    return (
      <div>
        <form onSubmit={this.addStudentHandler}>
          <label>Student full name: </label>
          <input
            type="text"
            name="student_fullname"
            value={this.state.student_fullname}
            onChange={this.changeHandler} />
          <Button variant="secondary" type="submit">Add new Student</Button>
        </form>
      </div>
    )
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onChangeStudent = (e) => {
    e.preventDefault();
    try {
      fetch(apiUrl + '/student/update.php', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: e.target.value,
          group_id: e.target.name,
          is_assigned: true,
        })
      }).then(this.refreshPage());
    } catch (error) {
      console.log(error);
    }
  }

  renderSelect(group_id, students_per_group) {
    const selectArr = [];
    this.state.students.filter(student => student.assigned_group_id === group_id).map(filteredStudent => (
      selectArr.push(<tr key={filteredStudent.student_id}><th>{filteredStudent.student_fullname}</th></tr>)
    ))
    while (selectArr.length < students_per_group) {
      selectArr.push(<tr key={selectArr.length}><th><select name={group_id} onChange={this.onChangeStudent} defaultValue="">
        <option key="" value="" disabled hidden>Assign student</option>
        {this.renderOptions()}
      </select></th></tr>)
    }
    return selectArr;
  }

  renderOptions() {
    return (this.state.students
      && this.state.students.length > 0
      && this.state.students.map(student => (<option
        key={student.student_id}
        value={student.student_id}>
        {student.student_fullname}
      </option>)))
  }

  render() {
    let { isLoaded, projects, groups, students } = this.state;
    const { project_name, number_of_groups, students_per_group } = this.state;

    if (!isLoaded) {
      return <Container><h2>Loading...</h2></Container>
    } else if (projects.length === 0) {
      return (
        <Container>
          <form onSubmit={this.createProjectHandler}>
            <Container>
              <label padding="50px">Project name: </label>
              <input
                type="text"
                name="project_name"
                value={project_name}
                placeholder="Project name"
                onChange={this.changeHandler}
                min="0" />
            </Container>
            <Container>
              <label>Number of groups: </label>
              <input
                type="number"
                name="number_of_groups"
                value={number_of_groups}
                placeholder="Number of groups"
                onChange={this.changeHandler}
                min="0" />
            </Container>
            <Container>
              <label>Students per group: </label>
              <input
                type="number"
                name="students_per_group"
                value={students_per_group}
                onChange={this.changeHandler}
                min="0" />
            </Container>
            <Container>
              <Button variant="secondary" type="submit">Create project</Button>
            </Container>
          </form>
        </Container>
      )
    } else {
      return (
        <Container>
          <Container>
            <h2>Status page mockup</h2>
            {
              projects.map(project => (
                <div key={project.project_id} margin="50px">
                  <p>Project: <b>{project.project_name}</b></p>
                  <p>Number of groups: <b>{project.number_of_groups}</b></p>
                  <p>Students per group: <b>{project.students_per_group}</b></p>
                </div>
              ))
            }
          </Container>
          <br></br>
          <Container>
            <h2>Students</h2>
            <Row xs={1} md={2}>
              <Table bordered hover responsive>
                <thead align="center">
                  <tr>
                    <th>Student</th>
                    <th>Group</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody align="center">
                  {students.map(student => (
                    <tr key={student.student_id} >
                      <td>
                        {student.student_fullname}
                      </td>
                      <td>
                        {student.assigned_group_id === null ? '-' : student.assigned_group_id}
                      </td>
                      <td>
                        <Button variant="link" onClick={this.deleteStudentHandler} id={student.student_id}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
            <Button variant="secondary" onClick={() => this.setState({ showForm: true })}>Add new student</Button>
            {this.state.showForm ? this.showNewStudentForm() : null}
          </Container>
          <br></br>
          <Container>
            <h2>Groups</h2>
            <Row xs={2} md={4} lg={6}>
              {groups.map(group => (
                <Col key={group.group_id} sm>
                  <Table bordered hover responsive key={group.group_id} value={group.students_per_group}>
                    <thead align="center">
                      <tr>
                        <th>
                          <h4>Group #{group.group_id}</h4>
                        </th>
                      </tr>
                    </thead>
                    <tbody align="center">
                      {this.renderSelect(group.group_id, group.students_per_group)}
                    </tbody>
                  </Table>
                </Col>
              ))}
            </Row>
          </Container>
        </Container>

      )
    }
  }
}

export default App;
