import React, { Component } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';

const apiUrl = "http://localhost:80/api";

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
      selectedGroupID: 0,
    }
  }

  componentDidMount() {
    this.getData();
    this.interval = setInterval(() => this.getData(), 1000);
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
      });
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
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({ showForm: false, student_fullname: '' })
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
      });
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
      });
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
      return <div>Loading...</div>
    } else if (projects.length === 0) {
      return (
        <div>
          <form onSubmit={this.createProjectHandler}>
            <div>
              <input
                type="text"
                name="project_name"
                value={project_name}
                onChange={this.changeHandler} />
            </div>
            <div>
              <input
                type="number"
                name="number_of_groups"
                value={number_of_groups}
                onChange={this.changeHandler} />
            </div>
            <div>
              <input
                type="number"
                name="students_per_group"
                value={students_per_group}
                onChange={this.changeHandler} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <h2>Status page mockup</h2>
            {
              projects.map(item => (
                <div key={item.project_id} margin="50px">
                  <p>Project: <b>{item.project_name}</b></p>
                  <p>Number of groups: <b>{item.number_of_groups}</b></p>
                  <p>Students per group: <b>{item.students_per_group}</b></p>
                </div>
              ))
            }
          </div>
          <br></br>
          <div>
            <h2>Students</h2>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.student_id} >
                    <td>
                      {student.student_fullname}
                    </td>
                    <td text-align="center">
                      {student.assigned_group_id === null ? '-' : student.assigned_group_id}
                    </td>
                    <td>
                      <Button variant="link" onClick={this.deleteStudentHandler} id={student.student_id}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="secondary" onClick={() => this.setState({ showForm: true })}>Add new student</Button>
            {this.state.showForm ? this.showNewStudentForm() : null}
          </div>
          <br></br>
          <Container>
            <Row>
              <h2>Groups</h2>
              {groups.map(group => (
                <Col key={group.group_id} sm>
                  <table key={group.group_id} value={group.students_per_group}>
                    <thead>
                      <tr>
                        <th>
                          <h4>Group #{group.group_id}</h4>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderSelect(group.group_id, group.students_per_group)}
                    </tbody>
                  </table>
                </Col>
              ))}
            </Row>
          </Container>
        </div>

      )
    }
  }
}

export default App;
